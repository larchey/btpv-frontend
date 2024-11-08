// src/services/groups.js
import authFetch from './api';

export const getGroups = async () => {
  try {
    return await authFetch('/groups');
  } catch (error) {
    console.error('Failed to fetch groups:', error);
    throw error;
  }
};

export const createGroup = async (groupData) => {
  try {
    return await authFetch('/groups', {
      method: 'POST',
      body: JSON.stringify(groupData)
    });
  } catch (error) {
    console.error('Failed to create group:', error);
    throw error;
  }
};

export const addGroupMember = async (groupId, username) => {
  try {
    return await authFetch(`/groups/${groupId}/members/${username}`, {
      method: 'POST'
    });
  } catch (error) {
    console.error('Failed to add member:', error);
    throw error;
  }
};

export const removeGroupMember = async (groupId, username) => {
  try {
    return await authFetch(`/groups/${groupId}/members/${username}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Failed to remove member:', error);
    throw error;
  }
};

export const getAvailableUsers = async (groupId) => {
  try {
    return await authFetch(`/groups/${groupId}/available-users`);
  } catch (error) {
    console.error('Failed to fetch available users:', error);
    throw error;
  }
};

export const deleteGroup = async (groupId) => {
  try {
    await authFetch(`/groups/${groupId}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Failed to delete group:', error);
    throw error;
  }
};