import React, { useState } from 'react';
import Botao from './botao.jsx';

function App() {
  const [posts, setPosts] = useState([
    { id: 1, titulo: "Post Inicial", autor: "Vincenzo", descricao: "Bem-vindo ao blog!" }
  ]);

  const [novoTitulo, setNovoTitulo] = useState('');
  const [novoDescricao, setNovoDescricao] = useState('');

  const adicionarPost = () => {
    if (novoTitulo === '' || novoDescricao === '') {
      alert("Preencha todos os campos!");
      return;
    }

    const novoPost = {
      id: Date.now(), // Usamos a data atual como ID único para não repetir
      titulo: novoTitulo,
      autor: "Vincenzo (Logado)",
      descricao: novoDescricao
    };

    setPosts([novoPost, ...posts]);
    setNovoTitulo('');
    setNovoDescricao('');
  };

  // --- NOVA FUNÇÃO: EXCLUIR POST ---
  const excluirPost = (idParaRemover) => {
    // Filtramos a lista: "Mantenha todos os posts, EXCETO o que tem o ID clicado"
    const listaAtualizada = posts.filter(post => post.id !== idParaRemover);
    setPosts(listaAtualizada);
  };

  return (
    <div style={{ backgroundColor: '#1a1a1a', minHeight: '100vh', padding: '20px', color: 'white', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#646cff', textAlign: 'center' }}>Blog poss 🚀</h1>

      {/* Formulário de Cadastro */}
      <div style={{ backgroundColor: '#242424', padding: '20px', borderRadius: '12px', maxWidth: '600px', margin: '20px auto', border: '1px solid #444' }}>
        <h3>Criar nova postagem</h3>
        <input 
          type="text" 
          placeholder="Título do post"
          value={novoTitulo}
          onChange={(e) => setNovoTitulo(e.target.value)}
          style={{ width: '96%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #333' }}
        />
        <textarea 
          placeholder="O que você está pensando?"
          value={novoDescricao}
          onChange={(e) => setNovoDescricao(e.target.value)}
          style={{ width: '96%', padding: '10px', height: '80px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #333' }}
        />
        <button 
          onClick={adicionarPost}
          style={{ backgroundColor: '#646cff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', width: '100%' }}
        >
          Publicar no Blog
        </button>
      </div>

      <hr style={{ maxWidth: '600px', border: '0.5px solid #333', margin: '40px auto' }} />

      {/* Lista de Posts */}
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {posts.map((post) => (
          <div key={post.id} style={{ backgroundColor: '#242424', border: '1px solid #333', borderRadius: '12px', padding: '20px', marginBottom: '20px', position: 'relative' }}>
            <h2 style={{ color: '#646cff', margin: '0' }}>{post.titulo}</h2>
            <p style={{ color: '#e2e2e2' }}>{post.descricao}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <small style={{ color: '#888' }}>Autor: <strong>{post.autor}</strong></small>
              
              {/* BOTÃO EXCLUIR */}
              <button 
                onClick={() => excluirPost(post.id)}
                style={{ backgroundColor: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', borderRadius: '4px', cursor: 'pointer', padding: '5px 10px', fontSize: '12px' }}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;