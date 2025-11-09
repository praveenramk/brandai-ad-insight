/**
 * Global configuration constants
 */
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Then use it in your fetch calls like:
const response = await fetch(`${API_URL}/critique`, {
  // ...rest of fetch options
});