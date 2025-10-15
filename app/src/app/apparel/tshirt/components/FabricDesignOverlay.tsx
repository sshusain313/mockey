'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

interface FabricDesignOverlayProps {
  mockupImage: string;
  designImage: string;
  categories: string[];
}

const FabricDesignOverlay: React.FC<FabricDesignOverlayProps> = ({
  mockupImage,
  designImage,
  categories = []
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<any>(null);
  const loadedRef = useRef<boolean>(false);

  // Helper function to determine design size and position based on mockup categories
  const getDesignConfig = (categories: string[] = []) => {
    // Default configuration
    let config = {
      scaleX: 0.35,
      scaleY: 0.35,
      top: 150,
      left: 150,
      angle: 0,
      opacity: 0.9
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

    // Adjust for specific angles
    if (categories.includes("Side View")) {
      config.angle = 15;
    }

    return config;
  };

  useEffect(() => {
    // Only run this effect on the client side
    if (typeof window === 'undefined') return;
    
    // Skip if already loaded or no canvas ref
    if (loadedRef.current || !canvasRef.current) return;

    // Import fabric.js dynamically
    import('fabric').then((fabricModule) => {
      if (!canvasRef.current) return;
      
      // Get the fabric object from the module
      const fabric = fabricModule.default;
      
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: 300,
        height: 300,
        selection: false,
        renderOnAddRemove: true
      });
      
      fabricRef.current = canvas;
      
      // Load the mockup image
      const absoluteMockupUrl = mockupImage.startsWith('/') 
        ? `${window.location.origin}${mockupImage}` 
        : mockupImage;
        
      fabric.Image.fromURL(absoluteMockupUrl, {
        crossOrigin: 'anonymous'
      }).then((mockupImg: any) => {
        // Scale the mockup to fit the canvas
        mockupImg.scaleToWidth(300);
        canvas.backgroundImage = mockupImg;
        canvas.renderAll();
        
        // Load the design image
        fabric.Image.fromURL(designImage, {
          crossOrigin: 'anonymous'
        }).then((designImg: any) => {
          const config = getDesignConfig(categories);
          
          // Center the design
          designImg.set({
            originX: 'center',
            originY: 'center',
            left: config.left,
            top: config.top,
            scaleX: config.scaleX,
            scaleY: config.scaleY,
            angle: config.angle,
            opacity: config.opacity,
            // Use multiply blend mode for better integration with the t-shirt
            globalCompositeOperation: 'multiply'
          });
          
          canvas.add(designImg);
          canvas.renderAll();
          loadedRef.current = true;
        });
      });
      
      // Cleanup function
      return () => {
        canvas.dispose();
        fabricRef.current = null;
        loadedRef.current = false;
      };
    }).catch(error => {
      console.error('Failed to load Fabric.js:', error);
    });
  }, [mockupImage, designImage, categories]);

  // Fallback rendering while Fabric.js is loading
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

  return (
    <div className="relative w-full h-full">
      {/* Fabric.js canvas */}
      <canvas ref={canvasRef} className="w-full h-full absolute inset-0" />
      
      {/* Fallback while Fabric.js is loading */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className={`relative ${getDesignSize(categories)}`}
          style={{
            transform: getDesignPosition(categories),
          }}
        >
          <Image
            src={designImage}
            alt="Uploaded design"
            fill
            sizes="20vw"
            className="object-contain"
            style={{ mixBlendMode: 'multiply', opacity: 0.9 }}
          />
        </div>
      </div>
    </div>
  );
};

export default FabricDesignOverlay;
