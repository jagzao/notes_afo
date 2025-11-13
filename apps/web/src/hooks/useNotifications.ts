import { useEffect, useState, useCallback } from 'react';

export interface NotificationOptions {
  title: string;
  body: string;
  tag?: string;
  icon?: string;
  badge?: string;
  data?: any;
}

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window) {
      setSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!supported) {
      console.warn('Notifications are not supported in this browser');
      return 'denied';
    }

    if (permission === 'granted') {
      return 'granted';
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }, [supported, permission]);

  const showNotification = useCallback(
    async (options: NotificationOptions): Promise<void> => {
      if (!supported) {
        console.warn('Notifications are not supported');
        return;
      }

      // Request permission if not granted
      if (permission !== 'granted') {
        const result = await requestPermission();
        if (result !== 'granted') {
          return;
        }
      }

      try {
        // Try to use Service Worker notification first (better for PWA)
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          const registration = await navigator.serviceWorker.ready;
          await registration.showNotification(options.title, {
            body: options.body,
            tag: options.tag,
            icon: options.icon || '/pwa-192x192.png',
            badge: options.badge || '/pwa-192x192.png',
            data: options.data,
            requireInteraction: false,
          });
        } else {
          // Fallback to regular notification
          new Notification(options.title, {
            body: options.body,
            tag: options.tag,
            icon: options.icon || '/pwa-192x192.png',
            data: options.data,
          });
        }
      } catch (error) {
        console.error('Error showing notification:', error);
      }
    },
    [supported, permission, requestPermission]
  );

  return {
    supported,
    permission,
    requestPermission,
    showNotification,
  };
};
