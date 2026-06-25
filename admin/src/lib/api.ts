// ---------------------------------------------------------------------------
// HTTP klijent — poziva pravi backend na http://localhost:4000/api
// ---------------------------------------------------------------------------

const BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000/api';

function getToken(): string | null {
  return localStorage.getItem('bioclinica_token');
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// --- Auth -------------------------------------------------------------------

export const authApi = {
  login: async (username: string, password: string) => {
    const data = await request<{ token: string; username: string; email: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    localStorage.setItem('bioclinica_token', data.token);
    return data;
  },
  me: () => request<{ id: number; username: string; email: string }>('/auth/me'),
  changePassword: (currentPassword: string, newPassword: string) =>
    request<{ message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
  logout: () => {
    localStorage.removeItem('bioclinica_token');
  },
};

// --- Dashboard --------------------------------------------------------------

export const dashboardApi = {
  stats: () => request<any>('/dashboard/stats'),
};

// --- Categories -------------------------------------------------------------

export const categoriesApi = {
  getAll: () => request<any[]>('/categories'),
  create: (data: any) => request<any>('/categories', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<any>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<any>(`/categories/${id}`, { method: 'DELETE' }),
};

// --- Products ---------------------------------------------------------------

export const productsApi = {
  getAll: () => request<any[]>('/products/all'),
  create: (data: any) => request<any>('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<any>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<any>(`/products/${id}`, { method: 'DELETE' }),
};

// --- Blog -------------------------------------------------------------------

export const blogApi = {
  getAll: () => request<any[]>('/blog/all'),
  getOne: (id: string) => request<any>(`/blog/${id}`),
  create: (data: any) => request<any>('/blog', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<any>(`/blog/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<any>(`/blog/${id}`, { method: 'DELETE' }),
};

// --- Contact ----------------------------------------------------------------

export const contactApi = {
  getAll: (status?: string) =>
    request<any[]>(`/contact${status ? `?status=${status}` : ''}`),
  setStatus: (id: number, status: string) =>
    request<any>(`/contact/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  delete: (id: number) => request<any>(`/contact/${id}`, { method: 'DELETE' }),
};

// --- Newsletter -------------------------------------------------------------

export const newsletterApi = {
  getSubscribers: () => request<any[]>('/newsletter/subscribers'),
  getStats: () => request<any>('/newsletter/stats'),
  delete: (id: number) => request<any>(`/newsletter/subscribers/${id}`, { method: 'DELETE' }),
};

// --- SEO --------------------------------------------------------------------

export const seoApi = {
  getAll: () => request<any[]>('/seo'),
  update: (pageKey: string, data: any) =>
    request<any>(`/seo/${pageKey}`, { method: 'PUT', body: JSON.stringify(data) }),
};
