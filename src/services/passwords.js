// src/services/passwords.js
import authFetch from './api';

export const getGroupPasswords = async (groupId) => {
  try {
    return await authFetch(`/passwords/group/${groupId}`);
  } catch (error) {
    console.error('Failed to fetch passwords:', error);
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

export const generatePassword = async (length = 16) => {
  try {
    const response = await authFetch(`/passwords/generate?length=${length}`);
    return response.password;
  } catch (error) {
    console.error('Failed to generate password:', error);
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