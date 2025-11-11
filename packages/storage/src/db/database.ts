/**
 * IndexedDB Database setup and migrations
 */

import { openDB, type IDBPDatabase } from 'idb';
import type { KeepPlusPlusDB } from './schema';
import { DB_NAME, DB_VERSION } from './schema';

let dbInstance: IDBPDatabase<KeepPlusPlusDB> | null = null;

/**
 * Initialize and open the database
 */
export async function initDatabase(): Promise<IDBPDatabase<KeepPlusPlusDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<KeepPlusPlusDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      console.log(`Upgrading database from v${oldVersion} to v${newVersion}`);

      // Version 1: Initial schema
      if (oldVersion < 1) {
        // Notes store
        const notesStore = db.createObjectStore('notes', { keyPath: 'id' });
        notesStore.createIndex('by-user', 'userId');
        notesStore.createIndex('by-updated', 'updatedAt');
        notesStore.createIndex('by-created', 'createdAt');
        notesStore.createIndex('by-pinned', 'pinned');
        notesStore.createIndex('by-archived', 'archived');
        notesStore.createIndex('by-trashed', 'trashed');

        // Tags store
        const tagsStore = db.createObjectStore('tags', { keyPath: 'id' });
        tagsStore.createIndex('by-user', 'userId');
        tagsStore.createIndex('by-name', 'name');

        // NoteTags junction store
        const noteTagsStore = db.createObjectStore('noteTags', {
          keyPath: ['noteId', 'tagId'],
        });
        noteTagsStore.createIndex('by-note', 'noteId');
        noteTagsStore.createIndex('by-tag', 'tagId');

        // Properties store
        const propertiesStore = db.createObjectStore('properties', { keyPath: 'id' });
        propertiesStore.createIndex('by-note', 'noteId');
        propertiesStore.createIndex('by-type', 'type');

        // PropertyValues store
        const propertyValuesStore = db.createObjectStore('propertyValues', { keyPath: 'id' });
        propertyValuesStore.createIndex('by-note', 'noteId');
        propertyValuesStore.createIndex('by-key', 'key');

        // Reminders store
        const remindersStore = db.createObjectStore('reminders', { keyPath: 'id' });
        remindersStore.createIndex('by-note', 'noteId');
        remindersStore.createIndex('by-user', 'userId');
        remindersStore.createIndex('by-fireAt', 'fireAt');
        remindersStore.createIndex('by-completed', 'completed');
      }
    },
    blocked() {
      console.warn('Database upgrade blocked. Close other tabs.');
    },
    blocking() {
      console.warn('Database blocking. Closing connection.');
      if (dbInstance) {
        dbInstance.close();
        dbInstance = null;
      }
    },
    terminated() {
      console.error('Database connection terminated unexpectedly.');
      dbInstance = null;
    },
  });

  return dbInstance;
}

/**
 * Get the database instance (throws if not initialized)
 */
export function getDatabase(): IDBPDatabase<KeepPlusPlusDB> {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return dbInstance;
}

/**
 * Close the database connection
 */
export function closeDatabase(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}

/**
 * Delete the database (for testing/reset)
 */
export async function deleteDatabase(): Promise<void> {
  closeDatabase();
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => {
      console.warn('Database deletion blocked');
    };
  });
}
