import { useState } from 'react';
import { flushSync } from 'react-dom';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Já autenticado — redireciona direto para área admin
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  function handleSubmit(e) {
    e.preventDefault();
    // flushSync: força render do estado "Entrando..." antes do login() síncrono
    flushSync(() => {
      setError('');
      setSubmitting(true);
    });

    const success = login(email, password);

    setSubmitting(false);

    if (success) {
      navigate('/admin', { replace: true });
    } else {
      setError('Credenciais inválidas');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <p className="text-center text-2xl font-bold text-blue-700 mb-6 tracking-tight">
          Blog EducaMais
        </p>
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-lg font-bold text-gray-800 mb-6 text-center">
          Acesso do Professor
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Mensagem de erro exibida apenas em falha de credenciais */}
          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg px-4 py-2 transition-colors"
          >
            {submitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
      </div>
    </div>
  );
}
