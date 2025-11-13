import { useState } from 'react';
import type { Note, NoteColor } from '@keep-plus-plus/types';
import { useNotes } from '../context/NotesContext';
import { useToast } from '../hooks/useToast';
import { NoteCard } from '../components/NoteCard';
import { NoteEditor } from '../components/NoteEditor';
import styles from './TrashPage.module.css';

export const TrashPage = () => {
  const { notes, updateNote, deleteNote, refreshNotes } = useNotes();
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const toast = useToast();

  // Filter trashed notes
  const trashedNotes = notes.filter((note) => note.trashed);

  const handleRestore = async (noteId: string) => {
    try {
      await updateNote(noteId, { trashed: false });
      await refreshNotes();
      toast.success('Note restored successfully');
    } catch (error) {
      console.error('Failed to restore note:', error);
      toast.error('Failed to restore note');
    }
  };

  const handleDeletePermanently = async (noteId: string) => {
    if (
      window.confirm(
        'Permanently delete this note? This action cannot be undone and will also delete all properties, tags, and reminders associated with this note.'
      )
    ) {
      try {
        await deleteNote(noteId);
        await refreshNotes();
        if (editingNote?.id === noteId) {
          setEditingNote(null);
        }
        toast.success('Note permanently deleted');
      } catch (error) {
        console.error('Failed to delete note permanently:', error);
        toast.error('Failed to delete note');
      }
    }
  };

  const handleEmptyTrash = async () => {
    if (
      window.confirm(
        `Permanently delete all ${trashedNotes.length} notes in trash? This action cannot be undone.`
      )
    ) {
      try {
        await Promise.all(trashedNotes.map((note) => deleteNote(note.id)));
        await refreshNotes();
        setEditingNote(null);
        toast.success(`${trashedNotes.length} notes permanently deleted`);
      } catch (error) {
        console.error('Failed to empty trash:', error);
        toast.error('Failed to empty trash');
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
        <div>
          <h1 className={styles.title}>Trash</h1>
          <p className={styles.subtitle}>
            {trashedNotes.length} {trashedNotes.length === 1 ? 'note' : 'notes'} in trash
          </p>
        </div>
        {trashedNotes.length > 0 && (
          <button className={styles.emptyTrashButton} onClick={handleEmptyTrash}>
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
            Empty Trash
          </button>
        )}
      </div>

      {trashedNotes.length > 0 ? (
        <>
          <div className={styles.notice}>
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Notes in trash will be automatically deleted after 30 days</span>
          </div>

          <div className={styles.grid}>
            {trashedNotes.map((note, index) => (
              <NoteCard
                key={note.id}
                note={note}
                onClick={setEditingNote}
                onPin={handlePin}
                onArchive={handleRestore}
                onDelete={handleDeletePermanently}
                index={index}
              />
            ))}
          </div>
        </>
      ) : (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🗑️</div>
          <h2 className={styles.emptyTitle}>Trash is empty</h2>
          <p className={styles.emptyText}>
            Deleted notes will appear here. Notes in trash are automatically deleted after 30 days.
          </p>
        </div>
      )}

      <NoteEditor
        note={editingNote}
        isOpen={!!editingNote}
        onClose={() => setEditingNote(null)}
        onSave={handleSave}
        onPin={handlePin}
        onArchive={handleRestore}
        onDelete={handleDeletePermanently}
        onColorChange={handleColorChange}
      />
    </div>
  );
};
