'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { fetchProductById } from '@/lib/serverProductService';
import ProductColorVariants from '@/components/ProductColorVariants';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Palette } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ProductColorPreviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (status === 'authenticated') {
      if (session?.user?.role !== 'admin') {
        router.push('/'); // Redirect non-admin users
      } else {
        fetchProduct();
      }
    } else if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, session, router]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const productData = await fetchProductById(id as string);
      
      if (productData) {
        setProduct(productData);
        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0]);
        }
      } else {
        setError('Product not found');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product data');
    } finally {
      setLoading(false);
    }
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  const handleBack = () => {
    router.back();
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
          <Button className="mt-4" onClick={handleBack}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Product
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">{product.name} - Color Variants</h1>
              <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1.5">
                <Palette className="h-4 w-4" />
                {product.colors?.length || 0} Colors
              </Badge>
            </div>
          </div>
          
          <div className="p-6">
            {product.colors && product.colors.length > 0 ? (
              <div className="max-w-2xl mx-auto">
                <ProductColorVariants
                  productImage={product.image}
                  colors={product.colors}
                  onColorSelect={handleColorSelect}
                />
                
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h2 className="text-lg font-medium mb-2">Available Colors</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color: string) => {
                      // Get color value based on color name
                      const colorMap: Record<string, string> = {
                        "Black": "#000000",
                        "White": "#FFFFFF",
                        "Red": "#FF0000",
                        "Green": "#008000",
                        "Blue": "#0000FF",
                        "Yellow": "#FFFF00",
                        "Purple": "#800080",
                        "Orange": "#FFA500",
                        "Pink": "#FFC0CB",
                        "Gray": "#808080",
                        "Brown": "#A52A2A",
                        "Navy Blue": "#000080",
                        "Teal": "#008080",
                        "Olive": "#808000",
                        "Maroon": "#800000"
                      };
                      const colorValue = colorMap[color] || "#CCCCCC";
                      
                      return (
                        <button
                          key={color}
                          className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                            selectedColor === color
                              ? 'bg-gray-900 text-white'
                              : 'bg-white border border-gray-200 text-gray-800'
                          }`}
                          onClick={() => handleColorSelect(color)}
                        >
                          <span 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: colorValue }}
                          ></span>
                          {color}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-8">
                <p className="text-gray-500">This product has no color variants defined.</p>
                <Button 
                  className="mt-4"
                  onClick={() => router.push(`/admin/products/edit/${product._id}`)}
                >
                  Edit Product to Add Colors
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}