import type { Note } from '@keep-plus-plus/types';
import { motion } from 'framer-motion';
import { NoteCard } from '../NoteCard/NoteCard';
import styles from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
  onNoteClick?: (note: Note) => void;
  onPinNote?: (noteId: string) => void;
  onArchiveNote?: (noteId: string) => void;
  onDeleteNote?: (noteId: string) => void;
  loading?: boolean;
  emptyMessage?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const NoteList: React.FC<NoteListProps> = ({
  notes,
  onNoteClick,
  onPinNote,
  onArchiveNote,
  onDeleteNote,
  loading = false,
  emptyMessage = 'No notes yet',
}) => {
  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading notes...</p>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>📝</div>
        <h3 className={styles.emptyTitle}>{emptyMessage}</h3>
        <p className={styles.emptyDescription}>Click "New Note" to create your first note</p>
      </div>
    );
  }

  // Separate pinned and unpinned notes
  const pinnedNotes = notes.filter((n) => n.pinned && !n.archived && !n.trashed);
  const unpinnedNotes = notes.filter((n) => !n.pinned && !n.archived && !n.trashed);

  return (
    <div className={styles.container}>
      {pinnedNotes.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Pinned</h2>
          <motion.div
            className={styles.grid}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {pinnedNotes.map((note, index) => (
              <NoteCard
                key={note.id}
                note={note}
                onClick={onNoteClick}
                onPin={onPinNote}
                onArchive={onArchiveNote}
                onDelete={onDeleteNote}
                index={index}
              />
            ))}
          </motion.div>
        </section>
      )}

      {unpinnedNotes.length > 0 && (
        <section className={styles.section}>
          {pinnedNotes.length > 0 && <h2 className={styles.sectionTitle}>Others</h2>}
          <motion.div
            className={styles.grid}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {unpinnedNotes.map((note, index) => (
              <NoteCard
                key={note.id}
                note={note}
                onClick={onNoteClick}
                onPin={onPinNote}
                onArchive={onArchiveNote}
                onDelete={onDeleteNote}
                index={index}
              />
            ))}
          </motion.div>
        </section>
      )}
    </div>
  );
};
