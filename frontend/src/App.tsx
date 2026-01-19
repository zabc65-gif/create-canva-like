import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EditorPage from './pages/EditorPage';
import TermsPage from './pages/TermsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/editor/:projectId?" element={<EditorPage />} />
      <Route path="/terms" element={<TermsPage />} />
    </Routes>
  );
}

export default App;
