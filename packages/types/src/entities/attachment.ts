/**
 * Attachment entity types
 */

export type AttachmentType = 'image' | 'file';

export interface Attachment {
  id: string;
  noteId: string;
  type: AttachmentType;
  fileName: string;
  fileSize: number;
  mimeType: string;
  data: string; // Base64 encoded file data
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAttachmentInput {
  type: AttachmentType;
  fileName: string;
  fileSize: number;
  mimeType: string;
  data: string;
}
