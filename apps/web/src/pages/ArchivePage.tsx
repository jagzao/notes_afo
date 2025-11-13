import { useState } from 'react';
import type { Note, NoteColor } from '@keep-plus-plus/types';
import { useNotes } from '../context/NotesContext';
import { useToast } from '../hooks/useToast';
import { NoteCard } from '../components/NoteCard';
import { NoteEditor } from '../components/NoteEditor';
import styles from './ArchivePage.module.css';

export const ArchivePage = () => {
  const { notes, updateNote, refreshNotes } = useNotes();
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const toast = useToast();

  // Filter archived notes
  const archivedNotes = notes.filter((note) => note.archived && !note.trashed);

  const handleUnarchive = async (noteId: string) => {
    try {
      await updateNote(noteId, { archived: false });
      await refreshNotes();
      toast.success('Note unarchived successfully');
    } catch (error) {
      console.error('Failed to unarchive note:', error);
      toast.error('Failed to unarchive note');
    }
  };

  const handleDelete = async (noteId: string) => {
    if (window.confirm('Move this note to trash?')) {
      try {
        await updateNote(noteId, { trashed: true });
        await refreshNotes();
        toast.success('Note moved to trash');
      } catch (error) {
        console.error('Failed to trash note:', error);
        toast.error('Failed to move note to trash');
      }
    }
  };

  const handlePin = async (noteId: string) => {
    const note = notes.find((n) => n.id === noteId);
    if (note) {
      try {
        await updateNote(noteId, { pinned: !note.pinned });
        await refreshNotes();
      } catch (error) {
        console.error('Failed to pin/unpin note:', error);
        toast.error('Failed to update note');
      }
    }
  };

  const handleSave = async (
    noteId: string,
    updates: { title?: string; description?: string; color?: NoteColor }
  ) => {
    try {
      await updateNote(noteId, updates);
      await refreshNotes();
    } catch (error) {
      console.error('Failed to save note:', error);
      toast.error('Failed to save note');
    }
  };

  const handleColorChange = async (noteId: string, color: NoteColor) => {
    try {
      await updateNote(noteId, { color });
      await refreshNotes();
    } catch (error) {
      console.error('Failed to change color:', error);
      toast.error('Failed to change color');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Archive</h1>
        <p className={styles.subtitle}>
          {archivedNotes.length} {archivedNotes.length === 1 ? 'note' : 'notes'} archived
        </p>
      </div>

      {archivedNotes.length > 0 ? (
        <div className={styles.grid}>
          {archivedNotes.map((note, index) => (
            <NoteCard
              key={note.id}
              note={note}
              onClick={setEditingNote}
              onPin={handlePin}
              onArchive={handleUnarchive}
              onDelete={handleDelete}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📦</div>
          <h2 className={styles.emptyTitle}>No archived notes</h2>
          <p className={styles.emptyText}>
            Notes you archive will appear here. Archive notes to keep them out of sight but easily
            accessible.
          </p>
        </div>
      )}

      <NoteEditor
        note={editingNote}
        isOpen={!!editingNote}
        onClose={() => setEditingNote(null)}
        onSave={handleSave}
        onPin={handlePin}
        onArchive={handleUnarchive}
        onDelete={handleDelete}
        onColorChange={handleColorChange}
      />
    </div>
  );
};
