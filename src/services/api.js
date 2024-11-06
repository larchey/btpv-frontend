// src/services/api.js
import { logout, getAuthHeader } from './auth';

const API_BASE = '/api/v1';

const authFetch = async (url, options = {}) => {
  const authHeader = getAuthHeader();
  
  if (!authHeader) {
    throw new Error('Authentication required');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': authHeader,
    ...options.headers
  };

  try {
    const fullUrl = `${API_BASE}${url}`;
    const response = await fetch(fullUrl, {
      ...options,
      headers
    });

    // For 204 No Content responses
    if (response.status === 204) {
      return null;
    }

    // Try to parse JSON response
    let data;
    try {
      data = await response.json();
    } catch (e) {
      if (!response.ok) {
        throw new Error('Request failed');
      }
      return null;
    }

    // Handle errors
    if (!response.ok) {
      if (response.status === 401) {
        logout();
      }
      throw new Error(data.detail || 'Request failed');
    }

    return data;
  } catch (error) {
    if (error.message === 'Authentication required' || 
        error.message.includes('unauthorized') || 
        error.message.includes('invalid token')) {
      logout();
    }
    throw error;
  }
};

export default authFetch;