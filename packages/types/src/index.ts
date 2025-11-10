/**
 * @keep-plus-plus/types
 * Shared TypeScript types for Keep++
 */

// Entities
export * from './entities';

// Events
export * from './events';

// DTOs
export * from './dtos';

// Common utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

export type AsyncResult<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

// ID types
export type UUID = string;
export type Timestamp = number;

// Result type for operations
export interface OperationResult<T = void> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
