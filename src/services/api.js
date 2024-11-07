// src/services/api.js
const API_BASE = '/api/v1';  // Remove hardcoded URL

const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token available');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };

  try {
    const response = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers
    });

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.reload();
          throw new Error('Session expired. Please login again.');
        }
        
        // Handle validation errors (422)
        if (response.status === 422 && data.detail) {
          throw new Error(Array.isArray(data.detail) 
            ? data.detail.map(err => err.msg).join(', ')
            : data.detail
          );
        }
        
        throw new Error(data.detail || 'Request failed');
      }
      
      return data;
    }

    // Handle non-JSON success responses
    if (response.ok) {
      return null;
    }

    throw new Error('Invalid response format');
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export default authFetch;