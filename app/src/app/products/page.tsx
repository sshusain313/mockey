'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchProductsFromDB } from '@/lib/serverProductService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IProduct } from '@/models/Product';
import { AdminProduct } from '@/lib/serverProductService';
import CreateProductButton from '@/components/CreateProductButton';
import { TShirtGallery } from '@/app/apparel/tshirt/components/TShirtGallery';
import { 
  calculateResponsiveDesignPositioning, 
  createStandardizedPlaceholder
} from '@/utils/designPositioning';

export default function ProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [containerSizes, setContainerSizes] = useState<{[key: string]: {width: number, height: number}}>({});
  
  // Refs to store container elements
  const containerRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const imageContainerRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchProductsFromDB();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Update container sizes when products change or window resizes
  useEffect(() => {
    const updateAllContainerSizes = () => {
      const newSizes: {[key: string]: {width: number, height: number}} = {};
      
      Object.keys(imageContainerRefs.current).forEach(productId => {
        const element = imageContainerRefs.current[productId];
        if (element) {
          const rect = element.getBoundingClientRect();
          newSizes[productId] = {
            width: rect.width,
            height: rect.height
          };
        }
      });
      
      setContainerSizes(newSizes);
    };

    // Update sizes after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(updateAllContainerSizes, 100);
    
    // Also update on window resize
    window.addEventListener('resize', updateAllContainerSizes);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateAllContainerSizes);
    };
  }, [products]); // Re-run when products change

  const handleProductCreated = (updatedProducts: AdminProduct[]) => {
    setProducts(updatedProducts);
  };

  // Function to calculate responsive placeholder positioning with dynamic container sizing
  const getResponsivePlaceholderStyle = useCallback((placeholder: any, productId: string) => {
    if (!placeholder) return {};
    
    // Get the actual container size for this product
    const containerSize = containerSizes[productId] || { width: 400, height: 400 };
    
    // Create standardized placeholder with percentage data
    const standardizedPlaceholder = createStandardizedPlaceholder(placeholder, true);
    
    // Use the responsive design positioning system with actual container dimensions
    const positioning = calculateResponsiveDesignPositioning(
      { width: 100, height: 100 }, // dummy design dimensions
      standardizedPlaceholder,
      containerSize.width,
      containerSize.height,
      true // maintainAspectRatio
    );

    return {
      left: `${positioning.x}px`,
      top: `${positioning.y}px`,
      width: `${positioning.width}px`,
      height: `${positioning.height}px`,
    };
  }, [containerSizes]);

  // Stable ref callback for image containers
  const setImageContainerRef = useCallback((productId: string) => (element: HTMLDivElement | null) => {
    imageContainerRefs.current[productId] = element;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <CreateProductButton onProductCreated={handleProductCreated} />
      </div>
      
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="gallery">Gallery View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          {products.length === 0 ? (
            <div className="text-center p-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-700">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link 
                  key={product._id} 
                  href={`/products/${product._id}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                    <div 
                      className="relative aspect-square bg-gray-100"
                      ref={setImageContainerRef(product._id)}
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      
                      {/* Color variants indicator */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="absolute bottom-2 right-2 flex space-x-1">
                          {product.colors.slice(0, 3).map((color: string) => {
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
                              <div 
                                key={color} 
                                className="w-4 h-4 rounded-full border border-white" 
                                style={{ backgroundColor: colorValue }}
                                title={color}
                              ></div>
                            );
                          })}
                          
                          {product.colors.length > 3 && (
                            <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 border border-white">
                              +{product.colors.length - 3}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Placeholder overlay positioned relative to image container only */}
                      {product.placeholder && (
                        <div 
                          className="absolute border border-dashed border-red-300 pointer-events-none"
                          style={{
                            ...getResponsivePlaceholderStyle(product.placeholder, product._id),
                            opacity: 0.5
                          }}
                        />
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h2 className="text-lg font-semibold text-gray-900 mb-1 truncate">{product.name}</h2>
                      <p className="text-gray-600 mb-2">${product.price.toFixed(2)}</p>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        <Badge variant="outline" className="text-xs bg-gray-50">
                          {product.category}
                        </Badge>
                        {product.tags && product.tags.length > 0 && (
                          <Badge variant="outline" className="text-xs bg-gray-50">
                            {product.tags[0]}
                            {product.tags.length > 1 && `+${product.tags.length - 1}`}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="gallery">
          <div className="bg-white rounded-lg shadow-md p-4">
            <TShirtGalleryWrapper products={products} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Wrapper component for TShirtGallery
function TShirtGalleryWrapper({ products }: { products: AdminProduct[] }) {
  const [activeCategory, setActiveCategory] = useState('Blank');
  const [localProducts, setLocalProducts] = useState<AdminProduct[]>(products);
  
  // Update local products when props change
  useEffect(() => {
    setLocalProducts(products);
  }, [products]);
  
  const handleProductCreated = (updatedProducts: AdminProduct[]) => {
    setLocalProducts(updatedProducts);
  };
  
  return (
    <div className="h-[800px] overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-4 px-4">
        <h3 className="text-lg font-medium">T-Shirt Gallery</h3>
        <CreateProductButton 
          onProductCreated={handleProductCreated} 
          useSimpleForm={true}
          buttonText="Add Product"
          buttonVariant="outline"
        />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="h-full">
          {localProducts && localProducts.length > 0 ? (
            <div className="h-full">
              <TShirtGallery 
                activeCategory={activeCategory} 
                setActiveCategory={setActiveCategory} 
                uploadedDesign={null}
                products={localProducts as unknown as IProduct[]}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <p className="text-gray-500">No products available in gallery view</p>
              <CreateProductButton 
                onProductCreated={handleProductCreated} 
                useSimpleForm={true}
                buttonText="Create Your First Product"
                buttonVariant="default"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
