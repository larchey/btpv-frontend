// src/services/passwords.js
import authFetch from './api';

export const generatePassword = async () => {
  try {
    const response = await authFetch('/passwords/generate');  // Changed to GET request
    return response;
  } catch (error) {
    console.error('Failed to generate password:', error);
    throw error;
  }
};


export const createPassword = async (passwordData) => {
  try {
    return await authFetch('/passwords', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  } catch (error) {
    console.error('Failed to create password:', error);
    throw error;
  }
};

export const getGroupPasswords = async (groupId) => {
  try {
    return await authFetch(`/passwords/group/${groupId}`);
  } catch (error) {
    console.error('Failed to fetch passwords:', error);
    throw error;
  }
};
export const updatePassword = async (passwordId, passwordData) => {
  try {
    return await authFetch(`/passwords/${passwordId}`, {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  } catch (error) {
    console.error('Failed to update password:', error);
    throw error;
  }
};

export const deletePassword = async (passwordId) => {
  try {
    return await authFetch(`/passwords/${passwordId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Failed to delete password:', error);
    throw error;
  }
};