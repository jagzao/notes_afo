import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PropertyDefinition, PropertyType } from '@keep-plus-plus/types';
import { useToast } from '../../hooks/useToast';
import styles from './PropertyEditModal.module.css';

interface PropertyEditModalProps {
  isOpen: boolean;
  property: PropertyDefinition | null;
  onClose: () => void;
  onSave: (id: string, updates: {
    key?: string;
    label?: string;
    type?: PropertyType;
    options?: string[];
    required?: boolean;
  }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const PROPERTY_TYPES: Array<{ value: PropertyType; label: string; requiresOptions: boolean }> = [
  { value: 'text', label: 'Text', requiresOptions: false },
  { value: 'number', label: 'Number', requiresOptions: false },
  { value: 'date', label: 'Date', requiresOptions: false },
  { value: 'checkbox', label: 'Checkbox', requiresOptions: false },
  { value: 'select', label: 'Select', requiresOptions: true },
  { value: 'multiselect', label: 'Multi-select', requiresOptions: true },
  { value: 'url', label: 'URL', requiresOptions: false },
];

export const PropertyEditModal: React.FC<PropertyEditModalProps> = ({
  isOpen,
  property,
  onClose,
  onSave,
  onDelete,
}) => {
  const toast = useToast();
  const [key, setKey] = useState('');
  const [label, setLabel] = useState('');
  const [type, setType] = useState<PropertyType>('text');
  const [options, setOptions] = useState<string[]>([]);
  const [required, setRequired] = useState(false);
  const [newOption, setNewOption] = useState('');
  const [saving, setSaving] = useState(false);

  // Load property data when opened
  useEffect(() => {
    if (property) {
      setKey(property.key);
      setLabel(property.label);
      setType(property.type);
      setOptions(property.options || []);
      setRequired(property.required);
    }
  }, [property]);

  const selectedType = PROPERTY_TYPES.find((t) => t.value === type);

  const handleAddOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      setOptions([...options, newOption.trim()]);
      setNewOption('');
    }
  };

  const handleRemoveOption = (option: string) => {
    setOptions(options.filter((o) => o !== option));
  };

  const handleTypeChange = (newType: PropertyType) => {
    const oldTypeRequiresOptions = PROPERTY_TYPES.find((t) => t.value === type)?.requiresOptions;
    const newTypeRequiresOptions = PROPERTY_TYPES.find((t) => t.value === newType)?.requiresOptions;

    if (type !== newType && !oldTypeRequiresOptions && newTypeRequiresOptions) {
      // Changing to a type that requires options
      setOptions([]);
    }

    if (
      property &&
      type !== newType &&
      !window.confirm(
        'Changing the property type will clear all existing values. Continue?'
      )
    ) {
      return;
    }

    setType(newType);
  };

  const handleSave = async () => {
    if (!property) return;

    // Validation
    if (!key.trim()) {
      toast.error('Property key cannot be empty');
      return;
    }

    if (!label.trim()) {
      toast.error('Property label cannot be empty');
      return;
    }

    if (selectedType?.requiresOptions && options.length === 0) {
      toast.error('Select and Multi-select properties require at least one option');
      return;
    }

    try {
      setSaving(true);
      await onSave(property.id, {
        key: key.trim(),
        label: label.trim(),
        type,
        options: selectedType?.requiresOptions ? options : undefined,
        required,
      });
      toast.success('Property updated successfully');
      onClose();
    } catch (error) {
      console.error('Failed to update property:', error);
      toast.error('Failed to update property');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!property) return;

    if (
      window.confirm(
        `Delete property "${property.label}"? This will remove it and all its values from the note.`
      )
    ) {
      try {
        await onDelete(property.id);
        toast.success('Property deleted successfully');
        onClose();
      } catch (error) {
        console.error('Failed to delete property:', error);
        toast.error('Failed to delete property');
      }
    }
  };

  if (!isOpen || !property) return null;

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
              <h2 className={styles.title}>Edit Property</h2>
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

            <div className={styles.content}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="property-key">
                  Key (identifier)
                </label>
                <input
                  id="property-key"
                  type="text"
                  className={styles.input}
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="e.g., priority, status"
                />
                <span className={styles.hint}>Used internally to identify this property</span>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="property-label">
                  Label (display name)
                </label>
                <input
                  id="property-label"
                  type="text"
                  className={styles.input}
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g., Priority, Status"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="property-type">
                  Type
                </label>
                <select
                  id="property-type"
                  className={styles.select}
                  value={type}
                  onChange={(e) => handleTypeChange(e.target.value as PropertyType)}
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                {type !== property.type && (
                  <span className={styles.warning}>
                    ⚠️ Changing type will clear all existing values
                  </span>
                )}
              </div>

              {selectedType?.requiresOptions && (
                <div className={styles.formGroup}>
                  <label className={styles.label}>Options</label>
                  <div className={styles.optionsContainer}>
                    {options.map((option) => (
                      <div key={option} className={styles.optionChip}>
                        <span>{option}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(option)}
                          className={styles.optionRemove}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className={styles.addOption}>
                    <input
                      type="text"
                      className={styles.input}
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddOption();
                        }
                      }}
                      placeholder="Add option..."
                    />
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className={styles.addButton}
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={required}
                    onChange={(e) => setRequired(e.target.checked)}
                    className={styles.checkbox}
                  />
                  <span>Required field</span>
                </label>
              </div>
            </div>

            <div className={styles.footer}>
              <button
                type="button"
                onClick={handleDelete}
                className={styles.deleteButton}
              >
                Delete Property
              </button>
              <div className={styles.footerActions}>
                <button type="button" onClick={onClose} className={styles.cancelButton}>
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className={styles.saveButton}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
