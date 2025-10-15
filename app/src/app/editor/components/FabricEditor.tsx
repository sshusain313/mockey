'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import * as fabricModule from 'fabric';
const { Canvas, Image } = fabricModule;

interface FabricEditorProps {
  mockupImage: string;
  designImage?: string | null;
  onDesignChange?: (designData: any) => void;
}

const FabricEditor: React.FC<FabricEditorProps> = ({
  mockupImage,
  designImage = null,
  onDesignChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabricModule.Canvas | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [designObject, setDesignObject] = useState<fabricModule.Image | null>(null);
  const [showControls, setShowControls] = useState(true);

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (typeof window === 'undefined' || !canvasRef.current) return;
    
    // Create canvas
    const canvas = new Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      selection: true,
      preserveObjectStacking: true
    });
    
    fabricCanvasRef.current = canvas;
    
    // Load the mockup image as background
    const absoluteMockupUrl = mockupImage.startsWith('/') 
      ? `${window.location.origin}${mockupImage}` 
      : mockupImage;
    
    Image.fromURL(absoluteMockupUrl, { crossOrigin: 'anonymous' }).then((mockupImg: fabricModule.Image) => {
      // Scale the image to fit the canvas
      const scale = Math.min(
        canvas.getWidth() / mockupImg.width!,
        canvas.getHeight() / mockupImg.height!
      ) * 0.9;
      
      mockupImg.scale(scale);
      mockupImg.set({
        left: canvas.getWidth() / 2,
        top: canvas.getHeight() / 2,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false
      });
      
      canvas.backgroundImage = mockupImg;
      canvas.renderAll();
      
      // Load design image if provided
      if (designImage) {
        loadDesignImage(designImage);
      }
      
      setIsReady(true);
    });
    
    // Set up event listeners
    canvas.on('object:modified', handleDesignChange);
    canvas.on('object:scaling', handleDesignChange);
    canvas.on('object:rotating', handleDesignChange);
    canvas.on('object:moving', handleDesignChange);
    
    // Cleanup
    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [mockupImage]);
  
  // Load design image when it changes
  useEffect(() => {
    if (!isReady || !designImage) return;
    loadDesignImage(designImage);
  }, [designImage, isReady]);
  
  // Load design image
  const loadDesignImage = (imageUrl: string) => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Remove existing design if any
    if (designObject) {
      canvas.remove(designObject);
    }
    
    Image.fromURL(imageUrl, { crossOrigin: 'anonymous' }).then((img: fabricModule.Image) => {
      // Scale the image to a reasonable size
      const scale = Math.min(
        canvas.getWidth() / img.width! / 2,
        canvas.getHeight() / img.height! / 2
      );
      
      img.scale(scale);
      img.set({
        left: canvas.getWidth() / 2,
        top: canvas.getHeight() / 2,
        originX: 'center',
        originY: 'center',
        cornerColor: 'rgba(255,0,0,0.8)',
        cornerSize: 12,
        transparentCorners: false,
        borderColor: 'red',
        borderScaleFactor: 2,
        padding: 5,
        globalCompositeOperation: 'multiply'
      });
      
      canvas.add(img);
      canvas.setActiveObject(img);
      setDesignObject(img);
      canvas.renderAll();
    });
  };
  
  // Handle design changes
  const handleDesignChange = () => {
    if (!fabricCanvasRef.current || !designObject || !onDesignChange) return;
    
    const designData = {
      left: designObject.left,
      top: designObject.top,
      scaleX: designObject.scaleX,
      scaleY: designObject.scaleY,
      angle: designObject.angle
    };
    
    onDesignChange(designData);
  };
  
  // Toggle design controls
  const toggleControls = () => {
    if (!fabricCanvasRef.current || !designObject) return;
    
    const newState = !showControls;
    setShowControls(newState);
    
    designObject.set({
      selectable: newState,
      hasControls: newState,
      hasBorders: newState,
      lockMovementX: !newState,
      lockMovementY: !newState,
      lockRotation: !newState,
      lockScalingX: !newState,
      lockScalingY: !newState
    });
    
    fabricCanvasRef.current.renderAll();
  };
  
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gray-50">
      {/* Canvas container */}
      <div className="relative border border-gray-200 shadow-md bg-white">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
      
      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-white shadow-sm"
          onClick={toggleControls}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
            <path d="M12 5C5.63636 5 1 12 1 12C1 12 5.63636 19 12 19C18.3636 19 23 12 23 12C23 12 18.3636 5 12 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {showControls ? 'Hide Controls' : 'Show Controls'}
        </Button>
      </div>
      
      {/* Loading indicator */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default FabricEditor;
