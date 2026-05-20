import { createContext, useState } from 'react';

// Contexto de autenticação — compartilha estado entre componentes
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Inicializa lendo sessionStorage para persistir entre reloads
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('auth') === 'true'
  );

  // Verifica credenciais hardcoded e persiste sessão
  function login(email, password) {
    if (email === 'professor@escola.com' && password === 'senha123') {
      sessionStorage.setItem('auth', 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }

  // Limpa sessão e estado
  function logout() {
    sessionStorage.removeItem('auth');
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
