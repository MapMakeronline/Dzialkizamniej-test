import { StateStorage } from 'zustand/middleware';

const MAX_STORAGE_SIZE = 2 * 1024 * 1024; // 2MB

export const createStorageMiddleware = (): StateStorage => ({
  getItem: (name: string): string | null => {
    try {
      const value = localStorage.getItem(name);
      if (!value) return null;
      
      const data = JSON.parse(value);
      return JSON.stringify(data);
    } catch (error) {
      console.warn('Error reading from storage:', error);
      return null;
    }
  },
  
  setItem: (name: string, value: string): void => {
    try {
      if (value.length > MAX_STORAGE_SIZE) {
        throw new Error('Storage quota would be exceeded');
      }
      localStorage.setItem(name, value);
    } catch (error) {
      console.warn('Error writing to storage:', error);
      // Clear storage if quota exceeded
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        localStorage.clear();
      }
    }
  },
  
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.warn('Error removing from storage:', error);
    }
  }
});