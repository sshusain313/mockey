'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { 
  calculateResponsiveDesignPositioning, 
  createStandardizedPlaceholder,
  validatePlaceholderCoordinates 
} from '@/utils/designPositioning';

interface PlaceholderRect {
  // Pixel-based positioning (legacy)
  x: number;
  y: number;
  width: number;
  height: number;
  // Percentage-based positioning (new)
  xPercent?: number;
  yPercent?: number;
  widthPercent?: number;
  heightPercent?: number;
}

interface PlaceholderDesignOverlayProps {
  designImage?: string;
  placeholder?: PlaceholderRect;
  mockupWidth?: number;
  mockupHeight?: number;
  categories?: string[]; // Optional categories for determining blend mode
  customShapePoints?: Array<{x: number, y: number}>;
}

const PlaceholderDesignOverlay: React.FC<PlaceholderDesignOverlayProps> = ({
  designImage = '/mockups/placeholder-design.png',
  placeholder = { x: 150, y: 150, width: 100, height: 100 },
  mockupWidth = 400,
  mockupHeight = 400,
  categories = [],
  customShapePoints = []
}) => {
  const [designDimensions, setDesignDimensions] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const uniqueAriaId = useMemo(() => `DndDescribedBy-${placeholder.x}-${placeholder.y}`, [placeholder.x, placeholder.y]);

  // Load the design image to get its dimensions
  useEffect(() => {
    if (!designImage || typeof window === 'undefined') return;

    // Reset loading state when design image changes
    setIsLoading(true);
    
    console.log('PlaceholderDesignOverlay: Loading design image:', designImage);
    
    // Set a timeout to handle cases where the image might hang
    const timeoutId = setTimeout(() => {
      console.warn('Design image load timed out');
      setIsLoading(false);
    }, 5000); // 5 second timeout
    
    try {
      const img = new window.Image(); // Use the browser's Image constructor
      img.crossOrigin = "anonymous"; // Add cross-origin attribute for external images
      
      img.onload = () => {
        clearTimeout(timeoutId);
        console.log('Design image loaded successfully:', img.width, 'x', img.height);
        setDesignDimensions({
          width: img.width,
          height: img.height
        });
        setIsLoading(false);
      };
      
      img.onerror = (error) => {
        clearTimeout(timeoutId);
        console.error('Failed to load design image:', error);
        setIsLoading(false);
      };
      
      // Handle both data URLs and object URLs
      if (designImage.startsWith('blob:') || designImage.startsWith('data:')) {
        img.src = designImage;
        console.log('Loading blob/data URL');
      } else {
        // For regular URLs, ensure they're absolute
        const absoluteUrl = designImage.startsWith('/') 
          ? `${window.location.origin}${designImage}` 
          : designImage;
        console.log('Loading absolute URL:', absoluteUrl);
        img.src = absoluteUrl;
      }
      
      // Cleanup function
      return () => {
        clearTimeout(timeoutId);
        img.onload = null;
        img.onerror = null;
      };
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Error creating image:', error);
      setIsLoading(false);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [designImage]);

  // Determine the appropriate blend mode based on hoodie color
  const getBlendMode = () => {
    if (categories.includes("Dark") || categories.includes("Black")) {
      return "screen";
    } else if (categories.includes("Colored") || 
               categories.includes("Red") || 
               categories.includes("Blue") || 
               categories.includes("Green")) {
      return "overlay";
    } else {
      // Default for white/light hoodies
      return "multiply";
    }
  };

  // Determine opacity based on hoodie color
  const getOpacity = () => {
    if (categories.includes("Dark") || categories.includes("Black")) {
      return 0.85;
    } else if (categories.includes("Colored")) {
      return 0.9;
    } else {
      return 0.95;
    }
  };

  // Calculate the scaling and positioning to fit the design within the placeholder
  // Using the new responsive design positioning system
  const calculateDesignStyle = () => {
    if (!placeholder) {
      return {
        display: 'none'
      };
    }

    // If no design image, show placeholder area
    if (!designImage) {
      // Create standardized placeholder with percentage data
      const standardizedPlaceholder = createStandardizedPlaceholder(placeholder, true);
      
      // Use the new responsive design positioning system
      const positioning = calculateResponsiveDesignPositioning(
        { width: 100, height: 100 }, // dummy design dimensions
        standardizedPlaceholder,
        mockupWidth,
        mockupHeight,
        true // maintainAspectRatio
      );

      // Convert pixel positions to percentages for true responsiveness
      const leftPercent = (positioning.x / mockupWidth) * 100;
      const topPercent = (positioning.y / mockupHeight) * 100;
      const widthPercent = (positioning.width / mockupWidth) * 100;
      const heightPercent = (positioning.height / mockupHeight) * 100;

      return {
        position: 'absolute' as const,
        left: `${leftPercent}%`,
        top: `${topPercent}%`,
        width: `${widthPercent}%`,
        height: `${heightPercent}%`,
        border: '1px dashed rgba(0, 0, 0, 0.3)',
        backgroundColor: 'rgba(200, 200, 200, 0.15)',
        borderRadius: '2px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        pointerEvents: 'none' as const,
      };
    }

    if (designDimensions.width === 0 || designDimensions.height === 0) {
      return {
        display: 'none'
      };
    }

    // Validate placeholder coordinates
    if (!validatePlaceholderCoordinates(placeholder)) {
      console.warn('Invalid placeholder coordinates:', placeholder);
      return {
        display: 'none'
      };
    }

    // Create standardized placeholder with percentage data
    const standardizedPlaceholder = createStandardizedPlaceholder(placeholder, true);
    
    // Use the new responsive design positioning system
    const positioning = calculateResponsiveDesignPositioning(
      designDimensions,
      standardizedPlaceholder,
      mockupWidth,
      mockupHeight,
      true // maintainAspectRatio
    );

    console.log('Calculated responsive design positioning:', positioning);

    // Convert pixel positions to percentages for true responsiveness
    const leftPercent = (positioning.x / mockupWidth) * 100;
    const topPercent = (positioning.y / mockupHeight) * 100;
    const widthPercent = (positioning.width / mockupWidth) * 100;
    const heightPercent = (positioning.height / mockupHeight) * 100;

    return {
      position: 'absolute' as const,
      left: `${leftPercent}%`,
      top: `${topPercent}%`,
      width: `${widthPercent}%`,
      height: `${heightPercent}%`,
      objectFit: 'contain' as const,
      mixBlendMode: getBlendMode() as React.CSSProperties['mixBlendMode'],
      opacity: getOpacity(),
      zIndex: 10,
      pointerEvents: 'none' as const,
    };
  };

  // Create clip path for custom shapes if provided
  const createClipPathData = () => {
    if (!customShapePoints || customShapePoints.length === 0) {
      return '';
    }

    const points = customShapePoints.map(point => `${point.x}% ${point.y}%`).join(', ');
    return `polygon(${points})`;
  };

  const designStyle = calculateDesignStyle();

  if (isLoading) {
    return null; // Don't render anything while loading
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <img
        src={designImage}
        alt="Design overlay"
        style={{
          ...designStyle,
          clipPath: createClipPathData(),
        }}
        aria-describedby={uniqueAriaId}
      />
      <div id={uniqueAriaId} style={{ display: 'none' }}>
        Design overlay positioned at {designStyle.left}, {designStyle.top} with dimensions {designStyle.width} x {designStyle.height}
      </div>
    </div>
  );
};

export default PlaceholderDesignOverlay;
