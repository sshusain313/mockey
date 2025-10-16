'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Grid2X2, Maximize2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { getColorValue, generateColorVariants } from '@/lib/colorUtils';

interface ColorVariantPreviewProps {
  productImage: string | null;
  colors: string[];
}

const ColorVariantPreview: React.FC<ColorVariantPreviewProps> = ({
  productImage,
  colors
}) => {
  const [coloredImages, setColoredImages] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string | null>(colors.length > 0 ? colors[0] : null);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  // Generate colored variants of the product image
  useEffect(() => {
    const loadColorVariants = async () => {
      if (!productImage || colors.length === 0) {
        console.log('ColorVariantPreview: No product image or colors', { productImage, colors });
        setIsLoading(false);
        return;
      }

      console.log('ColorVariantPreview: Loading color variants', { productImage, colors });
      setIsLoading(true);
      
      try {
        const colorVariants = await generateColorVariants(productImage, colors);
        console.log('ColorVariantPreview: Generated color variants', colorVariants);
        setColoredImages(colorVariants);
      } catch (error) {
        console.error('Error generating color variants:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadColorVariants();
  }, [productImage, colors]);

  // Update selected color when colors change
  useEffect(() => {
    if (colors.length > 0 && (!selectedColor || !colors.includes(selectedColor))) {
      setSelectedColor(colors[0]);
      setCurrentIndex(0);
    } else if (colors.length === 0) {
      setSelectedColor(null);
    }
  }, [colors, selectedColor]);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    const newIndex = colors.indexOf(color);
    if (newIndex !== -1) {
      setCurrentIndex(newIndex);
    }
  };

  const handlePrevious = () => {
    if (colors.length <= 1) return;
    const newIndex = (currentIndex - 1 + colors.length) % colors.length;
    setCurrentIndex(newIndex);
    setSelectedColor(colors[newIndex]);
  };

  const handleNext = () => {
    if (colors.length <= 1) return;
    const newIndex = (currentIndex + 1) % colors.length;
    setCurrentIndex(newIndex);
    setSelectedColor(colors[newIndex]);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'carousel' ? 'grid' : 'carousel');
  };

  if (isLoading) {
    return (
      <div className="mt-6 border rounded-lg p-4 bg-gray-50">
        {/* <h3 className="text-lg font-medium mb-4">Color Variants Preview</h3> */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-full aspect-square bg-gray-100 animate-pulse rounded-md"></div>
          <div className="flex space-x-2">
            {Array.from({ length: Math.min(colors.length || 1, 5) }).map((_, index) => (
              <div key={index} className="w-12 h-12 bg-gray-200 animate-pulse rounded-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!productImage || colors.length === 0) {
    return (
      <div className="mt-6 border rounded-lg p-4 bg-gray-50">
        <h3 className="text-lg font-medium mb-4">Color Variants Preview</h3>
        <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
          <p>Upload a product image and select colors to see variants</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 border rounded-lg p-4 bg-gray-50">

      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="thumbnails">Color Thumbnails</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-4">
          {viewMode === 'carousel' ? (
            <div className="relative">
              <div className="relative w-full aspect-square bg-white rounded-md overflow-hidden">
                <Dialog>
                  <DialogTrigger asChild>
                    <button 
                      type="button"
                      className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                      aria-label="View fullscreen"
                    >
                      <Maximize2 className="h-5 w-5" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl bg-white">
                    <div className="relative w-full aspect-square bg-white border border-black">
                      {selectedColor && coloredImages[selectedColor] ? (
                        <Image
                          src={coloredImages[selectedColor]}
                          alt={`${selectedColor} variant`}
                          fill
                          className="object-contain"
                        />
                      ) : (
                        <Image
                          src={productImage}
                          alt="Product image"
                          fill
                          className="object-contain"
                        />
                      )}
                    </div>
                    <div className="text-center mt-2">
                      <Badge variant="outline" className="px-3 py-1">
                        {selectedColor || 'Original'}
                      </Badge>
                    </div>
                  </DialogContent>
                </Dialog>

                {selectedColor && coloredImages[selectedColor] ? (
                  <Image
                    src={coloredImages[selectedColor]}
                    alt={`${selectedColor} variant`}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <Image
                    src={productImage}
                    alt="Product image"
                    fill
                    className="object-contain"
                  />
                )}
              </div>

              {/* Navigation arrows */}
              {colors.length > 1 && (
                <div className="absolute inset-y-0 left-0 right-0 flex justify-between items-center pointer-events-none">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 rounded-full bg-white/80 shadow-md pointer-events-auto"
                    onClick={handlePrevious}
                  >
                    <ChevronLeft className="h-6 w-6" />
                    <span className="sr-only">Previous color</span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 rounded-full bg-white/80 shadow-md pointer-events-auto"
                    onClick={handleNext}
                  >
                    <ChevronRight className="h-6 w-6" />
                    <span className="sr-only">Next color</span>
                  </Button>
                </div>
              )}

              {/* Color indicator */}
              <div className="text-center mt-4">
                <Badge variant="outline" className="px-3 py-1.5 text-base">
                  <span 
                    className="inline-block w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: getColorValue(selectedColor || '') }}
                  ></span>
                  {selectedColor || 'Original'}
                </Badge>
              </div>

              {/* Color dots for navigation */}
              {colors.length > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  {colors.map((color, index) => (
                    <button
                      type="button"
                      key={color}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentIndex ? 'transform scale-125' : 'opacity-60'
                      }`}
                      style={{ backgroundColor: getColorValue(color) }}
                      onClick={() => {
                        setCurrentIndex(index);
                        setSelectedColor(color);
                      }}
                      aria-label={`View ${color} variant`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {colors.map((color) => (
                <div 
                  key={color} 
                  className={`relative aspect-square bg-white rounded-md overflow-hidden border-2 transition-all ${
                    selectedColor === color ? 'border-blue-500' : 'border-gray-200'
                  }`}
                  onClick={() => handleColorSelect(color)}
                >
                  {coloredImages[color] ? (
                    <Image
                      src={coloredImages[color]}
                      alt={`${color} variant`}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="animate-pulse bg-gray-200 w-3/4 h-3/4 rounded-md"></div>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs py-1 px-2 text-center">
                    {color}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="thumbnails">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {colors.map((color) => (
              <div key={color} className="flex flex-col items-center">
                <div className="relative w-full aspect-square bg-white rounded-md overflow-hidden border border-gray-200">
                  {coloredImages[color] ? (
                    <Image
                      src={coloredImages[color]}
                      alt={`${color} thumbnail`}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="animate-pulse bg-gray-200 w-3/4 h-3/4 rounded-md"></div>
                    </div>
                  )}
                </div>
                <span className="mt-1 text-xs text-center text-gray-700">{color}</span>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ColorVariantPreview;
