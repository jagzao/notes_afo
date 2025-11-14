import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotes } from '../context/NotesContext';
import { useToast } from '../hooks/useToast';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { exportToJSON, importFromJSON, downloadFile } from '../utils/importExport';
import styles from './SettingsPage.module.css';

export const SettingsPage = () => {
  const { i18n } = useTranslation();
  const { refreshNotes } = useNotes();
  const toast = useToast();
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    imported: { notes: number; tags: number; properties: number; reminders: number };
    errors: string[];
  } | null>(null);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('keep-plus-plus-language', lang);
    toast.success(lang === 'es' ? 'Idioma cambiado a Español' : 'Language changed to English');
  };

  const handleExportJSON = async () => {
    setExporting(true);
    try {
      const jsonData = await exportToJSON();
      const timestamp = new Date().toISOString().split('T')[0];
      downloadFile(jsonData, `keep-plus-plus-backup-${timestamp}.json`, 'application/json');
      toast.success('Data exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const handleImportJSON = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportResult(null);

    try {
      const text = await file.text();
      const result = await importFromJSON(text);
      setImportResult(result);

      if (result.success) {
        await refreshNotes();
        toast.success(
          `Imported ${result.imported.notes} notes, ${result.imported.tags} tags, ${result.imported.properties} properties`
        );
      } else {
        toast.error('Import completed with errors');
      }
    } catch (error) {
      console.error('Import failed:', error);
      toast.error('Failed to import data');
    } finally {
      setImporting(false);
      // Reset input
      event.target.value = '';
    }
  };

  const handleClearData = async () => {
    if (
      !window.confirm(
        'WARNING: This will permanently delete ALL your data (notes, tags, properties, reminders). This action cannot be undone.\n\nAre you sure you want to continue?'
      )
    ) {
      return;
    }

    if (
      !window.confirm(
        'FINAL WARNING: All your data will be permanently deleted. Please confirm one more time.'
      )
    ) {
      return;
    }

    try {
      // Clear all data from IndexedDB
      const { initDatabase } = await import('@keep-plus-plus/storage');
      const db = await initDatabase();

      await db.clear('notes');
      await db.clear('tags');
      await db.clear('noteTags');
      await db.clear('properties');
      await db.clear('propertyValues');
      await db.clear('reminders');

      await refreshNotes();
      toast.success('All data cleared successfully');
    } catch (error) {
      console.error('Failed to clear data:', error);
      toast.error('Failed to clear data');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>Manage your data and preferences</p>
      </div>

      <div className={styles.content}>
        {/* Language Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Language / Idioma</h2>
          <p className={styles.sectionDescription}>
            Choose your preferred language for the app interface.
          </p>

          <div className={styles.languageSelector}>
            <button
              className={`${styles.languageButton} ${i18n.language === 'en' ? styles.active : ''}`}
              onClick={() => handleLanguageChange('en')}
              type="button"
            >
              🇺🇸 English
            </button>
            <button
              className={`${styles.languageButton} ${i18n.language === 'es' ? styles.active : ''}`}
              onClick={() => handleLanguageChange('es')}
              type="button"
            >
              🇪🇸 Español
            </button>
          </div>
        </section>

        {/* Export Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Export Data</h2>
          <p className={styles.sectionDescription}>
            Download all your notes, tags, properties, and reminders as a JSON file. You can use
            this to backup your data or transfer it to another device.
          </p>

          <button
            className={styles.primaryButton}
            onClick={handleExportJSON}
            disabled={exporting}
            type="button"
          >
            {exporting ? (
              <>
                <LoadingSpinner size="small" />
                Exporting...
              </>
            ) : (
              <>
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
                Export All Data (JSON)
              </>
            )}
          </button>
        </section>

        {/* Import Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Import Data</h2>
          <p className={styles.sectionDescription}>
            Import notes from a previously exported JSON file. Existing notes will not be affected.
          </p>

          <label className={styles.fileInputLabel} htmlFor="import-file">
            <input
              id="import-file"
              type="file"
              accept=".json,application/json"
              onChange={handleImportJSON}
              disabled={importing}
              className={styles.fileInput}
            />
            <span className={styles.primaryButton}>
              {importing ? (
                <>
                  <LoadingSpinner size="small" />
                  Importing...
                </>
              ) : (
                <>
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  Import Data (JSON)
                </>
              )}
            </span>
          </label>

          {importResult && (
            <div
              className={`${styles.importResult} ${
                importResult.success ? styles.success : styles.error
              }`}
            >
              <h3>Import Results</h3>
              <ul>
                <li>Notes: {importResult.imported.notes}</li>
                <li>Tags: {importResult.imported.tags}</li>
                <li>Properties: {importResult.imported.properties}</li>
                <li>Reminders: {importResult.imported.reminders}</li>
              </ul>
              {importResult.errors.length > 0 && (
                <details className={styles.errors}>
                  <summary>Errors ({importResult.errors.length})</summary>
                  <ul>
                    {importResult.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          )}
        </section>

        {/* Storage Info */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Storage</h2>
          <p className={styles.sectionDescription}>
            Your data is stored locally in your browser using IndexedDB. No data is sent to any
            server.
          </p>

          <div className={styles.infoBox}>
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p>
              Clearing your browser data will delete all your notes. Make sure to export your data
              regularly for backup.
            </p>
          </div>
        </section>

        {/* Danger Zone */}
        <section className={`${styles.section} ${styles.dangerZone}`}>
          <h2 className={styles.sectionTitle}>Danger Zone</h2>
          <p className={styles.sectionDescription}>
            Irreversible actions that will permanently delete your data.
          </p>

          <button
            className={styles.dangerButton}
            onClick={handleClearData}
            type="button"
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
            Clear All Data
          </button>
        </section>

        {/* About */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>About</h2>
          <p className={styles.sectionDescription}>
            <strong>Keep++</strong> - A powerful note-taking app combining Google Keep's simplicity
            with Notion's typed properties.
          </p>
          <p className={styles.version}>Version 1.0.0</p>
        </section>
      </div>
    </div>
  );
};
