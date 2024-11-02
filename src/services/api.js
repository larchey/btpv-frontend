// Base API configuration
const API_BASE = '/api/v1';

const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  return fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

export default authFetch;