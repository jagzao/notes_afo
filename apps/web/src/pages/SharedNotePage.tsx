import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Note } from '@keep-plus-plus/types';
import { NOTE_COLORS } from '@keep-plus-plus/types';
import { getSharedNote } from '../utils/shareNotes';
import { LoadingSpinner } from '../components/LoadingSpinner';
import styles from './SharedNotePage.module.css';

export const SharedNotePage = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSharedNote = async () => {
      if (!shareId) {
        setError('Invalid share link');
        setLoading(false);
        return;
      }

      try {
        const sharedNote = await getSharedNote(shareId);

        if (!sharedNote) {
          setError('This note is no longer available or has expired');
          setLoading(false);
          return;
        }

        setNote(sharedNote);
      } catch (err) {
        console.error('Error loading shared note:', err);
        setError('Failed to load shared note');
      } finally {
        setLoading(false);
      }
    };

    loadSharedNote();
  }, [shareId]);

  if (loading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>😕 Oops!</h2>
          <p>{error || 'Note not found'}</p>
          <a href="/" className={styles.homeLink}>
            Go to Keep++
          </a>
        </div>
      </div>
    );
  }

  const backgroundColor = NOTE_COLORS[note.color] || NOTE_COLORS.default;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.logo}>Keep++</h1>
        <p className={styles.subtitle}>Shared Note</p>
      </div>

      <div className={styles.noteCard} style={{ backgroundColor }}>
        {note.pinned && <div className={styles.pinnedBadge}>📌 Pinned</div>}

        {note.title && <h2 className={styles.title}>{note.title}</h2>}

        {note.description && (
          <div className={styles.description}>
            {note.description.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        )}

        <div className={styles.footer}>
          <span className={styles.date}>
            Updated {new Date(note.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className={styles.actions}>
        <a href="/" className={styles.button}>
          Create Your Own Notes
        </a>
      </div>
    </div>
  );
};
