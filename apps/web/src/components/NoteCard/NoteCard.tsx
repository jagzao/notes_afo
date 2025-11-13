import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import type { Note, Tag, PropertyDefinition, PropertyValue, Reminder } from '@keep-plus-plus/types';
import { NOTE_COLORS } from '@keep-plus-plus/types';
import { motion } from 'framer-motion';
import { TagBadge } from '../TagBadge';
import { useTags } from '../../context/TagsContext';
import { useProperties } from '../../context/PropertiesContext';
import { useReminders } from '../../context/RemindersContext';
import styles from './NoteCard.module.css';

interface NoteCardProps {
  note: Note;
  onClick?: (note: Note) => void;
  onPin?: (noteId: string) => void;
  onArchive?: (noteId: string) => void;
  onDelete?: (noteId: string) => void;
  index?: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: index * 0.05,
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
  hover: {
    y: -4,
    scale: 1.02,
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
};

const NoteCardComponent: React.FC<NoteCardProps> = ({
  note,
  onClick,
  onPin,
  onArchive,
  onDelete,
  index = 0,
}) => {
  const backgroundColor = useMemo(() => NOTE_COLORS[note.color] || NOTE_COLORS.default, [note.color]);
  const [noteTags, setNoteTags] = useState<Tag[]>([]);
  const [properties, setProperties] = useState<Array<{ definition: PropertyDefinition; value: PropertyValue | null }>>([]);
  const [reminder, setReminder] = useState<Reminder | null>(null);
  const { getTagsForNote } = useTags();
  const { getPropertiesWithValues } = useProperties();
  const { getRemindersForNote } = useReminders();

  // Load tags for this note
  useEffect(() => {
    const loadTags = async () => {
      try {
        const tags = await getTagsForNote(note.id);
        setNoteTags(tags);
      } catch (error) {
        console.error('Failed to load tags for note:', error);
      }
    };

    void loadTags();
  }, [note.id, getTagsForNote]);

  // Load properties for this note
  useEffect(() => {
    const loadProperties = async () => {
      try {
        const props = await getPropertiesWithValues(note.id);
        setProperties(props);
      } catch (error) {
        console.error('Failed to load properties for note:', error);
      }
    };

    void loadProperties();
  }, [note.id, getPropertiesWithValues]);

  // Load reminder for this note
  useEffect(() => {
    const loadReminder = async () => {
      try {
        const reminders = await getRemindersForNote(note.id);
        const pendingReminder = reminders.find((r) => !r.completed);
        setReminder(pendingReminder || null);
      } catch (error) {
        console.error('Failed to load reminder for note:', error);
      }
    };

    void loadReminder();
  }, [note.id, getRemindersForNote]);

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(note);
    }
  }, [onClick, note]);

  const handlePin = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPin) {
      onPin(note.id);
    }
  }, [onPin, note.id]);

  const handleArchive = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onArchive) {
      onArchive(note.id);
    }
  }, [onArchive, note.id]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(note.id);
    }
  }, [onDelete, note.id]);

  return (
    <motion.div
      className={styles.card}
      style={{ backgroundColor }}
      onClick={handleClick}
      role="article"
      aria-label={note.title || 'Untitled note'}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      custom={index}
      layout
    >
      {note.pinned && (
        <div className={styles.pinnedBadge} title="Pinned">
          📌
        </div>
      )}

      {note.title && <h3 className={styles.title}>{note.title}</h3>}

      {note.description && (
        <p className={styles.description}>
          {note.description.length > 200
            ? `${note.description.substring(0, 200)}...`
            : note.description}
        </p>
      )}

      {noteTags.length > 0 && (
        <div className={styles.tags}>
          {noteTags.map((tag) => (
            <TagBadge key={tag.id} tag={tag} />
          ))}
        </div>
      )}

      {properties.length > 0 && (
        <div className={styles.properties}>
          {properties.slice(0, 3).map(({ definition, value }) => (
            <div key={definition.id} className={styles.propertyItem}>
              <span className={styles.propertyLabel}>{definition.label}:</span>
              <span className={styles.propertyValue}>
                {formatPropertyValue(definition, value)}
              </span>
            </div>
          ))}
          {properties.length > 3 && (
            <div className={styles.propertyMore}>+{properties.length - 3} more</div>
          )}
        </div>
      )}

      {reminder && !reminder.completed && (
        <div className={styles.reminder}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className={styles.reminderIcon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className={styles.reminderText}>{formatReminderDate(reminder.fireAt)}</span>
        </div>
      )}

      <div className={styles.footer}>
        <span className={styles.date}>{formatDate(note.updatedAt)}</span>

        <div className={styles.actions}>
          <button
            className={styles.actionBtn}
            onClick={handlePin}
            title={note.pinned ? 'Unpin' : 'Pin'}
            aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
          >
            {note.pinned ? '📌' : '📍'}
          </button>

          <button
            className={styles.actionBtn}
            onClick={handleArchive}
            title={note.archived ? 'Unarchive' : 'Archive'}
            aria-label={note.archived ? 'Unarchive note' : 'Archive note'}
          >
            {note.archived ? '📂' : '📦'}
          </button>

          <button
            className={styles.actionBtn}
            onClick={handleDelete}
            title="Delete"
            aria-label="Delete note"
          >
            🗑️
          </button>
        </div>
      </div>
    </motion.div>
  );
};

function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return 'Today';
  } else if (days === 1) {
    return 'Yesterday';
  } else if (days < 7) {
    return `${days} days ago`;
  } else {
    return date.toLocaleDateString();
  }
}

function formatPropertyValue(definition: PropertyDefinition, value: PropertyValue | null): string {
  if (!value) return '—';

  switch (definition.type) {
    case 'text':
      return value.valueText || '—';
    case 'number':
      return value.valueNumber?.toString() || '—';
    case 'date':
      return value.valueDate ? new Date(value.valueDate).toLocaleDateString() : '—';
    case 'checkbox':
      return value.valueBool ? '✓' : '✗';
    case 'select':
      return value.valueSelect?.[0] || '—';
    case 'multiselect':
      return value.valueSelect?.join(', ') || '—';
    case 'url':
      return value.valueUrl || '—';
    default:
      return '—';
  }
}

function formatReminderDate(date: Date): string {
  const fireAt = new Date(date);
  const now = new Date();
  const diffMs = fireAt.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Past reminders
  if (diffMs < 0) {
    return 'Overdue';
  }

  // Less than 1 hour
  if (diffMins < 60) {
    return `in ${diffMins} min`;
  }

  // Less than 24 hours
  if (diffHours < 24) {
    return `in ${diffHours}h`;
  }

  // Today
  const isToday = fireAt.toDateString() === now.toDateString();
  if (isToday) {
    return `Today at ${fireAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  }

  // Tomorrow
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow = fireAt.toDateString() === tomorrow.toDateString();
  if (isTomorrow) {
    return `Tomorrow at ${fireAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  }

  // This week (within 7 days)
  if (diffDays < 7) {
    return fireAt.toLocaleDateString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' });
  }

  // Future dates
  return fireAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

// Memoize the component to prevent unnecessary re-renders
export const NoteCard = memo(NoteCardComponent);
