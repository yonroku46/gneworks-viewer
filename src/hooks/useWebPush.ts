'use client';

import { useState, useEffect, useCallback } from 'react';
import AppNotificationService from '@/api/service/AppNotificationService';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function arrayBufferToBase64(buffer: ArrayBuffer | null): string {
  if (!buffer) return '';
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export type PushPermissionStatus = 'default' | 'granted' | 'denied' | 'unsupported';

export function useWebPush() {
  const [permission, setPermission] = useState<PushPermissionStatus>('default');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(false);

  // 초기 상태 확인
  const checkStatus = useCallback(async () => {
    if (typeof window === 'undefined') return;

    const supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
    setIsSupported(supported);

    if (!supported) {
      setPermission('unsupported');
      setIsSubscribed(false);
      return;
    }

    setPermission(Notification.permission);

    try {
      const reg = await navigator.serviceWorker.getRegistration('/sw.js');
      if (reg) {
        const sub = await reg.pushManager.getSubscription();
        setIsSubscribed(Boolean(sub && Notification.permission === 'granted'));
      } else {
        setIsSubscribed(false);
      }
    } catch (e) {
      console.error('[useWebPush] Error checking subscription:', e);
      setIsSubscribed(false);
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  // 구독하기
  const subscribe = async (): Promise<boolean> => {
    if (!isSupported) {
      alert('이 브라우저는 웹 푸시 알림을 지원하지 않습니다.');
      return false;
    }

    setIsLoading(true);
    try {
      // 1. 브라우저 권한 요청
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== 'granted') {
        setIsSubscribed(false);
        return false;
      }

      // 2. 서비스 워커 등록 확인
      let reg = await navigator.serviceWorker.getRegistration('/sw.js');
      if (!reg) {
        reg = await navigator.serviceWorker.register('/sw.js');
        await navigator.serviceWorker.ready;
      }

      // 3. 서버에서 VAPID 공개키 조회
      const vapidPublicKey = await AppNotificationService.getVapidPublicKey();
      if (!vapidPublicKey) {
        throw new Error('VAPID 공개키를 가져오지 못했습니다.');
      }

      // 4. PushManager 구독
      const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
      let subscription = await reg.pushManager.getSubscription();

      if (subscription) {
        // 기존 구독이 있으면 해제 후 재구독
        await subscription.unsubscribe();
      }

      subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey
      });

      // 5. 키 추출 및 서버 등록
      const p256dhKey = subscription.getKey('p256dh');
      const authKey = subscription.getKey('auth');

      const p256dh = arrayBufferToBase64(p256dhKey);
      const auth = arrayBufferToBase64(authKey);

      await AppNotificationService.subscribePush({
        endpoint: subscription.endpoint,
        p256dh,
        auth,
        userAgent: navigator.userAgent
      });

      setIsSubscribed(true);
      return true;
    } catch (error) {
      console.error('[useWebPush] Subscribe error:', error);
      setIsSubscribed(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 구독 해제하기
  const unsubscribe = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const reg = await navigator.serviceWorker.getRegistration('/sw.js');
      if (reg) {
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          try {
            await AppNotificationService.unsubscribePush({ endpoint: sub.endpoint });
          } catch (err) {
            console.warn('[useWebPush] Server unsubscribe warning:', err);
          }
          await sub.unsubscribe();
        }
      }
      setIsSubscribed(false);
      return true;
    } catch (error) {
      console.error('[useWebPush] Unsubscribe error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 테스트 알림 발송
  const sendTestNotification = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await AppNotificationService.sendTestPush();
      return Boolean(res?.success);
    } catch (error) {
      console.error('[useWebPush] Test notification error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    permission,
    isSubscribed,
    isLoading,
    isSupported,
    subscribe,
    unsubscribe,
    sendTestNotification,
    refreshStatus: checkStatus
  };
}