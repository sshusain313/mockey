'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Canvas, Image as FabricImage, Shadow } from 'fabric';

interface EnhancedFabricOverlayProps {
  mockupImage: string;
  designImage: string | null;
  categories: string[];
  onDesignChange?: (designData: any) => void;
}

const EnhancedFabricOverlay = ({
  mockupImage,
  designImage,
  categories = [],
  onDesignChange
}: EnhancedFabricOverlayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [designObject, setDesignObject] = useState<FabricImage | null>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Helper function to determine design placement based on mockup categories
  const getDesignConfig = (categories: string[] = []) => {
    // Default configuration
    let config = {
      scaleX: 0.35,
      scaleY: 0.35,
      top: 150,
      left: 150,
      angle: 0,
      opacity: 0.95,
      blendMode: 'multiply' as GlobalCompositeOperation
    };

    // Adjust based on mockup type
    if (categories.includes("Closeup")) {
      config = {
        ...config,
        scaleX: 0.5,
        scaleY: 0.5,
        top: 130,
        left: 130
      };
    } else if (categories.includes("Without People") || categories.includes("Blank")) {
      config = {
        ...config,
        scaleX: 0.6,
        scaleY: 0.6,
        top: 100,
        left: 100
      };
    } else if (categories.includes("Mannequin")) {
      config = {
        ...config,
        scaleX: 0.45,
        scaleY: 0.45,
        top: 120,
        left: 120,
        angle: 0
      };
    } else if (categories.includes("Oversized")) {
      config = {
        ...config,
        scaleX: 0.3,
        scaleY: 0.3,
        top: 160,
        left: 160
      };
    } else if (categories.includes("Boxy")) {
      config = {
        ...config,
        scaleX: 0.45,
        scaleY: 0.45,
        top: 130,
        left: 130
      };
    }

    // Apply different blend modes based on t-shirt color
    if (categories.includes("Dark") || categories.includes("Black")) {
      config.blendMode = 'screen';
      config.opacity = 0.85;
    } else if (categories.includes("Colored")) {
      config.blendMode = 'overlay';
      config.opacity = 0.9;
    }

    // Adjust for specific angles
    if (categories.includes("Side View")) {
      config.angle = 15;
    } else if (categories.includes("Back View")) {
      config.angle = 0;
    }

    return config;
  };

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (typeof window === 'undefined' || !canvasRef.current) return;
    
    try {
      // Create canvas with higher resolution for better quality
      const canvas = new Canvas(canvasRef.current, {
        width: 600,
        height: 600,
        selection: false,
        preserveObjectStacking: true
      });
      
      fabricCanvasRef.current = canvas;
      
      // Load the mockup image as background
      const absoluteMockupUrl = mockupImage.startsWith('/') 
        ? `${window.location.origin}${mockupImage}` 
        : mockupImage;
      
      // Load the background image
      FabricImage.fromURL(absoluteMockupUrl, {
        crossOrigin: 'anonymous'
      }).then((img) => {
        // Scale the image to fit the canvas
        const scale = Math.min(
          canvas.getWidth() / (img.width || 1),
          canvas.getHeight() / (img.height || 1)
        ) * 0.95;
        
        img.scale(scale);
        img.set({
          left: canvas.getWidth() / 2,
          top: canvas.getHeight() / 2,
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false
        });
        
        // Set as background image
        canvas.backgroundImage = img;
        canvas.renderAll();
        
        // Load design image if provided
        if (designImage) {
          loadDesignImage(designImage);
        }
        
        setIsReady(true);
      });
      
      // Cleanup
      return () => {
        canvas.dispose();
        fabricCanvasRef.current = null;
      };
    } catch (error) {
      console.error('Error initializing Fabric.js:', error);
      setLoadingError('Failed to initialize canvas. Please try refreshing the page.');
    }
  }, [mockupImage]);
  
  // Load design image when it changes
  useEffect(() => {
    if (!isReady || !designImage) return;
    loadDesignImage(designImage);
  }, [designImage, isReady]);
  
  // Load design image with enhanced blending
  const loadDesignImage = (imageUrl: string) => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Remove existing design if any
    if (designObject) {
      canvas.remove(designObject);
      setDesignObject(null);
    }
    
    // Get configuration based on mockup categories
    const config = getDesignConfig(categories);
    
    // Handle both data URLs and object URLs
    const absoluteUrl = imageUrl.startsWith('/') 
      ? `${window.location.origin}${imageUrl}` 
      : imageUrl;
      
    // Set a timeout for loading the image
    const loadTimeout = setTimeout(() => {
      console.warn('Fabric image load timed out');
      setLoadingError('Image loading timed out. Please try refreshing the page.');
    }, 5000);
      
    // Load the design image
    FabricImage.fromURL(absoluteUrl, {
      crossOrigin: 'anonymous'
    }).then((img) => {
      clearTimeout(loadTimeout);
      
      // Scale the image appropriately
      const scale = Math.min(
        canvas.getWidth() / (img.width || 1) / 2,
        canvas.getHeight() / (img.height || 1) / 2
      ) * config.scaleX * 2;
      
      img.scale(scale);
      
      // Apply configuration
      img.set({
        left: canvas.getWidth() / 2,
        top: canvas.getHeight() / 2,
        originX: 'center',
        originY: 'center',
        angle: config.angle,
        opacity: config.opacity,
        globalCompositeOperation: config.blendMode,
        selectable: false,
        evented: false
      });
      
      // Add shadow for depth
      const shadow = new Shadow({
        color: 'rgba(0,0,0,0.2)',
        blur: 3,
        offsetX: 0,
        offsetY: 0
      });
      
      img.shadow = shadow;
      
      // Add the image to the canvas
      canvas.add(img);
      setDesignObject(img);
      canvas.renderAll();
      
      // Notify parent component of design change if callback provided
      if (onDesignChange) {
        onDesignChange({
          left: img.left,
          top: img.top,
          scaleX: img.scaleX,
          scaleY: img.scaleY,
          angle: img.angle,
          opacity: img.opacity,
          blendMode: img.globalCompositeOperation
        });
      }
    }).catch((error) => {
      console.error('Error loading design image:', error);
      setLoadingError('Failed to load design. Please try refreshing the page.');
    });
  };
  
  // Fallback rendering while Fabric.js is loading or if there's an error
  const getDesignSize = (categories: string[] = []) => {
    if (!categories) return "w-[35%] h-[35%]";
    
    if (categories.includes("Closeup")) {
      return "w-[50%] h-[50%]";
    } else if (categories.includes("Without People") || categories.includes("Blank") || categories.includes("Mannequin")) {
      return "w-[60%] h-[60%]";
    } else if (categories.includes("Oversized")) {
      return "w-[30%] h-[30%]";
    } else if (categories.includes("Boxy")) {
      return "w-[45%] h-[45%]";
    } else {
      return "w-[35%] h-[35%]";
    }
  };
  
  const getDesignPosition = (categories: string[] = []) => {
    if (!categories) return "translateY(0)";
    
    if (categories.includes("Closeup")) {
      return "translateY(0)";
    } else if (categories.includes("Without People") || categories.includes("Blank")) {
      return "translateY(0)";
    } else if (categories.includes("Mannequin")) {
      return "translateY(-5%)";
    } else {
      return "translateY(-15%)";
    }
  };
  
  const getBlendMode = (categories: string[] = []) => {
    if (categories.includes("Dark") || categories.includes("Black")) {
      return "screen";
    } else if (categories.includes("Colored")) {
      return "overlay";
    } else {
      return "multiply";
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Fabric.js canvas */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full absolute inset-0" 
        style={{ 
          objectFit: 'contain'
        }}
      />
      
      {/* Fallback while Fabric.js is loading or if there's an error */}
      {(!isReady || loadingError) && designImage && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div 
            className={`relative ${getDesignSize(categories)}`}
            style={{
              transform: getDesignPosition(categories),
            }}
          >
            <img
              src={designImage}
              alt="Uploaded design"
              className="w-full h-full object-contain"
              style={{ 
                mixBlendMode: getBlendMode(categories) as any,
                opacity: categories.includes("Dark") ? 0.85 : 0.95
              }}
            />
          </div>
        </div>
      )}
      
      {/* Error message */}
      {loadingError && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {loadingError}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedFabricOverlay;
