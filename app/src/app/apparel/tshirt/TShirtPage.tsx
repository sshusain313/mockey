'use client';

import React, { useState, useEffect } from 'react';
import { getTShirtProducts } from './actions';
import { IProduct } from '@/models/Product';

// Create a simple ProductGrid component since it doesn't exist
const ProductGrid = ({ products }: { products: IProduct[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {products.map(product => (
      <div key={product._id} className="bg-white rounded-lg shadow overflow-hidden">
        <div className="h-48 w-full relative">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-gray-600 text-sm mt-1">{product.description.substring(0, 100)}...</p>
          <div className="mt-2 flex justify-between items-center">
            <span className="font-bold text-blue-600">${product.price.toFixed(2)}</span>
            <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
              Customize
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Simple loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Simple sidebar component
const TShirtSidebar = ({ 
  onColorSelect, 
  selectedColor,
  onPriceRangeChange,
  priceRange
}: { 
  onColorSelect: (color: string | null) => void;
  selectedColor: string | null;
  onPriceRangeChange: (range: [number, number]) => void;
  priceRange: [number, number];
}) => (
  <div className="w-full md:w-64 bg-white p-4 border-r border-gray-200">
    <h2 className="text-xl font-bold mb-4">Filters</h2>
    
    <div className="mb-4">
      <h3 className="font-medium mb-2">Colors</h3>
      <div className="flex flex-wrap gap-2">
        {['White', 'Black', 'Red', 'Blue', 'Green'].map(color => (
          <button
            key={color}
            onClick={() => onColorSelect(selectedColor === color ? null : color)}
            className={`w-6 h-6 rounded-full border ${selectedColor === color ? 'ring-2 ring-blue-500' : ''}`}
            style={{ backgroundColor: color.toLowerCase() }}
            aria-label={color}
          />
        ))}
      </div>
    </div>
    
    <div className="mb-4">
      <h3 className="font-medium mb-2">Price Range</h3>
      <div className="flex items-center justify-between">
        <span>${priceRange[0]}</span>
        <span>${priceRange[1]}</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={priceRange[1]}
        onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value)])}
        className="w-full mt-2"
      />
    </div>
  </div>
);

const TShirtPage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Use the dedicated function to fetch only t-shirt products
        const tshirtProducts = await getTShirtProducts();
        setProducts(tshirtProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching t-shirt products:', err);
        setError('Failed to load t-shirt products. Please try again later.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on selected filters
  const filteredProducts = products.filter(product => {
    // Filter by color if selected
    if (selectedColor && !product.colors.includes(selectedColor)) {
      return false;
    }

    // Filter by price range
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }

    return true;
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <TShirtSidebar 
        onColorSelect={setSelectedColor}
        onPriceRangeChange={setPriceRange}
        selectedColor={selectedColor}
        priceRange={priceRange}
      />
      
      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6">T-Shirts</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md">
            No t-shirts found matching your filters. Try adjusting your selection.
          </div>
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
      </main>
    </div>
  );
};

export default TShirtPage;
