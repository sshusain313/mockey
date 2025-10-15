'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { IProduct } from '@/models/Product';

interface SimpleProductFormProps {
  onSuccess: (product: IProduct) => void;
  onCancel: () => void;
}

export default function SimpleProductForm({ onSuccess, onCancel }: SimpleProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Apparel',
    subcategory: 'T-Shirts',
    price: '',
    image: '',
    colors: ['White', 'Black', 'Red', 'Blue'],
    tags: ['Casual', 'Summer'],
    placeholder: {
      x: 100,
      y: 100,
      width: 200,
      height: 150
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceholderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      placeholder: {
        ...prev.placeholder,
        [name]: parseInt(value) || 0
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.image) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const productData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory,
        price: parseFloat(formData.price),
        image: formData.image,
        colors: formData.colors,
        tags: formData.tags,
        placeholder: formData.placeholder
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
          title: "Success",
          description: "Product created successfully"
        });
        onSuccess(result);
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to create product",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter product name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter product description"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange}
            placeholder="29.99"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>
      </div>
      
      <div className="border p-4 rounded-md">
        <h3 className="font-medium mb-2">Placeholder Position</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="x">X Position</Label>
            <Input
              id="x"
              name="x"
              type="number"
              value={formData.placeholder.x}
              onChange={handlePlaceholderChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="y">Y Position</Label>
            <Input
              id="y"
              name="y"
              type="number"
              value={formData.placeholder.y}
              onChange={handlePlaceholderChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="width">Width</Label>
            <Input
              id="width"
              name="width"
              type="number"
              value={formData.placeholder.width}
              onChange={handlePlaceholderChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="height">Height</Label>
            <Input
              id="height"
              name="height"
              type="number"
              value={formData.placeholder.height}
              onChange={handlePlaceholderChange}
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}
