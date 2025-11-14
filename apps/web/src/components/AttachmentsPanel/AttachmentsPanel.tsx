import { useState, useEffect, useRef } from 'react';
import type { Attachment } from '@keep-plus-plus/types';
import {
  createAttachment,
  getAttachmentsForNote,
  deleteAttachment,
  downloadAttachment,
  getAttachmentDataUrl,
  formatFileSize,
} from '../../utils/attachments';
import { useToast } from '../../hooks/useToast';
import styles from './AttachmentsPanel.module.css';

interface AttachmentsPanelProps {
  noteId: string;
}

export const AttachmentsPanel: React.FC<AttachmentsPanelProps> = ({ noteId }) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  useEffect(() => {
    loadAttachments();
  }, [noteId]);

  const loadAttachments = async () => {
    try {
      const data = await getAttachmentsForNote(noteId);
      setAttachments(data);
    } catch (error) {
      console.error('Failed to load attachments:', error);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file) {
          await createAttachment(noteId, file);
        }
      }

      await loadAttachments();
      toast.success(`Uploaded ${files.length} file${files.length > 1 ? 's' : ''}`);
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload files');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this attachment?')) return;

    try {
      await deleteAttachment(id);
      await loadAttachments();
      toast.success('Attachment deleted');
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete attachment');
    }
  };

  const handleDownload = (attachment: Attachment) => {
    try {
      downloadAttachment(attachment);
      toast.success('Download started');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download file');
    }
  };

  if (attachments.length === 0 && !uploading) {
    return (
      <div className={styles.empty}>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className={styles.fileInput}
          id={`file-input-${noteId}`}
        />
        <label htmlFor={`file-input-${noteId}`} className={styles.uploadButton}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
          Add Files or Images
        </label>
        <p className={styles.hint}>Max 5MB per file</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h4 className={styles.title}>Attachments ({attachments.length})</h4>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className={styles.fileInput}
          id={`file-input-${noteId}`}
          disabled={uploading}
        />
        <label
          htmlFor={`file-input-${noteId}`}
          className={`${styles.addButton} ${uploading ? styles.disabled : ''}`}
        >
          {uploading ? 'Uploading...' : '+ Add Files'}
        </label>
      </div>

      <div className={styles.grid}>
        {attachments.map((attachment) => (
          <div key={attachment.id} className={styles.attachment}>
            {attachment.type === 'image' ? (
              <div className={styles.imagePreview}>
                <img
                  src={getAttachmentDataUrl(attachment)}
                  alt={attachment.fileName}
                  className={styles.image}
                />
              </div>
            ) : (
              <div className={styles.fileIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            )}

            <div className={styles.info}>
              <p className={styles.fileName} title={attachment.fileName}>
                {attachment.fileName}
              </p>
              <p className={styles.fileSize}>{formatFileSize(attachment.fileSize)}</p>
            </div>

            <div className={styles.actions}>
              <button
                onClick={() => handleDownload(attachment)}
                className={styles.actionButton}
                title="Download"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </button>
              <button
                onClick={() => handleDelete(attachment.id)}
                className={`${styles.actionButton} ${styles.delete}`}
                title="Delete"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
