import { useState, useEffect } from 'react';
import { api } from '../services/api';
import Header from '../components/Header';
import PostCard from '../components/PostCard';
import SearchInput from '../components/SearchInput';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

function HomePage() {
  const [term, setTerm] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Debounce: aguarda 400ms após última digitação antes de chamar API
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const data = term.trim()
          ? await api.searchPosts(term)
          : await api.getPosts();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 400);

    // Cleanup: cancela timer se term mudar antes dos 400ms
    return () => clearTimeout(timer);
  }, [term]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Posts</h1>

        <div className="mb-6">
          <SearchInput value={term} onChange={setTerm} />
        </div>

        {loading && <LoadingSpinner />}

        {!loading && error && <ErrorMessage message={error} />}

        {!loading && !error && posts.length === 0 && (
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
