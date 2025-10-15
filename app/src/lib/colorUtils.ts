/**
 * Utility functions for working with colors
 */

// Predefined colors mapping
export const predefinedColors = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
  { name: "Red", value: "#FF0000" },
  { name: "Green", value: "#008000" },
  { name: "Blue", value: "#0000FF" },
  { name: "Yellow", value: "#FFFF00" },
  { name: "Purple", value: "#800080" },
  { name: "Orange", value: "#FFA500" },
  { name: "Pink", value: "#FFC0CB" },
  { name: "Gray", value: "#808080" },
  { name: "Brown", value: "#A52A2A" },
  { name: "Navy Blue", value: "#000080" },
  { name: "Teal", value: "#008080" },
  { name: "Olive", value: "#808000" },
  { name: "Maroon", value: "#800000" }
];

// Color map for quick lookups
export const colorMap: Record<string, string> = {
  "Black": "#000000",
  "White": "#FFFFFF",
  "Red": "#FF0000",
  "Green": "#008000",
  "Blue": "#0000FF",
  "Yellow": "#FFFF00",
  "Purple": "#800080",
  "Orange": "#FFA500",
  "Pink": "#FFC0CB",
  "Gray": "#808080",
  "Brown": "#A52A2A",
  "Navy Blue": "#000080",
  "Teal": "#008080",
  "Olive": "#808000",
  "Maroon": "#800000"
};

/**
 * Get the hex color value from a color name
 * @param colorName The name of the color
 * @returns The hex color value or a default gray if not found
 */
export function getColorValue(colorName: string): string {
  return colorMap[colorName] || "#CCCCCC"; // Default to gray if not found
}

/**
 * Apply a color overlay to an image
 * @param image The HTML image element
 * @param color The color to apply (hex format)
 * @returns A Promise that resolves to a data URL of the colored image
 */
export function applyColorToImage(
  image: HTMLImageElement,
  color: string
): Promise<string> {
  return new Promise((resolve) => {
    console.log('applyColorToImage: Starting color application', { color, imageWidth: image.width, imageHeight: image.height });
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.warn('applyColorToImage: Canvas context not available, returning original image');
      resolve(image.src); // Return original image if canvas context is not available
      return;
    }
    
    // Set canvas dimensions to match the image
    canvas.width = image.width;
    canvas.height = image.height;
    
    // Draw the original image
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    console.log('applyColorToImage: Original image drawn to canvas');
    
    // Apply color overlay using "multiply" blend mode
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    console.log('applyColorToImage: Color overlay applied with multiply blend mode');
    
    // Preserve the alpha channel of the original image
    ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    console.log('applyColorToImage: Alpha channel preserved');
    
    // Convert canvas to data URL
    const dataUrl = canvas.toDataURL('image/png');
    console.log('applyColorToImage: Canvas converted to data URL');
    
    resolve(dataUrl);
  });
}

/**
 * Generate colored variants of a product image
 * @param productImage The URL of the product image
 * @param colors Array of color names
 * @returns A Promise that resolves to a record of color names to colored image URLs
 */
export async function generateColorVariants(
  productImage: string,
  colors: string[]
): Promise<Record<string, string>> {
  return new Promise((resolve, reject) => {
    if (!productImage || colors.length === 0) {
      console.log('generateColorVariants: No product image or colors', { productImage, colors });
      resolve({});
      return;
    }
    
    console.log('generateColorVariants: Loading image', productImage);
    
    // Load the original image
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Enable CORS for the image
    
    img.onload = async () => {
      console.log('generateColorVariants: Image loaded successfully', { width: img.width, height: img.height });
      const colorVariants: Record<string, string> = {};
      
      try {
        // Generate a colored variant for each color
        for (const color of colors) {
          console.log(`generateColorVariants: Processing color "${color}"`);
          const colorValue = getColorValue(color);
          console.log(`generateColorVariants: Color value for "${color}" is "${colorValue}"`);
          const coloredImageUrl = await applyColorToImage(img, colorValue);
          colorVariants[color] = coloredImageUrl;
        }
        
        console.log('generateColorVariants: All color variants generated', Object.keys(colorVariants));
        resolve(colorVariants);
      } catch (error) {
        console.error('Error generating color variants:', error);
        reject(error);
      }
    };
    
    img.onerror = (error) => {
      console.error('Failed to load image:', productImage, error);
      reject(new Error('Failed to load image'));
    };
    
    img.src = productImage;
  });
}