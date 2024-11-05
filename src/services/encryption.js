export class EncryptionService {
    // Convert string to buffer
    static async stringToBuffer(str) {
      const encoder = new TextEncoder();
      return encoder.encode(str);
    }
  
    // Convert buffer to string
    static async bufferToString(buffer) {
      const decoder = new TextDecoder();
      return decoder.decode(buffer);
    }
  
    // Convert buffer to base64
    static async bufferToBase64(buffer) {
      const binStr = String.fromCharCode(...new Uint8Array(buffer));
      return btoa(binStr);
    }
  
    // Convert base64 to buffer
    static async base64ToBuffer(base64) {
      const binStr = atob(base64);
      return Uint8Array.from(binStr, (c) => c.charCodeAt(0));
    }
  
    // Generate a random encryption key
    static async generateKey() {
      const key = await window.crypto.subtle.generateKey(
        {
          name: "AES-GCM",
          length: 256
        },
        true,
        ["encrypt", "decrypt"]
      );
      
      const exportedKey = await window.crypto.subtle.exportKey("raw", key);
      return await this.bufferToBase64(exportedKey);
    }
  
    // Import a key from base64
    static async importKey(base64Key) {
      const keyBuffer = await this.base64ToBuffer(base64Key);
      return await window.crypto.subtle.importKey(
        "raw",
        keyBuffer,
        {
          name: "AES-GCM",
          length: 256
        },
        true,
        ["encrypt", "decrypt"]
      );
    }
  
    // Encrypt data
    static async encrypt(plaintext, base64Key) {
      try {
        const key = await this.importKey(base64Key);
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const data = await this.stringToBuffer(plaintext);
  
        const encrypted = await window.crypto.subtle.encrypt(
          {
            name: "AES-GCM",
            iv: iv
          },
          key,
          data
        );
  
        // Combine IV and encrypted data
        const combined = new Uint8Array(iv.byteLength + encrypted.byteLength);
        combined.set(new Uint8Array(iv), 0);
        combined.set(new Uint8Array(encrypted), iv.byteLength);
  
        return await this.bufferToBase64(combined);
      } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt data');
      }
    }
  
    // Decrypt data
    static async decrypt(encryptedData, base64Key) {
      try {
        const key = await this.importKey(base64Key);
        const combined = await this.base64ToBuffer(encryptedData);
        
        // Split IV and encrypted data
        const iv = combined.slice(0, 12);
        const data = combined.slice(12);
  
        const decrypted = await window.crypto.subtle.decrypt(
          {
            name: "AES-GCM",
            iv: iv
          },
          key,
          data
        );
  
        return await this.bufferToString(decrypted);
      } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt data');
      }
    }
  }
  
  export default EncryptionService;