const BASE = (import.meta as any).env?.VITE_API_URL || '/api';

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export const api = {
  getCategories: () => request<any[]>('/categories'),
  getProducts: (categoryId?: string) =>
    request<any[]>(`/products${categoryId ? `?category=${categoryId}` : ''}`),
  getProduct: (id: string) => request<any>(`/products/${id}`),
  getBlogPosts: () => request<any[]>('/blog'),
  getBlogPost: (id: string) => request<any>(`/blog/${id}`),
  subscribeNewsletter: (email: string, source: string) =>
    fetch(`${BASE}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source }),
    }).then(r => r.json()),
  sendContact: (data: {
    first_name: string; last_name: string; email: string; subject?: string; message: string;
  }) =>
    fetch(`${BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),
};
