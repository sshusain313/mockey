/**
 * Utility functions for applying colors to t-shirt images
 */
import { hexToRgb, isLightColor } from './colorUtils';

/**
 * Apply a color to a t-shirt image while preserving details and texture
 * @param imageUrl URL of the t-shirt image
 * @param color Hex color to apply
 * @returns Promise that resolves to a data URL of the colored t-shirt
 */
export function applyColorToTshirt(
  imageUrl: string,
  color: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Skip processing if color is white (default)
    if (color === '#FFFFFF') {
      resolve(imageUrl);
      return;
    }
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // Create canvas for processing
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(imageUrl); // Return original if canvas not supported
        return;
      }
      
      // Draw the original image
      ctx.drawImage(img, 0, 0);
      
      // Get image data for processing
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Convert hex color to RGB
      const rgb = hexToRgb(color);
      if (!rgb) {
        resolve(imageUrl);
        return;
      }
      
      // Detect if color is light or dark
      const isLight = isLightColor(color);
      
      // Process each pixel
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        
        // Skip transparent pixels
        if (a < 50) continue;
        
        // Calculate grayscale value to detect if this is part of the t-shirt
        const grayscale = (r + g + b) / 3;
        
        // Only modify pixels that are likely part of the t-shirt
        // This heuristic looks for mid-range grayscale values which are typically the shirt body
        if (grayscale > 50 && grayscale < 240) {
          // Calculate luminance to preserve shading
          const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          
          // Apply color while preserving shading
          if (isLight) {
            // For light colors, use multiply-like effect
            data[i] = Math.round(rgb.r * luminance);
            data[i + 1] = Math.round(rgb.g * luminance);
            data[i + 2] = Math.round(rgb.b * luminance);
          } else {
            // For dark colors, use screen-like effect to preserve highlights
            data[i] = Math.round(rgb.r * (0.5 + 0.5 * luminance));
            data[i + 1] = Math.round(rgb.g * (0.5 + 0.5 * luminance));
            data[i + 2] = Math.round(rgb.b * (0.5 + 0.5 * luminance));
          }
        }
      }
      
      // Put processed image data back on canvas
      ctx.putImageData(imageData, 0, 0);
      
      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/png');
      resolve(dataUrl);
    };
    
    img.onerror = () => {
      console.error('Error loading image for coloring');
      resolve(imageUrl); // Return original on error
    };
    
    img.src = imageUrl;
  });
}

/**
 * Create a cache key for storing colored images
 * @param imageUrl Original image URL
 * @param color Hex color
 * @returns Cache key string
 */
export function createColorCacheKey(imageUrl: string, color: string): string {
  // Create a simple hash of the URL to keep the key short
  let hash = 0;
  for (let i = 0; i < imageUrl.length; i++) {
    hash = ((hash << 5) - hash) + imageUrl.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return `color_${hash}_${color.replace('#', '')}`;
}
