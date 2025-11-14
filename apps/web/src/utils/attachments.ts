import type { Attachment } from '@keep-plus-plus/types';
import { generateId } from '@keep-plus-plus/storage';

const ATTACHMENTS_KEY = 'keep-plus-plus-attachments';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit for localStorage

/**
 * Get all attachments from localStorage
 */
function getAllAttachments(): Attachment[] {
  try {
    const data = localStorage.getItem(ATTACHMENTS_KEY);
    if (!data) {
      return [];
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading attachments:', error);
    return [];
  }
}

/**
 * Save attachments to localStorage
 */
function saveAttachments(attachments: Attachment[]): void {
  try {
    localStorage.setItem(ATTACHMENTS_KEY, JSON.stringify(attachments));
  } catch (error) {
    console.error('Error saving attachments:', error);
    throw new Error('Failed to save attachment. Storage may be full.');
  }
}

/**
 * Convert file to base64
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix
      const parts = result.split(',');
      const base64 = parts[1] || '';
      if (!base64) {
        reject(new Error('Failed to convert file to base64'));
        return;
      }
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Create attachment from file
 */
export async function createAttachment(noteId: string, file: File): Promise<Attachment> {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
  }

  // Determine type
  const type: 'image' | 'file' = file.type.startsWith('image/') ? 'image' : 'file';

  // Convert to base64
  const data = await fileToBase64(file);

  const attachment: Attachment = {
    id: generateId(),
    noteId,
    type,
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type,
    data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const attachments = getAllAttachments();
  attachments.push(attachment);
  saveAttachments(attachments);

  return attachment;
}

/**
 * Get attachments for a note
 */
export async function getAttachmentsForNote(noteId: string): Promise<Attachment[]> {
  const attachments = getAllAttachments();
  return attachments.filter((a) => a.noteId === noteId);
}

/**
 * Delete an attachment
 */
export async function deleteAttachment(id: string): Promise<void> {
  const attachments = getAllAttachments();
  const filtered = attachments.filter((a) => a.id !== id);
  saveAttachments(filtered);
}

/**
 * Download attachment
 */
export function downloadAttachment(attachment: Attachment): void {
  const dataUrl = `data:${attachment.mimeType};base64,${attachment.data}`;
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = attachment.fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Get attachment data URL for display
 */
export function getAttachmentDataUrl(attachment: Attachment): string {
  return `data:${attachment.mimeType};base64,${attachment.data}`;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
