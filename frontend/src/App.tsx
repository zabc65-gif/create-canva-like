import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EditorPage from './pages/EditorPage';
import TermsPage from './pages/TermsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProjectsPage from './pages/ProjectsPage';
import AccountSettings from './pages/AccountSettings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/account" element={<AccountSettings />} />
      <Route path="/editor/:projectId?" element={<EditorPage />} />
      <Route path="/terms" element={<TermsPage />} />
    </Routes>
  );
}

export default App;
