import type { Note } from '@keep-plus-plus/types';
import { NOTE_COLORS } from '@keep-plus-plus/types';
import styles from './NoteCard.module.css';

interface NoteCardProps {
  note: Note;
  onClick?: (note: Note) => void;
  onPin?: (noteId: string) => void;
  onArchive?: (noteId: string) => void;
  onDelete?: (noteId: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onClick,
  onPin,
  onArchive,
  onDelete,
}) => {
  const backgroundColor = NOTE_COLORS[note.color] || NOTE_COLORS.default;

  const handleClick = () => {
    if (onClick) {
      onClick(note);
    }
  };

  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPin) {
      onPin(note.id);
    }
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onArchive) {
      onArchive(note.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(note.id);
    }
  };

  return (
    <div
      className={styles.card}
      style={{ backgroundColor }}
      onClick={handleClick}
      role="article"
      aria-label={note.title || 'Untitled note'}
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
    </div>
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
