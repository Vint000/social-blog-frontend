import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const spinnerTimer = useRef(null);

  useEffect(() => {
    // Evita setState após desmontagem do componente
    let cancelado = false;
    setPost(null);
    setError(null);

    // Spinner só aparece se fetch demorar mais de 200ms (evita flash em localhost)
    spinnerTimer.current = setTimeout(() => {
      if (!cancelado) setLoading(true);
    }, 200);

    api.getPost(id)
      .then((data) => {
        if (!cancelado) {
          clearTimeout(spinnerTimer.current);
          setLoading(false);
          setPost(data);
        }
      })
      .catch((err) => {
        if (!cancelado) {
          clearTimeout(spinnerTimer.current);
          setLoading(false);
          setError(err.message);
        }
      });

    return () => {
      cancelado = true;
      clearTimeout(spinnerTimer.current);
    };
  }, [id]);

  const dataFormatada = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(window.history.state?.idx > 0 ? -1 : '/')}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 mb-6 transition"
        >
          ← Voltar
        </button>

        {loading && <LoadingSpinner />}

        {!loading && error && <ErrorMessage message={error} />}

        {!loading && !error && post && (
          <article>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {post.title}
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              Por {post.author} · {dataFormatada}
            </p>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>
          </article>
        )}
      </main>
    </div>
  );
}

export default PostPage;
