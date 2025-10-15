'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { ArrowDown, ArrowUp, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

// Define mockup templates with their respective image paths and mask areas
const mockupTemplates = [
  {
    id: 'tshirt-front',
    name: 'Front',
    path: '/mockups/tshirt.jpg',
    category: ['t-shirt', 'apparel'],
    maskPosition: { x: 0.5, y: 0.4, width: 0.4, height: 0.4 }
  },
  {
    id: 'tshirt-model',
    name: 'Model',
    path: '/mockups/tshirt.jpg',
    category: ['t-shirt', 'apparel'],
    maskPosition: { x: 0.5, y: 0.4, width: 0.3, height: 0.3 }
  },
  {
    id: 'hoodie-front',
    name: 'Hoodie Front',
    path: '/mockups/hoodie.jpg',
    category: ['hoodie', 'apparel'],
    maskPosition: { x: 0.5, y: 0.4, width: 0.4, height: 0.4 }
  }
];

interface MockupCanvasProps {
  productImage: File | null;
  onExport?: (dataUrl: string) => void;
  productCategory?: string;
  productSubcategory?: string;
}

const CleanMockupCanvas: React.FC<MockupCanvasProps> = ({
  productImage,
  onExport,
  productCategory,
  productSubcategory
}) => {
  // References
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  
  // State
  const [isBrowser, setIsBrowser] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<string>(mockupTemplates[0].id);
  const [scale, setScale] = useState<number>(2);
  const [rotation, setRotation] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter templates based on category
  const availableTemplates = productCategory
    ? mockupTemplates.filter(t => t.category.includes(productCategory.toLowerCase()))
    : mockupTemplates;
  
  // Set isBrowser to true once component mounts (client-side only)
  useEffect(() => {
    setIsBrowser(true);
  }, []);
  
  // Create a fallback mockup when loading fails
  const createFallbackMockup = (canvas: fabric.Canvas, message?: string) => {
    console.log('Creating fallback mockup with message:', message);
    
    // Create a placeholder rectangle
    const rect = new fabric.Rect({
      left: 0,
      top: 0,
      width: canvas.width,
      height: canvas.height,
      fill: '#f0f0f0',
      selectable: false,
      evented: false
    });
    
    // Add text label
    const text = new fabric.Text(message || 'Mockup Placeholder', {
      left: canvas.width! / 2,
      top: canvas.height! / 2,
      originX: 'center',
      originY: 'center',
      fill: '#888888',
      selectable: false,
      evented: false
    });
    
    // Add to canvas
    canvas.add(rect);
    canvas.add(text);
    canvas.renderAll();
    
    setLoading(false);
  };
  
  // Load mockup template
  const loadMockupTemplate = (templateId: string) => {
    console.log('loadMockupTemplate called with templateId:', templateId);
    const canvas = fabricCanvasRef.current;
    if (!canvas) {
      console.error('Canvas is not initialized in loadMockupTemplate');
      return;
    }
    
    setLoading(true);
    
    try {
      // Find the template
      console.log('Available templates:', availableTemplates);
      const template = availableTemplates.find(t => t.id === templateId);
      if (!template) {
        console.error('Template not found for ID:', templateId);
        setLoading(false);
        return;
      }
      console.log('Found template:', template);
      
      // Remove any existing mockup templates first
      const existingObjects = canvas.getObjects().filter(obj => {
        return obj.get('data') && obj.get('data').type === 'mockup-template';
      });
      
      console.log('Removing existing mockup templates:', existingObjects.length);
      existingObjects.forEach(obj => {
        canvas.remove(obj);
      });
      
      console.log('Loading mockup template:', template.path);
      
      // For non-SVG files, use the standard fabric.Image.fromURL
      console.log('Loading image from path:', template.path);
      
      // Add error handling with a timeout
      const loadTimeout = setTimeout(() => {
        console.error('Image loading timed out:', template.path);
        setError(`Failed to load image: ${template.path} (timeout)`);
        setLoading(false);
      }, 10000); // 10 second timeout
      
      // @ts-ignore - Ignoring TypeScript errors with fabric.js
      fabric.Image.fromURL(template.path, function(img: fabric.Image) {
        clearTimeout(loadTimeout);
        console.log('Image loaded successfully:', img);
        
        if (!img) {
          console.error('Image loaded but is null or undefined');
          setError('Failed to load image: Image is null');
          setLoading(false);
          return;
        }
        
        // Set image properties
        img.set({
          selectable: false,
          evented: false,
          data: { type: 'mockup-template' }
        });
        
        // Resize mockup to fit canvas with some padding
        const scaleX = (canvas.width! * 0.9) / img.width!;
        const scaleY = (canvas.height! * 0.9) / img.height!;
        const mockupScale = Math.min(scaleX, scaleY);
        
        img.scale(mockupScale);
        img.set({
          left: canvas.width! / 2,
          top: canvas.height! / 2,
          originX: 'center',
          originY: 'center',
        });
        
        // First save any product images currently on the canvas
        const productImages: fabric.Object[] = [];
        canvas.getObjects().forEach((obj) => {
          if (obj.get('data') && obj.get('data').type === 'product-image') {
            productImages.push(obj);
          }
        });
        
        // Remove existing mockup templates
        canvas.getObjects().forEach((obj) => {
          if (obj.get('data') && obj.get('data').type === 'mockup-template') {
            canvas.remove(obj);
          }
        });
        
        // Add new mockup template
        canvas.add(img);
        
        // Restore product images
        productImages.forEach(img => {
          canvas.add(img);
        });
        
        canvas.renderAll();
        setLoading(false);
      }, { crossOrigin: 'anonymous' });
    } catch (err) {
      console.error('Error loading mockup template:', err);
      setError('Failed to load mockup template');
      setLoading(false);
    }
  };
  
  // Initialize canvas only once when component mounts
  useEffect(() => {
    console.log('Canvas initialization effect running');
    
    // Wait a bit to ensure the DOM is fully rendered
    const timer = setTimeout(() => {
      console.log('Canvas initialization timer fired');
      
      const initCanvas = () => {
        console.log('initCanvas function called');
        if (!canvasRef.current) {
          console.error('Canvas ref is not available');
          setError('Canvas element not found');
          return;
        }
        
        try {
          console.log('Creating new fabric.Canvas instance');
          // Create a new canvas instance
          const canvas = new fabric.Canvas(canvasRef.current, {
            width: 600,
            height: 600,
            backgroundColor: '#f5f5f7',
            selection: false,
          });
          
          console.log('Canvas created successfully:', canvas);
          fabricCanvasRef.current = canvas;
          
          // Initial render
          canvas.renderAll();
          console.log('Canvas rendered');
          
          // Load the initial template after canvas is initialized
          if (activeTemplate) {
            console.log('Loading initial template:', activeTemplate);
            loadMockupTemplate(activeTemplate);
          }
        } catch (err) {
          console.error('Error initializing canvas:', err);
          setError('Failed to initialize canvas');
        }
      };
      
      initCanvas();
    }, 100);
    
    // Cleanup function
    return () => {
      clearTimeout(timer);
      
      // Dispose of the canvas when component unmounts
      if (fabricCanvasRef.current) {
        console.log('Disposing canvas');
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, [activeTemplate]); // Re-initialize when activeTemplate changes
  
  // Load product image when it changes
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !productImage) return;
    
    console.log('Loading product image');
    setLoading(true);
    setError(null);
    
    const loadProductImage = async () => {
      try {
        // Remove existing product images first
        const existingObjects = canvas.getObjects().filter(obj => {
          return obj.get('data') && obj.get('data').type === 'product-image';
        });
        
        existingObjects.forEach(obj => {
          canvas.remove(obj);
        });
        
        // Create object URL for the image
        const url = URL.createObjectURL(productImage);
        
        // Load the image
        // @ts-ignore - Ignoring TypeScript errors with fabric.js
        fabric.Image.fromURL(url, (img: fabric.Image) => {
          // Find the active mockup template to position the image properly
          const template = mockupTemplates.find(t => t.id === activeTemplate);
          const maskPosition = template?.maskPosition || { x: 0.5, y: 0.4, width: 0.4, height: 0.4 };
          
          // Calculate the target area for the design based on the mockup's mask position
          const targetWidth = canvas.width! * maskPosition.width;
          const targetHeight = canvas.height! * maskPosition.height;
          
          // Scale image to fit within the target area
          const scaleX = targetWidth / img.width!;
          const scaleY = targetHeight / img.height!;
          const imgScale = Math.min(scaleX, scaleY);
          
          img.scale(imgScale * scale);
          img.set({
            left: canvas.width! * maskPosition.x,
            top: canvas.height! * maskPosition.y,
            originX: 'center',
            originY: 'center',
            angle: rotation,
            data: { type: 'product-image' }
          });
          
          // Make the image selectable and movable
          img.set({
            selectable: true,
            evented: true,
            hasControls: true,
            hasBorders: true,
          });
          
          // Add to canvas
          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
          
          // Cleanup
          URL.revokeObjectURL(url);
          setLoading(false);
        }, { crossOrigin: 'anonymous' });
      } catch (err) {
        console.error('Error loading product image:', err);
        setError('Failed to load product image');
        setLoading(false);
      }
    };
    
    loadProductImage();
  }, [productImage, activeTemplate, scale, rotation]);
  
  // Handle template change
  const handleTemplateChange = (templateId: string) => {
    setActiveTemplate(templateId);
  };
  
  // Handle scale change
  const handleScaleChange = (value: number[]) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    
    const newScale = value[0];
    setScale(newScale);
    
    activeObject.scale(newScale);
    canvas.renderAll();
  };
  
  // Handle rotation change
  const handleRotationChange = (value: number[]) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    
    const newRotation = value[0];
    setRotation(newRotation);
    
    activeObject.set({ angle: newRotation });
    canvas.renderAll();
  };
  
  // Handle export button click
  const handleExport = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) {
      setError('Canvas not initialized');
      return;
    }
    
    try {
      // Create a copy of the canvas for export
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = canvas.width!;
      exportCanvas.height = canvas.height!;
      const exportCtx = exportCanvas.getContext('2d');
      
      if (!exportCtx) {
        setError('Failed to create export context');
        return;
      }
      
      // Get the data URL from the canvas
      // @ts-ignore - Ignoring TypeScript errors with fabric.js toDataURL method
      const dataUrl = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 1 // Required by TypeScript definition
      });
      
      if (onExport) {
        onExport(dataUrl);
      }
    } catch (err) {
      console.error('Error exporting canvas:', err);
      setError('Failed to export mockup');
    }
  };
  
  // If not in browser, return loading state
  if (!isBrowser) {
    return <div className="p-4 text-center">Loading canvas...</div>;
  }
  
  return (
    <div className="flex flex-col">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <Tabs defaultValue="template" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="template">Mockup Template</TabsTrigger>
          <TabsTrigger value="adjust">Adjust Design</TabsTrigger>
        </TabsList>
        
        <TabsContent value="template" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {availableTemplates.map((template) => (
              <div 
                key={template.id}
                className={`relative border rounded-md overflow-hidden cursor-pointer transition-all ${activeTemplate === template.id ? 'ring-2 ring-pink-500 scale-[1.02]' : 'hover:ring-1 hover:ring-gray-300'}`}
                onClick={() => handleTemplateChange(template.id)}
              >
                <div className="aspect-square relative">
                  <img 
                    src={template.path}
                    alt={template.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-2 text-center text-sm font-medium truncate">
                  {template.name}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="adjust" className="space-y-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Scale</Label>
                <div className="flex items-center space-x-2">
                  <ZoomOut className="h-4 w-4" />
                  <Slider 
                    value={[scale]}
                    min={0.1}
                    max={2}
                    step={0.01}
                    onValueChange={handleScaleChange}
                    className="w-[200px]"
                  />
                  <ZoomIn className="h-4 w-4" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Rotation</Label>
                <div className="flex items-center space-x-2">
                  <RotateCcw className="h-4 w-4" />
                  <Slider 
                    value={[rotation]}
                    min={-180}
                    max={180}
                    step={1}
                    onValueChange={handleRotationChange}
                    className="w-[200px]"
                  />
                  <div className="w-12 text-right">{rotation}°</div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 p-4 border rounded-lg">
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
          )}
          
          <div className="flex items-center justify-center bg-gray-50 rounded-lg" style={{ height: '500px' }}>
            <canvas ref={canvasRef} />
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button 
              onClick={handleExport}
              disabled={loading}
              className="bg-pink-600 hover:bg-pink-700"
            >
              Export Mockup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanMockupCanvas;
