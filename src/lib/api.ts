export const API_BASE = (import.meta as any).env?.VITE_API_URL || '/api';

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as any).error || `API error ${res.status}`);
  return data as T;
}

/* "12. juli 2026." iz ISO datuma — za blog kartice/članke */
export function formatDate(iso?: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const months = ['januar', 'februar', 'mart', 'april', 'maj', 'juni', 'juli', 'august', 'septembar', 'oktobar', 'novembar', 'decembar'];
  return `${d.getDate()}. ${months[d.getMonth()]} ${d.getFullYear()}.`;
}

export const api = {
  getCategories: () => request<any[]>('/categories'),
  getCategory: (id: string) => request<any>(`/categories/${id}`),
  getProducts: (categoryId?: string) =>
    request<any[]>(`/products${categoryId ? `?category=${categoryId}` : ''}`),
  getProduct: (id: string) => request<any>(`/products/${id}`),
  getBlogPosts: () => request<any[]>('/blog'),
  getBlogPost: (id: string) => request<any>(`/blog/${id}`),
  getSeo: (pageKey: string) => request<any>(`/seo/${pageKey}`),
  subscribeNewsletter: (email: string, source: string) =>
    post<{ message: string }>('/newsletter/subscribe', { email, source }),
  sendContact: (data: {
    first_name: string; last_name: string; email: string; subject?: string; message: string;
  }) => post<{ message: string }>('/contact', data),
};
