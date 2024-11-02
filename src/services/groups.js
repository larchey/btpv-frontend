import authFetch from './api';

export const getGroups = async () => {
  const response = await authFetch('/groups');
  if (!response.ok) throw new Error('Failed to fetch groups');
  return response.json();
};

export const createGroup = async (groupData) => {
  const response = await authFetch('/groups', {
    method: 'POST',
    body: JSON.stringify(groupData),
  });
  if (!response.ok) throw new Error('Failed to create group');
  return response.json();
};

export const addGroupMember = async (groupId, username) => {
  const response = await authFetch(`/groups/${groupId}/members/${username}`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to add member');
  return response.json();
};

export const removeGroupMember = async (groupId, username) => {
  const response = await authFetch(`/groups/${groupId}/members/${username}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to remove member');
  return response.json();
};