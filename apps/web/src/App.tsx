import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@keep-plus-plus/ui';
import { NotesProvider } from './context/NotesContext';
import { TagsProvider } from './context/TagsContext';
import { PropertiesProvider } from './context/PropertiesContext';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { Layout } from './components/Layout';

function App() {
  return (
    <ThemeProvider defaultMode="light" storageKey="keep-plus-plus-theme">
      <NotesProvider>
        <TagsProvider>
          <PropertiesProvider>
            <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="notes" element={<HomePage />} />
                <Route path="archive" element={<div>Archive</div>} />
                <Route path="trash" element={<div>Trash</div>} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
          </PropertiesProvider>
        </TagsProvider>
      </NotesProvider>
    </ThemeProvider>
  );
}

export default App;
