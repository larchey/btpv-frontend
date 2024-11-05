import authFetch from './api';
import EncryptionService from './encryption';

export const createPassword = async (passwordData) => {
  try {
    // Generate a unique encryption key
    const encryptionKey = await EncryptionService.generateKey();
    
    // Encrypt the password
    const encryptedPassword = await EncryptionService.encrypt(
      passwordData.password,
      encryptionKey
    );

    // Create the password entry with encrypted data
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
    console.error('Failed to create password:', error);
    throw error;
  }
};

export const getGroupPasswords = async (groupId) => {
  try {
    const passwords = await authFetch(`/passwords/group/${groupId}`);
    // We don't decrypt passwords until they're needed
    return passwords;
  } catch (error) {
    console.error('Failed to fetch passwords:', error);
    throw error;
  }
};

export const getPassword = async (passwordId) => {
  try {
    const password = await authFetch(`/passwords/${passwordId}`);
    
    // Decrypt the password
    if (password.encrypted_password && password.encryption_key) {
      const decryptedPassword = await EncryptionService.decrypt(
        password.encrypted_password,
        password.encryption_key
      );
      return {
        ...password,
        decrypted_password: decryptedPassword
      };
    }
    
    return password;
  } catch (error) {
    console.error('Failed to fetch password:', error);
    throw error;
  }
};

export const generateSecurePassword = (length = 16) => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset[array[i] % charset.length];
  }
  return password;
};
