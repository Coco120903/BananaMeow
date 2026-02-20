export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Normalizes image URLs to ensure they work across different environments.
 * Handles:
 * - Full URLs (http://localhost:5000/uploads/...) -> converts to relative and adds API_BASE
 * - Relative paths (/uploads/...) -> adds API_BASE
 * - Already complete URLs (http://...) -> returns as-is
 * 
 * @param {string} url - The image URL from the database
 * @returns {string|null} - The normalized URL, or null if url is falsy
 */
export function getImageUrl(url) {
  if (!url) return null;
  
  // If it's already a complete URL (starts with http:// or https://), return as-is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    // Extract relative path from full URL and reconstruct with API_BASE
    try {
      const urlObj = new URL(url);
      const relativePath = urlObj.pathname;
      return `${API_BASE}${relativePath}`;
    } catch {
      // If URL parsing fails, try to extract path manually
      const match = url.match(/\/uploads\/[^/]+\/[^/]+$/);
      if (match) {
        return `${API_BASE}${match[0]}`;
      }
      // Fallback: return as-is if we can't parse it
      return url;
    }
  }
  
  // If it's a relative path (starts with /), add API_BASE
  if (url.startsWith("/")) {
    return `${API_BASE}${url}`;
  }
  
  // If it doesn't start with /, assume it's a relative path and add /
  return `${API_BASE}/${url}`;
}
