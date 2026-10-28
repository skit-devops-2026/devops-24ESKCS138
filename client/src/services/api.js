// API client service for Kisan Market frontend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

/**
 * Fetch all products with optional category and search filters
 */
export async function getProducts(category = '', search = '') {
  const params = new URLSearchParams();
  if (category && category !== 'All Categories' && category !== 'all') {
    params.append('category', category);
  }
  if (search && search.trim() !== '') {
    params.append('search', search.trim());
  }

  const queryString = params.toString() ? `?${params.toString()}` : '';
  const response = await fetch(`${API_BASE_URL}/api/products${queryString}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data || [];
}

/**
 * Fetch single product by ID
 */
export async function getProductById(id) {
  const response = await fetch(`${API_BASE_URL}/api/products/${id}`);

  if (!response.ok) {
    throw new Error(`Product not found (Status ${response.status})`);
  }

  const result = await response.json();
  return result.data;
}

/**
 * Create a new agricultural product listing
 */
export async function createProduct(productData) {
  const response = await fetch(`${API_BASE_URL}/api/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to create product listing');
  }

  return result.data;
}

/**
 * Update an existing product listing
 */
export async function updateProduct(id, productData) {
  const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to update product');
  }

  return result.data;
}

/**
 * Delete a product listing
 */
export async function deleteProduct(id) {
  const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
    method: 'DELETE',
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to delete product');
  }

  return result.data;
}

/**
 * Check backend API health
 */
export async function checkBackendHealth() {
  const response = await fetch(`${API_BASE_URL}/api/health`);
  return await response.json();
}
