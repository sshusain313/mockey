/**
 * Utility functions for color analysis and manipulation
 */

/**
 * Determines if a color is light or dark
 * @param hexColor - Hex color string (e.g., "#FF0000")
 * @returns true if the color is light, false if it's dark
 */
export function isLightColor(hexColor: string): boolean {
  // Remove # if present
  const hex = hexColor.replace(/^#/, '');
  
  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate perceived brightness using the YIQ formula
  // This formula takes into account human perception of different colors
  // Y = 0.299R + 0.587G + 0.114B
  const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
  
  // Return true if the color is light (brightness > 0.5)
  return brightness > 0.5;
}

/**
 * Gets the appropriate opacity for a design based on background color
 * @param hexColor - Hex color string of the background
 * @returns opacity value between 0 and 1
 */
export function getDesignOpacity(hexColor: string): number {
  // Always return 1 regardless of background color
  return 1;
}

/**
 * Gets the dominant color from an image URL
 * @param imageUrl - URL of the image to analyze
 * @returns Promise that resolves to the dominant color as a hex string
 */
export async function getDominantColor(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      // Create canvas to analyze the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the image to the canvas
      ctx.drawImage(img, 0, 0);
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Calculate the average color
      let r = 0, g = 0, b = 0;
      let pixelCount = 0;
      
      // Sample pixels (every 10th pixel for performance)
      for (let i = 0; i < data.length; i += 40) {
        const alpha = data[i + 3];
        
        // Only consider non-transparent pixels
        if (alpha > 128) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          pixelCount++;
        }
      }
      
      // Calculate average
      if (pixelCount > 0) {
        r = Math.round(r / pixelCount);
        g = Math.round(g / pixelCount);
        b = Math.round(b / pixelCount);
        
        // Convert to hex
        const hex = '#' + 
          ((1 << 24) + (r << 16) + (g << 8) + b)
            .toString(16)
            .slice(1)
            .toUpperCase();
        
        resolve(hex);
      } else {
        // Fallback to a neutral color if no valid pixels found
        resolve('#888888');
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageUrl;
  });
}
