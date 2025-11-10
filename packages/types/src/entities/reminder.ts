/**
 * Reminder entity types
 */

export interface Reminder {
  id: string;
  noteId: string;
  userId: string;
  fireAt: Date;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReminderInput {
  noteId: string;
  fireAt: Date;
}

export interface UpdateReminderInput {
  fireAt?: Date;
  completed?: boolean;
}
