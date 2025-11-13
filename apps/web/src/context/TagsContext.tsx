import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Tag } from '@keep-plus-plus/types';
import { initDatabase, tagsRepository } from '@keep-plus-plus/storage';

interface TagsContextValue {
  tags: Tag[];
  loading: boolean;
  error: string | null;
  // CRUD operations
  createTag: (name: string) => Promise<Tag>;
  updateTag: (id: string, name: string) => Promise<Tag>;
  deleteTag: (id: string) => Promise<void>;
  // Tag-Note associations
  assignTagToNote: (noteId: string, tagId: string) => Promise<void>;
  removeTagFromNote: (noteId: string, tagId: string) => Promise<void>;
  getTagsForNote: (noteId: string) => Promise<Tag[]>;
  // Utils
  refreshTags: () => Promise<void>;
}

const TagsContext = createContext<TagsContextValue | undefined>(undefined);

export const TagsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock user ID (in real app, this would come from auth)
  const userId = 'demo-user';

  // Initialize database and load tags
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await initDatabase();
        await loadTags();
      } catch (err) {
        console.error('Failed to initialize tags:', err);
        setError('Failed to load tags');
      } finally {
        setLoading(false);
      }
    };

    void init();
  }, []);

  const loadTags = useCallback(async () => {
    try {
      const allTags = await tagsRepository.findAll(userId);
      setTags(allTags);
      setError(null);
    } catch (err) {
      console.error('Failed to load tags:', err);
      setError('Failed to load tags');
    }
  }, [userId]);

  const createTag = useCallback(async (name: string): Promise<Tag> => {
    try {
      const tag = await tagsRepository.create(userId, { name });
      setTags((prev) => [...prev, tag]);
      return tag;
    } catch (err) {
      console.error('Failed to create tag:', err);
      throw err;
    }
  }, [userId]);

  const updateTag = useCallback(async (id: string, name: string): Promise<Tag> => {
    try {
      const updatedTag = await tagsRepository.update(id, { name });
      setTags((prev) => prev.map((t) => (t.id === id ? updatedTag : t)));
      return updatedTag;
    } catch (err) {
      console.error('Failed to update tag:', err);
      throw err;
    }
  }, []);

  const deleteTag = useCallback(async (id: string): Promise<void> => {
    try {
      await tagsRepository.delete(id);
      setTags((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Failed to delete tag:', err);
      throw err;
    }
  }, []);

  const assignTagToNote = useCallback(async (noteId: string, tagId: string): Promise<void> => {
    try {
      await tagsRepository.assignToNote(noteId, tagId);
    } catch (err) {
      console.error('Failed to assign tag to note:', err);
      throw err;
    }
  }, []);

  const removeTagFromNote = useCallback(async (noteId: string, tagId: string): Promise<void> => {
    try {
      await tagsRepository.removeFromNote(noteId, tagId);
    } catch (err) {
      console.error('Failed to remove tag from note:', err);
      throw err;
    }
  }, []);

  const getTagsForNote = useCallback(async (noteId: string): Promise<Tag[]> => {
    try {
      return await tagsRepository.getTagsForNote(noteId);
    } catch (err) {
      console.error('Failed to get tags for note:', err);
      throw err;
    }
  }, []);

  const refreshTags = useCallback(async (): Promise<void> => {
    await loadTags();
  }, [loadTags]);

  const value: TagsContextValue = {
    tags,
    loading,
    error,
    createTag,
    updateTag,
    deleteTag,
    assignTagToNote,
    removeTagFromNote,
    getTagsForNote,
    refreshTags,
  };

  return <TagsContext.Provider value={value}>{children}</TagsContext.Provider>;
};

export const useTags = (): TagsContextValue => {
  const context = useContext(TagsContext);
  if (!context) {
    throw new Error('useTags must be used within a TagsProvider');
  }
  return context;
};
