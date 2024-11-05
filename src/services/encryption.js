import { Buffer } from 'buffer';

class EncryptionService {
  // Generate a random key for encryption
  static generateKey() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Buffer.from(array).toString('base64');
  }

  // Encrypt data using AES-GCM
  static async encrypt(plaintext, key) {
    try {
      // Convert base64 key to ArrayBuffer
      const keyBuffer = Buffer.from(key, 'base64');
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      // Import the key
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyBuffer,
        'AES-GCM',
        false,
        ['encrypt']
      );

      // Encrypt the data
      const encodedText = new TextEncoder().encode(plaintext);
      const encryptedData = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        cryptoKey,
        encodedText
      );

      // Combine IV and encrypted data and convert to base64
      const combined = new Uint8Array(iv.length + encryptedData.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encryptedData), iv.length);
      
      return Buffer.from(combined).toString('base64');
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  // Decrypt data using AES-GCM
  static async decrypt(encryptedData, key) {
    try {
      // Convert base64 data to ArrayBuffer
      const combined = Buffer.from(encryptedData, 'base64');
      const keyBuffer = Buffer.from(key, 'base64');
      
      // Extract IV and encrypted data
      const iv = combined.slice(0, 12);
      const data = combined.slice(12);

      // Import the key
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyBuffer,
        'AES-GCM',
        false,
        ['decrypt']
      );

      // Decrypt the data
      const decryptedData = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        cryptoKey,
        data
      );

      return new TextDecoder().decode(decryptedData);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }
}

export default EncryptionService;