/**
 * Data Transfer Objects for API communication
 */

// Common DTOs
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Auth DTOs
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Sync DTOs
export interface SyncRequest {
  operations: Array<{
    id: string;
    type: string;
    entity: string;
    entityId: string;
    data: unknown;
    timestamp: number;
    deviceId: string;
  }>;
  lastSyncAt?: number;
}

export interface SyncResponse {
  synced: string[]; // Operation IDs successfully synced
  conflicts: Array<{
    operationId: string;
    entityId: string;
    localVersion: unknown;
    remoteVersion: unknown;
  }>;
  updates: Array<{
    entity: string;
    entityId: string;
    data: unknown;
    timestamp: number;
  }>;
}

// Search DTOs
export interface SearchRequest {
  query: string;
  filters?: {
    tags?: string[];
    colors?: string[];
    state?: string;
  };
  sort?: {
    by: string;
    order: 'asc' | 'desc';
  };
  pagination?: PaginationParams;
}

export interface SearchResponse {
  results: Array<{
    id: string;
    title: string;
    description: string;
    highlights: {
      title?: string;
      description?: string;
    };
    score: number;
  }>;
  total: number;
}
