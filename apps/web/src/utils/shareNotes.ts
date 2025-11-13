import type { Note } from '@keep-plus-plus/types';
import { generateId } from '@keep-plus-plus/storage';

export interface PublicNote {
  shareId: string;
  noteId: string;
  note: Note;
  createdAt: Date;
  expiresAt?: Date;
}

const SHARED_NOTES_KEY = 'keep-plus-plus-shared-notes';

/**
 * Get all shared notes from localStorage
 */
function getSharedNotes(): Map<string, PublicNote> {
  try {
    const data = localStorage.getItem(SHARED_NOTES_KEY);
    if (!data) {
      return new Map();
    }

    const parsed = JSON.parse(data);
    return new Map(Object.entries(parsed));
  } catch (error) {
    console.error('Error reading shared notes:', error);
    return new Map();
  }
}

/**
 * Save shared notes to localStorage
 */
function saveSharedNotes(notes: Map<string, PublicNote>): void {
  try {
    const obj = Object.fromEntries(notes);
    localStorage.setItem(SHARED_NOTES_KEY, JSON.stringify(obj));
  } catch (error) {
    console.error('Error saving shared notes:', error);
  }
}

/**
 * Generate a public share link for a note
 */
export async function generateShareLink(note: Note): Promise<string> {
  const shareId = generateId();
  const sharedNotes = getSharedNotes();

  const publicNote: PublicNote = {
    shareId,
    noteId: note.id,
    note: {
      ...note,
      // Remove sensitive data
      userId: 'public',
    },
    createdAt: new Date(),
    // Optional: Set expiration (e.g., 30 days)
    // expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  };

  sharedNotes.set(shareId, publicNote);
  saveSharedNotes(sharedNotes);

  // Generate the full URL
  const baseUrl = window.location.origin;
  return `${baseUrl}/share/${shareId}`;
}

/**
 * Get a shared note by its share ID
 */
export async function getSharedNote(shareId: string): Promise<Note | null> {
  const sharedNotes = getSharedNotes();
  const publicNote = sharedNotes.get(shareId);

  if (!publicNote) {
    return null;
  }

  // Check if expired
  if (publicNote.expiresAt && new Date(publicNote.expiresAt) < new Date()) {
    // Remove expired note
    sharedNotes.delete(shareId);
    saveSharedNotes(sharedNotes);
    return null;
  }

  return publicNote.note;
}

/**
 * Revoke a share link for a note
 */
export async function revokeShareLink(noteId: string): Promise<void> {
  const sharedNotes = getSharedNotes();

  // Find and remove all shares for this note
  for (const [shareId, publicNote] of sharedNotes.entries()) {
    if (publicNote.noteId === noteId) {
      sharedNotes.delete(shareId);
    }
  }

  saveSharedNotes(sharedNotes);
}

/**
 * Get the share link for a note if it exists
 */
export async function getExistingShareLink(noteId: string): Promise<string | null> {
  const sharedNotes = getSharedNotes();

  for (const [shareId, publicNote] of sharedNotes.entries()) {
    if (publicNote.noteId === noteId) {
      // Check if expired
      if (publicNote.expiresAt && new Date(publicNote.expiresAt) < new Date()) {
        continue;
      }

      const baseUrl = window.location.origin;
      return `${baseUrl}/share/${shareId}`;
    }
  }

  return null;
}

/**
 * Check if a note is currently shared
 */
export async function isNoteShared(noteId: string): Promise<boolean> {
  const link = await getExistingShareLink(noteId);
  return link !== null;
}
