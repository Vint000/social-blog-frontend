const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`Erro ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

export const api = {
  // Retorna todos os posts: GET /posts → Post[]
  getPosts: () => request('/posts'),

  // Retorna post individual: GET /posts/:id → Post
  getPost: (id) => request(`/posts/${id}`),

  // Busca por palavra-chave: GET /posts/search?term= → Post[]
  searchPosts: (term) => request(`/posts/search?term=${encodeURIComponent(term)}`),
};
