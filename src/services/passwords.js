// src/services/passwords.js
import authFetch from './api';

export const generatePassword = (length = 16) => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset[array[i] % charset.length];
  }
  return password;
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