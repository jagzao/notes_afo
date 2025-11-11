/**
 * Note entity types
 */

export interface Note {
  id: string;
  userId: string;
  title: string;
  description: string;
  color: NoteColor;
  pinned: boolean;
  archived: boolean;
  trashed: boolean;
  trashedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  deviceId: string;
}

export type NoteColor =
  | 'default'
  | 'coral'
  | 'peach'
  | 'sand'
  | 'mint'
  | 'sage'
  | 'fog'
  | 'storm'
  | 'dusk'
  | 'blossom'
  | 'clay'
  | 'chalk';

export const NOTE_COLORS: Record<NoteColor, string> = {
  default: '#FFFFFF',
  coral: '#FAAFA8',
  peach: '#F39F76',
  sand: '#FFF8B8',
  mint: '#E2F6D3',
  sage: '#B4DDD3',
  fog: '#D4E4ED',
  storm: '#AECCDC',
  dusk: '#D3BFDB',
  blossom: '#F6E2DD',
  clay: '#E9E3D4',
  chalk: '#EFEFF1',
};

export interface CreateNoteInput {
  title?: string;
  description?: string;
  color?: NoteColor;
}

export interface UpdateNoteInput {
  title?: string;
  description?: string;
  color?: NoteColor;
  pinned?: boolean;
  archived?: boolean;
  trashed?: boolean;
  trashedAt?: Date;
}

export type NoteState = 'active' | 'archived' | 'trashed';

export interface NoteFilter {
  state?: NoteState;
  pinned?: boolean;
  tagIds?: string[];
  color?: NoteColor;
  search?: string;
}

export interface NoteSortOptions {
  by: 'createdAt' | 'updatedAt' | 'title';
  order: 'asc' | 'desc';
}
