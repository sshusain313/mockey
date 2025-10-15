/**
 * Design Positioning Utility
 * 
 * This utility provides functions to calculate and maintain consistent design positioning
 * between different components (TShirtGallery and Editor) regardless of canvas size.
 * Ensures admin-configured placeholder coordinates are applied exactly and consistently.
 */

// Reference canvas size used for standardization (admin canvas size)
export const REFERENCE_CANVAS_WIDTH = 400;
export const REFERENCE_CANVAS_HEIGHT = 400;

// Types for design positioning
export interface DesignDimensions {
  width: number;
  height: number;
}

export interface PlaceholderRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PercentagePlaceholder {
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
}

export interface DesignPositioning {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  maintainAspectRatio: boolean;
}

/**
 * Converts absolute pixel coordinates to percentage-based coordinates
 * This ensures consistent positioning across different canvas sizes
 */
export const convertToPercentage = (placeholder: PlaceholderRect): PercentagePlaceholder => {
  return {
    xPercent: (placeholder.x / REFERENCE_CANVAS_WIDTH) * 100,
    yPercent: (placeholder.y / REFERENCE_CANVAS_HEIGHT) * 100,
    widthPercent: (placeholder.width / REFERENCE_CANVAS_WIDTH) * 100,
    heightPercent: (placeholder.height / REFERENCE_CANVAS_HEIGHT) * 100
  };
};

/**
 * Converts percentage-based coordinates back to absolute pixel coordinates
 * for a specific canvas size
 */
export const convertFromPercentage = (
  percentagePlaceholder: PercentagePlaceholder,
  canvasWidth: number,
  canvasHeight: number
): PlaceholderRect => {
  return {
    x: (percentagePlaceholder.xPercent / 100) * canvasWidth,
    y: (percentagePlaceholder.yPercent / 100) * canvasHeight,
    width: (percentagePlaceholder.widthPercent / 100) * canvasWidth,
    height: (percentagePlaceholder.heightPercent / 100) * canvasHeight
  };
};

/**
 * Calculates design positioning based on design dimensions, placeholder, and container size
 * Uses percentage-based calculations for consistency across different canvas sizes
 * This is the main function that ensures consistent positioning across all components
 */
export const calculateDesignPositioning = (
  designDimensions: DesignDimensions,
  placeholder: PlaceholderRect,
  containerWidth: number,
  containerHeight: number,
  maintainAspectRatio: boolean = true,
  storedPositioning?: PercentagePlaceholder | null
): DesignPositioning => {
  // Use stored percentage-based coordinates if available, otherwise convert from placeholder
  const percentagePlaceholder = storedPositioning || convertToPercentage(placeholder);
  
  // Log the percentage-based coordinates being used
  console.log('Using percentage-based coordinates:', percentagePlaceholder);
  
  // Convert back to absolute coordinates based on the current container size
  const scaledPlaceholder = convertFromPercentage(
    percentagePlaceholder,
    containerWidth,
    containerHeight
  );
  
  // Calculate aspect ratios
  const designAspectRatio = designDimensions.width / designDimensions.height;
  const placeholderAspectRatio = scaledPlaceholder.width / scaledPlaceholder.height;
  
  // Log the aspect ratios for debugging
  console.log('Design aspect ratio:', designAspectRatio);
  console.log('Placeholder aspect ratio:', placeholderAspectRatio);
  console.log('Scaled placeholder:', scaledPlaceholder);
  
  let finalWidth, finalHeight, scale;
  
  if (maintainAspectRatio) {
    // Determine how to scale the design to fit the placeholder while maintaining aspect ratio
    if (designAspectRatio > placeholderAspectRatio) {
      // Design is wider than placeholder (relative to height)
      finalWidth = scaledPlaceholder.width;
      finalHeight = finalWidth / designAspectRatio;
      scale = finalWidth / designDimensions.width;
    } else {
      // Design is taller than placeholder (relative to width)
      finalHeight = scaledPlaceholder.height;
      finalWidth = finalHeight * designAspectRatio;
      scale = finalHeight / designDimensions.height;
    }
    
    // Center the design within the placeholder
    const x = scaledPlaceholder.x + (scaledPlaceholder.width - finalWidth) / 2;
    const y = scaledPlaceholder.y + (scaledPlaceholder.height - finalHeight) / 2;
    
    return {
      x,
      y,
      width: finalWidth,
      height: finalHeight,
      scale,
      maintainAspectRatio
    };
  } else {
    // If not maintaining aspect ratio, use exact placeholder dimensions
    return {
      x: scaledPlaceholder.x,
      y: scaledPlaceholder.y,
      width: scaledPlaceholder.width,
      height: scaledPlaceholder.height,
      scale: scaledPlaceholder.width / designDimensions.width,
      maintainAspectRatio
    };
  }
};

/**
 * Enhanced function to get consistent placeholder data for any component
 * This ensures the admin-configured coordinates are used exactly
 */
export const getConsistentPlaceholderData = (
  placeholder: PlaceholderRect | undefined,
  containerWidth: number = 400,
  containerHeight: number = 400
): PlaceholderRect => {
  if (!placeholder) {
    // Default fallback
    return {
      x: 150,
      y: 150,
      width: 100,
      height: 100
    };
  }

  // Check if placeholder already has percentage data
  if ('xPercent' in placeholder && 'yPercent' in placeholder && 
      'widthPercent' in placeholder && 'heightPercent' in placeholder) {
    // Use percentage-based data directly
    const percentageData = placeholder as any;
    return convertFromPercentage(percentageData, containerWidth, containerHeight);
  }

  // Convert pixel-based data to percentage and then back to ensure consistency
  const percentageData = convertToPercentage(placeholder);
  return convertFromPercentage(percentageData, containerWidth, containerHeight);
};

/**
 * Function to calculate responsive design positioning that works across all screen sizes
 * This is the main function that should be used in all components
 */
export const calculateResponsiveDesignPositioning = (
  designDimensions: DesignDimensions,
  placeholder: PlaceholderRect | undefined,
  containerWidth: number,
  containerHeight: number,
  maintainAspectRatio: boolean = true
): DesignPositioning => {
  // Get consistent placeholder data
  const consistentPlaceholder = getConsistentPlaceholderData(placeholder, containerWidth, containerHeight);
  
  // Calculate positioning using the consistent placeholder
  return calculateDesignPositioning(
    designDimensions,
    consistentPlaceholder,
    containerWidth,
    containerHeight,
    maintainAspectRatio
  );
};

/**
 * Saves design positioning data to localStorage for consistency between components
 */
export const saveDesignPositioning = (
  positioning: DesignPositioning,
  designId: string
): void => {
  try {
    // Convert to percentage-based positioning for storage
    const percentagePositioning = {
      xPercent: (positioning.x / positioning.width) * 100,
      yPercent: (positioning.y / positioning.height) * 100,
      widthPercent: positioning.width,
      heightPercent: positioning.height,
      scale: positioning.scale,
      maintainAspectRatio: positioning.maintainAspectRatio
    };
    
    localStorage.setItem(
      `designPosition_${designId}`,
      JSON.stringify(percentagePositioning)
    );
    
    // Also store in a common location for easy access
    localStorage.setItem('designPlaceholderData', JSON.stringify(percentagePositioning));
    
    console.log('Saved design positioning data for:', designId, percentagePositioning);
  } catch (error) {
    console.error('Error saving design positioning:', error);
  }
};

/**
 * Retrieves saved design positioning data from localStorage
 */
export const getDesignPositioning = (designId: string): DesignPositioning | null => {
  try {
    const key = `designPositioning_${designId}`;
    const storedData = localStorage.getItem(key);
    
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    console.error('Error retrieving design positioning:', error);
    return null;
  }
  
  return null;
};

/**
 * Retrieves stored percentage-based positioning data from localStorage
 * This is used to ensure consistent design positioning between components
 */
export const getStoredPercentagePositioning = (): PercentagePlaceholder | null => {
  try {
    const storedData = localStorage.getItem('designPlaceholderData');
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    console.error('Error retrieving stored percentage positioning:', error);
  }
  return null;
};

/**
 * Validates that placeholder coordinates are within reasonable bounds
 * This helps prevent positioning errors
 */
export const validatePlaceholderCoordinates = (placeholder: PlaceholderRect): boolean => {
  return (
    placeholder.x >= 0 &&
    placeholder.y >= 0 &&
    placeholder.width > 0 &&
    placeholder.height > 0 &&
    placeholder.x + placeholder.width <= REFERENCE_CANVAS_WIDTH &&
    placeholder.y + placeholder.height <= REFERENCE_CANVAS_HEIGHT
  );
};

/**
 * Creates a standardized placeholder object with percentage-based coordinates
 * This ensures consistency across all components
 */
export const createStandardizedPlaceholder = (
  placeholder: PlaceholderRect | undefined,
  includePercentages: boolean = true
): PlaceholderRect & Partial<PercentagePlaceholder> => {
  if (!placeholder) {
    const defaultPlaceholder = { x: 150, y: 150, width: 100, height: 100 };
    if (includePercentages) {
      return {
        ...defaultPlaceholder,
        ...convertToPercentage(defaultPlaceholder)
      };
    }
    return defaultPlaceholder;
  }

  if (includePercentages) {
    return {
      ...placeholder,
      ...convertToPercentage(placeholder)
    };
  }

  return placeholder;
};
