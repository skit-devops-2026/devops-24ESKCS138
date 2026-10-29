// API client service for Kisan Market frontend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Helper for auth headers
const getAuthHeaders = (token) => {
  const headers = { 'Content-Type': 'application/json' };
  const authToken = token || localStorage.getItem('kisan_token');
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

// ================= PRODUCT APIS =================

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
export async function createProduct(productData, token) {
  const response = await fetch(`${API_BASE_URL}/api/products`, {
    method: 'POST',
    headers: getAuthHeaders(token),
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
export async function updateProduct(id, productData, token) {
  const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
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
export async function deleteProduct(id, token) {
  const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to delete product');
  }

  return result.data;
}

// ================= AUTHENTICATION APIS =================

/**
 * Register a new Farmer or Buyer
 */
export async function registerUser(userData) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Registration failed');
  }

  return result;
}

/**
 * Login user and obtain JWT token
 */
export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Invalid credentials');
  }

  return result;
}

/**
 * Get profile of currently logged-in user
 */
export async function getCurrentUser(token) {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error('Session expired, please log in again');
  }

  const result = await response.json();
  return result.user;
}

// ================= ORDER APIS =================

/**
 * Submit an order (buyer checkout)
 */
export async function createOrder(orderData, token) {
  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(orderData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to place order');
  }

  return result.data;
}

/**
 * Get buyer's order history
 */
export async function getMyOrders(token) {
  const response = await fetch(`${API_BASE_URL}/api/orders/my-orders`, {
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }

  const result = await response.json();
  return result.data || [];
}

/**
 * Get incoming orders for farmer
 */
export async function getFarmerOrders(token) {
  const response = await fetch(`${API_BASE_URL}/api/orders/farmer-orders`, {
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch farmer orders');
  }

  const result = await response.json();
  return result.data || [];
}

/**
 * Farmer updates order fulfillment status
 */
export async function updateOrderStatus(orderId, status, token) {
  const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ status }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to update order status');
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
