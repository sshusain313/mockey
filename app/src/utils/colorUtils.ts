/**
 * Color utility functions for the application
 */

/**
 * Converts a hex color string to RGB values
 * @param hex The hex color string (e.g., "#FFFFFF" or "#FFF")
 * @returns An object with r, g, b values or null if invalid
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Remove the hash if it exists
  hex = hex.replace(/^#/, '');

  // Handle shorthand hex (e.g., #FFF)
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  // Validate hex format
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return null;
  }

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  };
}

/**
 * Determines if a color is light or dark based on its luminance
 * @param hexColor The hex color string
 * @returns true if the color is light, false if dark
 */
export function isLightColor(hexColor: string): boolean {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return true;
  
  // Calculate relative luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5;
}

/**
 * Converts RGB values to a hex color string
 * @param r Red value (0-255)
 * @param g Green value (0-255)
 * @param b Blue value (0-255)
 * @returns Hex color string with leading #
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b]
    .map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('');
}

/**
 * Adjusts the brightness of a color
 * @param hexColor The hex color string
 * @param factor Factor to adjust brightness (0-2, where 1 is no change)
 * @returns Adjusted hex color
 */
export function adjustBrightness(hexColor: string, factor: number): string {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return hexColor;
  
  return rgbToHex(
    Math.min(255, Math.max(0, Math.round(rgb.r * factor))),
    Math.min(255, Math.max(0, Math.round(rgb.g * factor))),
    Math.min(255, Math.max(0, Math.round(rgb.b * factor)))
  );
}
