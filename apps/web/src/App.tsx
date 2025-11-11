import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@keep-plus-plus/ui';
import { NotesProvider } from './context/NotesContext';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { Layout } from './components/Layout';

function App() {
  return (
    <ThemeProvider defaultMode="light" storageKey="keep-plus-plus-theme">
      <NotesProvider>
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
      </NotesProvider>
    </ThemeProvider>
  );
}

export default App;
