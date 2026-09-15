'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import AppNotificationService from '@/api/service/AppNotificationService';
import ApiRoutes from '@/api/module/ApiRoutes';
import { tokenPrefix } from '@/api';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { useAuth } from './AuthProvider';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  sseStatus: 'connecting' | 'connected' | 'error' | 'disconnected';
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
   const [sseStatus, setSseStatus] = useState<'connecting' | 'connected' | 'error' | 'disconnected'>('disconnected');
  const eventSourceRef = useRef<any>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef<number>(0);

  const fetchNotifications = React.useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await AppNotificationService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // SSE 연결 정리 함수
  const disconnectSSE = React.useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setSseStatus('disconnected');
  }, []);

  // SSE 연결 설정 함수 (모바일 절전 & 지수 백오프 적용)
  const setupSSE = React.useCallback(() => {
    if (!user) return;
    // 화면이 꺼져있거나(hidden) 오프라인 상태일 때는 연결하지 않음 (배터리/통신 보존)
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
    if (typeof navigator !== 'undefined' && !navigator.onLine) return;

    disconnectSSE();

    setSseStatus('connecting');

    const sseUrl = `${ApiRoutes.NOTIFICATION_SUBSCRIBE}`;

    try {
      const es = new EventSourcePolyfill(sseUrl, {
        headers: {
          'Authorization': `${tokenPrefix} ${user.token}`,
          'RefreshToken': `${tokenPrefix} ${user.refreshToken}`
        }
      });
      eventSourceRef.current = es;

      es.onopen = () => {
        setSseStatus('connected');
        retryCountRef.current = 0; // 성공 시 재시도 횟수 리셋
      };

      es.addEventListener('notification', (event: any) => {
        let parsedData = event?.data;
        try {
          if (typeof event?.data === 'string') parsedData = JSON.parse(event.data);
        } catch {
          // ignore
        }
        fetchNotifications();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('gneworks-notification-received', { detail: parsedData }));
        }
      });

      es.addEventListener('connect', () => {
        setSseStatus('connected');
        retryCountRef.current = 0;
      });

      es.addEventListener('ping', () => {
        // Heartbeat received
      });

      es.onerror = (error: any) => {
        console.error('[SSE] Connection error:', {
          status: error?.status,
          readyState: es?.readyState,
        });
        setSseStatus('error');
        disconnectSSE();

        // 화면이 켜져 있고 온라인일 때만 지수 백오프로 재연결 (5초 ~ 최대 60초)
        if (typeof document !== 'undefined' && document.visibilityState === 'visible' && navigator.onLine) {
          const delay = Math.min(5000 * Math.pow(1.5, retryCountRef.current), 60000);
          retryCountRef.current += 1;
          retryTimeoutRef.current = setTimeout(() => {
            if (user) setupSSE();
          }, delay);
        }
      };
    } catch (err) {
      console.error('[SSE] Setup exception:', err);
      setSseStatus('error');
    }
  }, [user, fetchNotifications, disconnectSSE]);

  // 안전 폴링 시작/중지 (화면이 켜져 있을 때만 60초 주기로 보조 실행)
  const startPolling = React.useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    pollIntervalRef.current = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible' && user) {
        fetchNotifications();
      }
    }, 60000);
  }, [user, fetchNotifications]);

  const stopPolling = React.useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!user) {
      disconnectSSE();
      stopPolling();
      setNotifications([]);
      return;
    }

    // 1. 초기 1회 로드 및 SSE / 폴링 시작
    fetchNotifications();
    setupSSE();
    startPolling();

    // 2. Service Worker로부터 Web Push 도착 메시지 수신 처리
    const handleSwMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'GNEWORKS_PUSH_NOTIFICATION') {
        fetchNotifications();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('gneworks-notification-received', { detail: event.data.payload }));
        }
      }
    };
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleSwMessage);
    }

    // 3. 모바일 배터리 절약 핵심: 화면 가시성(visibilitychange) 감지
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // 화면 꺼짐 / 앱 백그라운드 전환: SSE 스트림 및 폴링 즉시 중단 (CPU Deep Sleep 허용)
        disconnectSSE();
        stopPolling();
      } else if (document.visibilityState === 'visible') {
        // 화면 켜짐 / 복귀: 즉시 최신 데이터 갱신 및 SSE 재연결
        retryCountRef.current = 0;
        fetchNotifications();
        setupSSE();
        startPolling();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 4. 네트워크 상태(online/offline) 감지 (음영지역 배터리 방전 방지)
    const handleOnline = () => {
      retryCountRef.current = 0;
      fetchNotifications();
      setupSSE();
      startPolling();
    };
    const handleOffline = () => {
      disconnectSSE();
      stopPolling();
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      disconnectSSE();
      stopPolling();
      if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleSwMessage);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user, fetchNotifications, setupSSE, disconnectSSE, startPolling, stopPolling]);

  const markAsRead = async (id: string) => {
    try {
      const res = await AppNotificationService.markAsRead(id);
      if (res?.success) {
        setNotifications(prev => 
          prev.map(n => n.appNotificationId === id ? { ...n, isRead: true } : n)
        );
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await AppNotificationService.markAllAsRead();
      if (res?.success) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      isLoading, 
      fetchNotifications, 
      markAsRead, 
      markAllAsRead,
      sseStatus
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}