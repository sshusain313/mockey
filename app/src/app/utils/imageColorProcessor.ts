/**
 * Utility functions for processing image colors
 */

// Map of color IDs to their RGB values
const colorMap: Record<string, number[]> = {
  red: [255, 0, 0],
  green: [0, 255, 0],
  blue: [0, 0, 255],
  yellow: [255, 255, 0],
  purple: [128, 0, 128],
  black: [0, 0, 0],
  white: [255, 255, 255],
  orange: [255, 165, 0],
  pink: [255, 192, 203],
  gray: [128, 128, 128],
};

/**
 * Process an image to apply selected colors
 * @param imageUrl - URL or data URL of the image to process
 * @param selectedColors - Array of color hex values to apply to the image
 * @returns Promise that resolves to a data URL of the processed image
 */
export async function processImageColors(
  imageUrl: string,
  selectedColors: string[]
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If no colors selected, return original image
    if (selectedColors.length === 0) {
      resolve(imageUrl);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous'; // Handle CORS issues
    
    img.onload = () => {
      // Create canvas to process the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the original image to the canvas
      ctx.drawImage(img, 0, 0);
      
      // Get image data for processing
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Convert hex colors to RGB arrays
      const rgbColors = selectedColors.map(hexToRgb);
      
      // If we have only one color, apply it to the entire product
      if (rgbColors.length === 1) {
        const [targetR, targetG, targetB] = rgbColors[0];
        
        // Process each pixel
        for (let i = 0; i < data.length; i += 4) {
          const a = data[i + 3];
          
          // Skip fully transparent pixels
          if (a === 0) continue;
          
          // For non-transparent pixels, we'll apply the color but preserve shading
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Calculate grayscale value to preserve shading
          const grayscale = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
          
          // Apply the color while preserving shading
          data[i] = Math.round(targetR * grayscale);
          data[i + 1] = Math.round(targetG * grayscale);
          data[i + 2] = Math.round(targetB * grayscale);
        }
      } else {
        // For multiple colors, we'll distribute them based on brightness
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          
          // Skip fully transparent pixels
          if (a === 0) continue;
          
          // Apply color transformation based on selected colors
          if (rgbColors.length > 0) {
            // Calculate grayscale for better color distribution
            const grayscale = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
            
            // Choose a color based on the pixel's brightness
            const colorIndex = Math.floor(grayscale * rgbColors.length);
            const selectedColor = rgbColors[Math.min(colorIndex, rgbColors.length - 1)];
            
            if (selectedColor) {
              // Apply the selected color while preserving shading
              const [targetR, targetG, targetB] = selectedColor;
              
              data[i] = Math.round(targetR * grayscale);
              data[i + 1] = Math.round(targetG * grayscale);
              data[i + 2] = Math.round(targetB * grayscale);
            }
          }
        }
      }
      
      // Put the processed image data back on the canvas
      ctx.putImageData(imageData, 0, 0);
      
      // Convert canvas to data URL
      const processedDataUrl = canvas.toDataURL('image/png');
      resolve(processedDataUrl);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageUrl;
  });
}

/**
 * Convert hex color string to RGB array
 * @param hex - Hex color string (e.g., "#FF0000")
 * @returns RGB array [r, g, b]
 */
function hexToRgb(hex: string): number[] {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse hex values
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  
  return [r, g, b];
}
