// Frontend/src/utils/api.js
// Resolves the backend API base URL automatically based on the runtime environment

export const getApiBase = () => {
  if (typeof window !== 'undefined') {
    const { hostname } = window.location;
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.')
    ) {
      return 'http://localhost:5000/api';
    }
  }
  return import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
};

export const API_BASE = getApiBase();
export default API_BASE;
