'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import ProductSubcategories from '@/components/ProductSubcategories';
import ProductTags from '@/components/ProductTags';
import ProductColors from '@/components/ProductColors';
import ProductImageUpload from '@/components/ProductImageUpload';
import MockupCanvas from '@/components/MockupCanvas';
import ColorVariantPreview from '@/components/ColorVariantPreview';

// Interface for placeholder with percentage-based positioning
interface PlaceholderWithPercentage {
  x: number;
  y: number;
  width: number;
  height: number;
  xPercent?: number;
  yPercent?: number;
  widthPercent?: number;
  heightPercent?: number;
}

export interface AdminProduct {
  id?: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  tags: string[];
  colors: string[];
  image: string | null;
  mockupImage: string | null;
  placeholder: PlaceholderWithPercentage;
  customShapePoints?: Array<{x: number, y: number}>;
}

interface SubcategoryOption {
  value: string;
  label: string;
  category: string;
}

const subcategoryOptions: Record<string, SubcategoryOption[]> = {
  apparel: [
    { value: 't-shirt', label: 'T-Shirt', category: 'apparel' },
    { value: 'hoodie', label: 'Hoodie', category: 'apparel' },
    { value: 'tank tops', label: 'Tank Tops', category: 'apparel' },
    { value: 'jacket', label: 'Jacket', category: 'apparel' },
    { value: 'crop top', label: 'Crop Top', category: 'apparel' },
    { value: 'apron', label: 'Apron', category: 'apparel' },
    { value: 'scarf', label: 'Scarf', category: 'apparel' },
    { value: 'jersey', label: 'Jersey', category: 'apparel' },

  ],
  tech: [
    { value: 'iphone', label: 'iPhone', category: 'tech' },
    { value: 'laptop', label: 'Laptop', category: 'tech' },
    { value: 'ipad', label: 'iPad', category: 'tech' },
    { value: 'macbook', label: 'Macbook', category: 'tech' },
    { value: 'phone', label: 'Phone', category: 'tech' },
  ],
  home: [
    { value: 'can', label: 'can', category: 'home' },
    { value: 'mug', label: 'mug', category: 'home' },
    { value: 'cushion', label: 'cushion', category: 'home' },
    { value: 'coaster', label: 'Coaster', category: 'home' },
  ],
  accessories: [
    { value: 'tote bag', label: 'Totebag', category: 'accessories' },
    { value: 'cap', label: 'cap', category: 'accessories' },
    { value: 'phone-cover', label: 'phone-cover', category: 'accessories' },
    { value: 'beanie', label: 'Beanie', category: 'accessories' },
    { value: 'gaming pad', label: 'Gaming Pad', category: 'accessories' },
  ],
  print: [
    { value: 'business card', label: 'Business Card', category: 'print' },
    { value: 'book', label: 'Book', category: 'print' },
    { value: 'id card', label: 'Id Card', category: 'print' },
    { value: 'poster', label: 'Poster', category: 'print' },
    { value: 'flyer', label: 'Flyer', category: 'print' },
    { value: 'greeting card', label: 'Greeting Card', category: 'print' },
    { value: 'billboard', label: 'Billboard', category: 'print' },
    { value: 'magazine', label: 'Magazine', category: 'print' },
    { value: 'brochure', label: 'Brochure', category: 'print' },
    { value: 'lanyard', label: 'Lanyard', category: 'print' },
    { value: 'banner', label: 'Banner', category: 'print' },
    { value: 'canvas', label: 'Canvas', category: 'print' },
    { value: 'notebook', label: 'Notebook', category: 'print' },
  ],
  packaging: [
    { value: 'box', label: 'Box', category: 'packaging' },
    { value: 'bottle', label: 'Bottle', category: 'packaging' },
    { value: 'dropper bottle', label: 'Dropper Bottle', category: 'packaging' },
    { value: 'pouch', label: 'Pouch', category: 'packaging' },
    { value: 'cosmetic', label: 'Cosmetic', category: 'packaging' },
  ]
};

interface ProductFormProps {
  onSuccess?: (product: any) => void;
  onCancel?: () => void;
  initialProduct?: AdminProduct;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSuccess, onCancel, initialProduct }) => {
  const [product, setProduct] = useState({
    name: initialProduct?.name || '',
    description: initialProduct?.description || '',
    category: initialProduct?.category || '',
    subcategories: initialProduct?.subcategory ? [initialProduct.subcategory] : [] as string[],
    price: initialProduct?.price ? initialProduct.price.toString() : '',
    image: null as File | null,
    tags: initialProduct?.tags || [] as string[],
    colors: initialProduct?.colors || [] as string[],
    mockupImage: initialProduct?.mockupImage || null as string | null,
    customShapePoints: initialProduct?.customShapePoints || [] as Array<{x: number, y: number}>,
  });
  
  // State for the placeholder rectangle with percentage-based positioning
  const [placeholder, setPlaceholder] = useState(initialProduct?.placeholder || {
    x: 150,
    y: 150,
    width: 100,
    height: 100,
    xPercent: 37.5, // 150/400 * 100
    yPercent: 37.5, // 150/400 * 100
    widthPercent: 25,  // 100/400 * 100
    heightPercent: 25,  // 100/400 * 100
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialProduct?.image || null);
  const { toast } = useToast();
  
  // This is a placeholder comment - the handlePlaceholderChange function is defined below

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProduct(prev => ({ ...prev, [name]: value }));
    
    // Reset subcategories when category changes
    if (name === 'category') {
      setProduct(prev => ({ ...prev, subcategories: [] }));
    }
  };

  const handleSubcategoriesChange = (subcategories: string[]) => {
    setProduct(prev => ({ ...prev, subcategories }));
  };

  const handleTagsChange = (tags: string[]) => {
    setProduct(prev => ({ ...prev, tags }));
  };

  const handleColorsChange = (colors: string[]) => {
    setProduct(prev => ({ ...prev, colors }));
  };

  const handleImageChange = (file: File | null) => {
    setProduct(prev => ({ ...prev, image: file }));
    
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.onerror = (err) => {
        console.error('Error reading file:', err);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleMockupChange = (dataUrl: string) => {
    setProduct(prev => ({ 
      ...prev, 
      mockupImage: dataUrl 
    }));
  };
  
  // Handle placeholder rectangle changes from MockupCanvas with percentage-based positioning
  const handlePlaceholderChange = (
    newPlaceholder: PlaceholderWithPercentage,
    view?: string,
    customShapePoints?: Array<{x: number, y: number}>
  ) => {
    // Ensure we have percentage values, calculate them if not provided
    const updatedPlaceholder = {
      ...newPlaceholder,
      // Canvas size is 400x400 in MockupCanvas
      xPercent: newPlaceholder.xPercent || (newPlaceholder.x / 400) * 100,
      yPercent: newPlaceholder.yPercent || (newPlaceholder.y / 400) * 100,
      widthPercent: newPlaceholder.widthPercent || (newPlaceholder.width / 400) * 100,
      heightPercent: newPlaceholder.heightPercent || (newPlaceholder.height / 400) * 100
    };
    
    console.log('Placeholder updated with percentage-based positioning:', updatedPlaceholder);
    setPlaceholder(updatedPlaceholder);
    
    // Update the product with custom shape points if provided
    if (customShapePoints && customShapePoints.length > 2) {
      setProduct(prev => ({
        ...prev,
        customShapePoints: customShapePoints
      }));
      console.log('Updated product with custom shape points:', customShapePoints.length);
    }
    
    // Save percentage-based positioning to localStorage for consistency across components
    localStorage.setItem('designPositioning', JSON.stringify({
      xPercent: updatedPlaceholder.xPercent,
      yPercent: updatedPlaceholder.yPercent,
      widthPercent: updatedPlaceholder.widthPercent,
      heightPercent: updatedPlaceholder.heightPercent
    }));
  };

  // Function to convert an image to PNG format
  const convertToPNG = (dataUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => {
        reject(new Error('Error loading image'));
      };
      img.src = dataUrl;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate form data
      if (!product.name || !product.category || !product.price) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
          duration: 3000,
        });
        setIsSubmitting(false);
        return;
      }

      // Validate placeholder data
      if (!placeholder.width || !placeholder.height) {
        toast({
          title: "Error",
          description: "Please set the placeholder rectangle dimensions",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Define imageUrl variable
      let imageUrl = initialProduct?.image || '/placeholder-product.jpg';
      
      if (product.image) {
        const reader = new FileReader();
        const imagePromise = new Promise<string>((resolve) => {
          reader.onload = () => {
            resolve(reader.result as string);
          };
        });
        reader.readAsDataURL(product.image);
        imageUrl = await imagePromise;
        
        // Convert to PNG if it's not already
        if (imageUrl && !imageUrl.includes('image/png')) {
          try {
            console.log('Converting main image to PNG format...');
            imageUrl = await convertToPNG(imageUrl);
          } catch (error) {
            console.error('Error converting image to PNG:', error);
            toast({
              title: "Image Conversion Error",
              description: "Failed to convert image to PNG format. Please try a different image.",
              variant: "destructive",
              duration: 3000,
            });
            setIsSubmitting(false);
            return;
          }
        }
      }

      // Use the mockupImage as backgroundImage if available, otherwise use the main image
      let backgroundImage = product.mockupImage || imageUrl;
      
      // Convert mockupImage to PNG if needed
      if (product.mockupImage && !product.mockupImage.includes('image/png')) {
        try {
          console.log('Converting mockup image to PNG format...');
          backgroundImage = await convertToPNG(product.mockupImage);
        } catch (error) {
          console.error('Error converting mockup image to PNG:', error);
          toast({
            title: "Image Conversion Error",
            description: "Failed to convert mockup image to PNG format. Please try a different image.",
            variant: "destructive",
            duration: 3000,
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Prepare product data for server according to Product model
      const productData = {
        // If editing, include the ID
        ...(initialProduct?.id && { _id: initialProduct.id }),
        name: product.name,
        category: product.category,
        subcategory: product.subcategories[0] || '', // Use first subcategory as primary
        price: parseFloat(product.price) || 0,
        description: product.description || 'No description provided', // Ensure description is never empty
        image: imageUrl,
        backgroundImage: backgroundImage || imageUrl, // Required by Product model, fallback to imageUrl
        mockupImage: product.mockupImage,
        tags: product.tags,
        colors: product.colors, // Include colors array
        placeholder: {
          x: Math.round(placeholder.x),
          y: Math.round(placeholder.y),
          width: Math.round(placeholder.width),
          height: Math.round(placeholder.height),
        },
        // Include custom shape points if available
        customShapePoints: product.customShapePoints || [],
      };

      console.log('Sending product data to server:', productData);

      // Save product to database using the products API endpoint
      const endpoint = initialProduct?.id 
        ? `/api/products/${initialProduct.id}` 
        : '/api/products';
        
      console.log('Making API request to:', endpoint);
      console.log('Request method:', initialProduct?.id ? 'PUT' : 'POST');
      
      const response = await fetch(endpoint, {
        method: initialProduct?.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for sending auth cookies
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${initialProduct ? 'update' : 'create'} product`);
      }

      const result = await response.json();
      console.log('Server response:', result);
      
      // Call onSuccess callback with the saved product data
      if (onSuccess) {
        onSuccess(result);
      }
      
      toast({
        title: initialProduct ? "Product Updated" : "Product Created",
        description: `Successfully ${initialProduct ? 'updated' : 'created'} product: ${product.name}`,
        duration: 3000,
      });

      // Reset form if not updating
      if (!initialProduct) {
        setProduct({
          name: '',
          description: '',
          category: '',
          subcategories: [],
          price: '',
          image: null,
          tags: [],
          colors: [],
          mockupImage: null,
          customShapePoints: [],
        });
        setPlaceholder({
          x: 150,
          y: 150,
          width: 100,
          height: 100,
          xPercent: 37.5, // 150/400 * 100
          yPercent: 37.5, // 150/400 * 100
          widthPercent: 25,  // 100/400 * 100
          heightPercent: 25,  // 100/400 * 100
        });
        setPreviewUrl(null);
      }
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save product. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg shadow-md p-8 max-w-6xl mx-auto my-4 bg-white">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className='flex flex-row gap-4'>
          <div className='flex flex-col w-1/2'>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-medium">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700 font-medium">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  className="w-full"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-gray-700 font-medium">Category</Label>
                <Select
                  value={product.category}
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white opacity-100">
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

              <ProductSubcategories
                category={product.category}
                subcategories={product.subcategories}
                onSubcategoryChange={handleSubcategoriesChange}
              />

              <div className="space-y-2">
                <Label htmlFor="price" className="text-gray-700 font-medium">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={product.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full"
                  required
                />
              </div>

              <ProductTags
                tags={product.tags}
                onTagsChange={handleTagsChange}
              />
            </div>
          </div>

          <div className="space-y-6 w-1/2">
            <div className="mb-6">
              <ProductImageUpload
                productImage={product.image}
                onImageChange={handleImageChange}
                mockupImage={product.mockupImage}
                onMockupChange={handleMockupChange}
                category={product.category}
                subcategory={product.subcategories[0] || ''}
                placeholder={placeholder}
                onPlaceholderChange={handlePlaceholderChange}
              />
            </div>
            
            {/* Color Variants Preview Section */}
            <div className="mb-6">
              <Label htmlFor="colorPreview" className="block text-sm font-medium text-gray-700 mb-1">
                Color Variants Preview
              </Label>
              
              {/* Product Colors Selection */}
              <div className="mt-6">
                <ProductColors
                  colors={product.colors}
                  onColorsChange={handleColorsChange}
                  productImage={previewUrl}
                />
              </div>
              
              {/* <div className="border border-gray-300 rounded-md p-4">
                {previewUrl && (
                  <div className="relative">
                    {product.colors.length > 0 ? (
                      <ColorVariantPreview 
                        productImage={previewUrl}
                        colors={product.colors}
                      />
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>Select colors below to see product color variants</p>
                      </div>
                    )}
                  </div>
                )}
              </div> */}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end space-x-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            className="bg-brand-pink hover:bg-brand-pink/90 px-6"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? (initialProduct ? 'Updating...' : 'Creating...') 
              : (initialProduct ? 'Update Product' : 'Create Product')
            }
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
