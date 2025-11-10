/**
 * Property entity types (for typed properties in notes)
 */

export type PropertyType =
  | 'text'
  | 'number'
  | 'date'
  | 'checkbox'
  | 'select'
  | 'multiselect'
  | 'url';

export interface PropertyDefinition {
  id: string;
  noteId: string;
  key: string;
  type: PropertyType;
  label: string;
  options?: string[]; // For select/multiselect
  required: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyValue {
  id: string;
  noteId: string;
  key: string;
  valueText?: string;
  valueNumber?: number;
  valueDate?: Date;
  valueBool?: boolean;
  valueSelect?: string[];
  valueUrl?: string;
  updatedAt: Date;
  deviceId: string;
}

export interface CreatePropertyInput {
  key: string;
  type: PropertyType;
  label: string;
  options?: string[];
  required?: boolean;
}

export interface UpdatePropertyInput {
  label?: string;
  options?: string[];
  required?: boolean;
}

export type PropertyValueInput =
  | { type: 'text'; value: string }
  | { type: 'number'; value: number }
  | { type: 'date'; value: Date }
  | { type: 'checkbox'; value: boolean }
  | { type: 'select'; value: string }
  | { type: 'multiselect'; value: string[] }
  | { type: 'url'; value: string };

export interface PropertyValidationError {
  key: string;
  message: string;
}
