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
      // Create a high-quality version of the image
      const img = new Image();
      img.crossOrigin = 'Anonymous'; // Handle CORS if needed
      
      // Set image rendering attributes for high quality
      img.style.imageRendering = 'high-quality';
      
      img.onload = () => {
        setHighQualityDesignImg(img);
      };
      
      img.src = designImage || '';
    }
  }, [designImg, designImgStatus, designImage]);
  const [designPosition, setDesignPosition] = useState({ x: 0, y: 0 });
  const [designDimensions, setDesignDimensions] = useState({ width: 0, height: 0 });
  const [designScale, setDesignScale] = useState(1);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [isSelected, setIsSelected] = useState(false);
  const [showRotationControls, setShowRotationControls] = useState(false);
  const [localRotationX, setLocalRotationX] = useState(rotationX);
  const [localRotationY, setLocalRotationY] = useState(rotationY);
  const [isDraggingXAxis, setIsDraggingXAxis] = useState(false);
  const [isDraggingYAxis, setIsDraggingYAxis] = useState(false);
  const designImageRef = useRef<Konva.Image>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const xAxisRef = useRef<Konva.Group>(null);
  const yAxisRef = useRef<Konva.Group>(null);
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

  // Position the design image using percentage-based positioning for consistent sizing
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
        // Use percentage-based positioning (preferred method)
        scaledPlaceholder = {
          x: (placeholder.xPercent / 100) * containerWidth,
          y: (placeholder.yPercent / 100) * containerHeight,
          width: (placeholder.widthPercent / 100) * containerWidth,
          height: (placeholder.heightPercent / 100) * containerHeight
        };
      } else {
        // Fall back to pixel-based positioning with scaling
        const scaleX = containerWidth / ADMIN_CANVAS_WIDTH;
        const scaleY = containerHeight / ADMIN_CANVAS_HEIGHT;
        
        scaledPlaceholder = {
          x: placeholder.x * scaleX,
          y: placeholder.y * scaleY,
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

  // Calculate wrapping transformations for the design with quality preservation
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
        // Quality preservation properties
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
      // Quality preservation value (1 = highest quality)
      quality: 1
    };
    
    // Apply intensity factor to all transformations
    const intensityFactor = warpingValue / 100;
    
    // Calculate quality adjustment based on transformation intensity
    // This ensures that more extreme transformations don't lose quality
    const qualityPreservationFactor = Math.max(0.9, 1 - Math.abs(intensityFactor) * 0.1);
    
    // Apply different transforms based on style
    switch (warpingStyle) {
      case 'wave':
        if (warpingDirection === 'horizontal') {
          // Horizontal wave effect
          transformValues.skewY = warpingValue / 5;
          transformValues.scaleY = 1 + (Math.abs(intensityFactor) * 0.5);
          
          // Add wave effect with advanced parameters
          if (warpingFrequency > 0) {
            const phase = warpingPhase * Math.PI / 180;
            const amplitude = warpingAmplitude * intensityFactor;
            const frequency = warpingFrequency / 10;
            
            // Apply sine wave distortion - use a single offset for the entire image
            // This creates a more consistent wave effect
            const waveOffset = Math.sin(phase) * amplitude;
            transformValues.offsetY = waveOffset;
          }
        } else {
          // Vertical wave effect
          transformValues.skewX = warpingValue / 5;
          transformValues.scaleX = 1 + (Math.abs(intensityFactor) * 0.5);
          
          // Add wave effect with advanced parameters
          if (warpingFrequency > 0) {
            const phase = warpingPhase * Math.PI / 180;
            const amplitude = warpingAmplitude * intensityFactor;
            const frequency = warpingFrequency / 10;
            
            // Apply sine wave distortion - use a single offset for the entire image
            // This creates a more consistent wave effect
            const waveOffset = Math.sin(phase) * amplitude;
            transformValues.offsetX = waveOffset;
          }
        }
        break;
        
      case 'bulge':
        // Bulge effect (expand from center)
        const bulgeScale = 1 + (intensityFactor * 2);
        transformValues.scaleX = bulgeScale;
        transformValues.scaleY = bulgeScale;
        
        // Add frequency-based bulge effect if advanced parameters are available
        if (warpingFrequency > 0) {
          const phase = warpingPhase * Math.PI / 180;
          const bulgeOffset = Math.sin(phase) * (warpingAmplitude * intensityFactor);
          
          if (warpingDirection === 'horizontal') {
            transformValues.offsetY = bulgeOffset;
          } else {
            transformValues.offsetX = bulgeOffset;
          }
        }
        break;
        
      case 'pinch':
        // Pinch effect (contract from center)
        const pinchScale = Math.max(0.5, 1 - (Math.abs(intensityFactor) * 2));
        transformValues.scaleX = pinchScale;
        transformValues.scaleY = pinchScale;
        
        // Add skew for advanced pinch effect
        const skewAngle = intensityFactor * 2;
        if (warpingDirection === 'horizontal') {
          transformValues.skewY = skewAngle;
        } else {
          transformValues.skewX = skewAngle;
        }
        
        // Add frequency-based pinch effect if advanced parameters are available
        if (warpingFrequency > 0) {
          const phase = warpingPhase * Math.PI / 180;
          const pinchOffset = Math.cos(phase) * (warpingAmplitude * intensityFactor * 0.5);
          
          if (warpingDirection === 'horizontal') {
            transformValues.offsetY = pinchOffset;
          } else {
            transformValues.offsetX = pinchOffset;
          }
        }
        break;
    }
    
    // Apply quality preservation factor to the final transform values
    transformValues.quality = qualityPreservationFactor;
    
    // Log quality preservation information
    console.log(`Applied wrapping with quality preservation factor: ${qualityPreservationFactor}`);
    
    return transformValues;
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
  
  // Handle X-axis drag
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
    
    // Map horizontal movement to X-axis rotation (up/down tilt)
    // Limit rotation to a reasonable range (-30 to 30 degrees)
    const newRotationX = Math.max(-30, Math.min(30, (pointerPos.y - designCenter.y) / 5));
    
    handleRotationChange(newRotationX, localRotationY);
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
          
          <div className="flex flex-col gap-1">
            
            {mode === 'edit' && (
              <>              
                <div className="flex items-center bg-purple-50 px-3 py-1 rounded-md border border-purple-200 cursor-pointer" onClick={toggleRotationControls}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-xs text-purple-700 font-medium">
                    {showRotationControls ? 'Hide 3D Rotation Controls' : 'Show 3D Rotation Controls'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
        
      </div>

      <div className="relative" style={{ width: '50%', margin: '0 auto' }}>
        {/* Edit/Preview Toggle Button - positioned over the canvas */}
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
                <span className="text-xs font-medium text-gray-700">Edit</span>
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
        <Layer>
          {productImg && (
            <KonvaImage
              image={productImg}
              x={productX}
              y={productY}
              width={productImg.width * productScale}
              height={productImg.height * productScale}
            />
          )}

          {designImg && placeholder && designDimensions.width > 0 && (
            <>
              <KonvaImage
                ref={designImageRef}
                image={highQualityDesignImg || designImg}
                // Position with rotation center offset
                x={designPosition.x + designDimensions.width / 2}
                y={designPosition.y + designDimensions.height / 2}
                width={designDimensions.width}
                height={designDimensions.height}
                globalCompositeOperation={getBlendMode()}
                opacity={getOpacity()}
                shadowColor={shadowParams.shadowColor}
                shadowBlur={shadowParams.shadowBlur}
                shadowOffsetX={shadowParams.shadowOffset.x}
                shadowOffsetY={shadowParams.shadowOffset.y}
                shadowOpacity={shadowParams.shadowOpacity}
                draggable={mode === 'edit'}
                // Quality-preserving properties
                imageSmoothingEnabled={true}
                imageSmoothingQuality='high'
                // Apply combined 3D rotation and wrapping effects with quality preservation
                {...(() => {
                  // Get wrapping transforms with quality preservation
                  const warpTransforms = calculateWarpingTransforms();
                  
                  // Combine with rotation effects
                  return {
                    scaleX: warpTransforms.scaleX * scaleX,
                    scaleY: warpTransforms.scaleY * scaleY,
                    rotation: 0,
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
                }}
              />
              
              {isSelected && mode === 'edit' && (
                <>
                  <Transformer
                    ref={transformerRef}
                    rotateEnabled={false}
                    enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                    boundBoxFunc={(oldBox, newBox) => {
                      // Limit resize to minimum dimensions
                      if (newBox.width < 10 || newBox.height < 10) {
                        return oldBox;
                      }
                      
                      return newBox;
                    }}
                    onTransformEnd={() => {
                      // After transform is complete, update the design dimensions
                      if (designImageRef.current) {
                        const node = designImageRef.current;
                        const nodeScaleX = node.scaleX();
                        const nodeScaleY = node.scaleY();
                        
                        // Update the external scale values via callback
                        if (onScaleChange) {
                          // Multiply by the current scaleX/scaleY to accumulate transformations
                          onScaleChange(
                            Math.max(0.5, Math.min(2, scaleX * nodeScaleX)), 
                            Math.max(0.5, Math.min(2, scaleY * nodeScaleY))
                          );
                        }
                        
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
                      }
                    }}
                  />
                  
                  {/* Enhanced Rotation Axis Controls */}
                  {showRotationControls && (
                    <Group>
                      {/* Center point with improved visibility */}
                      <Rect
                        x={designPosition.x + designDimensions.width / 2 - 6}
                        y={designPosition.y + designDimensions.height / 2 - 6}
                        width={12}
                        height={12}
                        fill="rgba(255, 255, 255, 0.9)"
                        stroke="#333"
                        strokeWidth={2}
                        cornerRadius={6}
                        shadowColor="black"
                        shadowBlur={4}
                        shadowOpacity={0.3}
                      />
                      
                      {/* X-Axis (Horizontal) with improved grabbing area */}
                      <Group
                        ref={xAxisRef}
                        x={designPosition.x + designDimensions.width / 2}
                        y={designPosition.y + designDimensions.height / 2}
                      >
                        {/* Track with gradient for better visual feedback */}
                        <Rect
                          x={0}
                          y={-8} // Wider area for easier grabbing
                          width={120}
                          height={16}
                          fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                          fillLinearGradientEndPoint={{ x: 120, y: 0 }}
                          fillLinearGradientColorStops={[0, 'rgba(255, 82, 82, 0.2)', 1, 'rgba(255, 82, 82, 0.7)']}
                          cornerRadius={8}
                          shadowColor="black"
                          shadowBlur={3}
                          shadowOpacity={0.2}
                          onMouseDown={() => setIsDraggingXAxis(true)}
                          onMouseUp={() => setIsDraggingXAxis(false)}
                          onMouseLeave={() => setIsDraggingXAxis(false)}
                          onMouseMove={handleXAxisDrag}
                          onTouchStart={() => setIsDraggingXAxis(true)}
                          onTouchEnd={() => setIsDraggingXAxis(false)}
                          onTouchMove={handleXAxisDrag}
                        />
                        
                        {/* Slider indicator showing current rotation position */}
                        <Rect
                          x={60 + (localRotationX * 2)} // Position based on current rotation
                          y={-12}
                          width={8}
                          height={24}
                          fill="#FF5252"
                          cornerRadius={4}
                          shadowColor="black"
                          shadowBlur={2}
                          shadowOpacity={0.3}
                          draggable={true}
                          onDragMove={(e) => {
                            // Calculate new rotation based on slider position
                            const node = e.target;
                            const newX = node.x();
                            const newRotationX = Math.max(-30, Math.min(30, (newX - 60) / 2));
                            handleRotationChange(newRotationX, localRotationY);
                            
                            // Keep the slider within the track
                            node.x(Math.max(0, Math.min(120, newX)));
                          }}
                        />
                        
                        {/* Handle with improved visibility */}
                        <Group
                          x={120}
                          y={0}
                        >
                          <Rect
                            x={0}
                            y={-15}
                            width={30}
                            height={30}
                            fill="#FF5252"
                            cornerRadius={6}
                            shadowColor="black"
                            shadowBlur={4}
                            shadowOpacity={0.3}
                          />
                          <Text
                            x={9}
                            y={-7}
                            text="X"
                            fontSize={16}
                            fontStyle="bold"
                            fill="white"
                          />
                        </Group>
                        
                        {/* Reset button for X-axis */}
                        <Group
                          x={-40}
                          y={-15}
                          onMouseDown={() => handleRotationChange(0, localRotationY)}
                          onTouchStart={() => handleRotationChange(0, localRotationY)}
                        >
                          {/* <Rect
                            width={30}
                            height={30}
                            fill="rgba(255, 255, 255, 0.8)"
                            stroke="#FF5252"
                            strokeWidth={2}
                            cornerRadius={6}
                            shadowColor="black"
                            shadowBlur={3}
                            shadowOpacity={0.2}
                          />
                          <Text
                            x={7}
                            y={8}
                            text="R"
                            fontSize={14}
                            fontStyle="bold"
                            fill="#FF5252"
                          /> */}
                        </Group>
                      </Group>
                      
                      {/* Y-Axis (Vertical) with improved grabbing area */}
                      <Group
                        ref={yAxisRef}
                        x={designPosition.x + designDimensions.width / 2}
                        y={designPosition.y + designDimensions.height / 2}
                      >
                        {/* Track with gradient for better visual feedback */}
                        <Rect
                          x={-8} // Wider area for easier grabbing
                          y={0}
                          width={16}
                          height={120}
                          fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                          fillLinearGradientEndPoint={{ x: 0, y: 120 }}
                          fillLinearGradientColorStops={[0, 'rgba(76, 175, 80, 0.2)', 1, 'rgba(76, 175, 80, 0.7)']}
                          cornerRadius={8}
                          shadowColor="black"
                          shadowBlur={3}
                          shadowOpacity={0.2}
                          onMouseDown={() => setIsDraggingYAxis(true)}
                          onMouseUp={() => setIsDraggingYAxis(false)}
                          onMouseLeave={() => setIsDraggingYAxis(false)}
                          onMouseMove={handleYAxisDrag}
                          onTouchStart={() => setIsDraggingYAxis(true)}
                          onTouchEnd={() => setIsDraggingYAxis(false)}
                          onTouchMove={handleYAxisDrag}
                        />
                        
                        {/* Slider indicator showing current rotation position */}
                        <Rect
                          x={-12}
                          y={60 + (localRotationY * 2)} // Position based on current rotation
                          width={24}
                          height={8}
                          fill="#4CAF50"
                          cornerRadius={4}
                          shadowColor="black"
                          shadowBlur={2}
                          shadowOpacity={0.3}
                          draggable={true}
                          onDragMove={(e) => {
                            // Calculate new rotation based on slider position
                            const node = e.target;
                            const newY = node.y();
                            const newRotationY = Math.max(-30, Math.min(30, (newY - 60) / 2));
                            handleRotationChange(localRotationX, newRotationY);
                            
                            // Keep the slider within the track
                            node.y(Math.max(0, Math.min(120, newY)));
                          }}
                        />
                        
                        {/* Handle with improved visibility */}
                        <Group
                          x={0}
                          y={120}
                        >
                          <Rect
                            x={-15}
                            y={0}
                            width={30}
                            height={30}
                            fill="#4CAF50"
                            cornerRadius={6}
                            shadowColor="black"
                            shadowBlur={4}
                            shadowOpacity={0.3}
                          />
                          <Text
                            x={-7}
                            y={8}
                            text="Y"
                            fontSize={16}
                            fontStyle="bold"
                            fill="white"
                          />
                        </Group>
                        
                        {/* Reset button for Y-axis */}
                        <Group
                          x={-15}
                          y={-40}
                          onMouseDown={() => handleRotationChange(localRotationX, 0)}
                          onTouchStart={() => handleRotationChange(localRotationX, 0)}
                        >
                          {/* <Rect
                            width={30}
                            height={30}
                            fill="rgba(255, 255, 255, 0.8)"
                            stroke="#4CAF50"
                            strokeWidth={2}
                            cornerRadius={6}
                            shadowColor="black"
                            shadowBlur={3}
                            shadowOpacity={0.2}
                          />
                          <Text
                            x={7}
                            y={8}
                            text="R"
                            fontSize={14}
                            fontStyle="bold"
                            fill="#4CAF50"
                          /> */}
                        </Group>
                      </Group>
                      
                      {/* Enhanced Rotation Values Display with Reset All button */}
                      <Group
                        x={designPosition.x}
                        y={designPosition.y + designDimensions.height + 20}
                      >
                        {/* <Rect
                          width={designDimensions.width}
                          height={40}
                          fill="rgba(0, 0, 0, 0.7)"
                          cornerRadius={8}
                          shadowColor="black"
                          shadowBlur={5}
                          shadowOpacity={0.3}
                        />
                        <Text
                          x={15}
                          y={15}
                          text={`X Rotation: ${Math.round(localRotationX)}°`}
                          fontSize={14}
                          fill="white"
                        />
                        <Text
                          x={designDimensions.width / 2 + 15}
                          y={15}
                          text={`Y Rotation: ${Math.round(localRotationY)}°`}
                          fontSize={14}
                          fill="white"
                        /> */}
                        
                        {/* Reset All button */}
                        {/* <Group
                          x={designDimensions.width - 40}
                          y={5}
                          onMouseDown={() => handleRotationChange(0, 0)}
                          onTouchStart={() => handleRotationChange(0, 0)}
                        >
                          <Rect
                            width={30}
                            height={30}
                            fill="rgba(255, 255, 255, 0.9)"
                            stroke="#2196F3"
                            strokeWidth={2}
                            cornerRadius={6}
                          />
                          <Text
                            x={5}
                            y={8}
                            text="0°"
                            fontSize={14}
                            fontStyle="bold"
                            fill="#2196F3"
                          />
                        </Group> */}
                      </Group>
                    </Group>
                  )}
                </>
              )}
            </>
          )}
        </Layer>
      </Stage>
      </div>
    </>
  );
};

export default KonvaComponents;
