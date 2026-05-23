import { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import Header from '../components/Header';
import PostCard from '../components/PostCard';
import SearchInput from '../components/SearchInput';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

function HomePage() {
  const [term, setTerm] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // hasFetched: evita flash de "Nenhum post disponível" antes do primeiro fetch
  const hasFetched = useRef(false);
  // showSpinner: spinner com delay 200ms apenas na carga inicial (não durante busca)
  const [showSpinner, setShowSpinner] = useState(false);
  const spinnerTimer = useRef(null);

  useEffect(() => {
    // Cancela spinner anterior ao trocar term
    clearTimeout(spinnerTimer.current);
    setShowSpinner(false);

    // Spinner só na carga inicial (hasFetched=false) e após 200ms — igual ao PostPage
    if (!hasFetched.current) {
      spinnerTimer.current = setTimeout(() => setShowSpinner(true), 200);
    }

    // Debounce: aguarda 400ms após última digitação antes de chamar API
    const timer = setTimeout(async () => {
      setError(null);
      try {
        const data = term.trim()
          ? await api.searchPosts(term)
          : await api.getPosts();
        hasFetched.current = true;
        setShowSpinner(false);
        setPosts(data);
      } catch (err) {
        hasFetched.current = true;
        setShowSpinner(false);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 400);

    // Cleanup: cancela timers se term mudar antes dos 400ms
    return () => {
      clearTimeout(timer);
      clearTimeout(spinnerTimer.current);
    };
  }, [term]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Publicações</h1>

        <div className="mb-6">
          <SearchInput value={term} onChange={setTerm} />
        </div>

        {showSpinner && <LoadingSpinner />}

        {!loading && error && <ErrorMessage message={error} />}

        {!loading && !error && posts.length === 0 && hasFetched.current && (
          <p className="text-center text-gray-500 py-12">
            {term ? `Nenhum post encontrado para "${term}".` : 'Nenhum post disponível.'}
          </p>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default HomePage;
