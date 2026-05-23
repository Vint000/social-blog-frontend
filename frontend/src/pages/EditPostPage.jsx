import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

// Página de edição de post existente — carrega dados via GET, salva via PUT
export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estado dos campos do formulário
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  // Estados de controle de fluxo
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Carrega dados do post ao montar ou quando o id muda
  useEffect(() => {
    setLoading(true);
    setLoadFailed(false);

    api.getPost(id)
      .then((post) => {
        setTitle(post.title);
        setContent(post.content);
        setAuthor(post.author);
      })
      .catch(() => {
        setLoadFailed(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();

    // Validação client-side — todos os campos obrigatórios
    if (!title.trim() || !content.trim() || !author.trim()) {
      setSubmitError('Todos os campos são obrigatórios');
      return;
    }

    setSubmitError(null);
    setSubmitting(true);

    try {
      await api.updatePost(id, { title: title.trim(), content: content.trim(), author: author.trim() });
      // Sucesso — retorna para painel administrativo
      navigate('/admin');
    } catch (err) {
      setSubmitError(err.message);
      setSubmitting(false);
    }
  }

  // Estado de carregamento inicial
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto p-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Erro ao carregar post (ex: 404, rede fora)
  if (loadFailed) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto p-8">
          <ErrorMessage message="Erro ao carregar post. Ele pode ter sido removido." />
          <button
            onClick={() => navigate('/admin')}
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 rounded px-3 py-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span aria-hidden="true">←</span> Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-2xl mx-auto p-8">
        {/* Cabeçalho com título e botão de volta */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Editar Post</h1>
          <button
            onClick={() => navigate('/admin')}
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 rounded px-3 py-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span aria-hidden="true">←</span> Voltar
          </button>
        </div>

        {/* Mensagem de erro de validação ou da API */}
        {submitError && (
          <p className="mb-4 text-red-600 bg-red-50 border border-red-200 rounded p-3">
            {submitError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo título */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Título do post"
            />
          </div>

          {/* Campo conteúdo */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Conteúdo
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              placeholder="Escreva o conteúdo do post..."
            />
          </div>

          {/* Campo autor */}
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
              Autor
            </label>
            <input
              id="author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nome do autor"
            />
          </div>

          {/* Botão submit — desabilitado durante envio */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {submitting ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>
    </div>
  );
}
