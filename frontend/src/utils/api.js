// API utility for making authenticated requests
const API_BASE_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Create headers with authentication
const getAuthHeaders = () => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

// Generic API call function
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: getAuthHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      // Handle authentication errors
      if (response.status === 401) {
        // Token expired or invalid, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }
      
      throw new Error(data.message || `API call failed: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error);
    throw error;
  }
};

// GET request
export const apiGet = (endpoint) => {
  return apiCall(endpoint, { method: 'GET' });
};

// POST request
export const apiPost = (endpoint, data) => {
  return apiCall(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// PUT request
export const apiPut = (endpoint, data) => {
  return apiCall(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// DELETE request
export const apiDelete = (endpoint) => {
  return apiCall(endpoint, { method: 'DELETE' });
};

export default {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
  call: apiCall
};
