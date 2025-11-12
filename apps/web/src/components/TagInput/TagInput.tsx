/**
 * TagInput Component
 * Input for creating and assigning tags with autocomplete
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Tag } from '@keep-plus-plus/types';
import { TagBadge } from '../TagBadge';
import styles from './TagInput.module.css';

interface TagInputProps {
  selectedTags: Tag[];
  availableTags: Tag[];
  onTagAdd: (tag: Tag) => void;
  onTagRemove: (tagId: string) => void;
  onTagCreate: (name: string) => Promise<Tag>;
  placeholder?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
  selectedTags,
  availableTags,
  onTagAdd,
  onTagRemove,
  onTagCreate,
  placeholder = 'Add tags...',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on input
  const suggestions = availableTags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedTags.some((selected) => selected.id === tag.id)
  );

  const canCreate = inputValue.trim().length > 0 && !suggestions.some((s) => s.name.toLowerCase() === inputValue.toLowerCase());

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(value.length > 0);
    setHighlightedIndex(0);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      if (suggestions.length > 0 && highlightedIndex < suggestions.length) {
        // Select highlighted suggestion
        const selectedSuggestion = suggestions[highlightedIndex];
        if (selectedSuggestion) {
          await handleSelectTag(selectedSuggestion);
        }
      } else if (canCreate) {
        // Create new tag
        await handleCreateTag();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const maxIndex = suggestions.length + (canCreate ? 1 : 0) - 1;
      setHighlightedIndex((prev) => Math.min(prev + 1, maxIndex));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setInputValue('');
    } else if (e.key === 'Backspace' && inputValue === '' && selectedTags.length > 0) {
      // Remove last tag if input is empty
      const lastTag = selectedTags[selectedTags.length - 1];
      if (lastTag) {
        onTagRemove(lastTag.id);
      }
    }
  };

  const handleSelectTag = async (tag: Tag) => {
    onTagAdd(tag);
    setInputValue('');
    setShowSuggestions(false);
    setHighlightedIndex(0);
    inputRef.current?.focus();
  };

  const handleCreateTag = async () => {
    if (!canCreate) return;

    try {
      const newTag = await onTagCreate(inputValue.trim());
      onTagAdd(newTag);
      setInputValue('');
      setShowSuggestions(false);
      setHighlightedIndex(0);
      inputRef.current?.focus();
    } catch (error) {
      console.error('Failed to create tag:', error);
    }
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.tagsWrapper}>
        {selectedTags.map((tag) => (
          <TagBadge
            key={tag.id}
            tag={tag}
            removable
            onRemove={() => onTagRemove(tag.id)}
          />
        ))}
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (inputValue.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={selectedTags.length === 0 ? placeholder : ''}
        />
      </div>

      <AnimatePresence>
        {showSuggestions && (suggestions.length > 0 || canCreate) && (
          <motion.div
            className={styles.suggestions}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {suggestions.map((tag, index) => (
              <div
                key={tag.id}
                className={`${styles.suggestion} ${
                  highlightedIndex === index ? styles.suggestionHighlighted : ''
                }`}
                onClick={() => handleSelectTag(tag)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {tag.name}
              </div>
            ))}
            {canCreate && (
              <div
                className={`${styles.suggestion} ${styles.suggestionCreate} ${
                  highlightedIndex === suggestions.length ? styles.suggestionHighlighted : ''
                }`}
                onClick={handleCreateTag}
                onMouseEnter={() => setHighlightedIndex(suggestions.length)}
              >
                Create "{inputValue}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
