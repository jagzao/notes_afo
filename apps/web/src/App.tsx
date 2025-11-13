import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@keep-plus-plus/ui';
import { NotesProvider } from './context/NotesContext';
import { TagsProvider } from './context/TagsContext';
import { PropertiesProvider } from './context/PropertiesContext';
import { RemindersProvider } from './context/RemindersContext';
import { HomePage } from './pages/HomePage';
import { RemindersPage } from './pages/RemindersPage';
import { ArchivePage } from './pages/ArchivePage';
import { TrashPage } from './pages/TrashPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { Layout } from './components/Layout';

function App() {
  return (
    <ThemeProvider defaultMode="light" storageKey="keep-plus-plus-theme">
      <NotesProvider>
        <TagsProvider>
          <PropertiesProvider>
            <RemindersProvider>
              <BrowserRouter>
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
              </BrowserRouter>
              <Toaster />
            </RemindersProvider>
          </PropertiesProvider>
        </TagsProvider>
      </NotesProvider>
    </ThemeProvider>
  );
}

export default App;
