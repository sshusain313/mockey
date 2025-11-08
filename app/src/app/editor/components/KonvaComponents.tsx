'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage, Group, Rect, Text, Transformer } from 'react-konva';
import useImage from 'use-image';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';

interface DesignCanvasProps {
  productImage: string;
  designImage: string | null;
  placeholder: any;
  placeholderType?: 'rectangle' | 'magneticLasso' | 'customShape';
  containerWidth: number;
  containerHeight: number;
  categories?: string[];
  stageRef: React.RefObject<any>;
  maintainAspectRatio?: boolean;
  onToggleAspectRatio?: () => void;
  productName?: string;
  productDescription?: string;
  productPrice?: number;
  customShapePoints?: Array<{x: number, y: number}>;
  onModeChange?: (mode: 'edit' | 'preview') => void;
  colorValue?: string; // Selected color for the product
  // Rotation props
  rotationX?: number;
  rotationY?: number;
  onRotationChange?: (rotationX: number, rotationY: number) => void;
  // Scaling props
  scaleX?: number;
  scaleY?: number;
  onScaleChange?: (scaleX: number, scaleY: number) => void;
  // Wrapping props
  warpingValue?: number;
  warpingDirection?: 'horizontal' | 'vertical';
  warpingStyle?: 'wave' | 'bulge' | 'pinch';
  warpingFrequency?: number;
  warpingAmplitude?: number;
  warpingPhase?: number;
}

const KonvaComponents = ({
  productImage,
  designImage,
  placeholder,
  placeholderType = 'rectangle',
  containerWidth,
  containerHeight,
  categories = [],
  stageRef,
  maintainAspectRatio: propMaintainAspectRatio,
  onToggleAspectRatio,
  productName,
  productDescription,
  productPrice,
  customShapePoints = [],
  onModeChange,
  colorValue = '#FFFFFF',
  // Rotation props with default values
  rotationX = 0,
  rotationY = 0,
  onRotationChange,
  // Scaling props with default values
  scaleX = 1,
  scaleY = 1,
  onScaleChange,
  // Wrapping props with default values
  warpingValue = 0,
  warpingDirection = 'horizontal',
  warpingStyle = 'wave',
  warpingFrequency = 3,
  warpingAmplitude = 10,
  warpingPhase = 0
}: DesignCanvasProps) => {
  // Load product image with standard method
  const [productImg] = useImage(productImage);
  
  // Custom hook for loading design image with quality preservation
  const [designImg, designImgStatus] = useImage(designImage || '');
  
  // Create a high-quality version of the design image when it loads
  const [highQualityDesignImg, setHighQualityDesignImg] = useState<HTMLImageElement | null>(null);
  
  useEffect(() => {
    if (designImg && designImgStatus === 'loaded') {
      // Disable caching while updating
      setShouldCacheMask(false);
      
      // Clear cache on design image node if it exists
      if (designImageRef.current) {
        designImageRef.current.clearCache();
      }
      
      // Clear mask group cache
      if (maskGroupRef.current) {
        maskGroupRef.current.clearCache();
      }
      
      // Create a high-quality version of the image
      const img = new Image();
      img.crossOrigin = 'Anonymous'; // Handle CORS if needed
      
      // Set image rendering attributes for high quality
      img.style.imageRendering = 'high-quality';
      
      img.onload = () => {
        setHighQualityDesignImg(img);
        
        // Force layer redraw after high quality image is loaded
        setTimeout(() => {
          if (designImageRef.current) {
            designImageRef.current.getLayer()?.batchDraw();
          }
          
          // Re-enable caching after update is complete
          setShouldCacheMask(true);
        }, 50);
      };
      
      img.src = designImage || '';
      
      // Reset selection state when a new design is loaded
      setIsSelected(false);
    }
  }, [designImg, designImgStatus, designImage]);
  const [designPosition, setDesignPosition] = useState({ x: 0, y: 0 });
  const [designDimensions, setDesignDimensions] = useState({ width: 0, height: 0 });
  const [designScale, setDesignScale] = useState(1);
  const [designRotation, setDesignRotation] = useState(0);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [isSelected, setIsSelected] = useState(false);
  const [shouldCacheMask, setShouldCacheMask] = useState(true);
  const [showRotationControls, setShowRotationControls] = useState(false);
  const [localRotationX, setLocalRotationX] = useState(rotationX);
  const [localRotationY, setLocalRotationY] = useState(rotationY);
  const [isDraggingXAxis, setIsDraggingXAxis] = useState(false);
  const [isDraggingYAxis, setIsDraggingYAxis] = useState(false);
  const designImageRef = useRef<Konva.Image>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const xAxisRef = useRef<Konva.Group>(null);
  const yAxisRef = useRef<Konva.Group>(null);
  const maskGroupRef = useRef<Konva.Group>(null);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(
    propMaintainAspectRatio !== undefined ? propMaintainAspectRatio : true
  );
  
  // Toggle between edit and preview modes
  const toggleMode = () => {
    const newMode = mode === 'edit' ? 'preview' : 'edit';
    setMode(newMode);
    
    // Deselect when switching to preview mode
    if (newMode === 'preview') {
      setIsSelected(false);
    }
    
    if (onModeChange) {
      onModeChange(newMode);
    }
  };
  
  // Update maintainAspectRatio when prop changes
  useEffect(() => {
    if (propMaintainAspectRatio !== undefined) {
      setMaintainAspectRatio(propMaintainAspectRatio);
    }
  }, [propMaintainAspectRatio]);
  
  // Update local rotation state when props change
  useEffect(() => {
    setLocalRotationX(rotationX);
    setLocalRotationY(rotationY);
  }, [rotationX, rotationY]);
  
  // Update when scale values change from props
  useEffect(() => {
    if (designImageRef.current) {
      // Force a redraw when scale values change
      designImageRef.current.getLayer()?.batchDraw();
    }
  }, [scaleX, scaleY]);
  
  // Connect transformer to design image when selected
  useEffect(() => {
    if (isSelected && designImageRef.current && transformerRef.current) {
      // Attach transformer to the image
      transformerRef.current.nodes([designImageRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);
  
  // Handle click on empty areas to deselect
  const checkDeselect = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    // Only handle deselection in edit mode
    if (mode !== 'edit') return;
    
    // Clicked on empty area - deselect
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setIsSelected(false);
    }
  };

  // Calculate product image scale and position
  const productScale = productImg ? Math.min(
    containerWidth / productImg.width,
    containerHeight / productImg.height
  ) : 1;

  const productX = productImg ? (containerWidth - productImg.width * productScale) / 2 : 0;
  const productY = productImg ? (containerHeight - productImg.height * productScale) / 2 : 0;

  // Position the design image using product-bound-based positioning for consistent sizing
  useEffect(() => {
    if (productImg && placeholder && designImg) {
      // Fixed dimensions for consistency with gallery view
      const ADMIN_CANVAS_WIDTH = 400;
      const ADMIN_CANVAS_HEIGHT = 400;
      
      // Check if we have percentage-based placeholder data
      const hasPercentageData = placeholder.xPercent !== undefined && 
                             placeholder.yPercent !== undefined && 
                             placeholder.widthPercent !== undefined && 
                             placeholder.heightPercent !== undefined;
      
      // Use percentage-based positioning if available, otherwise fall back to pixel-based
      let scaledPlaceholder;
      
      if (hasPercentageData) {
        // Use percentage-based positioning relative to the rendered product image bounds
        const renderedProductWidth = productImg.width * productScale;
        const renderedProductHeight = productImg.height * productScale;

        scaledPlaceholder = {
          x: productX + (placeholder.xPercent / 100) * renderedProductWidth,
          y: productY + (placeholder.yPercent / 100) * renderedProductHeight,
          width: (placeholder.widthPercent / 100) * renderedProductWidth,
          height: (placeholder.heightPercent / 100) * renderedProductHeight
        };
      } else {
        // Fall back to pixel-based positioning with scaling relative to the product image rect
        const renderedProductWidth = productImg.width * productScale;
        const renderedProductHeight = productImg.height * productScale;
        const scaleX = renderedProductWidth / ADMIN_CANVAS_WIDTH;
        const scaleY = renderedProductHeight / ADMIN_CANVAS_HEIGHT;

        scaledPlaceholder = {
          x: productX + placeholder.x * scaleX,
          y: productY + placeholder.y * scaleY,
          width: placeholder.width * scaleX,
          height: placeholder.height * scaleY
        };
      }
      
      // Calculate design image dimensions with quality preservation
      const designAspectRatio = designImg.width / designImg.height;
      let finalWidth, finalHeight;
      
      // Get the original image dimensions for quality calculation
      const originalWidth = designImg.width;
      const originalHeight = designImg.height;
      
      // Calculate the placeholder aspect ratio
      const placeholderAspectRatio = scaledPlaceholder.width / scaledPlaceholder.height;
      
      if (maintainAspectRatio) {
        // Maintain aspect ratio
        if (designAspectRatio > placeholderAspectRatio) {
          // Design is wider than placeholder (relative to height)
          finalWidth = scaledPlaceholder.width;
          finalHeight = finalWidth / designAspectRatio;
        } else {
          // Design is taller than placeholder (relative to width)
          finalHeight = scaledPlaceholder.height;
          finalWidth = finalHeight * designAspectRatio;
        }
      } else {
        // Don't maintain aspect ratio, just use placeholder dimensions
        finalWidth = scaledPlaceholder.width;
        finalHeight = scaledPlaceholder.height;
      }
      
      // Calculate quality preservation factors
      const scaleFactor = Math.min(finalWidth / originalWidth, finalHeight / originalHeight);
      
      // If we're scaling down significantly, we'll apply quality preservation techniques
      // This helps maintain image quality even when the image is displayed at a smaller size
      const needsQualityPreservation = scaleFactor < 0.8;
      
      if (needsQualityPreservation) {
        console.log('Applying quality preservation for scaled design image');
        // We'll use the high-quality image loading we set up earlier
      }
      
      // Center the design within the placeholder
      const finalX = scaledPlaceholder.x + (scaledPlaceholder.width - finalWidth) / 2;
      const finalY = scaledPlaceholder.y + (scaledPlaceholder.height - finalHeight) / 2;
      
      // Position the design image at the calculated coordinates
      setDesignPosition({
        x: finalX,
        y: finalY
      });
      
      // Set the dimensions to match the calculated values
      setDesignDimensions({
        width: finalWidth,
        height: finalHeight
      });
      
      // Calculate the scale factor for the design
      const designScaleFactor = finalWidth / designImg.width;
      setDesignScale(designScaleFactor);
      
      console.log(`Design scaled with factor: ${designScaleFactor}, maintaining quality`);
    }
  }, [designImg, placeholder, containerWidth, containerHeight, maintainAspectRatio, productImg]);

  // Calculate color brightness (0-1 scale)
  const getColorBrightness = (hexColor: string): number => {
    // Remove # if present
    const hex = hexColor.replace(/^#/, '');
    
    // Parse hex values
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    
    // Calculate perceived brightness using the luminance formula
    // (0.299*R + 0.587*G + 0.114*B)
    return 0.299 * r + 0.587 * g + 0.114 * b;
  };

  // Calculate the appropriate blend mode based on product color
  const calculateBlendMode = (hexColor: string): string => {
    // Get brightness of the selected color (0-1 scale)
    const brightness = getColorBrightness(hexColor);
    
    // Use categories as a primary indicator if available
    if (categories.includes("Dark") || categories.includes("Black")) {
      return 'screen';
    } else if (categories.includes("Colored")) {
      // For colored products, use brightness to determine the best blend mode
      return brightness < 0.4 ? 'screen' : 'multiply';
    } else {
      // If no specific category, use the analyzed brightness
      if (brightness < 0.3) {
        // Dark product
        return 'screen';
      } else if (brightness > 0.7) {
        // Light product
        return 'multiply';
      } else {
        // Medium brightness - choose based on exact brightness
        return brightness < 0.5 ? 'screen' : 'multiply';
      }
    }
  };
  
  // State for blend mode
  const [blendMode, setBlendMode] = useState(calculateBlendMode(colorValue));
  
  // Update blend mode when color changes
  useEffect(() => {
    setBlendMode(calculateBlendMode(colorValue));
  }, [colorValue, categories]);
  
  // Log initial color values when component mounts
  useEffect(() => {
    console.log(`Initial color: ${colorValue}, brightness: ${getColorBrightness(colorValue).toFixed(2)}`);
  }, []);
  
  // Function to get the current blend mode
  const getBlendMode = (): GlobalCompositeOperation => blendMode as GlobalCompositeOperation;
  
  // Calculate opacity based on color brightness
  const calculateOpacity = (hexColor: string): number => {
    // Get brightness of the selected color (0-1 scale)
    const brightness = getColorBrightness(hexColor);
    
    // Base opacity adjustment from categories
    const categoryAdjustment = categories.includes("Dark") || categories.includes("Black") ? 0.05 : 0;
    
    // Dynamic opacity based on brightness:
    // - For dark colors (low brightness): higher opacity (0.9-0.95)
    // - For light colors (high brightness): lower opacity (0.7-0.85)
    // - For medium colors: medium opacity (0.8-0.9)
    
    if (brightness < 0.3) {
      // Dark color - higher opacity for better visibility
      return 0.9 + categoryAdjustment;
    } else if (brightness > 0.7) {
      // Light color - lower opacity for better blending
      return 0.75 + categoryAdjustment;
    } else {
      // Medium color - balanced opacity
      // Linear interpolation between 0.85 and 0.75 based on brightness
      const mediumOpacity = 0.85 - ((brightness - 0.3) / 0.4) * 0.1;
      return mediumOpacity + categoryAdjustment;
    }
  };
  
  // State for design opacity
  const [designOpacity, setDesignOpacity] = useState(calculateOpacity(colorValue));
  
  // Update opacity when color changes
  useEffect(() => {
    const newOpacity = calculateOpacity(colorValue);
    setDesignOpacity(newOpacity);
    console.log(`Color changed to ${colorValue}, brightness: ${getColorBrightness(colorValue).toFixed(2)}, opacity: ${newOpacity.toFixed(2)}, blend mode: ${calculateBlendMode(colorValue)}`);
  }, [colorValue, categories]);
  
  // Function to get the current opacity
  const getOpacity = () => designOpacity;

  // Calculate dynamic shadow parameters based on product color
  const getShadowParams = () => {
    // Get brightness of the selected color
    const brightness = getColorBrightness(colorValue);
    
    // Determine if we need a light or dark shadow based on color brightness
    const needsLightShadow = brightness < 0.5 || categories.includes("Dark") || categories.includes("Black");
    
    // Shadow color based on brightness
    const shadowColor = needsLightShadow 
      ? `rgba(255, 255, 255, ${0.15 + (0.3 - Math.min(0.3, brightness)) * 0.2})` // Brighter shadow for darker products
      : `rgba(0, 0, 0, ${0.15 + (Math.min(0.9, brightness) - 0.5) * 0.2})`; // Darker shadow for lighter products
    
    // Shadow blur based on brightness
    // More blur on medium brightness products for better contrast
    const shadowBlur = brightness > 0.3 && brightness < 0.7 
      ? 4 
      : 3;
    
    // Shadow opacity based on brightness
    // Higher opacity for extreme brightness values (very dark or very light)
    const shadowOpacity = Math.abs(brightness - 0.5) > 0.3 
      ? 0.35 
      : 0.25;
    
    console.log(`Shadow params calculated for color ${colorValue}: blur=${shadowBlur}, opacity=${shadowOpacity}`);
    
    return {
      shadowColor,
      shadowBlur,
      shadowOffset: { x: 1, y: 1 },
      shadowOpacity
    };
  };
  
  // State for shadow parameters
  const [shadowParams, setShadowParams] = useState(getShadowParams());
  
  // Update shadow parameters when color changes
  useEffect(() => {
    setShadowParams(getShadowParams());
  }, [colorValue, categories]);
  
  // Log when colorValue prop changes
  useEffect(() => {
    console.log(`colorValue prop changed to: ${colorValue}`);
  }, [colorValue]);

  // Update cache when warping parameters change
  useEffect(() => {
    if (designImageRef.current && warpingValue > 0) {
      // Clear cache and force redraw to apply new warping
      designImageRef.current.clearCache();
      designImageRef.current.cache();
      designImageRef.current.getLayer()?.batchDraw();
      
      console.log(`Warping updated - Style: ${warpingStyle}, Value: ${warpingValue}, Direction: ${warpingDirection}`);
    }
  }, [warpingValue, warpingStyle, warpingDirection, warpingFrequency, warpingAmplitude, warpingPhase]);
  
  // Cache the mask group for composite operations - triggered by design changes
  useEffect(() => {
    if (maskGroupRef.current && designImg && shouldCacheMask) {
      // Use a small delay to ensure the image is fully rendered
      const timer = setTimeout(() => {
        if (maskGroupRef.current) {
          // Clear any existing cache first
          maskGroupRef.current.clearCache();
          // Force layer redraw before caching
          maskGroupRef.current.getLayer()?.batchDraw();
          // Re-cache with new design
          maskGroupRef.current.cache();
          // Final redraw to show the cached version
          maskGroupRef.current.getLayer()?.batchDraw();
        }
      }, 0);
      
      return () => clearTimeout(timer);
    } else if (maskGroupRef.current && !shouldCacheMask) {
      // Clear cache when caching is disabled
      maskGroupRef.current.clearCache();
      maskGroupRef.current.getLayer()?.batchDraw();
    }
  }, [designImg, shouldCacheMask, designPosition, designDimensions, designRotation]);
  
  // Update mask group cache when design transforms
  useEffect(() => {
    if (maskGroupRef.current) {
      maskGroupRef.current.clearCache();
      maskGroupRef.current.cache();
      maskGroupRef.current.getLayer()?.batchDraw();
    }
  }, [scaleX, scaleY, warpingValue]);

  // Enhanced wrapping transformations for realistic fabric curvature
  const calculateWarpingTransforms = () => {
    // If no warping, return default values
    if (warpingValue === 0) {
      return {
        scaleX: 1,
        scaleY: 1,
        skewX: 0,
        skewY: 0,
        offsetX: 0,
        offsetY: 0,
        quality: 1
      };
    }
    
    // Initialize transform values with quality preservation
    let transformValues = {
      scaleX: 1,
      scaleY: 1,
      skewX: 0,
      skewY: 0,
      offsetX: 0,
      offsetY: 0,
      quality: 1
    };
    
    // Apply intensity factor to all transformations
    const intensityFactor = warpingValue / 100;
    
    // Calculate quality adjustment based on transformation intensity
    const qualityPreservationFactor = Math.max(0.9, 1 - Math.abs(intensityFactor) * 0.1);
    
    // Enhanced wrapping styles for realistic fabric simulation
    switch (warpingStyle) {
      case 'wave':
        // Simulate fabric waves and ripples
        if (warpingDirection === 'horizontal') {
          // Horizontal wave - like fabric draping horizontally
          transformValues.skewY = (warpingValue / 4) * Math.sin(warpingPhase * Math.PI / 180);
          transformValues.scaleY = 1 + (Math.abs(intensityFactor) * 0.3);
          
          // Multi-frequency wave for natural fabric look
          if (warpingFrequency > 0) {
            const phase = warpingPhase * Math.PI / 180;
            const amplitude = warpingAmplitude * intensityFactor;
            const frequency = warpingFrequency / 10;
            
            // Combine multiple wave frequencies for natural fabric draping
            const primaryWave = Math.sin(phase) * amplitude;
            const secondaryWave = Math.sin(phase * 2 + Math.PI / 4) * (amplitude * 0.3);
            transformValues.offsetY = primaryWave + secondaryWave;
            
            // Add subtle horizontal scaling variation
            transformValues.scaleX = 1 + (Math.sin(phase) * intensityFactor * 0.1);
          }
        } else {
          // Vertical wave - like fabric hanging vertically with folds
          transformValues.skewX = (warpingValue / 4) * Math.sin(warpingPhase * Math.PI / 180);
          transformValues.scaleX = 1 + (Math.abs(intensityFactor) * 0.3);
          
          if (warpingFrequency > 0) {
            const phase = warpingPhase * Math.PI / 180;
            const amplitude = warpingAmplitude * intensityFactor;
            
            // Multi-frequency vertical draping
            const primaryWave = Math.sin(phase) * amplitude;
            const secondaryWave = Math.sin(phase * 2 + Math.PI / 4) * (amplitude * 0.3);
            transformValues.offsetX = primaryWave + secondaryWave;
            
            // Subtle vertical scaling variation
            transformValues.scaleY = 1 + (Math.sin(phase) * intensityFactor * 0.1);
          }
        }
        break;
        
      case 'bulge':
        // Simulate fabric bulging (like over a rounded surface)
        const bulgeFactor = 1 + (intensityFactor * 1.5);
        
        // Apply non-uniform bulge for realistic fabric stretch
        transformValues.scaleX = bulgeFactor;
        transformValues.scaleY = bulgeFactor * 0.95; // Slightly less vertical for natural look
        
        // Add perspective-like distortion
        const bulgePhase = warpingPhase * Math.PI / 180;
        const bulgeSkew = Math.sin(bulgePhase) * intensityFactor * 3;
          
          if (warpingDirection === 'horizontal') {
          transformValues.skewY = bulgeSkew;
          
          // Frequency-based bulge variation
          if (warpingFrequency > 0) {
            const bulgeOffset = Math.sin(bulgePhase) * (warpingAmplitude * intensityFactor);
            transformValues.offsetY = bulgeOffset;
          }
          } else {
          transformValues.skewX = bulgeSkew;
          
          if (warpingFrequency > 0) {
            const bulgeOffset = Math.sin(bulgePhase) * (warpingAmplitude * intensityFactor);
            transformValues.offsetX = bulgeOffset;
          }
        }
        break;
        
      case 'pinch':
        // Simulate fabric pinching or gathering
        const pinchFactor = Math.max(0.6, 1 - (Math.abs(intensityFactor) * 1.5));
        
        // Non-uniform pinch for realistic gathering
        transformValues.scaleX = pinchFactor;
        transformValues.scaleY = pinchFactor * 1.05; // Slightly more vertical for gathered look
        
        // Add gathering distortion
        const pinchPhase = warpingPhase * Math.PI / 180;
        const gatherSkew = Math.cos(pinchPhase) * intensityFactor * 4;
          
          if (warpingDirection === 'horizontal') {
          transformValues.skewY = gatherSkew;
          
          // Create compression waves
          if (warpingFrequency > 0) {
            const compressionWave = Math.cos(pinchPhase * warpingFrequency / 2) * (warpingAmplitude * intensityFactor * 0.7);
            transformValues.offsetY = compressionWave;
          }
          } else {
          transformValues.skewX = gatherSkew;
          
          if (warpingFrequency > 0) {
            const compressionWave = Math.cos(pinchPhase * warpingFrequency / 2) * (warpingAmplitude * intensityFactor * 0.7);
            transformValues.offsetX = compressionWave;
          }
        }
        break;
    }
    
    // Apply quality preservation factor
    transformValues.quality = qualityPreservationFactor;
    
    console.log(`Enhanced wrapping applied: ${warpingStyle}, intensity: ${warpingValue}%, quality: ${qualityPreservationFactor.toFixed(2)}`);
    
    return transformValues;
  };

  // Custom fabric mesh warping filter for realistic distortion
  // This creates pixel-level distortion that simulates fabric curves
  const fabricWarpFilter = (imageData: ImageData) => {
    if (warpingValue === 0) return;
    
    const { data, width, height } = imageData;
    const intensity = warpingValue / 100;
    
    // Create a copy of the original data for sampling
    const originalData = new Uint8ClampedArray(data);
    
    // Bilinear interpolation helper function for smooth warping
    const getInterpolatedPixel = (x: number, y: number): [number, number, number, number] => {
      const x0 = Math.floor(x);
      const x1 = Math.min(x0 + 1, width - 1);
      const y0 = Math.floor(y);
      const y1 = Math.min(y0 + 1, height - 1);
      
      const fx = x - x0;
      const fy = y - y0;
      
      const getPixel = (px: number, py: number) => {
        const idx = (py * width + px) * 4;
        return [originalData[idx], originalData[idx + 1], originalData[idx + 2], originalData[idx + 3]];
      };
      
      const p00 = getPixel(x0, y0);
      const p10 = getPixel(x1, y0);
      const p01 = getPixel(x0, y1);
      const p11 = getPixel(x1, y1);
      
      const result: [number, number, number, number] = [0, 0, 0, 0];
      for (let i = 0; i < 4; i++) {
        const top = p00[i] * (1 - fx) + p10[i] * fx;
        const bottom = p01[i] * (1 - fx) + p11[i] * fx;
        result[i] = top * (1 - fy) + bottom * fy;
      }
      
      return result;
    };
    
    // Apply mesh-based warping with smooth interpolation
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        
        // Calculate normalized coordinates (0 to 1)
        const nx = x / width;
        const ny = y / height;
        
        // Calculate displacement based on position and warping parameters
        let dx = 0;
        let dy = 0;
        
        switch (warpingStyle) {
          case 'wave':
            // Multi-frequency sinusoidal displacement for realistic fabric waves
            const waveFreq = warpingFrequency / 2;
            const wavePhaseRad = warpingPhase * Math.PI / 180;
            
            if (warpingDirection === 'horizontal') {
              // Horizontal waves with multiple harmonics
              dy = Math.sin(nx * waveFreq * Math.PI * 2 + wavePhaseRad) * warpingAmplitude * intensity * 2;
              dy += Math.sin(nx * waveFreq * Math.PI * 4 + wavePhaseRad + Math.PI / 3) * warpingAmplitude * intensity * 0.5;
              // Add tertiary wave for fabric texture
              dy += Math.sin(nx * waveFreq * Math.PI * 6 + wavePhaseRad + Math.PI / 5) * warpingAmplitude * intensity * 0.2;
            } else {
              // Vertical waves with multiple harmonics
              dx = Math.sin(ny * waveFreq * Math.PI * 2 + wavePhaseRad) * warpingAmplitude * intensity * 2;
              dx += Math.sin(ny * waveFreq * Math.PI * 4 + wavePhaseRad + Math.PI / 3) * warpingAmplitude * intensity * 0.5;
              dx += Math.sin(ny * waveFreq * Math.PI * 6 + wavePhaseRad + Math.PI / 5) * warpingAmplitude * intensity * 0.2;
            }
            break;
            
          case 'bulge':
            // Radial displacement for fabric bulging over a rounded surface
            const centerX = 0.5;
            const centerY = 0.5;
            const distX = nx - centerX;
            const distY = ny - centerY;
            const dist = Math.sqrt(distX * distX + distY * distY);
            
            // Smooth gaussian bulge curve
            const bulgeCurve = Math.exp(-dist * dist / (0.3 * 0.3));
            const bulgeAmount = warpingAmplitude * intensity * bulgeCurve * 3;
            
            // Apply radial displacement
            dx = distX * bulgeAmount;
            dy = distY * bulgeAmount;
            
            // Add slight rotation for natural fabric stretch
            const angle = Math.atan2(distY, distX);
            dx += Math.sin(angle * 2) * intensity * 2;
            dy += Math.cos(angle * 2) * intensity * 2;
            break;
            
          case 'pinch':
            // Inward radial displacement for fabric pinching/gathering
            const pcenterX = 0.5;
            const pcenterY = 0.5;
            const pdistX = nx - pcenterX;
            const pdistY = ny - pcenterY;
            const pdist = Math.sqrt(pdistX * pdistX + pdistY * pdistY);
            
            // Tight pinch curve
            const pinchCurve = Math.exp(-pdist * pdist / (0.2 * 0.2));
            const pinchAmount = -warpingAmplitude * intensity * pinchCurve * 2;
            
            // Apply inward displacement
            dx = pdistX * pinchAmount;
            dy = pdistY * pinchAmount;
            
            // Add gathering wrinkles
            const pangle = Math.atan2(pdistY, pdistX);
            dx += Math.sin(pangle * 8) * intensity * pinchCurve * 3;
            dy += Math.cos(pangle * 8) * intensity * pinchCurve * 3;
            break;
        }
        
        // Calculate source pixel coordinates with displacement
        const srcX = x - dx;
        const srcY = y - dy;
        
        // Bounds checking and interpolation
        if (srcX >= 0 && srcX < width - 1 && srcY >= 0 && srcY < height - 1) {
          const pixel = getInterpolatedPixel(srcX, srcY);
          
          // Copy interpolated pixel data
          data[idx] = pixel[0];     // R
          data[idx + 1] = pixel[1]; // G
          data[idx + 2] = pixel[2]; // B
          data[idx + 3] = pixel[3]; // A
        } else {
          // Out of bounds - make transparent
          data[idx + 3] = 0;
        }
      }
    }
  };

  const toggleAspectRatio = () => {
    const newValue = !maintainAspectRatio;
    setMaintainAspectRatio(newValue);
    if (onToggleAspectRatio) {
      onToggleAspectRatio();
    }
  };
  
  // Toggle rotation controls visibility
  const toggleRotationControls = () => {
    setShowRotationControls(!showRotationControls);
  };
  
  // Handle rotation changes
  const handleRotationChange = (newRotationX: number, newRotationY: number) => {
    setLocalRotationX(newRotationX);
    setLocalRotationY(newRotationY);
    
    if (onRotationChange) {
      onRotationChange(newRotationX, newRotationY);
    }
  };
  
  // Handle X-axis drag - Now controls 2D rotation
  const handleXAxisDrag = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (!isDraggingXAxis) return;
    
    const stage = e.target.getStage();
    if (!stage) return;
    
    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;
    
    // Calculate rotation based on drag position relative to design center
    const designCenter = {
      x: designPosition.x + designDimensions.width / 2,
      y: designPosition.y + designDimensions.height / 2
    };
    
    // Calculate angle from center to pointer
    const angle = Math.atan2(pointerPos.y - designCenter.y, pointerPos.x - designCenter.x);
    const degrees = (angle * 180 / Math.PI);
    
    // Update rotation
    setDesignRotation(degrees);
    
    // Update the actual node rotation if it exists
    if (designImageRef.current) {
      designImageRef.current.rotation(degrees);
    }
  };
  
  // Handle Y-axis drag
  const handleYAxisDrag = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (!isDraggingYAxis) return;
    
    const stage = e.target.getStage();
    if (!stage) return;
    
    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;
    
    // Calculate rotation based on drag position relative to design center
    const designCenter = {
      x: designPosition.x + designDimensions.width / 2,
      y: designPosition.y + designDimensions.height / 2
    };
    
    // Map horizontal movement to Y-axis rotation (left/right tilt)
    // Limit rotation to a reasonable range (-30 to 30 degrees)
    const newRotationY = Math.max(-30, Math.min(30, (designCenter.x - pointerPos.x) / 5));
    
    handleRotationChange(localRotationX, newRotationY);
  };

  return (
    <>
      <div className="mb-2 flex items-center justify-between w-full">
        <div className="flex items-center space-x-2">
          {process.env.NODE_ENV !== 'production' && (
            <button
              onClick={toggleAspectRatio}
              className={`px-2 py-1 text-xs rounded ${maintainAspectRatio ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {maintainAspectRatio ? 'Maintaining Aspect Ratio' : 'Using Exact Placeholder Size'}
            </button>
          )}
        </div>
        
      </div>

      <div className="relative w-full md:w-11/12 lg:w-4/5 xl:w-3/5 mx-auto">
        {/* edit/Preview Toggle Button - positioned over the canvas */}
        <div className="absolute top-2 right-2 z-10">
          <button 
            onClick={toggleMode}
            className="flex items-center space-x-1 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 border border-gray-300 transition-colors duration-200"
          >
            {mode === 'edit' ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-xs font-medium text-gray-700">Preview</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span className="text-xs font-medium text-gray-700">edit</span>
              </>
            )}
          </button>
        </div>
        
        <Stage 
          width={containerWidth} 
          height={containerHeight} 
          ref={stageRef} 
          onClick={checkDeselect} 
          onTap={checkDeselect}
          style={{
            // backgroundColor: 'red',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            width: '100%',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
          }}
        >
         {/* Base Layer - Product and Placeholder */}
        <Layer>
          {/* Product image - renders first as base layer */}
          {productImg && (
            <KonvaImage
              image={productImg}
              x={productX}
              y={productY}
              width={productImg.width * productScale}
              height={productImg.height * productScale}
            />
          )}
         </Layer>
         
         {/* Design Layer with Masking - Clips everything to product bounds */}
         <Layer
           clipFunc={(ctx) => {
             // Clip entire layer to product image boundaries
             if (productImg) {
               ctx.rect(productX, productY, productImg.width * productScale, productImg.height * productScale);
             }
           }}
         >
          {/* Visual placeholder when no design is uploaded */}
          {!designImg && placeholder && productImg && (
            <>
              {(() => {
                // Calculate placeholder position
                const ADMIN_CANVAS_WIDTH = 400;
                const ADMIN_CANVAS_HEIGHT = 400;
                
                const hasPercentageData = placeholder.xPercent !== undefined && 
                                       placeholder.yPercent !== undefined && 
                                       placeholder.widthPercent !== undefined && 
                                       placeholder.heightPercent !== undefined;
                
                let scaledPlaceholder;
                
                if (hasPercentageData) {
                  const renderedProductWidth = productImg.width * productScale;
                  const renderedProductHeight = productImg.height * productScale;

                  scaledPlaceholder = {
                    x: productX + (placeholder.xPercent / 100) * renderedProductWidth,
                    y: productY + (placeholder.yPercent / 100) * renderedProductHeight,
                    width: (placeholder.widthPercent / 100) * renderedProductWidth,
                    height: (placeholder.heightPercent / 100) * renderedProductHeight
                  };
                } else {
                  const renderedProductWidth = productImg.width * productScale;
                  const renderedProductHeight = productImg.height * productScale;
                  const scaleX = renderedProductWidth / ADMIN_CANVAS_WIDTH;
                  const scaleY = renderedProductHeight / ADMIN_CANVAS_HEIGHT;

                  scaledPlaceholder = {
                    x: productX + placeholder.x * scaleX,
                    y: productY + placeholder.y * scaleY,
                    width: placeholder.width * scaleX,
                    height: placeholder.height * scaleY
                  };
                }
                
                return (
                  <Group>
                    <Rect
                      x={scaledPlaceholder.x}
                      y={scaledPlaceholder.y}
                      width={scaledPlaceholder.width}
                      height={scaledPlaceholder.height}
                      stroke="#2196F3"
                      strokeWidth={2}
                      dash={[10, 5]}
                      fill="rgba(33, 150, 243, 0.1)"
                      cornerRadius={4}
                    />
                    <Text
                      x={scaledPlaceholder.x}
                      y={scaledPlaceholder.y + scaledPlaceholder.height / 2 - 30}
                      width={scaledPlaceholder.width}
                      text="your"
                      fontSize={Math.min(24, scaledPlaceholder.width / 8)}
                      fontFamily="Arial, sans-serif"
                      fill="#888"
                      align="center"
                    />
                    <Text
                      x={scaledPlaceholder.x}
                      y={scaledPlaceholder.y + scaledPlaceholder.height / 2 - 5}
                      width={scaledPlaceholder.width}
                      text="DESIGN"
                      fontSize={Math.min(32, scaledPlaceholder.width / 6)}
                      fontStyle="bold"
                      fontFamily="Arial, sans-serif"
                      fill="#555"
                      align="center"
                    />
                    <Text
                      x={scaledPlaceholder.x}
                      y={scaledPlaceholder.y + scaledPlaceholder.height / 2 + 25}
                      width={scaledPlaceholder.width}
                      text="here!"
                      fontSize={Math.min(20, scaledPlaceholder.width / 10)}
                      fontStyle="italic"
                      fontFamily="Arial, sans-serif"
                      fill="#888"
                      align="center"
                    />
                  </Group>
                );
              })()}
            </>
          )}

          {/* Design with T-shirt shape mask */}
          {designImg && productImg && placeholder && designDimensions.width > 0 && (
            <Group
              ref={maskGroupRef}
              cache={shouldCacheMask}
            >
              {/* Product image as mask (destination) */}
              <KonvaImage
                image={productImg}
                x={productX}
                y={productY}
                width={productImg.width * productScale}
                height={productImg.height * productScale}
                listening={false}
              />
              
              {/* Design image (source) - will be masked by product shape */}
              <KonvaImage
                ref={designImageRef}
                image={highQualityDesignImg || designImg}
                globalCompositeOperation="source-atop"
                // Position with rotation center offset
                x={designPosition.x + designDimensions.width / 2}
                y={designPosition.y + designDimensions.height / 2}
                width={designDimensions.width}
                height={designDimensions.height}
                opacity={0.95}
                shadowColor={shadowParams.shadowColor}
                shadowBlur={shadowParams.shadowBlur}
                shadowOffsetX={shadowParams.shadowOffset.x}
                shadowOffsetY={shadowParams.shadowOffset.y}
                shadowOpacity={shadowParams.shadowOpacity}
                draggable={mode === 'edit'}
                 dragBoundFunc={(pos) => {
                   // Constrain drag position to product image boundaries
                   if (!productImg) return pos;
                   
                   const nodeWidth = designDimensions.width;
                   const nodeHeight = designDimensions.height;
                   
                   // Calculate boundaries (accounting for rotation center offset)
                   const minX = productX + nodeWidth / 2;
                   const maxX = productX + (productImg.width * productScale) - nodeWidth / 2;
                   const minY = productY + nodeHeight / 2;
                   const maxY = productY + (productImg.height * productScale) - nodeHeight / 2;
                   
                   return {
                     x: Math.max(minX, Math.min(pos.x, maxX)),
                     y: Math.max(minY, Math.min(pos.y, maxY))
                   };
                 }}
                // Quality-preserving properties
                imageSmoothingEnabled={true}
                imageSmoothingQuality='high'
                // Apply custom fabric warping filter
                filters={warpingValue > 0 ? [fabricWarpFilter] : []}
                cache={warpingValue > 0}
                // Apply combined 3D rotation and wrapping effects with quality preservation
                {...(() => {
                  // Get wrapping transforms with quality preservation
                  const warpTransforms = calculateWarpingTransforms();
                  
                  // Combine with rotation effects
                  return {
                    scaleX: warpTransforms.scaleX * scaleX,
                    scaleY: warpTransforms.scaleY * scaleY,
                    rotation: designRotation,
                    skewX: warpTransforms.skewX + (localRotationY * 0.5),
                    skewY: warpTransforms.skewY + (localRotationX * 0.5),
                    // Set offset with wrapping adjustments
                    offsetX: designDimensions.width / 2 + warpTransforms.offsetX,
                    offsetY: designDimensions.height / 2 + warpTransforms.offsetY,
                    // Apply quality factor to image rendering
                    // Higher values for imageSmoothingQuality ensure better quality
                    // We're using the quality factor to determine how to render the image
                    perfectDrawEnabled: true,
                    listening: true,
                    transformsEnabled: 'all'
                  };
                })()}
                onClick={() => {
                  // Only select in edit mode
                  if (mode === 'edit') {
                    setIsSelected(true);
                  }
                }}
                onTap={() => {
                  // For touch devices
                  if (mode === 'edit') {
                    setIsSelected(true);
                  }
                }}
                 onDragStart={() => {
                   // Ensure selection when dragging starts
                   if (mode === 'edit') {
                     setIsSelected(true);
                   }
                   
                   // Disable caching during drag for smooth rendering
                   setShouldCacheMask(false);
                 }}
                onDragMove={(e) => {
                  // Update position while dragging for smooth movement
                  const node = e.target;
                  const newPos = {
                    x: node.x() - designDimensions.width / 2,
                    y: node.y() - designDimensions.height / 2
                  };
                  setDesignPosition(newPos);
                }}
                 onDragEnd={(e) => {
                   // Get the final position after drag
                   const node = e.target;
                   const newPos = {
                     x: node.x() - designDimensions.width / 2,
                     y: node.y() - designDimensions.height / 2
                   };
                   
                   // Update the design position state
                   setDesignPosition(newPos);
                   
                   // Re-enable caching after drag for masking
                   setShouldCacheMask(true);
                 }}
              />
            </Group>
           )}
              
           {/* Transformer - renders normally without masking to preserve functionality */}
           {designImg && placeholder && designDimensions.width > 0 && isSelected && mode === 'edit' && (
                  <Transformer
                    ref={transformerRef}
                  rotateEnabled={true}
                  enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right', 'top-center', 'bottom-center']}
                  rotateAnchorOffset={30}
                    boundBoxFunc={(oldBox, newBox) => {
                      // Limit resize to minimum dimensions
                      if (newBox.width < 10 || newBox.height < 10) {
                        return oldBox;
                  }
                   
                   // Constrain to product image boundaries
                   if (productImg) {
                     const productBounds = {
                       x: productX,
                       y: productY,
                       width: productImg.width * productScale,
                       height: productImg.height * productScale
                     };
                     
                     // Check if new box exceeds product boundaries
                     if (newBox.x < productBounds.x) {
                       newBox.width = newBox.width - (productBounds.x - newBox.x);
                       newBox.x = productBounds.x;
                     }
                     
                     if (newBox.y < productBounds.y) {
                       newBox.height = newBox.height - (productBounds.y - newBox.y);
                       newBox.y = productBounds.y;
                     }
                     
                     if (newBox.x + newBox.width > productBounds.x + productBounds.width) {
                       newBox.width = productBounds.x + productBounds.width - newBox.x;
                     }
                     
                     if (newBox.y + newBox.height > productBounds.y + productBounds.height) {
                       newBox.height = productBounds.y + productBounds.height - newBox.y;
                     }
                     
                     // Re-check minimum dimensions after boundary constraints
                     if (newBox.width < 10 || newBox.height < 10) {
                       return oldBox;
                     }
                      }
                      
                      return newBox;
                 }}
                borderStroke="#2196F3"
                borderStrokeWidth={2}
                anchorFill="#2196F3"
                anchorStroke="#fff"
                anchorStrokeWidth={2}
                anchorSize={10}
                anchorCornerRadius={5}
                onTransform={() => {
                  // Real-time update during transform
                  if (designImageRef.current) {
                    const node = designImageRef.current;
                    // Force redraw for smooth transformation
                    node.getLayer()?.batchDraw();
                  }
                  
                  // Disable caching during transform for smooth rendering
                  setShouldCacheMask(false);
                }}
                    onTransformEnd={() => {
                      // After transform is complete, update the design dimensions
                      if (designImageRef.current) {
                        const node = designImageRef.current;
                        const nodeScaleX = node.scaleX();
                        const nodeScaleY = node.scaleY();
                        const nodeRotation = node.rotation();
                        
                        // Save the rotation value
                        setDesignRotation(nodeRotation);
                        
                        // Update the external scale values via callback
                        if (onScaleChange) {
                          // Multiply by the current scaleX/scaleY to accumulate transformations
                          onScaleChange(
                            Math.max(0.5, Math.min(2, scaleX * nodeScaleX)), 
                            Math.max(0.5, Math.min(2, scaleY * nodeScaleY))
                          );
                        }
                        
                        // Keep the rotation, no need to reset it
                        // Reset scale to 1 and adjust width/height instead
                        node.scaleX(1);
                        node.scaleY(1);
                        
                        // Update the design position and dimensions
                        setDesignPosition({
                          x: node.x() - designDimensions.width / 2,
                          y: node.y() - designDimensions.height / 2
                        });
                        
                        setDesignDimensions({
                          width: Math.max(5, node.width() * nodeScaleX),
                          height: Math.max(5, node.height() * nodeScaleY)
                        });
                        
                        // Re-enable caching after transform for masking
                        setShouldCacheMask(true);
                      }
                    }}
                  />
           )}
          
         </Layer>
         
         {/* UI Overlay Layer - For boundary indicators (not clipped) */}
         <Layer>
          {/* Product boundary indicator (visible in edit mode with design) */}
          {mode === 'edit' && designImg && productImg && (
                        <Rect
              x={productX}
              y={productY}
              width={productImg.width * productScale}
              height={productImg.height * productScale}
              // stroke="rgba(33, 150, 243, 0.3)"
                            strokeWidth={2}
              dash={[5, 5]}
              listening={false}
            />
          )}
        </Layer>
      </Stage>
      </div>
    </>
  );
};

export default KonvaComponents;
