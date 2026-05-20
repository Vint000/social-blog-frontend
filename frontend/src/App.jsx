import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import NewPostPage from './pages/NewPostPage';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Placeholder — substituído no plano 03-03
const EditPostPage = () => <div className="p-8">Editar post — em breve</div>;

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts/:id" element={<PostPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={<ProtectedRoute><AdminPage /></ProtectedRoute>}
        />
        <Route
          path="/admin/posts/new"
          element={<ProtectedRoute><NewPostPage /></ProtectedRoute>}
        />
        <Route
          path="/admin/posts/:id/edit"
          element={<ProtectedRoute><EditPostPage /></ProtectedRoute>}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
