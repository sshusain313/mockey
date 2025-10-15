'use client';

import React, { useState, useEffect } from 'react';
import { Palette, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { processImageColors } from '@/app/utils/imageColorProcessor';

interface PngColorSelectorProps {
  imageUrl: string | null; // This is the design image
  productImage?: string | null; // This is the product image (PNG) to apply colors to
  colorValue: string; // Current color selected in the sidebar
  onProcessedImageChange?: (processedImageUrl: string | null) => void;
  onProcessedProductChange?: (processedProductUrl: string | null) => void;
}

const PngColorSelector: React.FC<PngColorSelectorProps> = ({ 
  imageUrl, 
  productImage,
  colorValue,
  onProcessedImageChange,
  onProcessedProductChange
}) => {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  // Predefined color options
  const colorOptions = [
    { name: "White", value: "#FFFFFF", id: "white" },
    { name: "Black", value: "#000000", id: "black" },
    { name: "Red", value: "#FF0000", id: "red" },
    { name: "Green", value: "#00FF00", id: "green" },
    { name: "Blue", value: "#0000FF", id: "blue" },
    { name: "Yellow", value: "#FFFF00", id: "yellow" },
    { name: "Purple", value: "#800080", id: "purple" },
    { name: "Orange", value: "#FFA500", id: "orange" },
    { name: "Pink", value: "#FFC0CB", id: "pink" },
    { name: "Gray", value: "#808080", id: "gray" },
  ];

  // State for processed product image
  const [processedProductImage, setProcessedProductImage] = useState<string | null>(null);

  // Reset when image changes
  useEffect(() => {
    setSelectedColors([]);
    setProcessedImage(null);
    setProcessedProductImage(null);
  }, [imageUrl, productImage]);
  
  // Apply color from sidebar when it changes
  useEffect(() => {
    if (colorValue && productImage) {
      // Replace any previously selected colors with just the new color
      const newSelectedColors = [colorValue];
      setSelectedColors(newSelectedColors);
      processImage(newSelectedColors);
    }
  }, [colorValue, productImage]);
  
  // Process the image immediately when component mounts
  useEffect(() => {
    if (productImage && colorValue) {
      processImage([colorValue]);
    }
  }, []);

  // Process the image with selected colors
  const processImage = async (colors: string[]) => {
    if (!productImage) return;
    
    try {
      if (colors.length === 0) {
        setProcessedProductImage(null);
        if (onProcessedProductChange) {
          onProcessedProductChange(null);
        }
        return;
      }
      
      // Process the product image with selected colors
      const processedProductUrl = await processImageColors(productImage, colors);
      setProcessedProductImage(processedProductUrl);
      
      if (onProcessedProductChange) {
        onProcessedProductChange(processedProductUrl);
      }
    } catch (error) {
      console.error('Error processing image colors:', error);
    }
  };

  // Select a single color (replacing any previous selection)
  const toggleColorSelection = (colorValue: string) => {
    // If this color is already selected, deselect it
    const newSelectedColors = selectedColors.includes(colorValue)
      ? []
      : [colorValue]; // Otherwise, select only this color (replacing any others)
    
    setSelectedColors(newSelectedColors);
    processImage(newSelectedColors);
    
    // Update the sidebar color picker value
    if (newSelectedColors.length > 0) {
      // Only update if we're selecting a color (not deselecting)
      onColorChange(colorValue);
    }
  };
  
  // Function to update the parent component's color value
  const onColorChange = (newColor: string) => {
    // This is a workaround to update the sidebar color picker
    // We're using the DOM API to update the color picker value
    const colorPicker = document.querySelector('input[type="color"]') as HTMLInputElement;
    if (colorPicker) {
      colorPicker.value = newColor;
      
      // Create and dispatch an input event to trigger the onChange handler
      const event = new Event('input', { bubbles: true });
      colorPicker.dispatchEvent(event);
    }
  };

  // Reset to original image
  const resetToOriginal = () => {
    setSelectedColors([]);
    setProcessedProductImage(null);
    if (onProcessedProductChange) {
      onProcessedProductChange(null);
    }
  };

  if (!productImage) return null;

  return (
    <div className="mt-4 space-y-2 border border-gray-200 rounded-md p-3">
      <div className="flex items-center gap-2">
        <Palette className="h-4 w-4 text-blue-500" />
        <h4 className="text-sm font-medium text-gray-900">Product Color</h4>
      </div>
      
      <p className="text-xs text-gray-500">Click a color to apply to your product:</p>
      
      <div className="flex flex-wrap gap-2 mt-2">
        {colorOptions.map(color => (
          <div 
            key={color.id} 
            onClick={() => toggleColorSelection(color.value)}
            className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-all ${
              selectedColors.includes(color.value) 
                ? 'border-blue-500 scale-110 shadow-md' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            style={{ backgroundColor: color.value }}
            title={color.name}
          />
        ))}
      </div>
      
      <div className="text-xs text-gray-600 mt-2 font-medium">
        {selectedColors.length === 0 
          ? 'Original product color' 
          : `Current color: ${colorOptions.find(c => c.value === selectedColors[0])?.name || 'Custom'}`}
      </div>
      
      {processedProductImage && (
        <button 
          onClick={resetToOriginal}
          className="w-full py-1 px-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors mt-2 flex items-center justify-center gap-1"
        >
          <RotateCcw className="h-3 w-3" />
          Reset to Original
        </button>
      )}
      
      <div className="mt-3">
        <div className="text-xs font-medium text-gray-700 mb-1">Product Preview:</div>
        <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
          <Image 
            src={processedProductImage || productImage} 
            alt="Product color preview" 
            width={200} 
            height={200} 
            className="mx-auto object-contain" 
            style={{ maxHeight: '120px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default PngColorSelector;
