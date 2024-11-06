// src/services/api.js
const API_BASE = 'http://localhost:8000/api/v1';

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
    console.log('Calling API:', `${API_BASE}${url}`);
    const response = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers,
    });

    console.log('API Response:', response.status, response.statusText);

    let data;
    try {
      data = await response.json();
    } catch (e) {
      if (response.status === 204) {
        return null;
      }
      throw e;
    }

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.reload();
      }
      throw new Error(data.detail || JSON.stringify(data));
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export default authFetch;