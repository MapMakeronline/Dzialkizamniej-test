/**
 * Cleans a string by:
 * - Removing control characters
 * - Converting special characters to their basic form
 * - Removing multiple spaces
 * - Trimming whitespace
 */
export function cleanString(str: string): string {
  if (!str) return '';
  
  return str
    // Remove control characters
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
    // Convert special characters
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    // Replace multiple spaces with single space
    .replace(/\s+/g, ' ')
    // Trim whitespace
    .trim();
}