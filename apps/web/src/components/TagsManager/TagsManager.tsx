import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Tag } from '@keep-plus-plus/types';
import { useTags } from '../../context/TagsContext';
import { useToast } from '../../hooks/useToast';
import styles from './TagsManager.module.css';

interface TagsManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TagWithUsage extends Tag {
  usageCount: number;
}

export const TagsManager: React.FC<TagsManagerProps> = ({ isOpen, onClose }) => {
  const { tags, updateTag, deleteTag, refreshTags } = useTags();
  const toast = useToast();
  const [tagsWithUsage, setTagsWithUsage] = useState<TagWithUsage[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // Load tags with usage counts
  useEffect(() => {
    if (isOpen) {
      const loadTagsWithUsage = async () => {
        const { tagsRepository } = await import('@keep-plus-plus/storage');

        const withUsage = await Promise.all(
          tags.map(async (tag) => {
            const noteIds = await tagsRepository.getNotesForTag(tag.id);
            return {
              ...tag,
              usageCount: noteIds.length,
            };
          })
        );

        // Sort by usage count (descending)
        withUsage.sort((a, b) => b.usageCount - a.usageCount);
        setTagsWithUsage(withUsage);
      };

      void loadTagsWithUsage();
    }
  }, [isOpen, tags]);

  const handleStartEdit = (tag: TagWithUsage) => {
    setEditingId(tag.id);
    setEditingName(tag.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleSaveEdit = async (id: string) => {
    if (!editingName.trim()) {
      toast.error('Tag name cannot be empty');
      return;
    }

    try {
      await updateTag(id, editingName.trim());
      await refreshTags();
      setEditingId(null);
      setEditingName('');
      toast.success('Tag renamed successfully');
    } catch (error) {
      console.error('Failed to update tag:', error);
      toast.error('Failed to rename tag');
    }
  };

  const handleDelete = async (tag: TagWithUsage) => {
    const message =
      tag.usageCount > 0
        ? `Delete "${tag.name}"? This will remove it from ${tag.usageCount} ${
            tag.usageCount === 1 ? 'note' : 'notes'
          }.`
        : `Delete "${tag.name}"?`;

    if (window.confirm(message)) {
      try {
        await deleteTag(tag.id);
        await refreshTags();
        toast.success('Tag deleted successfully');
      } catch (error) {
        console.error('Failed to delete tag:', error);
        toast.error('Failed to delete tag');
      }
    }
  };

  const handleDeleteUnused = async () => {
    const unusedTags = tagsWithUsage.filter((t) => t.usageCount === 0);

    if (unusedTags.length === 0) {
      toast.info('No unused tags to delete');
      return;
    }

    if (window.confirm(`Delete ${unusedTags.length} unused ${unusedTags.length === 1 ? 'tag' : 'tags'}?`)) {
      try {
        await Promise.all(unusedTags.map((tag) => deleteTag(tag.id)));
        await refreshTags();
        toast.success(`${unusedTags.length} unused ${unusedTags.length === 1 ? 'tag' : 'tags'} deleted`);
      } catch (error) {
        console.error('Failed to delete unused tags:', error);
        toast.error('Failed to delete unused tags');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className={styles.header}>
              <div>
                <h2 className={styles.title}>Manage Tags</h2>
                <p className={styles.subtitle}>
                  {tagsWithUsage.length} {tagsWithUsage.length === 1 ? 'tag' : 'tags'} total
                </p>
              </div>
              <div className={styles.headerActions}>
                <button
                  className={styles.deleteUnusedButton}
                  onClick={handleDeleteUnused}
                  type="button"
                >
                  Delete Unused
                </button>
                <button
                  className={styles.closeButton}
                  onClick={onClose}
                  type="button"
                  aria-label="Close"
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className={styles.content}>
              {tagsWithUsage.length === 0 ? (
                <div className={styles.empty}>
                  <p>No tags yet. Create tags by adding them to your notes.</p>
                </div>
              ) : (
                <div className={styles.tagsList}>
                  {tagsWithUsage.map((tag) => (
                    <div key={tag.id} className={styles.tagItem}>
                      {editingId === tag.id ? (
                        <>
                          <input
                            type="text"
                            className={styles.editInput}
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                void handleSaveEdit(tag.id);
                              } else if (e.key === 'Escape') {
                                handleCancelEdit();
                              }
                            }}
                            autoFocus
                          />
                          <div className={styles.editActions}>
                            <button
                              className={styles.saveButton}
                              onClick={() => handleSaveEdit(tag.id)}
                              type="button"
                              title="Save"
                            >
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
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </button>
                            <button
                              className={styles.cancelButton}
                              onClick={handleCancelEdit}
                              type="button"
                              title="Cancel"
                            >
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
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className={styles.tagInfo}>
                            <span className={styles.tagName}>#{tag.name}</span>
                            <span className={styles.tagUsage}>
                              {tag.usageCount} {tag.usageCount === 1 ? 'note' : 'notes'}
                            </span>
                          </div>
                          <div className={styles.tagActions}>
                            <button
                              className={styles.actionButton}
                              onClick={() => handleStartEdit(tag)}
                              type="button"
                              title="Rename"
                            >
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
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              className={styles.actionButton}
                              onClick={() => handleDelete(tag)}
                              type="button"
                              title="Delete"
                            >
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
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
