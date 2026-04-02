const API_URL = import.meta.env.VITE_API_URL || '';

export const fetchProducts = async (filters = {}) => {
  const query = new URLSearchParams({ ...filters, t: Date.now() }).toString();
  const response = await fetch(`${API_URL}/api/products?${query}`, {
    headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
  });
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};

export const fetchCategories = async () => {
  const response = await fetch(`${API_URL}/api/categories?t=${Date.now()}`, {
    headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
  });
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};

export const fetchProductById = async (id) => {
  const response = await fetch(`${API_URL}/api/products/${id}?t=${Date.now()}`, {
    headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
  });
  if (!response.ok) throw new Error('Failed to fetch product');
  return response.json();
};

export const fetchGallery = async () => {
  const response = await fetch(`${API_URL}/api/gallery?t=${Date.now()}`, {
    headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
  });
  if (!response.ok) throw new Error('Failed to fetch gallery');
  return response.json();
};

export const fetchColors = async () => {
  const response = await fetch(`${API_URL}/api/colors?t=${Date.now()}`, {
    headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
  });
  if (!response.ok) throw new Error('Failed to fetch colors');
  return response.json();
};

export const fetchHero = async () => {
  const response = await fetch(`${API_URL}/api/hero`);
  if (!response.ok) throw new Error('Failed to fetch hero');
  return response.json();
};

export const fetchSettings = async () => {
  const response = await fetch(`${API_URL}/api/settings`);
  if (!response.ok) throw new Error('Failed to fetch settings');
  return response.json();
};

export const adminLogin = async (username, password) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!response.ok) {
     const error = await response.json();
     throw new Error(error.error || 'Login failed');
  }
  return response.json();
};

// Helper to get headers with token
export const getAdminHeaders = () => {
  const token = sessionStorage.getItem('adminToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0'
  };
};
