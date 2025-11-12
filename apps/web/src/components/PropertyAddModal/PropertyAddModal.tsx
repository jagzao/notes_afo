import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PropertyType, CreatePropertyInput } from '@keep-plus-plus/types';
import styles from './PropertyAddModal.module.css';

interface PropertyAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (input: CreatePropertyInput) => Promise<void>;
}

const PROPERTY_TYPES: Array<{ value: PropertyType; label: string; needsOptions: boolean }> = [
  { value: 'text', label: 'Text', needsOptions: false },
  { value: 'number', label: 'Number', needsOptions: false },
  { value: 'date', label: 'Date', needsOptions: false },
  { value: 'checkbox', label: 'Checkbox', needsOptions: false },
  { value: 'select', label: 'Select (single)', needsOptions: true },
  { value: 'multiselect', label: 'Multi-select', needsOptions: true },
  { value: 'url', label: 'URL', needsOptions: false },
];

export const PropertyAddModal: React.FC<PropertyAddModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [key, setKey] = useState('');
  const [label, setLabel] = useState('');
  const [type, setType] = useState<PropertyType>('text');
  const [required, setRequired] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setKey('');
      setLabel('');
      setType('text');
      setRequired(false);
      setOptions([]);
      setNewOption('');
      setSubmitting(false);
    }
  }, [isOpen]);

  const needsOptions = PROPERTY_TYPES.find((t) => t.value === type)?.needsOptions || false;

  const handleAddOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      setOptions([...options, newOption.trim()]);
      setNewOption('');
    }
  };

  const handleRemoveOption = (optionToRemove: string) => {
    setOptions(options.filter((o) => o !== optionToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddOption();
    }
  };

  const generateKey = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  };

  const handleLabelChange = (value: string) => {
    setLabel(value);
    if (!key || key === generateKey(label)) {
      setKey(generateKey(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!key || !label || !type) {
      return;
    }

    if (needsOptions && options.length === 0) {
      return;
    }

    setSubmitting(true);

    try {
      const input: CreatePropertyInput = {
        key,
        label,
        type,
        required,
        ...(needsOptions && { options }),
      };

      await onAdd(input);
      onClose();
    } catch (error) {
      console.error('Failed to create property:', error);
      setSubmitting(false);
    }
  };

  const isValid = key && label && type && (!needsOptions || options.length > 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.modal}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit}>
              <div className={styles.header}>
                <h2 className={styles.title}>Add Property</h2>
              </div>

              <div className={styles.content}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Label <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={styles.input}
                    value={label}
                    onChange={(e) => handleLabelChange(e.target.value)}
                    placeholder="e.g., Priority, Due Date, Status"
                    autoFocus
                  />
                  <span className={styles.helpText}>
                    The display name for this property
                  </span>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Key <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={styles.input}
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="e.g., priority, due_date, status"
                  />
                  <span className={styles.helpText}>
                    Unique identifier for this property (auto-generated from label)
                  </span>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Type <span className={styles.required}>*</span>
                  </label>
                  <select
                    className={styles.select}
                    value={type}
                    onChange={(e) => setType(e.target.value as PropertyType)}
                  >
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                {needsOptions && (
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Options <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.optionsBuilder}>
                      {options.length > 0 && (
                        <div className={styles.optionsList}>
                          {options.map((option) => (
                            <div key={option} className={styles.optionItem}>
                              <span className={styles.optionText}>{option}</span>
                              <button
                                type="button"
                                className={styles.removeButton}
                                onClick={() => handleRemoveOption(option)}
                                aria-label="Remove option"
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
                          ))}
                        </div>
                      )}
                      <div className={styles.addOptionRow}>
                        <input
                          type="text"
                          className={`${styles.input} ${styles.addOptionInput}`}
                          value={newOption}
                          onChange={(e) => setNewOption(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Add an option..."
                        />
                        <button
                          type="button"
                          className={styles.addOptionButton}
                          onClick={handleAddOption}
                          disabled={!newOption.trim()}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    <span className={styles.helpText}>
                      Add options for users to select from
                    </span>
                  </div>
                )}

                <div className={styles.formGroup}>
                  <div className={styles.checkboxContainer}>
                    <input
                      type="checkbox"
                      id="required"
                      className={styles.checkbox}
                      checked={required}
                      onChange={(e) => setRequired(e.target.checked)}
                    />
                    <label htmlFor="required" className={styles.label}>
                      Required field
                    </label>
                  </div>
                </div>
              </div>

              <div className={styles.footer}>
                <button
                  type="button"
                  className={`${styles.button} ${styles.cancelButton}`}
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${styles.button} ${styles.createButton}`}
                  disabled={!isValid || submitting}
                >
                  {submitting ? 'Creating...' : 'Create Property'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
