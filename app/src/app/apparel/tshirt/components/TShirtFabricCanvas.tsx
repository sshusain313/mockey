'use client';

import React, { useEffect, useRef } from 'react';
import { useFabricCanvas } from '@/hooks/useFabricCanvas';
import Image from 'next/image';

interface TShirtFabricCanvasProps {
  mockupImage: string;
  designImage: string | null;
  categories: string[];
}

const TShirtFabricCanvas: React.FC<TShirtFabricCanvasProps> = ({
  mockupImage,
  designImage,
  categories = []
}) => {
  const { canvasRef, isReady } = useFabricCanvas({
    mockupImage,
    designImage,
    categories,
    width: 300,
    height: 300
  });

  // For debugging
  useEffect(() => {
    console.log('TShirtFabricCanvas rendered with:', { mockupImage, designImage, isReady });
  }, [mockupImage, designImage, isReady]);

  // Don't render anything until the canvas is ready
  if (!isReady) {
    // Show a loading state or fallback to a simple image overlay while Fabric.js loads
    return (
      <div className="relative w-full h-full">
        {designImage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="relative w-[35%] h-[35%]"
              style={{
                transform: 'translateY(-15%)',
              }}
            >
              <Image
                src={designImage}
                alt="Uploaded design"
                fill
                sizes="20vw"
                className="object-contain"
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <canvas ref={canvasRef} className="w-full h-full" />
  );
};

export default TShirtFabricCanvas;
