/**
 * IndexedDB Schema for Keep++
 */

import type { DBSchema } from 'idb';
import type { Note, Tag, NoteTag, PropertyDefinition, PropertyValue, Reminder, Attachment } from '@keep-plus-plus/types';

export const DB_NAME = 'keep-plus-plus';
export const DB_VERSION = 1;

/**
 * Database schema definition
 */
export interface KeepPlusPlusDB extends DBSchema {
  notes: {
    key: string;
    value: Note;
    indexes: {
      'by-user': string;
      'by-updated': Date;
      'by-created': Date;
      'by-pinned': number;
      'by-archived': number;
      'by-trashed': number;
    };
  };
  tags: {
    key: string;
    value: Tag;
    indexes: {
      'by-user': string;
      'by-name': string;
    };
  };
  noteTags: {
    key: string;
    value: NoteTag;
    indexes: {
      'by-note': string;
      'by-tag': string;
    };
  };
  properties: {
    key: string;
    value: PropertyDefinition;
    indexes: {
      'by-note': string;
      'by-type': string;
    };
  };
  propertyValues: {
    key: string;
    value: PropertyValue;
    indexes: {
      'by-note': string;
      'by-key': string;
    };
  };
  reminders: {
    key: string;
    value: Reminder;
    indexes: {
      'by-note': string;
      'by-user': string;
      'by-fireAt': Date;
      'by-completed': number;
    };
  };
  attachments: {
    key: string;
    value: Attachment;
    indexes: {
      'by-note': string;
      'by-type': string;
    };
  };
}
