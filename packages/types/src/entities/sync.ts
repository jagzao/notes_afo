/**
 * Sync and conflict resolution types
 */

export type SyncOperationType = 'CREATE' | 'UPDATE' | 'DELETE';

export type SyncEntityType = 'note' | 'property' | 'tag' | 'reminder';

export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'failed';

export interface SyncOperation {
  id: string;
  type: SyncOperationType;
  entity: SyncEntityType;
  entityId: string;
  data: unknown;
  timestamp: number;
  retries: number;
  status: SyncStatus;
  error?: string;
  deviceId: string;
  createdAt: Date;
}

export interface SyncMetadata {
  lastSyncAt: number;
  pendingOperations: number;
  conflictsCount: number;
  deviceId: string;
}

export interface ConflictResolution {
  strategy: 'lww' | 'duplicate' | 'manual';
  selectedVersion?: 'local' | 'remote';
  mergedData?: unknown;
}

export interface SyncConflict {
  id: string;
  entityType: SyncEntityType;
  entityId: string;
  localVersion: unknown;
  remoteVersion: unknown;
  localTimestamp: number;
  remoteTimestamp: number;
  resolution?: ConflictResolution;
  createdAt: Date;
}

export interface SyncQueueStats {
  pending: number;
  syncing: number;
  failed: number;
  lastSync?: Date;
}
