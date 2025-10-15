'use client';

import { useState, useEffect } from 'react';
import { TShirtGallery } from '@/app/apparel/tshirt/components/TShirtGallery';
import CreateProductButton from '@/components/CreateProductButton';
import { IProduct } from '@/models/Product';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function GalleryPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [activeCategory, setActiveCategory] = useState('Blank');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      setError('Error loading products');
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductCreated = (updatedProducts: IProduct[]) => {
    setProducts(updatedProducts);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h1 className="text-2xl font-bold">T-Shirt Gallery</h1>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchProducts}
                disabled={isLoading}
              >
                <RefreshCw size={16} className="mr-2" />
                Refresh
              </Button>
              <CreateProductButton 
                onProductCreated={handleProductCreated} 
                useSimpleForm={true}
              />
            </div>
          </div>
          
          <div className="h-[800px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-6">
                  <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
                  <p className="text-gray-700">{error}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchProducts}
                    className="mt-4"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <p className="text-gray-500">No products available</p>
                <CreateProductButton 
                  onProductCreated={handleProductCreated} 
                  useSimpleForm={true}
                  buttonText="Create Your First Product"
                />
              </div>
            ) : (
              <TShirtGallery 
                activeCategory={activeCategory} 
                setActiveCategory={setActiveCategory} 
                uploadedDesign={null}
                products={products}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
