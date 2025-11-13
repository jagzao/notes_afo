/**
 * Reminders Repository - CRUD operations for reminders
 */

import type { Reminder, CreateReminderInput, UpdateReminderInput } from '@keep-plus-plus/types';
import { getDatabase } from '../db/database';
import { generateId } from '../utils/id';

export class RemindersRepository {
  /**
   * Create a new reminder
   */
  async create(userId: string, input: CreateReminderInput): Promise<Reminder> {
    const db = getDatabase();
    const now = new Date();

    const reminder: Reminder = {
      id: generateId(),
      noteId: input.noteId,
      userId,
      fireAt: input.fireAt,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    await db.add('reminders', reminder);
    return reminder;
  }

  /**
   * Get a reminder by ID
   */
  async findById(id: string): Promise<Reminder | null> {
    const db = getDatabase();
    const reminder = await db.get('reminders', id);
    return reminder || null;
  }

  /**
   * Get all reminders for a user
   */
  async findAll(userId: string): Promise<Reminder[]> {
    const db = getDatabase();
    const tx = db.transaction('reminders', 'readonly');
    const index = tx.store.index('by-user');

    const reminders = await index.getAll(userId);
    return reminders.sort((a, b) => a.fireAt.getTime() - b.fireAt.getTime());
  }

  /**
   * Get all reminders for a note
   */
  async findByNote(noteId: string): Promise<Reminder[]> {
    const db = getDatabase();
    const tx = db.transaction('reminders', 'readonly');
    const index = tx.store.index('by-note');

    const reminders = await index.getAll(noteId);
    return reminders.sort((a, b) => a.fireAt.getTime() - b.fireAt.getTime());
  }

  /**
   * Get pending (not completed) reminders for a user
   */
  async findPending(userId: string): Promise<Reminder[]> {
    const db = getDatabase();
    const tx = db.transaction('reminders', 'readonly');
    const index = tx.store.index('by-user');

    const reminders = await index.getAll(userId);
    const pending = reminders.filter((r) => !r.completed);
    return pending.sort((a, b) => a.fireAt.getTime() - b.fireAt.getTime());
  }

  /**
   * Get reminders that should fire (fireAt <= now and not completed)
   */
  async findDue(userId: string): Promise<Reminder[]> {
    const db = getDatabase();
    const now = new Date();
    const tx = db.transaction('reminders', 'readonly');
    const index = tx.store.index('by-user');

    const reminders = await index.getAll(userId);
    const due = reminders.filter((r) => !r.completed && r.fireAt.getTime() <= now.getTime());
    return due.sort((a, b) => a.fireAt.getTime() - b.fireAt.getTime());
  }

  /**
   * Update a reminder
   */
  async update(id: string, input: UpdateReminderInput): Promise<Reminder> {
    const db = getDatabase();
    const reminder = await this.findById(id);

    if (!reminder) {
      throw new Error(`Reminder not found: ${id}`);
    }

    const updatedReminder: Reminder = {
      ...reminder,
      ...(input.fireAt !== undefined && { fireAt: input.fireAt }),
      ...(input.completed !== undefined && { completed: input.completed }),
      ...(input.completed && !reminder.completed && { completedAt: new Date() }),
      updatedAt: new Date(),
    };

    await db.put('reminders', updatedReminder);
    return updatedReminder;
  }

  /**
   * Mark a reminder as completed
   */
  async complete(id: string): Promise<Reminder> {
    return this.update(id, { completed: true });
  }

  /**
   * Mark a reminder as not completed
   */
  async uncomplete(id: string): Promise<Reminder> {
    const db = getDatabase();
    const reminder = await this.findById(id);

    if (!reminder) {
      throw new Error(`Reminder not found: ${id}`);
    }

    const updatedReminder: Reminder = {
      ...reminder,
      completed: false,
      completedAt: undefined,
      updatedAt: new Date(),
    };

    await db.put('reminders', updatedReminder);
    return updatedReminder;
  }

  /**
   * Delete a reminder
   */
  async delete(id: string): Promise<void> {
    const db = getDatabase();
    const reminder = await this.findById(id);

    if (!reminder) {
      throw new Error(`Reminder not found: ${id}`);
    }

    await db.delete('reminders', id);
  }

  /**
   * Delete all reminders for a note
   */
  async deleteByNote(noteId: string): Promise<void> {
    const db = getDatabase();
    const reminders = await this.findByNote(noteId);

    const tx = db.transaction('reminders', 'readwrite');

    for (const reminder of reminders) {
      await tx.store.delete(reminder.id);
    }

    await tx.done;
  }

  /**
   * Delete all completed reminders for a user
   */
  async deleteCompleted(userId: string): Promise<void> {
    const db = getDatabase();
    const allReminders = await this.findAll(userId);
    const completed = allReminders.filter((r) => r.completed);

    const tx = db.transaction('reminders', 'readwrite');

    for (const reminder of completed) {
      await tx.store.delete(reminder.id);
    }

    await tx.done;
  }
}

// Export singleton instance
export const remindersRepository = new RemindersRepository();
