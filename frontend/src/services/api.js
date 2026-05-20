const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`Erro ${res.status}: ${res.statusText}`);
  }
  // DELETE retorna 204 sem body — evitar chamar res.json()
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  // Retorna todos os posts: GET /posts → Post[]
  getPosts: () => request('/posts'),

  // Retorna post individual: GET /posts/:id → Post
  getPost: (id) => request(`/posts/${id}`),

  // Busca por palavra-chave: GET /posts/search?term= → Post[]
  searchPosts: (term) => request(`/posts/search?term=${encodeURIComponent(term)}`),

  // Cria novo post (requer professor): POST /posts → Post
  createPost: (data) => request('/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-user-type': 'teacher' },
    body: JSON.stringify(data),
  }),

  // Atualiza post existente (requer professor): PUT /posts/:id → Post
  updatePost: (id, data) => request(`/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-user-type': 'teacher' },
    body: JSON.stringify(data),
  }),

  // Remove post (requer professor): DELETE /posts/:id → null (204)
  deletePost: (id) => request(`/posts/${id}`, {
    method: 'DELETE',
    headers: { 'x-user-type': 'teacher' },
  }),
};
