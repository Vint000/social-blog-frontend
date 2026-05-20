import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Redireciona para /login se não autenticado
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
