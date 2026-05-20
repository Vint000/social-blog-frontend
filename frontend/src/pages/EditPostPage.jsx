import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Carrega dados do post ao montar ou quando o id muda
  useEffect(() => {
    setLoading(true);
    setError(null);

    api.getPost(id)
      .then((post) => {
        setTitle(post.title);
        setContent(post.content);
        setAuthor(post.author);
      })
      .catch(() => {
        setError('Erro ao carregar post');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();

    // Validação client-side — todos os campos obrigatórios
    if (!title.trim() || !content.trim() || !author.trim()) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await api.updatePost(id, { title: title.trim(), content: content.trim(), author: author.trim() });
      // Sucesso — retorna para painel administrativo
      navigate('/admin');
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  // Estado de carregamento inicial
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  // Erro de carregamento — não exibe formulário
  if (error && !submitting && title === '' && content === '' && author === '') {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <p className="mb-4 text-red-600 bg-red-50 border border-red-200 rounded p-3">
          {error}
        </p>
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
        >
          ← Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      {/* Cabeçalho com título e botão de volta */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Editar Post</h1>
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
        >
          ← Voltar
        </button>
      </div>

      {/* Mensagem de erro de validação ou da API */}
      {error && (
        <p className="mb-4 text-red-600 bg-red-50 border border-red-200 rounded p-3">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
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
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y"
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
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
  );
}
