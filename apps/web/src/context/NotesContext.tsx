import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Note, CreateNoteInput, UpdateNoteInput } from '@keep-plus-plus/types';
import { initDatabase, notesRepository } from '@keep-plus-plus/storage';

interface NotesContextValue {
  notes: Note[];
  loading: boolean;
  error: string | null;
  // CRUD operations
  createNote: (input: CreateNoteInput) => Promise<Note>;
  updateNote: (id: string, input: UpdateNoteInput) => Promise<Note>;
  deleteNote: (id: string) => Promise<void>;
  // Actions
  pinNote: (id: string) => Promise<void>;
  archiveNote: (id: string) => Promise<void>;
  moveToTrash: (id: string) => Promise<void>;
  restoreFromTrash: (id: string) => Promise<void>;
  // Utils
  refreshNotes: () => Promise<void>;
}

const NotesContext = createContext<NotesContextValue | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock user ID (in real app, this would come from auth)
  const userId = 'demo-user';

  // Initialize database and load notes
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await initDatabase();
        await loadNotes();
      } catch (err) {
        console.error('Failed to initialize database:', err);
        setError('Failed to load notes');
      } finally {
        setLoading(false);
      }
    };

    void init();
  }, []);

  const loadNotes = useCallback(async () => {
    try {
      const allNotes = await notesRepository.findAll(userId, { state: 'active' }, { by: 'updatedAt', order: 'desc' });
      setNotes(allNotes);
      setError(null);
    } catch (err) {
      console.error('Failed to load notes:', err);
      setError('Failed to load notes');
    }
  }, [userId]);

  const createNote = useCallback(async (input: CreateNoteInput): Promise<Note> => {
    try {
      const note = await notesRepository.create(userId, input);
      setNotes((prev) => [note, ...prev]);
      return note;
    } catch (err) {
      console.error('Failed to create note:', err);
      throw err;
    }
  }, [userId]);

  const updateNote = useCallback(async (id: string, input: UpdateNoteInput): Promise<Note> => {
    try {
      const updated = await notesRepository.update(id, input);
      setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
      return updated;
    } catch (err) {
      console.error('Failed to update note:', err);
      throw err;
    }
  }, []);

  const deleteNote = useCallback(async (id: string): Promise<void> => {
    try {
      await notesRepository.delete(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error('Failed to delete note:', err);
      throw err;
    }
  }, []);

  const pinNote = useCallback(async (id: string): Promise<void> => {
    try {
      const updated = await notesRepository.togglePin(id);
      setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
    } catch (err) {
      console.error('Failed to pin note:', err);
      throw err;
    }
  }, []);

  const archiveNote = useCallback(async (id: string): Promise<void> => {
    try {
      const updated = await notesRepository.toggleArchive(id);
      // Remove from active notes if archived
      if (updated.archived) {
        setNotes((prev) => prev.filter((n) => n.id !== id));
      } else {
        setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
      }
    } catch (err) {
      console.error('Failed to archive note:', err);
      throw err;
    }
  }, []);

  const moveToTrash = useCallback(async (id: string): Promise<void> => {
    try {
      await notesRepository.moveToTrash(id);
      // Remove from active notes
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error('Failed to move note to trash:', err);
      throw err;
    }
  }, []);

  const restoreFromTrash = useCallback(async (id: string): Promise<void> => {
    try {
      const restored = await notesRepository.restoreFromTrash(id);
      setNotes((prev) => [restored, ...prev]);
    } catch (err) {
      console.error('Failed to restore note:', err);
      throw err;
    }
  }, []);

  const refreshNotes = useCallback(async (): Promise<void> => {
    await loadNotes();
  }, [loadNotes]);

  const value: NotesContextValue = {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    pinNote,
    archiveNote,
    moveToTrash,
    restoreFromTrash,
    refreshNotes,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};

export const useNotes = (): NotesContextValue => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
