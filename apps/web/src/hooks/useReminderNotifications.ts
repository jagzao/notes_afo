import { useEffect, useRef } from 'react';
import { useReminders } from '../context/RemindersContext';

/**
 * Hook to check for due reminders and show notifications
 */
export const useReminderNotifications = () => {
  const { getDueReminders, completeReminder } = useReminders();
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const notifiedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      void Notification.requestPermission();
    }

    const checkReminders = async () => {
      try {
        const dueReminders = await getDueReminders();

        for (const reminder of dueReminders) {
          // Skip if already notified
          if (notifiedRef.current.has(reminder.id)) {
            continue;
          }

          // Check if notification is supported and permitted
          if ('Notification' in window && Notification.permission === 'granted') {
            // Show notification
            const notification = new Notification('Reminder', {
              body: `Note reminder is due`,
              icon: '/icon-192.png',
              tag: reminder.id,
              requireInteraction: true,
            });

            notification.onclick = () => {
              // Focus window when notification is clicked
              window.focus();
              notification.close();
            };

            // Mark reminder as complete automatically after notification
            // This prevents repeated notifications
            await completeReminder(reminder.id);
          }

          // Mark as notified to prevent duplicate notifications in this session
          notifiedRef.current.add(reminder.id);
        }
      } catch (error) {
        console.error('Failed to check reminders:', error);
      }
    };

    // Check immediately
    void checkReminders();

    // Check every minute
    intervalRef.current = setInterval(() => {
      void checkReminders();
    }, 60000); // 60 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [getDueReminders, completeReminder]);
};
