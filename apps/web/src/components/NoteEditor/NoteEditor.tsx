/**
 * NoteEditor Modal Component
 * Full-featured editor for creating and editing notes
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Note, NoteColor, Tag, PropertyDefinition, PropertyValue, CreatePropertyInput, Reminder } from '@keep-plus-plus/types';
import { Button } from '@keep-plus-plus/ui';
import { ColorPicker } from '../ColorPicker';
import { TagInput } from '../TagInput';
import { PropertyField } from '../PropertyField/PropertyField';
import { PropertyAddModal } from '../PropertyAddModal/PropertyAddModal';
import { PropertyEditModal } from '../PropertyEditModal';
import { ReminderPicker } from '../ReminderPicker/ReminderPicker';
import { AttachmentsPanel } from '../AttachmentsPanel';
import { useTags } from '../../context/TagsContext';
import { useProperties } from '../../context/PropertiesContext';
import { useReminders } from '../../context/RemindersContext';
import styles from './NoteEditor.module.css';

interface NoteEditorProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (noteId: string, updates: { title?: string; description?: string; color?: NoteColor }) => Promise<void>;
  onPin?: (noteId: string) => Promise<void>;
  onArchive?: (noteId: string) => Promise<void>;
  onDelete?: (noteId: string) => Promise<void>;
  onColorChange?: (noteId: string, color: NoteColor) => Promise<void>;
}

type SaveStatus = 'idle' | 'saving' | 'saved';

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  isOpen,
  onClose,
  onSave,
  onPin,
  onArchive,
  onDelete,
  onColorChange,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [noteTags, setNoteTags] = useState<Tag[]>([]);
  const [properties, setProperties] = useState<Array<{ definition: PropertyDefinition; value: PropertyValue | null }>>([]);
  const [reminder, setReminder] = useState<Reminder | null>(null);
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<PropertyDefinition | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Tags context
  const { tags, createTag, assignTagToNote, removeTagFromNote, getTagsForNote } = useTags();

  // Properties context
  const { getPropertiesWithValues, createProperty, updateProperty, deleteProperty } = useProperties();

  // Reminders context
  const { createReminder, updateReminder, deleteReminder, getRemindersForNote } = useReminders();

  // Initialize form with note data
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setDescription(note.description);

      // Load tags for this note
      const loadNoteTags = async () => {
        try {
          const tags = await getTagsForNote(note.id);
          setNoteTags(tags);
        } catch (error) {
          console.error('Failed to load note tags:', error);
        }
      };
      void loadNoteTags();

      // Load properties for this note
      const loadProperties = async () => {
        try {
          const props = await getPropertiesWithValues(note.id);
          setProperties(props);
        } catch (error) {
          console.error('Failed to load properties:', error);
        }
      };
      void loadProperties();

      // Load reminder for this note
      const loadReminder = async () => {
        try {
          const reminders = await getRemindersForNote(note.id);
          // Get the first pending reminder
          const pendingReminder = reminders.find((r) => !r.completed);
          setReminder(pendingReminder || null);
        } catch (error) {
          console.error('Failed to load reminder:', error);
        }
      };
      void loadReminder();
    } else {
      setTitle('');
      setDescription('');
      setNoteTags([]);
      setProperties([]);
      setReminder(null);
    }
  }, [note, getTagsForNote, getPropertiesWithValues, getRemindersForNote]);

  // Focus title input when modal opens
  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isOpen]);

  // Auto-save with debounce
  const debouncedSave = useCallback(() => {
    if (!note) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setSaveStatus('saving');

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await onSave(note.id, { title, description });
        setSaveStatus('saved');

        // Reset to idle after 2 seconds
        setTimeout(() => {
          setSaveStatus('idle');
        }, 2000);
      } catch (error) {
        console.error('Failed to save note:', error);
        setSaveStatus('idle');
      }
    }, 500);
  }, [note, title, description, onSave]);

  // Trigger auto-save when title or description changes
  useEffect(() => {
    if (note && (title !== note.title || description !== note.description)) {
      debouncedSave();
    }
  }, [title, description, note, debouncedSave]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Esc to close
      if (e.key === 'Escape') {
        onClose();
      }

      // Ctrl/Cmd + Enter to save and close
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
    return undefined;
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePin = async () => {
    if (note && onPin) {
      await onPin(note.id);
    }
  };

  const handleArchive = async () => {
    if (note && onArchive) {
      await onArchive(note.id);
      onClose();
    }
  };

  const handleDelete = async () => {
    if (note && onDelete) {
      if (window.confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
        await onDelete(note.id);
        onClose();
      }
    }
  };

  const handleColorChange = async (color: NoteColor) => {
    if (note && onColorChange) {
      await onColorChange(note.id, color);
    }
  };

  const handleTagAdd = async (tag: Tag) => {
    if (!note) return;

    try {
      await assignTagToNote(note.id, tag.id);
      setNoteTags((prev) => [...prev, tag]);
    } catch (error) {
      console.error('Failed to assign tag:', error);
    }
  };

  const handleTagRemove = async (tagId: string) => {
    if (!note) return;

    try {
      await removeTagFromNote(note.id, tagId);
      setNoteTags((prev) => prev.filter((t) => t.id !== tagId));
    } catch (error) {
      console.error('Failed to remove tag:', error);
    }
  };

  const handleTagCreate = async (name: string): Promise<Tag> => {
    return await createTag(name);
  };

  const handlePropertyAdd = async (input: CreatePropertyInput) => {
    if (!note) return;

    try {
      const property = await createProperty(note.id, input);
      setProperties((prev) => [...prev, { definition: property, value: null }]);
    } catch (error) {
      console.error('Failed to add property:', error);
      throw error;
    }
  };

  const handlePropertyEdit = (property: PropertyDefinition) => {
    setEditingProperty(property);
  };

  const handlePropertyUpdate = async (
    id: string,
    updates: {
      key?: string;
      label?: string;
      type?: string;
      options?: string[];
      required?: boolean;
    }
  ) => {
    if (!note) return;

    try {
      const updatedProperty = await updateProperty(id, updates);
      setProperties((prev) =>
        prev.map((p) =>
          p.definition.id === id ? { ...p, definition: updatedProperty } : p
        )
      );
      setEditingProperty(null);
    } catch (error) {
      console.error('Failed to update property:', error);
      throw error;
    }
  };

  const handlePropertyDelete = async (propertyId: string) => {
    if (!note) return;

    try {
      await deleteProperty(propertyId);
      setProperties((prev) => prev.filter((p) => p.definition.id !== propertyId));
    } catch (error) {
      console.error('Failed to delete property:', error);
    }
  };

  const handleReminderSet = async (date: Date) => {
    if (!note) return;

    try {
      if (reminder) {
        // Update existing reminder
        const updated = await updateReminder(reminder.id, { fireAt: date });
        setReminder(updated);
      } else {
        // Create new reminder
        const newReminder = await createReminder({ noteId: note.id, fireAt: date });
        setReminder(newReminder);
      }
    } catch (error) {
      console.error('Failed to set reminder:', error);
      throw error;
    }
  };

  const handleReminderClear = async () => {
    if (!note || !reminder) return;

    try {
      await deleteReminder(reminder.id);
      setReminder(null);
    } catch (error) {
      console.error('Failed to clear reminder:', error);
      throw error;
    }
  };

  if (!note) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.header}>
              <div className={styles.title}>Editar Nota</div>
              <button
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Cerrar"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className={styles.content}>
              <div className={styles.inputGroup}>
                <input
                  ref={titleInputRef}
                  type="text"
                  className={`${styles.input} ${styles.titleInput}`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Título"
                />
              </div>

              <div className={styles.inputGroup}>
                <textarea
                  className={styles.textarea}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Escribe tu nota..."
                />
              </div>

              <div className={styles.inputGroup}>
                <TagInput
                  selectedTags={noteTags}
                  availableTags={tags}
                  onTagAdd={handleTagAdd}
                  onTagRemove={handleTagRemove}
                  onTagCreate={handleTagCreate}
                  placeholder="Add tags..."
                />
              </div>

              {/* Properties Section */}
              <div className={styles.propertiesSection}>
                <div className={styles.propertiesHeader}>
                  <h3 className={styles.propertiesTitle}>Properties</h3>
                  <button
                    className={styles.addPropertyButton}
                    onClick={() => setIsAddPropertyModalOpen(true)}
                    type="button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      width="16"
                      height="16"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add Property
                  </button>
                </div>

                {properties.length > 0 ? (
                  <div className={styles.propertiesList}>
                    {properties.map(({ definition, value }) => (
                      <PropertyField
                        key={definition.id}
                        noteId={note.id}
                        definition={definition}
                        value={value}
                        onEdit={handlePropertyEdit}
                        onDelete={handlePropertyDelete}
                      />
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyProperties}>
                    No properties yet. Click "Add Property" to create one.
                  </div>
                )}
              </div>

              {/* Attachments Section */}
              <AttachmentsPanel noteId={note.id} />
            </div>

            <div className={styles.footer}>
              <div className={styles.toolbar}>
                <button
                  className={`${styles.iconButton} ${note.pinned ? styles.active : ''}`}
                  onClick={handlePin}
                  aria-label={note.pinned ? 'Desfijar' : 'Fijar'}
                  title={note.pinned ? 'Desfijar' : 'Fijar'}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={note.pinned ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 17v5" />
                    <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
                  </svg>
                </button>

                <button
                  className={`${styles.iconButton} ${note.archived ? styles.active : ''}`}
                  onClick={handleArchive}
                  aria-label={note.archived ? 'Desarchivar' : 'Archivar'}
                  title={note.archived ? 'Desarchivar' : 'Archivar'}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="21 8 21 21 3 21 3 8" />
                    <rect x="1" y="3" width="22" height="5" />
                    <line x1="10" y1="12" x2="14" y2="12" />
                  </svg>
                </button>

                <ColorPicker
                  selectedColor={note.color}
                  onColorChange={handleColorChange}
                />

                <ReminderPicker
                  noteId={note.id}
                  currentReminder={reminder}
                  onSet={handleReminderSet}
                  onClear={handleReminderClear}
                />

                <button
                  className={styles.iconButton}
                  onClick={handleDelete}
                  aria-label="Eliminar"
                  title="Eliminar"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              </div>

              <div className={styles.actions}>
                {saveStatus !== 'idle' && (
                  <span className={`${styles.saveStatus} ${styles[saveStatus]}`}>
                    {saveStatus === 'saving' ? 'Guardando...' : 'Guardado'}
                  </span>
                )}
                <Button onClick={onClose} variant="primary" size="sm">
                  Cerrar
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Property Add Modal */}
          <PropertyAddModal
            isOpen={isAddPropertyModalOpen}
            onClose={() => setIsAddPropertyModalOpen(false)}
            onAdd={handlePropertyAdd}
          />

          {/* Property Edit Modal */}
          <PropertyEditModal
            isOpen={!!editingProperty}
            property={editingProperty}
            onClose={() => setEditingProperty(null)}
            onSave={handlePropertyUpdate}
            onDelete={handlePropertyDelete}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
