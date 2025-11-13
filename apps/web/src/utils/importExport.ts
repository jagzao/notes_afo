import type { Note, Tag, PropertyDefinition, PropertyValue, Reminder } from '@keep-plus-plus/types';

export interface ExportData {
  version: string;
  exportedAt: string;
  notes: Note[];
  tags: Tag[];
  properties: PropertyDefinition[];
  propertyValues: PropertyValue[];
  reminders: Reminder[];
  noteTags: Array<{ noteId: string; tagId: string }>;
}

/**
 * Export all data to JSON format
 */
export async function exportToJSON(): Promise<string> {
  const { notesRepository, tagsRepository, propertiesRepository, remindersRepository } = await import('@keep-plus-plus/storage');
  const userId = 'demo-user'; // In production, get from auth

  try {
    // Load all data
    const notes = await notesRepository.findAll(userId);
    const tags = await tagsRepository.findAll(userId);

    // Load properties and values
    const allProperties: PropertyDefinition[] = [];
    const allPropertyValues: PropertyValue[] = [];
    for (const note of notes) {
      const noteProps = await propertiesRepository.findDefinitionsByNote(note.id);
      allProperties.push(...noteProps);

      for (const prop of noteProps) {
        const value = await propertiesRepository.findValueByKey(note.id, prop.key);
        if (value) {
          allPropertyValues.push(value);
        }
      }
    }

    // Load reminders
    const allReminders: Reminder[] = [];
    for (const note of notes) {
      const noteReminders = await remindersRepository.findByNote(note.id);
      allReminders.push(...noteReminders);
    }

    // Load note-tag associations
    const noteTags: Array<{ noteId: string; tagId: string }> = [];
    for (const note of notes) {
      const noteTagsList = await tagsRepository.getTagsForNote(note.id);
      for (const tag of noteTagsList) {
        noteTags.push({ noteId: note.id, tagId: tag.id });
      }
    }

    const exportData: ExportData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      notes,
      tags,
      properties: allProperties,
      propertyValues: allPropertyValues,
      reminders: allReminders,
      noteTags,
    };

    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Failed to export data:', error);
    throw new Error('Failed to export data');
  }
}

/**
 * Export a single note to Markdown format
 */
export async function exportNoteToMarkdown(noteId: string): Promise<string> {
  const { notesRepository, tagsRepository, propertiesRepository, remindersRepository } = await import('@keep-plus-plus/storage');

  try {
    const note = await notesRepository.findById(noteId);
    if (!note) {
      throw new Error('Note not found');
    }

    let markdown = '';

    // Title
    if (note.title) {
      markdown += `# ${note.title}\n\n`;
    }

    // Metadata
    markdown += `---\n`;
    markdown += `Created: ${new Date(note.createdAt).toLocaleString()}\n`;
    markdown += `Updated: ${new Date(note.updatedAt).toLocaleString()}\n`;
    markdown += `Color: ${note.color}\n`;
    if (note.pinned) markdown += `Pinned: Yes\n`;
    if (note.archived) markdown += `Archived: Yes\n`;
    markdown += `---\n\n`;

    // Tags
    const tags = await tagsRepository.getTagsForNote(noteId);
    if (tags.length > 0) {
      markdown += `**Tags:** ${tags.map((t) => `#${t.name}`).join(' ')}\n\n`;
    }

    // Reminders
    const reminders = await remindersRepository.findByNote(noteId);
    if (reminders.length > 0) {
      markdown += `**Reminders:**\n`;
      for (const reminder of reminders) {
        const status = reminder.completed ? '✓' : '○';
        markdown += `- ${status} ${new Date(reminder.fireAt).toLocaleString()}\n`;
      }
      markdown += `\n`;
    }

    // Properties
    const properties = await propertiesRepository.findAllPropertiesWithValues(noteId);
    if (properties.length > 0) {
      markdown += `**Properties:**\n`;
      for (const { definition, value } of properties) {
        if (value) {
          let displayValue = '';
          switch (definition.type) {
            case 'text':
              displayValue = value.valueText || '';
              break;
            case 'number':
              displayValue = value.valueNumber?.toString() || '';
              break;
            case 'date':
              displayValue = value.valueDate ? new Date(value.valueDate).toLocaleDateString() : '';
              break;
            case 'checkbox':
              displayValue = value.valueBool ? 'Yes' : 'No';
              break;
            case 'select':
            case 'multiselect':
              displayValue = value.valueSelect?.join(', ') || '';
              break;
            case 'url':
              displayValue = value.valueUrl || '';
              break;
          }
          markdown += `- **${definition.label}:** ${displayValue}\n`;
        }
      }
      markdown += `\n`;
    }

    // Description
    if (note.description) {
      markdown += `${note.description}\n`;
    }

    return markdown;
  } catch (error) {
    console.error('Failed to export note to Markdown:', error);
    throw new Error('Failed to export note to Markdown');
  }
}

/**
 * Download data as a file
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Import data from JSON format
 */
export async function importFromJSON(jsonData: string): Promise<{
  success: boolean;
  imported: {
    notes: number;
    tags: number;
    properties: number;
    reminders: number;
  };
  errors: string[];
}> {
  const { notesRepository, tagsRepository, propertiesRepository, remindersRepository } = await import('@keep-plus-plus/storage');
  const userId = 'demo-user';

  const result = {
    success: true,
    imported: { notes: 0, tags: 0, properties: 0, reminders: 0 },
    errors: [] as string[],
  };

  try {
    const data: ExportData = JSON.parse(jsonData);

    // Validate version
    if (!data.version || data.version !== '1.0.0') {
      throw new Error('Unsupported export format version');
    }

    // Import tags first (needed for note associations)
    const tagIdMap = new Map<string, string>();
    for (const tag of data.tags) {
      try {
        // Check if tag already exists
        const existing = await tagsRepository.findByName(userId, tag.name);
        if (existing) {
          tagIdMap.set(tag.id, existing.id);
        } else {
          const newTag = await tagsRepository.create(userId, { name: tag.name });
          tagIdMap.set(tag.id, newTag.id);
          result.imported.tags++;
        }
      } catch (error) {
        result.errors.push(`Failed to import tag "${tag.name}": ${error}`);
      }
    }

    // Import notes
    const noteIdMap = new Map<string, string>();
    for (const note of data.notes) {
      try {
        const newNote = await notesRepository.create(userId, {
          title: note.title,
          description: note.description,
          color: note.color,
        });

        // Preserve original metadata
        await notesRepository.update(newNote.id, {
          pinned: note.pinned,
          archived: note.archived,
          trashed: note.trashed,
        });

        noteIdMap.set(note.id, newNote.id);
        result.imported.notes++;
      } catch (error) {
        result.errors.push(`Failed to import note "${note.title}": ${error}`);
      }
    }

    // Import note-tag associations
    for (const { noteId, tagId } of data.noteTags) {
      const newNoteId = noteIdMap.get(noteId);
      const newTagId = tagIdMap.get(tagId);

      if (newNoteId && newTagId) {
        try {
          await tagsRepository.assignToNote(newNoteId, newTagId);
        } catch (error) {
          // Ignore duplicate assignments
        }
      }
    }

    // Import properties
    const propertyIdMap = new Map<string, string>();
    for (const property of data.properties) {
      const newNoteId = noteIdMap.get(property.noteId);
      if (newNoteId) {
        try {
          const newProperty = await propertiesRepository.createDefinition(newNoteId, {
            key: property.key,
            type: property.type,
            label: property.label,
            options: property.options,
            required: property.required,
          });
          propertyIdMap.set(property.id, newProperty.id);
          result.imported.properties++;
        } catch (error) {
          result.errors.push(`Failed to import property "${property.label}": ${error}`);
        }
      }
    }

    // Import property values
    for (const value of data.propertyValues) {
      const newNoteId = noteIdMap.get(value.noteId);
      if (newNoteId) {
        try {
          // Find the property definition to get the type
          const propertyDef = data.properties.find(
            (p) => p.noteId === value.noteId && p.key === value.key
          );

          if (!propertyDef) continue;

          let input: any = { type: propertyDef.type };

          switch (propertyDef.type) {
            case 'text':
              input.value = value.valueText;
              break;
            case 'number':
              input.value = value.valueNumber;
              break;
            case 'date':
              input.value = value.valueDate;
              break;
            case 'checkbox':
              input.value = value.valueBool;
              break;
            case 'select':
            case 'multiselect':
              input.value = value.valueSelect;
              break;
            case 'url':
              input.value = value.valueUrl;
              break;
          }

          await propertiesRepository.setValue(newNoteId, value.key, input);
        } catch (error) {
          // Ignore missing properties
        }
      }
    }

    // Import reminders
    for (const reminder of data.reminders) {
      const newNoteId = noteIdMap.get(reminder.noteId);
      if (newNoteId) {
        try {
          await remindersRepository.create(userId, {
            noteId: newNoteId,
            fireAt: new Date(reminder.fireAt),
          });
          result.imported.reminders++;
        } catch (error) {
          result.errors.push(`Failed to import reminder: ${error}`);
        }
      }
    }

  } catch (error) {
    result.success = false;
    result.errors.push(`Import failed: ${error}`);
  }

  return result;
}
