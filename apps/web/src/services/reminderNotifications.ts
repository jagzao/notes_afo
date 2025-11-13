import type { Reminder } from '@keep-plus-plus/types';
import type { NotificationOptions } from '../hooks/useNotifications';

const REMINDER_CHECK_INTERVAL = 60000; // Check every minute
const NOTIFICATION_BUFFER = 60000; // Notify 1 minute before or at the time

let checkInterval: number | null = null;
let lastCheckedReminders = new Set<string>();

export interface ReminderNotificationService {
  start: (
    getReminders: () => Promise<Reminder[]>,
    getNoteTitleById: (noteId: string) => Promise<string | null>,
    showNotification: (options: NotificationOptions) => Promise<void>
  ) => void;
  stop: () => void;
}

export const reminderNotificationService: ReminderNotificationService = {
  start: (getReminders, getNoteTitleById, showNotification) => {
    // Clear any existing interval
    if (checkInterval) {
      clearInterval(checkInterval);
    }

    const checkReminders = async () => {
      try {
        const reminders = await getReminders();
        const now = Date.now();

        for (const reminder of reminders) {
          // Skip completed reminders
          if (reminder.completed) {
            continue;
          }

          const fireAt = new Date(reminder.fireAt).getTime();
          const timeDiff = fireAt - now;

          // Check if reminder should fire (within buffer time and not yet notified)
          if (
            timeDiff <= NOTIFICATION_BUFFER &&
            timeDiff > -NOTIFICATION_BUFFER &&
            !lastCheckedReminders.has(reminder.id)
          ) {
            // Get note title
            const noteTitle = await getNoteTitleById(reminder.noteId);

            // Send notification
            await showNotification({
              title: '🔔 Reminder',
              body: noteTitle || 'You have a reminder',
              tag: `reminder-${reminder.id}`,
              data: {
                type: 'reminder',
                reminderId: reminder.id,
                noteId: reminder.noteId,
              },
            });

            // Mark as notified
            lastCheckedReminders.add(reminder.id);

            // Clean up old entries after 5 minutes
            setTimeout(() => {
              lastCheckedReminders.delete(reminder.id);
            }, 5 * 60 * 1000);
          }
        }
      } catch (error) {
        console.error('Error checking reminders:', error);
      }
    };

    // Check immediately
    checkReminders();

    // Then check periodically
    checkInterval = setInterval(checkReminders, REMINDER_CHECK_INTERVAL);
  },

  stop: () => {
    if (checkInterval) {
      clearInterval(checkInterval);
      checkInterval = null;
    }
    lastCheckedReminders.clear();
  },
};
