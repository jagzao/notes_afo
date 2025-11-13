import { useState, useEffect, useMemo } from 'react';
import type { Note, Reminder } from '@keep-plus-plus/types';
import { useNotes } from '../context/NotesContext';
import { useReminders } from '../context/RemindersContext';
import { useToast } from '../hooks/useToast';
import { NoteEditor } from '../components/NoteEditor';
import { LoadingSpinner } from '../components/LoadingSpinner';
import styles from './RemindersPage.module.css';

interface ReminderGroup {
  title: string;
  reminders: Reminder[];
}

export const RemindersPage = () => {
  const { notes, updateNote, refreshNotes } = useNotes();
  const { getPendingReminders, completeReminder, deleteReminder } = useReminders();
  const toast = useToast();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Load reminders
  useEffect(() => {
    const loadReminders = async () => {
      try {
        setLoading(true);
        const pending = await getPendingReminders();
        setReminders(pending);
      } catch (error) {
        console.error('Failed to load reminders:', error);
        toast.error('Failed to load reminders');
      } finally {
        setLoading(false);
      }
    };
    void loadReminders();
  }, [getPendingReminders, toast]);

  // Group reminders by time category
  const groupedReminders = useMemo((): ReminderGroup[] => {
    const now = new Date();
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);
    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() + 7);

    const overdue: Reminder[] = [];
    const today: Reminder[] = [];
    const thisWeek: Reminder[] = [];
    const upcoming: Reminder[] = [];

    reminders.forEach((reminder) => {
      const fireAt = new Date(reminder.fireAt);

      if (fireAt < now) {
        overdue.push(reminder);
      } else if (fireAt <= todayEnd) {
        today.push(reminder);
      } else if (fireAt <= weekEnd) {
        thisWeek.push(reminder);
      } else {
        upcoming.push(reminder);
      }
    });

    const groups: ReminderGroup[] = [];
    if (overdue.length > 0) groups.push({ title: 'Overdue', reminders: overdue });
    if (today.length > 0) groups.push({ title: 'Today', reminders: today });
    if (thisWeek.length > 0) groups.push({ title: 'This Week', reminders: thisWeek });
    if (upcoming.length > 0) groups.push({ title: 'Upcoming', reminders: upcoming });

    return groups;
  }, [reminders]);

  const handleComplete = async (reminderId: string) => {
    try {
      await completeReminder(reminderId);
      setReminders((prev) => prev.filter((r) => r.id !== reminderId));
      toast.success('Reminder completed');
    } catch (error) {
      console.error('Failed to complete reminder:', error);
      toast.error('Failed to complete reminder');
    }
  };

  const handleDelete = async (reminderId: string) => {
    if (window.confirm('Delete this reminder?')) {
      try {
        await deleteReminder(reminderId);
        setReminders((prev) => prev.filter((r) => r.id !== reminderId));
        toast.success('Reminder deleted');
      } catch (error) {
        console.error('Failed to delete reminder:', error);
        toast.error('Failed to delete reminder');
      }
    }
  };

  const handleOpenNote = (noteId: string) => {
    const note = notes.find((n) => n.id === noteId);
    if (note) {
      setEditingNote(note);
    }
  };

  const handleSaveNote = async (
    noteId: string,
    updates: { title?: string; description?: string }
  ) => {
    try {
      await updateNote(noteId, updates);
      await refreshNotes();
    } catch (error) {
      console.error('Failed to save note:', error);
      toast.error('Failed to save note');
    }
  };

  const formatDateTime = (date: Date): string => {
    const fireAt = new Date(date);
    const now = new Date();
    const isToday = fireAt.toDateString() === now.toDateString();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const isTomorrow = fireAt.toDateString() === tomorrow.toDateString();

    const time = fireAt.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });

    if (isToday) return `Today at ${time}`;
    if (isTomorrow) return `Tomorrow at ${time}`;

    return fireAt.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <LoadingSpinner size="large" label="Loading reminders..." />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Reminders</h1>
        <p className={styles.subtitle}>
          {reminders.length} {reminders.length === 1 ? 'reminder' : 'reminders'} pending
        </p>
      </div>

      {groupedReminders.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🔔</div>
          <h2 className={styles.emptyTitle}>No reminders</h2>
          <p className={styles.emptyText}>
            Add reminders to your notes to get notified at the right time.
          </p>
        </div>
      ) : (
        <div className={styles.content}>
          {groupedReminders.map((group) => (
            <section key={group.title} className={styles.section}>
              <h2 className={styles.sectionTitle}>{group.title}</h2>
              <div className={styles.remindersList}>
                {group.reminders.map((reminder) => {
                  const note = notes.find((n) => n.id === reminder.noteId);
                  return (
                    <div
                      key={reminder.id}
                      className={`${styles.reminderCard} ${
                        group.title === 'Overdue' ? styles.overdue : ''
                      }`}
                    >
                      <div className={styles.reminderInfo}>
                        <button
                          className={styles.noteTitle}
                          onClick={() => handleOpenNote(reminder.noteId)}
                          type="button"
                        >
                          {note?.title || 'Untitled Note'}
                        </button>
                        <div className={styles.reminderTime}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>{formatDateTime(reminder.fireAt)}</span>
                        </div>
                      </div>
                      <div className={styles.reminderActions}>
                        <button
                          className={styles.actionButton}
                          onClick={() => handleComplete(reminder.id)}
                          type="button"
                          title="Complete"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </button>
                        <button
                          className={styles.actionButton}
                          onClick={() => handleDelete(reminder.id)}
                          type="button"
                          title="Delete"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {editingNote && (
        <NoteEditor
          note={editingNote}
          isOpen={!!editingNote}
          onClose={() => setEditingNote(null)}
          onSave={handleSaveNote}
          onPin={async () => {}}
          onArchive={async () => {}}
          onDelete={async () => {}}
          onColorChange={async () => {}}
        />
      )}
    </div>
  );
};
