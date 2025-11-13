import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@keep-plus-plus/ui';
import { NotesProvider } from './context/NotesContext';
import { TagsProvider } from './context/TagsContext';
import { PropertiesProvider } from './context/PropertiesContext';
import { RemindersProvider } from './context/RemindersContext';
import { Layout } from './components/Layout';
import { LoadingSpinner } from './components/LoadingSpinner';
import { OfflineIndicator } from './components/OfflineIndicator';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const RemindersPage = lazy(() => import('./pages/RemindersPage').then(m => ({ default: m.RemindersPage })));
const ArchivePage = lazy(() => import('./pages/ArchivePage').then(m => ({ default: m.ArchivePage })));
const TrashPage = lazy(() => import('./pages/TrashPage').then(m => ({ default: m.TrashPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

function App() {
  return (
    <ThemeProvider defaultMode="light" storageKey="keep-plus-plus-theme">
      <NotesProvider>
        <TagsProvider>
          <PropertiesProvider>
            <RemindersProvider>
              <BrowserRouter>
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<Layout />}>
                      <Route index element={<HomePage />} />
                      <Route path="notes" element={<HomePage />} />
                      <Route path="reminders" element={<RemindersPage />} />
                      <Route path="archive" element={<ArchivePage />} />
                      <Route path="trash" element={<TrashPage />} />
                      <Route path="settings" element={<SettingsPage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Route>
                  </Routes>
                </Suspense>
              </BrowserRouter>
              <Toaster />
              <OfflineIndicator />
            </RemindersProvider>
          </PropertiesProvider>
        </TagsProvider>
      </NotesProvider>
    </ThemeProvider>
  );
}

export default App;
