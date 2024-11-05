import authFetch from './api';
import EncryptionService from './encryption';

export const createPassword = async (passwordData) => {
  try {
    // Generate a unique encryption key for this password
    const encryptionKey = EncryptionService.generateKey();
    
    // Encrypt the password before sending
    const encryptedPassword = await EncryptionService.encrypt(
      passwordData.password,
      encryptionKey
    );

    // Send encrypted password and key separately
    const response = await authFetch('/passwords', {
      method: 'POST',
      body: JSON.stringify({
        ...passwordData,
        password: encryptedPassword,
        encryption_key: encryptionKey
      }),
    });

    return response;
  } catch (error) {
    console.error('Error creating password:', error);
    throw error;
  }
};

export const getPassword = async (passwordId) => {
  try {
    const response = await authFetch(`/passwords/${passwordId}`);
    
    // Decrypt the password using the stored encryption key
    if (response.encrypted_password && response.encryption_key) {
      const decryptedPassword = await EncryptionService.decrypt(
        response.encrypted_password,
        response.encryption_key
      );
      return {
        ...response,
        password: decryptedPassword
      };
    }
    
    return response;
  } catch (error) {
    console.error('Error retrieving password:', error);
    throw error;
  }
};

export const getGroupPasswords = async (groupId) => {
  const response = await authFetch(`/passwords/group/${groupId}`);
  if (!response.ok) throw new Error('Failed to fetch passwords');
  return response.json();
};


export const generatePassword = async (length = 16) => {
  const response = await authFetch(`/passwords/generate?length=${length}`);
  if (!response.ok) throw new Error('Failed to generate password');
  return response.json();
};