import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Reminder, CreateReminderInput, UpdateReminderInput } from '@keep-plus-plus/types';
import { initDatabase, remindersRepository, notesRepository } from '@keep-plus-plus/storage';
import { useNotifications } from '../hooks/useNotifications';
import { reminderNotificationService } from '../services/reminderNotifications';

interface RemindersContextValue {
  reminders: Reminder[];
  loading: boolean;
  error: string | null;
  // CRUD operations
  createReminder: (input: CreateReminderInput) => Promise<Reminder>;
  updateReminder: (id: string, input: UpdateReminderInput) => Promise<Reminder>;
  deleteReminder: (id: string) => Promise<void>;
  completeReminder: (id: string) => Promise<Reminder>;
  uncompleteReminder: (id: string) => Promise<Reminder>;
  // Query operations
  getRemindersForNote: (noteId: string) => Promise<Reminder[]>;
  getPendingReminders: () => Promise<Reminder[]>;
  getDueReminders: () => Promise<Reminder[]>;
  // Utils
  refreshReminders: () => Promise<void>;
}

const RemindersContext = createContext<RemindersContextValue | undefined>(undefined);

export const RemindersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { showNotification, requestPermission } = useNotifications();

  // Mock user ID (in real app, this would come from auth)
  const userId = 'demo-user';

  // Initialize database and load reminders
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await initDatabase();
        await loadReminders();
      } catch (err) {
        console.error('Failed to initialize reminders:', err);
        setError('Failed to load reminders');
      } finally {
        setLoading(false);
      }
    };

    void init();
  }, []);

  // Initialize reminder notifications
  useEffect(() => {
    // Request notification permission
    requestPermission();

    // Helper to get note title
    const getNoteTitleById = async (noteId: string): Promise<string | null> => {
      try {
        const note = await notesRepository.findById(noteId);
        return note ? note.title || 'Untitled Note' : null;
      } catch (error) {
        console.error('Error getting note title:', error);
        return null;
      }
    };

    // Helper to get all pending reminders
    const getPendingReminders = async (): Promise<Reminder[]> => {
      try {
        return await remindersRepository.findPending(userId);
      } catch (error) {
        console.error('Error getting pending reminders:', error);
        return [];
      }
    };

    // Start the notification service
    reminderNotificationService.start(
      getPendingReminders,
      getNoteTitleById,
      showNotification
    );

    // Cleanup on unmount
    return () => {
      reminderNotificationService.stop();
    };
  }, [userId, showNotification, requestPermission]);

  const loadReminders = useCallback(async () => {
    try {
      const allReminders = await remindersRepository.findAll(userId);
      setReminders(allReminders);
      setError(null);
    } catch (err) {
      console.error('Failed to load reminders:', err);
      setError('Failed to load reminders');
    }
  }, [userId]);

  const createReminder = useCallback(
    async (input: CreateReminderInput): Promise<Reminder> => {
      try {
        const reminder = await remindersRepository.create(userId, input);
        setReminders((prev) => [...prev, reminder]);
        return reminder;
      } catch (err) {
        console.error('Failed to create reminder:', err);
        throw err;
      }
    },
    [userId]
  );

  const updateReminder = useCallback(
    async (id: string, input: UpdateReminderInput): Promise<Reminder> => {
      try {
        const reminder = await remindersRepository.update(id, input);
        setReminders((prev) => prev.map((r) => (r.id === id ? reminder : r)));
        return reminder;
      } catch (err) {
        console.error('Failed to update reminder:', err);
        throw err;
      }
    },
    []
  );

  const deleteReminder = useCallback(async (id: string): Promise<void> => {
    try {
      await remindersRepository.delete(id);
      setReminders((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Failed to delete reminder:', err);
      throw err;
    }
  }, []);

  const completeReminder = useCallback(async (id: string): Promise<Reminder> => {
    try {
      const reminder = await remindersRepository.complete(id);
      setReminders((prev) => prev.map((r) => (r.id === id ? reminder : r)));
      return reminder;
    } catch (err) {
      console.error('Failed to complete reminder:', err);
      throw err;
    }
  }, []);

  const uncompleteReminder = useCallback(async (id: string): Promise<Reminder> => {
    try {
      const reminder = await remindersRepository.uncomplete(id);
      setReminders((prev) => prev.map((r) => (r.id === id ? reminder : r)));
      return reminder;
    } catch (err) {
      console.error('Failed to uncomplete reminder:', err);
      throw err;
    }
  }, []);

  const getRemindersForNote = useCallback(async (noteId: string): Promise<Reminder[]> => {
    try {
      return await remindersRepository.findByNote(noteId);
    } catch (err) {
      console.error('Failed to get reminders for note:', err);
      throw err;
    }
  }, []);

  const getPendingReminders = useCallback(async (): Promise<Reminder[]> => {
    try {
      return await remindersRepository.findPending(userId);
    } catch (err) {
      console.error('Failed to get pending reminders:', err);
      throw err;
    }
  }, [userId]);

  const getDueReminders = useCallback(async (): Promise<Reminder[]> => {
    try {
      return await remindersRepository.findDue(userId);
    } catch (err) {
      console.error('Failed to get due reminders:', err);
      throw err;
    }
  }, [userId]);

  const refreshReminders = useCallback(async () => {
    await loadReminders();
  }, [loadReminders]);

  const value: RemindersContextValue = {
    reminders,
    loading,
    error,
    createReminder,
    updateReminder,
    deleteReminder,
    completeReminder,
    uncompleteReminder,
    getRemindersForNote,
    getPendingReminders,
    getDueReminders,
    refreshReminders,
  };

  return <RemindersContext.Provider value={value}>{children}</RemindersContext.Provider>;
};

export const useReminders = (): RemindersContextValue => {
  const context = useContext(RemindersContext);
  if (!context) {
    throw new Error('useReminders must be used within RemindersProvider');
  }
  return context;
};
