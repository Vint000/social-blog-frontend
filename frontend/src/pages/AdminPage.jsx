import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';

// Painel administrativo — lista posts com ações de editar e excluir
export default function AdminPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // ID do post aguardando confirmação de exclusão (null = modal fechado)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const navigate = useNavigate();
  const { logout } = useAuth();

  // Carrega lista de posts ao montar o componente
  useEffect(() => {
    api.getPosts()
      .then((data) => setPosts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Executa exclusão após confirmação no modal
  async function handleDeleteConfirm() {
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    try {
      await api.deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Erro ao excluir post:', err);
    }
  }

  // Encerra sessão e redireciona para home
  function handleLogout() {
    logout();
    navigate('/');
  }

  if (loading) {
    return <p className="p-8 text-gray-500">Carregando posts...</p>;
  }

  if (error) {
    return <p className="p-8 text-red-600">Erro: {error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">

      {/* Modal de confirmação de exclusão */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Excluir post</h2>
            <p className="text-gray-600 mb-6">Tem certeza? Esta ação não pode ser desfeita.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Cabeçalho com título e ações globais */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Painel do Professor</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/admin/posts/new')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Novo Post
          </button>
          <button
            onClick={handleLogout}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
          >
            Sair
          </button>
        </div>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-500">Nenhum post encontrado.</p>
      ) : (
        <ul className="space-y-3">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex items-center justify-between bg-white border border-gray-200 rounded p-4"
            >
              {/* Dados do post */}
              <div>
                <p className="font-semibold text-gray-800">{post.title}</p>
                <p className="text-sm text-gray-500">{post.author}</p>
              </div>

              {/* Ações por post */}
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/admin/posts/${post.id}/edit`)}
                  className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-200 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => setConfirmDeleteId(post.id)}
                  className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
