'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProductColorVariants from '@/components/ProductColorVariants';
import { fetchProductById } from '@/lib/serverProductService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!productId) {
          setError('Product ID is missing');
          setLoading(false);
          return;
        }
        
        const productData = await fetchProductById(productId);
        
        if (productData) {
          setProduct(productData);
          // Set the first color as selected by default if colors exist
          if (productData.colors && productData.colors.length > 0) {
            setSelectedColor(productData.colors[0]);
          }
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    getProduct();
  }, [productId]);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error || 'Product not found'}</p>
          <Button className="mt-4" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Product Image with Color Variants */}
            <div className="md:w-1/2 p-6">
              <ProductColorVariants
                productImage={product.image}
                colors={product.colors || []}
                onColorSelect={handleColorSelect}
              />
            </div>
            
            {/* Product Details */}
            <div className="md:w-1/2 p-6 md:p-8">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                <button className="text-gray-400 hover:text-red-500">
                  <Heart className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mt-2">
                <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
              </div>
              
              <div className="mt-4">
                <h2 className="text-sm font-medium text-gray-900">Description</h2>
                <p className="mt-2 text-gray-600">{product.description}</p>
              </div>
              
              {/* Category and Subcategory */}
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-gray-100">
                  {product.category}
                </Badge>
                <Badge variant="outline" className="bg-gray-100">
                  {product.subcategory}
                </Badge>
              </div>
              
              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-sm font-medium text-gray-900">Color</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.colors.map((color: string) => (
                      <button
                        key={color}
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedColor === color
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-sm font-medium text-gray-900">Tags</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="bg-gray-100">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Add to Cart Button */}
              <div className="mt-8">
                <Button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}