/**
 * Notes Repository - CRUD operations for notes
 */

import type { Note, CreateNoteInput, UpdateNoteInput, NoteFilter, NoteSortOptions } from '@keep-plus-plus/types';
import { getDatabase } from '../db/database';
import { generateId } from '../utils/id';

export class NotesRepository {
  /**
   * Create a new note
   */
  async create(userId: string, input: CreateNoteInput): Promise<Note> {
    const db = getDatabase();
    const now = new Date();

    const note: Note = {
      id: generateId(),
      userId,
      title: input.title || '',
      description: input.description || '',
      color: input.color || 'default',
      pinned: false,
      archived: false,
      trashed: false,
      createdAt: now,
      updatedAt: now,
      version: 1,
      deviceId: this.getDeviceId(),
    };

    // Validate note has at least title or description
    if (!note.title && !note.description) {
      throw new Error('Note must have at least a title or description');
    }

    await db.add('notes', note);
    return note;
  }

  /**
   * Get a note by ID
   */
  async findById(id: string): Promise<Note | null> {
    const db = getDatabase();
    const note = await db.get('notes', id);
    return note || null;
  }

  /**
   * Get all notes for a user with optional filtering
   */
  async findAll(userId: string, filter?: NoteFilter, sort?: NoteSortOptions): Promise<Note[]> {
    const db = getDatabase();
    const tx = db.transaction('notes', 'readonly');
    const index = tx.store.index('by-user');

    let notes = await index.getAll(userId);

    // Apply filters
    if (filter) {
      notes = this.applyFilters(notes, filter);
    }

    // Apply sorting
    if (sort) {
      notes = this.applySorting(notes, sort);
    }

    return notes;
  }

  /**
   * Update a note
   */
  async update(id: string, input: UpdateNoteInput): Promise<Note> {
    const db = getDatabase();
    const note = await this.findById(id);

    if (!note) {
      throw new Error(`Note not found: ${id}`);
    }

    const updatedNote: Note = {
      ...note,
      ...input,
      updatedAt: new Date(),
      version: note.version + 1,
      deviceId: this.getDeviceId(),
    };

    // Validate note has at least title or description
    if (!updatedNote.title && !updatedNote.description) {
      throw new Error('Note must have at least a title or description');
    }

    await db.put('notes', updatedNote);
    return updatedNote;
  }

  /**
   * Delete a note (hard delete)
   */
  async delete(id: string): Promise<void> {
    const db = getDatabase();
    await db.delete('notes', id);
  }

  /**
   * Pin/unpin a note
   */
  async togglePin(id: string): Promise<Note> {
    const note = await this.findById(id);
    if (!note) {
      throw new Error(`Note not found: ${id}`);
    }

    return this.update(id, { pinned: !note.pinned });
  }

  /**
   * Archive/unarchive a note
   */
  async toggleArchive(id: string): Promise<Note> {
    const note = await this.findById(id);
    if (!note) {
      throw new Error(`Note not found: ${id}`);
    }

    return this.update(id, {
      archived: !note.archived,
      pinned: false, // Unpin when archiving
    });
  }

  /**
   * Move note to trash
   */
  async moveToTrash(id: string): Promise<Note> {
    const note = await this.findById(id);
    if (!note) {
      throw new Error(`Note not found: ${id}`);
    }

    return this.update(id, {
      trashed: true,
      trashedAt: new Date(),
      pinned: false,
      archived: false,
    });
  }

  /**
   * Restore note from trash
   */
  async restoreFromTrash(id: string): Promise<Note> {
    const note = await this.findById(id);
    if (!note) {
      throw new Error(`Note not found: ${id}`);
    }

    const { trashedAt, ...rest } = note;
    return this.update(id, {
      trashed: false,
      trashedAt: undefined,
    });
  }

  /**
   * Get notes in trash older than 30 days
   */
  async getExpiredTrashNotes(): Promise<Note[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const db = getDatabase();
    const tx = db.transaction('notes', 'readonly');
    const notes = await tx.store.getAll();

    return notes.filter(
      (note) => note.trashed && note.trashedAt && note.trashedAt < thirtyDaysAgo
    );
  }

  /**
   * Empty trash (delete all trashed notes)
   */
  async emptyTrash(userId: string): Promise<number> {
    const trashedNotes = await this.findAll(userId, { state: 'trashed' });
    const db = getDatabase();
    const tx = db.transaction('notes', 'readwrite');

    for (const note of trashedNotes) {
      await tx.store.delete(note.id);
    }

    await tx.done;
    return trashedNotes.length;
  }

  /**
   * Search notes by text
   */
  async search(userId: string, query: string): Promise<Note[]> {
    const allNotes = await this.findAll(userId, { state: 'active' });
    const lowerQuery = query.toLowerCase();

    return allNotes.filter((note) => {
      const titleMatch = note.title.toLowerCase().includes(lowerQuery);
      const descMatch = note.description.toLowerCase().includes(lowerQuery);
      return titleMatch || descMatch;
    });
  }

  /**
   * Get count of notes by state
   */
  async getCountByState(userId: string): Promise<{
    active: number;
    archived: number;
    trashed: number;
  }> {
    const notes = await this.findAll(userId);

    return {
      active: notes.filter((n) => !n.archived && !n.trashed).length,
      archived: notes.filter((n) => n.archived).length,
      trashed: notes.filter((n) => n.trashed).length,
    };
  }

  // Private helper methods

  private applyFilters(notes: Note[], filter: NoteFilter): Note[] {
    let filtered = notes;

    // Filter by state
    if (filter.state === 'active') {
      filtered = filtered.filter((n) => !n.archived && !n.trashed);
    } else if (filter.state === 'archived') {
      filtered = filtered.filter((n) => n.archived);
    } else if (filter.state === 'trashed') {
      filtered = filtered.filter((n) => n.trashed);
    }

    // Filter by pinned
    if (filter.pinned !== undefined) {
      filtered = filtered.filter((n) => n.pinned === filter.pinned);
    }

    // Filter by color
    if (filter.color) {
      filtered = filtered.filter((n) => n.color === filter.color);
    }

    return filtered;
  }

  private applySorting(notes: Note[], sort: NoteSortOptions): Note[] {
    const sorted = [...notes];

    sorted.sort((a, b) => {
      let compareValue = 0;

      if (sort.by === 'createdAt') {
        compareValue = a.createdAt.getTime() - b.createdAt.getTime();
      } else if (sort.by === 'updatedAt') {
        compareValue = a.updatedAt.getTime() - b.updatedAt.getTime();
      } else if (sort.by === 'title') {
        compareValue = a.title.localeCompare(b.title);
      }

      return sort.order === 'desc' ? -compareValue : compareValue;
    });

    return sorted;
  }

  private getDeviceId(): string {
    // Try to get from localStorage, or generate new one
    if (typeof window !== 'undefined') {
      let deviceId = localStorage.getItem('keep-plus-plus-device-id');
      if (!deviceId) {
        deviceId = generateId();
        localStorage.setItem('keep-plus-plus-device-id', deviceId);
      }
      return deviceId;
    }
    return 'server';
  }
}

// Export singleton instance
export const notesRepository = new NotesRepository();
