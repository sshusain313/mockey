'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getColorValue, generateColorVariants } from '@/lib/colorUtils';

interface ProductColorVariantsProps {
  productImage: string;
  colors: string[];
  onColorSelect?: (color: string) => void;
}

const ProductColorVariants: React.FC<ProductColorVariantsProps> = ({
  productImage,
  colors,
  onColorSelect
}) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(colors.length > 0 ? colors[0] : null);
  const [coloredImages, setColoredImages] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Generate colored variants of the product image
  useEffect(() => {
    const loadColorVariants = async () => {
      if (!productImage || colors.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      try {
        const colorVariants = await generateColorVariants(productImage, colors);
        setColoredImages(colorVariants);
      } catch (error) {
        console.error('Error generating color variants:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadColorVariants();
  }, [productImage, colors]);

  // Handle color selection
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    if (onColorSelect) {
      onColorSelect(color);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="w-full aspect-square bg-gray-100 animate-pulse rounded-md"></div>
        <div className="flex space-x-2">
          {Array.from({ length: Math.min(colors.length, 5) }).map((_, index) => (
            <div key={index} className="w-12 h-12 bg-gray-200 animate-pulse rounded-full"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Main product image with selected color */}
      <div className="relative w-full aspect-square bg-white rounded-md overflow-hidden">
        {selectedColor && coloredImages[selectedColor] ? (
          <Image
            src={coloredImages[selectedColor]}
            alt={`${selectedColor} variant`}
            fill
            className="object-contain"
            priority
          />
        ) : (
          <Image
            src={productImage}
            alt="Product image"
            fill
            className="object-contain"
            priority
          />
        )}
      </div>
      
      {/* Color variant thumbnails */}
      {colors.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {colors.map((color) => (
            <button
              key={color}
              className={`relative w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                selectedColor === color ? 'border-blue-500 scale-110' : 'border-gray-200'
              }`}
              onClick={() => handleColorSelect(color)}
              aria-label={`Select ${color} color`}
            >
              {coloredImages[color] ? (
                <Image
                  src={coloredImages[color]}
                  alt={`${color} thumbnail`}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="w-4 h-4 rounded-full" style={{ backgroundColor: getColorValue(color) }}></span>
                </div>
              )}
              <span className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-0.5 truncate text-center">
                {color}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductColorVariants;
