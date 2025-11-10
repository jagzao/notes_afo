/**
 * Tag entity types
 */

export interface Tag {
  id: string;
  userId: string;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteTag {
  noteId: string;
  tagId: string;
  createdAt: Date;
}

export interface CreateTagInput {
  name: string;
  color?: string;
}

export interface UpdateTagInput {
  name?: string;
  color?: string;
}
