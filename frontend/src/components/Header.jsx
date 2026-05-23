import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight hover:text-blue-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
        >
          Blog EducaMais
        </Link>

        {!isAuthenticated && (
          <Link
            to="/login"
            className="text-sm text-blue-100 hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded px-2 py-1"
          >
            Área do Professor
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
