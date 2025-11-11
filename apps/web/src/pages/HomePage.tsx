import { useState } from 'react';
import { Button } from '@keep-plus-plus/ui';
import { useNotes } from '../context/NotesContext';
import { NoteList } from '../components/NoteList/NoteList';
import type { Note, CreateNoteInput } from '@keep-plus-plus/types';
import styles from './HomePage.module.css';

export const HomePage = () => {
  const { notes, loading, createNote, pinNote, archiveNote, moveToTrash } = useNotes();
  const [showNewNote, setShowNewNote] = useState(false);

  const handleCreateNote = async () => {
    const input: CreateNoteInput = {
      title: '',
      description: '',
    };

    try {
      await createNote(input);
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const handleNoteClick = (note: Note) => {
    // TODO: Open note editor modal
    console.log('Clicked note:', note);
  };

  const handlePinNote = async (noteId: string) => {
    try {
      await pinNote(noteId);
    } catch (error) {
      console.error('Failed to pin note:', error);
    }
  };

  const handleArchiveNote = async (noteId: string) => {
    try {
      await archiveNote(noteId);
    } catch (error) {
      console.error('Failed to archive note:', error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await moveToTrash(noteId);
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Notes</h2>
        <Button variant="primary" size="md" onClick={handleCreateNote}>
          + New Note
        </Button>
      </div>

      <NoteList
        notes={notes}
        loading={loading}
        onNoteClick={handleNoteClick}
        onPinNote={handlePinNote}
        onArchiveNote={handleArchiveNote}
        onDeleteNote={handleDeleteNote}
        emptyMessage="No notes yet"
      />
    </div>
  );
};
