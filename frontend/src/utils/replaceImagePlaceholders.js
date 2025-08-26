// Utility function to replace image placeholders with actual server URLs
const SERVER_URL = 'http://localhost:5000';

/**
 * Replaces Moodle-style image placeholders with actual server URLs
 * @param {string} text - Text containing placeholders like @@SERVERFILE@@/path/to/image.jpg
 * @returns {string} - Text with placeholders replaced by actual URLs
 */
export function replaceImagePlaceholders(text) {
  if (!text || typeof text !== 'string') {
    return text || '';
  }

  // Replace @@SERVERFILE@@/path/to/image.ext with http://localhost:5000/path/to/image.ext
  return text.replace(/@@SERVERFILE@@\//g, `${SERVER_URL}/`);
}

/**
 * Converts real image URLs back to placeholders for storage
 * @param {string} text - Text containing real URLs
 * @returns {string} - Text with URLs replaced by placeholders
 */
export function createImagePlaceholders(text) {
  if (!text || typeof text !== 'string') {
    return text || '';
  }

  // Replace http://localhost:5000/path/to/image.ext with @@SERVERFILE@@/path/to/image.ext
  const serverUrlRegex = new RegExp(`${SERVER_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/`, 'g');
  return text.replace(serverUrlRegex, '@@SERVERFILE@@/');
}

/**
 * Extracts image filenames from text that contains image placeholders
 * @param {string} text - Text containing image placeholders
 * @returns {Array<string>} - Array of image filenames
 */
export function extractImageFilenames(text) {
  if (!text || typeof text !== 'string') {
    return [];
  }

  const placeholderRegex = /@@SERVERFILE@@\/([^"\s<>]+\.(jpg|jpeg|png|gif|webp|svg))/gi;
  const matches = text.matchAll(placeholderRegex);
  return Array.from(matches, match => match[1]);
}
