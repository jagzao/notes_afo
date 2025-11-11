/**
 * Tags Repository - CRUD operations for tags
 */

import type { Tag, NoteTag, CreateTagInput, UpdateTagInput } from '@keep-plus-plus/types';
import { getDatabase } from '../db/database';
import { generateId } from '../utils/id';

export class TagsRepository {
  /**
   * Create a new tag
   */
  async create(userId: string, input: CreateTagInput): Promise<Tag> {
    const db = getDatabase();
    const now = new Date();

    // Check if tag with same name already exists
    const existing = await this.findByName(userId, input.name);
    if (existing) {
      throw new Error(`Tag with name "${input.name}" already exists`);
    }

    const tag: Tag = {
      id: generateId(),
      userId,
      name: input.name.trim(),
      color: input.color || '#9AA0A6',
      createdAt: now,
      updatedAt: now,
    };

    await db.add('tags', tag);
    return tag;
  }

  /**
   * Get a tag by ID
   */
  async findById(id: string): Promise<Tag | null> {
    const db = getDatabase();
    const tag = await db.get('tags', id);
    return tag || null;
  }

  /**
   * Get a tag by name
   */
  async findByName(userId: string, name: string): Promise<Tag | null> {
    const db = getDatabase();
    const tx = db.transaction('tags', 'readonly');
    const index = tx.store.index('by-user');
    const tags = await index.getAll(userId);

    return tags.find((t) => t.name.toLowerCase() === name.toLowerCase()) || null;
  }

  /**
   * Get all tags for a user
   */
  async findAll(userId: string): Promise<Tag[]> {
    const db = getDatabase();
    const tx = db.transaction('tags', 'readonly');
    const index = tx.store.index('by-user');

    const tags = await index.getAll(userId);
    return tags.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Update a tag
   */
  async update(id: string, input: UpdateTagInput): Promise<Tag> {
    const db = getDatabase();
    const tag = await this.findById(id);

    if (!tag) {
      throw new Error(`Tag not found: ${id}`);
    }

    // If name is being changed, check for duplicates
    if (input.name && input.name !== tag.name) {
      const existing = await this.findByName(tag.userId, input.name);
      if (existing) {
        throw new Error(`Tag with name "${input.name}" already exists`);
      }
    }

    const updatedTag: Tag = {
      ...tag,
      ...(input.name && { name: input.name.trim() }),
      ...(input.color && { color: input.color }),
      updatedAt: new Date(),
    };

    await db.put('tags', updatedTag);
    return updatedTag;
  }

  /**
   * Delete a tag
   */
  async delete(id: string): Promise<void> {
    const db = getDatabase();
    const tx = db.transaction(['tags', 'noteTags'], 'readwrite');

    // Delete the tag
    await tx.objectStore('tags').delete(id);

    // Delete all note-tag associations
    const noteTagsIndex = tx.objectStore('noteTags').index('by-tag');
    const noteTags = await noteTagsIndex.getAll(id);

    for (const noteTag of noteTags) {
      await tx.objectStore('noteTags').delete([noteTag.noteId, noteTag.tagId] as unknown as string);
    }

    await tx.done;
  }

  /**
   * Assign a tag to a note
   */
  async assignToNote(noteId: string, tagId: string): Promise<NoteTag> {
    const db = getDatabase();

    // Check if already assigned
    const existing = await db.get('noteTags', [noteId, tagId] as unknown as string);
    if (existing) {
      return existing;
    }

    const noteTag: NoteTag = {
      noteId,
      tagId,
      createdAt: new Date(),
    };

    await db.add('noteTags', noteTag);
    return noteTag;
  }

  /**
   * Remove a tag from a note
   */
  async removeFromNote(noteId: string, tagId: string): Promise<void> {
    const db = getDatabase();
    await db.delete('noteTags', [noteId, tagId] as unknown as string);
  }

  /**
   * Get all tags for a note
   */
  async getTagsForNote(noteId: string): Promise<Tag[]> {
    const db = getDatabase();
    const tx = db.transaction(['noteTags', 'tags'], 'readonly');

    const noteTagsIndex = tx.objectStore('noteTags').index('by-note');
    const noteTags = await noteTagsIndex.getAll(noteId);

    const tags: Tag[] = [];
    for (const noteTag of noteTags) {
      const tag = await tx.objectStore('tags').get(noteTag.tagId);
      if (tag) {
        tags.push(tag);
      }
    }

    return tags.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get all notes for a tag
   */
  async getNotesForTag(tagId: string): Promise<string[]> {
    const db = getDatabase();
    const tx = db.transaction('noteTags', 'readonly');
    const index = tx.store.index('by-tag');

    const noteTags = await index.getAll(tagId);
    return noteTags.map((nt) => nt.noteId);
  }

  /**
   * Get tag usage count (number of notes using each tag)
   */
  async getTagUsageCount(userId: string): Promise<Map<string, number>> {
    const tags = await this.findAll(userId);
    const counts = new Map<string, number>();

    const db = getDatabase();
    const allNoteTags = await db.getAll('noteTags');

    for (const tag of tags) {
      const count = allNoteTags.filter((nt) => nt.tagId === tag.id).length;
      counts.set(tag.id, count);
    }

    return counts;
  }

  /**
   * Search tags by name
   */
  async search(userId: string, query: string): Promise<Tag[]> {
    const allTags = await this.findAll(userId);
    const lowerQuery = query.toLowerCase();

    return allTags.filter((tag) => tag.name.toLowerCase().includes(lowerQuery));
  }
}

// Export singleton instance
export const tagsRepository = new TagsRepository();
