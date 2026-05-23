import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-blue-700 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight hover:text-blue-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded">
          Blog EducaMais
        </Link>
      </div>
    </header>
  );
}

export default Header;
