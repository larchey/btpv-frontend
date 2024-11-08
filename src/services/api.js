// src/services/api.js
const API_BASE = 'http://localhost:8000/api/v1';  

const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // handleLogout();
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

    // Handle non-200 responses first
    if (!response.ok) {
      let errorMessage = 'Request failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch {
        // If we can't parse the error as JSON, use the status text
        errorMessage = response.statusText;
      }
      throw new Error(errorMessage);
    }

    // Handle successful responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    // For non-JSON responses (like 204 No Content)
    return null;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
export default authFetch;