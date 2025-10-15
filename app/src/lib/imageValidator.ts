/**
 * Utility functions for validating image files
 */

/**
 * Validates if a base64 image string is a PNG image
 * @param base64String The base64 string to validate
 * @returns An object with validation result and error message if any
 */
export function validateBase64Image(base64String: string): { isValid: boolean; error?: string } {
  try {
    // Check if it's a valid base64 string
    if (!base64String || typeof base64String !== 'string') {
      return { isValid: false, error: 'Invalid image data' };
    }

    // Extract the MIME type from the base64 string
    const mimeTypeMatch = base64String.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
    
    if (!mimeTypeMatch) {
      return { isValid: false, error: 'Invalid image format' };
    }

    const mimeType = mimeTypeMatch[1];
    
    // Check if the MIME type is PNG
    if (mimeType !== 'image/png') {
      return { isValid: false, error: 'Only PNG images are allowed' };
    }

    return { isValid: true };
  } catch (error) {
    console.error('Error validating image:', error);
    return { isValid: false, error: 'Error validating image' };
  }
}

/**
 * Validates if a file is a PNG image based on its MIME type
 * @param file The file to validate
 * @returns An object with validation result and error message if any
 */
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  try {
    // Check if it's a valid file
    if (!file) {
      return { isValid: false, error: 'No file provided' };
    }

    // Check if the MIME type is PNG
    if (file.type !== 'image/png') {
      return { isValid: false, error: 'Only PNG images are allowed' };
    }

    // Check file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return { isValid: false, error: 'File size should be less than 10MB' };
    }

    return { isValid: true };
  } catch (error) {
    console.error('Error validating image file:', error);
    return { isValid: false, error: 'Error validating image file' };
  }
}

/**
 * Extracts the MIME type from a base64 string
 * @param base64String The base64 string
 * @returns The MIME type or null if not found
 */
export function getMimeTypeFromBase64(base64String: string): string | null {
  try {
    const mimeTypeMatch = base64String.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
    return mimeTypeMatch ? mimeTypeMatch[1] : null;
  } catch (error) {
    console.error('Error extracting MIME type:', error);
    return null;
  }
}