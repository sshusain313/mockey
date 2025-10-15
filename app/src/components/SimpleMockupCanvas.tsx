'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define mockup templates with their respective image paths
const mockupTemplates = [
  {
    id: 'tshirt-front',
    name: 'T-Shirt Front',
    path: '/mockups/tshirt-front.png',
    category: ['t-shirt', 'apparel'],
    designArea: { top: '30%', left: '50%', width: '40%', height: '40%' }
  },
  {
    id: 'tshirt-model',
    name: 'T-Shirt on Model',
    path: '/mockups/tshirt-model.png',
    category: ['t-shirt', 'apparel'],
    designArea: { top: '35%', left: '50%', width: '30%', height: '30%' }
  },
  {
    id: 'hoodie-front',
    name: 'Hoodie Front',
    path: '/mockups/hoodie-front.png',
    category: ['hoodie', 'apparel'],
    designArea: { top: '35%', left: '50%', width: '40%', height: '40%' }
  }
];

// Use placeholder images if mockups aren't available yet
const placeholderMockups = mockupTemplates.map(template => ({
  ...template,
  path: '/placeholder.svg'
}));

interface SimpleMockupCanvasProps {
  productImage: File | null;
  onExport?: (dataUrl: string) => void;
  productCategory?: string;
  productSubcategory?: string;
}

const SimpleMockupCanvas: React.FC<SimpleMockupCanvasProps> = ({
  productImage,
  onExport,
  productCategory,
  productSubcategory
}) => {
  const [productImageUrl, setProductImageUrl] = useState<string | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<string>(placeholderMockups[0].id);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [availableTemplates, setAvailableTemplates] = useState(placeholderMockups);
  
  // Filter available templates based on product category/subcategory
  useEffect(() => {
    if (productCategory || productSubcategory) {
      const filtered = placeholderMockups.filter(template => {
        if (productSubcategory && template.category.includes(productSubcategory)) {
          return true;
        }
        if (productCategory && template.category.includes(productCategory)) {
          return true;
        }
        return false;
      });
      
      setAvailableTemplates(filtered.length > 0 ? filtered : placeholderMockups);
      
      // Set first template as active if current active template is not in filtered list
      if (filtered.length > 0 && !filtered.find(t => t.id === activeTemplate)) {
        setActiveTemplate(filtered[0].id);
      }
    }
  }, [productCategory, productSubcategory, activeTemplate]);
  
  // Create URL for product image when it changes
  useEffect(() => {
    if (productImage) {
      const url = URL.createObjectURL(productImage);
      setProductImageUrl(url);
      
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setProductImageUrl(null);
    }
  }, [productImage]);
  
  // Handle template change
  const handleTemplateChange = (templateId: string) => {
    setActiveTemplate(templateId);
  };
  
  // Get current template
  const currentTemplate = availableTemplates.find(t => t.id === activeTemplate) || availableTemplates[0];
  
  // Handle export (simplified version)
  const handleExport = () => {
    if (!onExport || !productImageUrl) return;
    
    // In a real implementation, you would create a composite image here
    // For now, just pass the product image URL
    onExport(productImageUrl);
  };
  
  return (
    <div className="flex flex-col">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-3/4">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
            {loading && (
              <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
              </div>
            )}
            
            {/* Mockup template */}
            <div className="relative w-full h-full">
              <Image 
                src={currentTemplate.path}
                alt={currentTemplate.name}
                fill
                className="object-contain"
              />
              
              {/* Product image overlay */}
              {productImageUrl && (
                <div 
                  className="absolute pointer-events-none" 
                  style={{
                    top: currentTemplate.designArea.top,
                    left: currentTemplate.designArea.left,
                    width: currentTemplate.designArea.width,
                    height: currentTemplate.designArea.height,
                    transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
                    transformOrigin: 'center center',
                  }}
                >
                  <Image 
                    src={productImageUrl}
                    alt="Product design"
                    width={300}
                    height={300}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-2">
              <Label className="w-24">Scale:</Label>
              <div className="flex-1">
                <Slider
                  value={[scale]}
                  min={0.1}
                  max={2}
                  step={0.01}
                  onValueChange={(value) => setScale(value[0])}
                />
              </div>
              <div className="w-12 text-right">{scale.toFixed(2)}x</div>
            </div>
            
            <div className="flex items-center gap-2">
              <Label className="w-24">Rotation:</Label>
              <div className="flex-1">
                <Slider
                  value={[rotation]}
                  min={0}
                  max={360}
                  step={1}
                  onValueChange={(value) => setRotation(value[0])}
                />
              </div>
              <div className="w-12 text-right">{rotation}°</div>
            </div>
          </div>
        </div>
        
        <div className="md:w-1/4 space-y-4">
          <div>
            <Label className="block mb-2">Mockup Templates</Label>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {availableTemplates.map((template) => (
                <Button
                  key={template.id}
                  variant={activeTemplate === template.id ? "default" : "outline"}
                  className="w-full justify-start text-left"
                  onClick={() => handleTemplateChange(template.id)}
                >
                  {template.name}
                </Button>
              ))}
            </div>
          </div>
          
          <Button
            className="w-full"
            onClick={handleExport}
            disabled={loading || !productImageUrl}
          >
            Export Mockup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SimpleMockupCanvas;
