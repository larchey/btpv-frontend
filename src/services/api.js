// src/services/api.js
const API_BASE = '/api/v1';

const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token available');
  }

  // Properly format the Authorization header
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };

  try {
    const response = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers,
      credentials: 'include'  // Include credentials in the request
    });

    // Try to parse the response as JSON first
    let data;
    try {
      data = await response.json();
    } catch (e) {
      // If response is not JSON, return null for empty responses
      if (response.status === 204) {
        return null;
      }
      throw e;
    }

    // Handle non-200 responses
    if (!response.ok) {
      // Special handling for authentication errors
      if (response.status === 401) {
        localStorage.removeItem('token');
        throw new Error('Authentication failed. Please login again.');
      }
      throw new Error(data?.detail || response.statusText || 'Request failed');
    }

    return data;
  } catch (error) {
    // If it's already an Error object, rethrow it
    if (error instanceof Error) {
      throw error;
    }
    // Otherwise, wrap it in an Error
    throw new Error('An unexpected error occurred');
  }
};

export default authFetch;