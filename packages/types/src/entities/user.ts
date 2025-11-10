/**
 * User entity types
 */

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  settings: UserSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'es' | 'en';
  defaultNoteColor: string;
  compactView: boolean;
  telemetryEnabled: boolean;
}

export interface CreateUserInput {
  email: string;
  name: string;
  password: string;
}

export interface UpdateUserInput {
  name?: string;
  avatarUrl?: string;
  settings?: Partial<UserSettings>;
}
