import authFetch from './api';

export const getGroupPasswords = async (groupId) => {
  const response = await authFetch(`/passwords/group/${groupId}`);
  if (!response.ok) throw new Error('Failed to fetch passwords');
  return response.json();
};

export const createPassword = async (passwordData) => {
  const response = await authFetch('/passwords', {
    method: 'POST',
    body: JSON.stringify(passwordData),
  });
  if (!response.ok) throw new Error('Failed to create password');
  return response.json();
};

export const generatePassword = async (length = 16) => {
  const response = await authFetch(`/passwords/generate?length=${length}`);
  if (!response.ok) throw new Error('Failed to generate password');
  return response.json();
};