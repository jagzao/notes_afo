import { useState, useMemo } from 'react';
import { Button } from '@keep-plus-plus/ui';
import { useNotes } from '../context/NotesContext';
import { useTags } from '../context/TagsContext';
import { NoteList } from '../components/NoteList/NoteList';
import { NoteEditor } from '../components/NoteEditor';
import type { Note, CreateNoteInput, NoteColor } from '@keep-plus-plus/types';
import styles from './HomePage.module.css';

const NOTE_COLORS: Array<{ value: NoteColor; label: string }> = [
  { value: 'coral', label: 'Coral' },
  { value: 'peach', label: 'Pelocotón' },
  { value: 'sand', label: 'Arena' },
  { value: 'mint', label: 'Menta' },
  { value: 'sage', label: 'Salvia' },
];

export const HomePage = () => {
  const { notes, loading, createNote, updateNote, pinNote, archiveNote, moveToTrash } = useNotes();
  const { tags } = useTags();
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<NoteColor[]>([]);

  // Filter notes based on search and filters
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      // Search filter (title and description)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = note.title.toLowerCase().includes(query);
        const matchesDescription = note.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDescription) {
          return false;
        }
      }

      // Color filter
      if (selectedColors.length > 0) {
        if (!selectedColors.includes(note.color)) {
          return false;
        }
      }

      return true;
    });
  }, [notes, searchQuery, selectedColors]);

  const toggleTagFilter = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const toggleColorFilter = (color: NoteColor) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSelectedColors([]);
  };

  const hasActiveFilters = searchQuery || selectedTags.length > 0 || selectedColors.length > 0;

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
    setEditingNote(note);
  };

  const handleCloseEditor = () => {
    setEditingNote(null);
  };

  const handleSaveNote = async (noteId: string, updates: { title?: string; description?: string; color?: NoteColor }) => {
    try {
      await updateNote(noteId, updates);
    } catch (error) {
      console.error('Failed to save note:', error);
      throw error;
    }
  };

  const handleColorChange = async (noteId: string, color: NoteColor) => {
    try {
      await updateNote(noteId, { color });
    } catch (error) {
      console.error('Failed to change note color:', error);
      throw error;
    }
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
        <div className={styles.headerTop}>
          <h2 className={styles.title}>Notes</h2>
          <Button variant="primary" size="md" onClick={handleCreateNote}>
            + New Note
          </Button>
        </div>

        <input
          type="text"
          className={styles.searchBar}
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {(tags.length > 0 || NOTE_COLORS.length > 0) && (
          <div className={styles.filters}>
            {tags.slice(0, 5).map((tag) => (
              <button
                key={tag.id}
                className={`${styles.filterChip} ${
                  selectedTags.includes(tag.id) ? styles.filterChipActive : ''
                }`}
                onClick={() => toggleTagFilter(tag.id)}
              >
                #{tag.name}
              </button>
            ))}

            {NOTE_COLORS.map((color) => (
              <button
                key={color.value}
                className={`${styles.filterChip} ${
                  selectedColors.includes(color.value) ? styles.filterChipActive : ''
                }`}
                onClick={() => toggleColorFilter(color.value)}
              >
                🎨 {color.label}
              </button>
            ))}

            {hasActiveFilters && (
              <button className={styles.clearFilters} onClick={clearFilters}>
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      <NoteList
        notes={filteredNotes}
        loading={loading}
        onNoteClick={handleNoteClick}
        onPinNote={handlePinNote}
        onArchiveNote={handleArchiveNote}
        onDeleteNote={handleDeleteNote}
        emptyMessage={hasActiveFilters ? 'No notes match your filters' : 'No notes yet'}
      />

      <NoteEditor
        note={editingNote}
        isOpen={editingNote !== null}
        onClose={handleCloseEditor}
        onSave={handleSaveNote}
        onPin={handlePinNote}
        onArchive={handleArchiveNote}
        onDelete={handleDeleteNote}
        onColorChange={handleColorChange}
      />
    </div>
  );
};
