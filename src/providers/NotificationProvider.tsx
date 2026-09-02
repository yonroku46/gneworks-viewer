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

  const fetchNotifications = async () => {
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
  };

  useEffect(() => {
    let retryTimeout: NodeJS.Timeout;

    const setupSSE = () => {
      if (!user) return;
      
      console.log('[SSE] Setting up connection...');
      setSseStatus('connecting');
      
      const sseUrl = `${ApiRoutes.NOTIFICATION_SUBSCRIBE}`;
      
      eventSourceRef.current = new EventSourcePolyfill(sseUrl, {
        headers: {
          'Authorization': `${tokenPrefix} ${user.token}`,
          'RefreshToken': `${tokenPrefix} ${user.refreshToken}`
        }
      });

      eventSourceRef.current.onopen = () => {
        console.log('[SSE] Connection opened');
        setSseStatus('connected');
      };

      eventSourceRef.current.addEventListener('notification', (event: any) => {
        console.log('[SSE] New notification received');
        fetchNotifications();
      });

      eventSourceRef.current.addEventListener('connect', (event: any) => {
        console.log('[SSE] Initial connect event received');
        setSseStatus('connected');
      });

      eventSourceRef.current.addEventListener('ping', (event: any) => {
        // Heartbeat received
        console.debug('[SSE] Ping received');
      });

      eventSourceRef.current.onerror = (error: any) => {
        console.error('[SSE] Connection error details:', {
          status: error?.status,
          readyState: eventSourceRef.current?.readyState,
          message: error?.message || 'Unknown SSE error event',
          error
        });
        setSseStatus('error');
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }
        
        // Retry after 5 seconds if still logged in
        retryTimeout = setTimeout(() => {
          if (user) setupSSE();
        }, 5000);
      };
    };

    if (user) {
      fetchNotifications();
      setupSSE();
    } else {
      setNotifications([]);
      setSseStatus('disconnected');
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
      setSseStatus('disconnected');
    };
  }, [user]);

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