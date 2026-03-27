const API_URL = import.meta.env.VITE_API_URL || '';

export const fetchProducts = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  const response = await fetch(`${API_URL}/api/products?${query}`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};

export const fetchCategories = async () => {
  const response = await fetch(`${API_URL}/api/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};

export const fetchProductById = async (id) => {
  const response = await fetch(`${API_URL}/api/products/${id}`);
  if (!response.ok) throw new Error('Failed to fetch product');
  return response.json();
};

export const fetchGallery = async () => {
  const response = await fetch(`${API_URL}/api/gallery`);
  if (!response.ok) throw new Error('Failed to fetch gallery');
  return response.json();
};
