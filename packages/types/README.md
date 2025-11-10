# @keep-plus-plus/types

Shared TypeScript types and interfaces for Keep++.

## Installation

```bash
pnpm add @keep-plus-plus/types
```

## Usage

```typescript
import { Note, User, CreateNoteInput, NoteCreatedEvent } from '@keep-plus-plus/types';

// Use types for entities
const note: Note = {
  id: '123',
  userId: 'user-1',
  title: 'My Note',
  description: 'Description',
  color: 'default',
  pinned: false,
  archived: false,
  trashed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  version: 1,
  deviceId: 'device-1',
};

// Use input types for creation
const input: CreateNoteInput = {
  title: 'New Note',
  description: 'Content',
};

// Use event types
const event: NoteCreatedEvent = {
  type: 'note.created',
  payload: { noteId: '123', note },
  timestamp: Date.now(),
  deviceId: 'device-1',
};
```

## Exports

### Entities

- `User`, `UserSettings`, `CreateUserInput`, `UpdateUserInput`
- `Note`, `NoteColor`, `CreateNoteInput`, `UpdateNoteInput`, `NoteFilter`, `NoteSortOptions`
- `Tag`, `NoteTag`, `CreateTagInput`, `UpdateTagInput`
- `PropertyDefinition`, `PropertyValue`, `PropertyType`, `CreatePropertyInput`, `UpdatePropertyInput`
- `Reminder`, `CreateReminderInput`, `UpdateReminderInput`
- `SyncOperation`, `SyncMetadata`, `SyncConflict`, `ConflictResolution`

### Events

- `DomainEvent`, `AppEvent`, `EventHandler`
- Note events: `NoteCreatedEvent`, `NoteUpdatedEvent`, `NoteDeletedEvent`, etc.
- Property events: `PropertyAddedEvent`, `PropertyUpdatedEvent`, `PropertyRemovedEvent`
- Tag events: `TagCreatedEvent`, `TagAssignedEvent`, `TagUnassignedEvent`
- Sync events: `SyncStartedEvent`, `SyncCompletedEvent`, `SyncFailedEvent`, `ConflictDetectedEvent`
- Reminder events: `ReminderTriggeredEvent`

### DTOs

- `ApiResponse`, `ApiError`, `PaginatedResponse`, `PaginationParams`
- Auth: `LoginRequest`, `LoginResponse`, `RegisterRequest`, `RefreshTokenRequest`
- Sync: `SyncRequest`, `SyncResponse`
- Search: `SearchRequest`, `SearchResponse`

### Utility Types

- `Nullable<T>`, `Optional<T>`, `Maybe<T>`
- `AsyncResult<T, E>`
- `DeepPartial<T>`
- `RequireAtLeastOne<T>`
- `OperationResult<T>`
- `UUID`, `Timestamp`

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
```

## Design Principles

1. **Type Safety**: All types are strictly typed, no `any`
2. **Immutability**: Types encourage immutable patterns
3. **Discriminated Unions**: Events and operations use discriminated unions
4. **Utility Types**: Common patterns extracted to utility types
5. **Documentation**: All exports are documented with JSDoc comments

## License

MIT
