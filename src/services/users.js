// src/services/users.js
import authFetch from './api';

export const getCurrentUser = async () => {
  try {
    return await authFetch('/users/me');
  } catch (error) {
    console.error('Failed to get current user:', error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    return await authFetch('/users');
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    return await authFetch('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
};
export const updateUser = async (userId, userData) => {
  try {
    return await authFetch(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  } catch (error) {
    console.error('Failed to update user:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    await authFetch(`/users/${userId}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Failed to delete user:', error);
    throw error;
  }
};