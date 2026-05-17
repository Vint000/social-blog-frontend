import React, { useState, useEffect } from 'react';
import { ThumbsUp, MessageCircle, Share2, User, Trash2, Send, Edit2, Check, X } from 'lucide-react';

function App() {
  // 1. ESTADOS (Memória e Persistência)
  const [user] = useState({ uid: '1234', name: 'Vincenzo' });
  const [posts, setPosts] = useState(() => {
    const salvos = localStorage.getItem('posts_social_blog');
    return salvos ? JSON.parse(salvos) : [
      { 
        id: 1, 
        authorId: '0000', 
        authorName: 'Sistema', 
        content: 'Bem-vindo! Agora seus posts e edições ficam salvos neste navegador.', 
        createdAt: Date.now(), 
        likes: [], 
        comments: [] 
      }
    ];
  });

  const [newPostContent, setNewPostContent] = useState('');
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [tempComment, setTempComment] = useState('');
  
  // Estados para Edição de Comentário
  const [editingCommentId, setEditingCommentId] = useState(null); 
  const [editText, setEditText] = useState('');

  // Sincroniza com o disco local (LocalStorage)
  useEffect(() => {
    localStorage.setItem('posts_social_blog', JSON.stringify(posts));
  }, [posts]);

  // --- FUNÇÕES DE LÓGICA ---

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    const novo = {
      id: Date.now(),
      content: newPostContent,
      authorId: user.uid,
      authorName: user.name,
      createdAt: Date.now(),
      likes: [],
      comments: []
    };
    setPosts([novo, ...posts]);
    setNewPostContent('');
  };

  const handleExcluirPost = (id) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  const handleLike = (postId) => {
    const novosPosts = posts.map(post => {
      if (post.id === postId) {
        const jaCurtiu = post.likes.includes(user.uid);
        const novosLikes = jaCurtiu 
          ? post.likes.filter(id => id !== user.uid)
          : [...post.likes, user.uid];
        return { ...post, likes: novosLikes };
      }
      return post;
    });
    setPosts(novosPosts);
  };

  const handleAddComment = (postId) => {
    if (!tempComment.trim()) return;
    const novosPosts = posts.map(post => {
      if (post.id === postId) {
        const novoComentario = { 
          id: Date.now(), 
          authorId: user.uid, 
          authorName: user.name, 
          text: tempComment 
        };
        return { ...post, comments: [...post.comments, novoComentario] };
      }
      return post;
    });
    setPosts(novosPosts);
    setTempComment('');
  };

  const handleSaveEdit = (postId, commentId) => {
    if (!editText.trim()) return;
    const novosPosts = posts.map(post => {
      if (post.id === postId) {
        const novosComentarios = post.comments.map(c => 
          c.id === commentId ? { ...c, text: editText } : c
        );
        return { ...post, comments: novosComentarios };
      }
      return post;
    });
    setPosts(novosPosts);
    setEditingCommentId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
      {/* HEADER */}
      <nav className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 size={20} />
            <h1 className="text-xl font-bold tracking-tight">SocialBlog</h1>
          </div>
          <div className="bg-blue-700 p-2 rounded-full cursor-pointer hover:bg-blue-800 transition">
            <User size={20} />
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* CRIAR POST */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-4">
          <textarea
            className="w-full bg-gray-50 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-800"
            rows="3"
            placeholder="No que estás a pensar, Vincenzo?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />
          <div className="flex justify-end mt-3 border-t border-gray-50 pt-3">
            <button 
              onClick={handleCreatePost} 
              disabled={!newPostContent.trim()}
              className={`px-6 py-2 rounded-lg font-bold transition ${!newPostContent.trim() ? 'bg-gray-300 text-gray-500' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'}`}
            >
              Publicar
            </button>
          </div>
        </div>

        {/* FEED */}
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 transition hover:border-gray-300">
               <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold">{post.authorName.charAt(0)}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{post.authorName}</h3>
                      <p className="text-xs text-gray-500">Público</p>
                    </div>
                  </div>
                  {user.uid === post.authorId && (
                    <button onClick={() => handleExcluirPost(post.id)} className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition"><Trash2 size={18} /></button>
                  )}
               </div>

               <p className="text-gray-800 mb-4 whitespace-pre-wrap leading-relaxed">{post.content}</p>

               {/* CONTADORES */}
               <div className="flex gap-4 text-xs text-gray-500 mb-2 px-1">
                 {post.likes.length > 0 && <span className="flex items-center gap-1 font-medium text-blue-600"><ThumbsUp size={12} fill="#3b82f6" /> {post.likes.length}</span>}
                 {post.comments.length > 0 && <span>{post.comments.length} comentários</span>}
               </div>

               <div className="flex border-t border-gray-100 pt-1">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-sm transition ${post.likes.includes(user.uid) ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <ThumbsUp size={18} className={post.likes.includes(user.uid) ? 'fill-current' : ''} /> Gostar
                  </button>
                  <button 
                    onClick={() => setActiveCommentId(activeCommentId === post.id ? null : post.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition ${activeCommentId === post.id ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <MessageCircle size={18} /> Comentar
                  </button>
               </div>

               {/* SEÇÃO DE COMENTÁRIOS */}
               {activeCommentId === post.id && (
                 <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex gap-2 mb-4">
                      <input 
                        type="text" 
                        className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Escreva um comentário..."
                        value={tempComment}
                        onChange={(e) => setTempComment(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                      />
                      <button onClick={() => handleAddComment(post.id)} className="text-blue-600 p-2 hover:bg-blue-100 rounded-full transition"><Send size={18} /></button>
                    </div>

                    {post.comments.map(c => (
                      <div key={c.id} className="flex gap-2 mb-3 items-start">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold flex-shrink-0">{c.authorName.charAt(0)}</div>
                        <div className="bg-gray-100 px-3 py-2 rounded-2xl text-[13px] flex-1">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <span className="font-bold block text-gray-900 mb-0.5">{c.authorName}</span>
                              {editingCommentId === c.id ? (
                                <div className="flex items-center gap-2 mt-1">
                                  <input 
                                    autoFocus
                                    className="flex-1 bg-white border border-blue-400 rounded-md px-2 py-1 focus:outline-none"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                  />
                                  <button onClick={() => handleSaveEdit(post.id, c.id)} className="text-green-600 p-1 hover:bg-green-100 rounded"><Check size={16}/></button>
                                  <button onClick={() => setEditingCommentId(null)} className="text-red-600 p-1 hover:bg-red-100 rounded"><X size={16}/></button>
                                </div>
                              ) : (
                                <span className="text-gray-800">{c.text}</span>
                              )}
                            </div>
                            
                            
                            {(editingCommentId !== c.id && user.uid === c.authorId) && (
                              <button 
                                onClick={() => { setEditingCommentId(c.id); setEditText(c.text); }}
                                className="text-blue-500 hover:text-blue-700 p-1.5 bg-white shadow-sm border border-gray-200 rounded-lg ml-2 transition active:scale-90"
                              >
                                <Edit2 size={13} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;