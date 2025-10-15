'use client';

import { useState, useEffect } from 'react';
import { TShirtGallery } from '@/app/apparel/tshirt/components/TShirtGallery';
import CreateProductButton from './CreateProductButton';
import { IProduct } from '@/models/Product';

export default function ProductGalleryContainer() {
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
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-bold">Product Gallery</h1>
        <CreateProductButton onProductCreated={handleProductCreated} />
      </div>
      
      <div className="flex-1">
        <TShirtGallery 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory} 
          uploadedDesign={null}
          products={products}
        />
      </div>
    </div>
  );
}
