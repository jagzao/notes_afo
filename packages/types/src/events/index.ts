/**
 * Domain events for event-driven architecture
 */

export interface DomainEvent<T = unknown> {
  type: string;
  payload: T;
  timestamp: number;
  userId?: string;
  deviceId: string;
}

// Note Events
export interface NoteCreatedEvent extends DomainEvent<{ noteId: string; note: unknown }> {
  type: 'note.created';
}

export interface NoteUpdatedEvent extends DomainEvent<{ noteId: string; changes: unknown }> {
  type: 'note.updated';
}

export interface NoteDeletedEvent extends DomainEvent<{ noteId: string }> {
  type: 'note.deleted';
}

export interface NotePinnedEvent extends DomainEvent<{ noteId: string }> {
  type: 'note.pinned';
}

export interface NoteArchivedEvent extends DomainEvent<{ noteId: string }> {
  type: 'note.archived';
}

export interface NoteTrashedEvent extends DomainEvent<{ noteId: string }> {
  type: 'note.trashed';
}

// Property Events
export interface PropertyAddedEvent extends DomainEvent<{ noteId: string; propertyKey: string }> {
  type: 'property.added';
}

export interface PropertyUpdatedEvent
  extends DomainEvent<{ noteId: string; propertyKey: string }> {
  type: 'property.updated';
}

export interface PropertyRemovedEvent
  extends DomainEvent<{ noteId: string; propertyKey: string }> {
  type: 'property.removed';
}

// Tag Events
export interface TagCreatedEvent extends DomainEvent<{ tagId: string }> {
  type: 'tag.created';
}

export interface TagAssignedEvent extends DomainEvent<{ noteId: string; tagId: string }> {
  type: 'tag.assigned';
}

export interface TagUnassignedEvent extends DomainEvent<{ noteId: string; tagId: string }> {
  type: 'tag.unassigned';
}

// Sync Events
export interface SyncStartedEvent extends DomainEvent {
  type: 'sync.started';
}

export interface SyncCompletedEvent extends DomainEvent<{ operations: number }> {
  type: 'sync.completed';
}

export interface SyncFailedEvent extends DomainEvent<{ error: string }> {
  type: 'sync.failed';
}

export interface ConflictDetectedEvent extends DomainEvent<{ conflictId: string }> {
  type: 'sync.conflict.detected';
}

export interface ConflictResolvedEvent extends DomainEvent<{ conflictId: string }> {
  type: 'sync.conflict.resolved';
}

// Reminder Events
export interface ReminderTriggeredEvent extends DomainEvent<{ reminderId: string }> {
  type: 'reminder.triggered';
}

export type AppEvent =
  | NoteCreatedEvent
  | NoteUpdatedEvent
  | NoteDeletedEvent
  | NotePinnedEvent
  | NoteArchivedEvent
  | NoteTrashedEvent
  | PropertyAddedEvent
  | PropertyUpdatedEvent
  | PropertyRemovedEvent
  | TagCreatedEvent
  | TagAssignedEvent
  | TagUnassignedEvent
  | SyncStartedEvent
  | SyncCompletedEvent
  | SyncFailedEvent
  | ConflictDetectedEvent
  | ConflictResolvedEvent
  | ReminderTriggeredEvent;

export type EventHandler<T extends AppEvent = AppEvent> = (event: T) => void | Promise<void>;
