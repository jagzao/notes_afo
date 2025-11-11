# @keep-plus-plus/storage

Storage layer with IndexedDB for Keep++.

## Installation

```bash
pnpm add @keep-plus-plus/storage @keep-plus-plus/types
```

## Usage

### Initialize Database

```typescript
import { initDatabase } from '@keep-plus-plus/storage';

// Initialize on app start
await initDatabase();
```

### Notes Repository

```typescript
import { notesRepository } from '@keep-plus-plus/storage';

// Create a note
const note = await notesRepository.create('user-123', {
  title: 'My Note',
  description: 'Note content',
  color: 'coral',
});

// Get all notes
const notes = await notesRepository.findAll('user-123');

// Get filtered notes
const pinnedNotes = await notesRepository.findAll('user-123', {
  state: 'active',
  pinned: true,
});

// Update a note
const updated = await notesRepository.update(note.id, {
  title: 'Updated Title',
});

// Pin/unpin
await notesRepository.togglePin(note.id);

// Archive/unarchive
await notesRepository.toggleArchive(note.id);

// Move to trash
await notesRepository.moveToTrash(note.id);

// Restore from trash
await notesRepository.restoreFromTrash(note.id);

// Search notes
const results = await notesRepository.search('user-123', 'query');

// Delete permanently
await notesRepository.delete(note.id);
```

### Tags Repository

```typescript
import { tagsRepository } from '@keep-plus-plus/storage';

// Create a tag
const tag = await tagsRepository.create('user-123', {
  name: 'Work',
  color: '#FF5722',
});

// Get all tags
const tags = await tagsRepository.findAll('user-123');

// Assign tag to note
await tagsRepository.assignToNote(noteId, tag.id);

// Remove tag from note
await tagsRepository.removeFromNote(noteId, tag.id);

// Get tags for a note
const noteTags = await tagsRepository.getTagsForNote(noteId);

// Get notes for a tag
const noteIds = await tagsRepository.getNotesForTag(tag.id);

// Search tags
const results = await tagsRepository.search('user-123', 'work');

// Delete tag
await tagsRepository.delete(tag.id);
```

## Features

- **IndexedDB**: Fast, local browser storage
- **Typed Repositories**: Full TypeScript support
- **CRUD Operations**: Complete Create, Read, Update, Delete
- **Advanced Queries**: Filtering, sorting, searching
- **Relationships**: Note-Tag associations
- **State Management**: Pin, archive, trash with auto-cleanup
- **Performance**: Indexed queries for fast retrieval

## Database Schema

### Stores

- `notes`: All notes with metadata
- `tags`: User-created tags
- `noteTags`: Many-to-many note-tag relationships
- `properties`: Property definitions (Etapa 3)
- `propertyValues`: Property values (Etapa 3)
- `reminders`: Note reminders (Etapa 6)

### Indexes

Each store has optimized indexes for fast queries:
- Notes: by-user, by-updated, by-created, by-pinned, by-archived, by-trashed
- Tags: by-user, by-name
- NoteTags: by-note, by-tag

## Development

```bash
# Build
pnpm build

# Watch mode
pnpm dev

# Type check
pnpm typecheck

# Lint
pnpm lint

# Test
pnpm test
```

## Testing

Uses `fake-indexeddb` for testing in Node.js environment.

```typescript
import { initDatabase, deleteDatabase } from '@keep-plus-plus/storage';

beforeEach(async () => {
  await initDatabase();
});

afterEach(async () => {
  await deleteDatabase();
});
```

## API Reference

### NotesRepository

- `create(userId, input)`: Create a new note
- `findById(id)`: Get note by ID
- `findAll(userId, filter?, sort?)`: Get all notes with optional filtering
- `update(id, input)`: Update a note
- `delete(id)`: Delete a note permanently
- `togglePin(id)`: Pin/unpin a note
- `toggleArchive(id)`: Archive/unarchive a note
- `moveToTrash(id)`: Move note to trash
- `restoreFromTrash(id)`: Restore note from trash
- `search(userId, query)`: Full-text search
- `getExpiredTrashNotes()`: Get notes older than 30 days in trash
- `emptyTrash(userId)`: Delete all trashed notes
- `getCountByState(userId)`: Get count by active/archived/trashed

### TagsRepository

- `create(userId, input)`: Create a new tag
- `findById(id)`: Get tag by ID
- `findByName(userId, name)`: Get tag by name
- `findAll(userId)`: Get all tags
- `update(id, input)`: Update a tag
- `delete(id)`: Delete a tag and all associations
- `assignToNote(noteId, tagId)`: Assign tag to note
- `removeFromNote(noteId, tagId)`: Remove tag from note
- `getTagsForNote(noteId)`: Get all tags for a note
- `getNotesForTag(tagId)`: Get all notes for a tag
- `search(userId, query)`: Search tags
- `getTagUsageCount(userId)`: Get usage count for all tags

## License

MIT
