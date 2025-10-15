'use client';

import React, { useEffect, useRef, useState } from 'react';
import fabric from 'fabric';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const AdminMockupCanvas: React.FC = () => {
  const { toast } = useToast();
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const [placeholder, setPlaceholder] = useState<fabric.Rect | null>(null);
  const [uploadedImage, setUploadedImage] = useState<fabric.Image | null>(null);
  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: '',
    subcategories: [],
    price: '',
    image: null,
    tags: [],
    mockupImage: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Initialize the canvas
  useEffect(() => {
    if (!canvasContainerRef.current) return;

    const canvasElement = document.createElement('canvas');
    canvasElement.width = 400;
    canvasElement.height = 400;
    canvasContainerRef.current.appendChild(canvasElement);

    const canvas = new fabric.Canvas(canvasElement, {
      backgroundColor: '#f3f3f3',
    });

    canvasRef.current = canvas;

    // Add placeholder rectangle
    const rect = new fabric.Rect({
      left: 200,
      top: 150,
      width: 300,
      height: 300,
      fill: 'rgba(0, 0, 255, 0.2)',
      stroke: 'pink',
      strokeDashArray: [5, 5],
      selectable: true,
      hasControls: true,
      lockRotation: true,
    });

    canvas.add(rect);
    setPlaceholder(rect);

    // Ensure placeholder stays within canvas bounds
    canvas.on('object:modified', () => {
      if (rect.left! < 0) rect.left = 0;
      if (rect.top! < 0) rect.top = 0;
      if (rect.left! + rect.width! > canvas.width!) rect.left = canvas.width! - rect.width!;
      if (rect.top! + rect.height! > canvas.height!) rect.top = canvas.height! - rect.height!;
      canvas.renderAll();
    });

    return () => {
      canvas.dispose();
    };
  }, []);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canvasRef.current || !placeholder) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;

      fabric.Image.fromURL(imageUrl, {
        crossOrigin: 'anonymous'
      }, (img: fabric.Image) => {
        // Remove any existing uploaded image
        if (uploadedImage) {
          canvasRef.current?.remove(uploadedImage);
        }

        // Scale and position the image to fit the placeholder
        img.scaleToWidth(placeholder.width!);
        img.scaleToHeight(placeholder.height!);
        img.left = placeholder.left;
        img.top = placeholder.top;
        img.clipPath = placeholder;

        canvasRef.current?.add(img);
        setUploadedImage(img);
        canvasRef.current?.renderAll();
      });
    };

    reader.readAsDataURL(file);
  };

  // Save placeholder position and size
  const handleSavePlaceholder = () => {
    if (!product.category) {
      alert('Please select a category.');
      return;
    }

    if (!placeholder) return;

    const placeholderData = {
      left: placeholder.left,
      top: placeholder.top,
      width: placeholder.width,
      height: placeholder.height,
    };

    console.log('Saved Placeholder:', placeholderData);
    alert('Placeholder saved successfully!');
  };

  // Export canvas as PNG
  const handleExportCanvas = () => {
    if (!canvasRef.current) return;

    const dataUrl = canvasRef.current.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1,
    });

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'mockup.png';
    link.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Product Data:', product); // Debugging

      if (!product.category) {
        alert('Please select a category.');
        setIsSubmitting(false);
        return;
      }

      // Prepare product data for server
      const productData = {
        name: product.name,
        category: product.category,
        subcategories: product.subcategories,
        price: parseFloat(product.price) || 0,
        description: product.description,
        image: product.image,
        mockupImage: product.mockupImage,
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: 'Product Created',
          description: `Successfully created product: ${product.name}`,
          duration: 3000,
        });



        // Reset form
        setProduct({
          name: '',
          description: '',
          category: '',
          subcategories: [],
          price: '',
          image: null,
          tags: [],
          mockupImage: null,
        });
        setPreviewUrl(null);
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: `Failed to save product: ${error.message}`,
          variant: 'destructive',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: 'Error',
        description: 'Failed to save product. Please try again.',
        variant: 'destructive',
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        ref={canvasContainerRef}
        className="border border-gray-300"
        style={{ width: 800, height: 600 }}
      ></div>

      <div className="flex flex-row gap-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="file-input"
        />
        <Button onClick={handleSavePlaceholder} className="bg-blue-500 text-white">
          Save Placeholder
        </Button>
        <Button onClick={handleExportCanvas} className="bg-green-500 text-white">
          Export as PNG
        </Button>
      </div>

      <Select
        onValueChange={(value) => setProduct((prev) => ({ ...prev, category: value }))}
        value={product.category}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apparel">Apparel</SelectItem>
            <SelectItem value="accessories">Accessories</SelectItem>
            <SelectItem value="home">Home & Living</SelectItem>
            <SelectItem value="tech">Tech</SelectItem>
            <SelectItem value="print">Print</SelectItem>
            <SelectItem value="packaging">Packaging</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default AdminMockupCanvas;
