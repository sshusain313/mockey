'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { TShirtGallery } from '@/app/apparel/tshirt/components/TShirtGallery';
import { IProduct } from '@/models/Product';
import { fetchProductsFromDB } from '@/lib/productActions';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle, Plus } from 'lucide-react';
// import CreateProductButton from '@/components/CreateProductButton';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { 
  calculateResponsiveDesignPositioning, 
  createStandardizedPlaceholder,
  convertToPercentage 
} from '@/utils/designPositioning';

export default function ProductGalleryPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [activeCategory, setActiveCategory] = useState('Blank');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  const [containerSizes, setContainerSizes] = useState<{[key: string]: {width: number, height: number}}>({});
  
  // Refs to store container elements
  const containerRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const imageContainerRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  // Fetch products on component mount
  useEffect(() => {
    loadProducts();
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

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First try using the direct API endpoint
      const response = await fetch('/api/products/direct');
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Products loaded from direct API:', data.length);
      setProducts(data);
    } catch (apiError) {
      console.error('Error loading products from API:', apiError);
      
      try {
        // Fallback to server action if API fails
        console.log('Falling back to server action...');
        const data = await fetchProductsFromDB();
        console.log('Products loaded from server action:', data.length);
        setProducts(data);
      } catch (serverError) {
        console.error('Error loading products from server action:', serverError);
        setError('Failed to load products from database');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductCreated = (updatedProducts: IProduct[]) => {
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

  // Stable ref callback to avoid infinite loops
  const setContainerRef = useCallback((productId: string) => (element: HTMLDivElement | null) => {
    containerRefs.current[productId] = element;
  }, []);

  // Stable ref callback for image containers
  const setImageContainerRef = useCallback((productId: string) => (element: HTMLDivElement | null) => {
    imageContainerRefs.current[productId] = element;
  }, []);

  // Function to render color indicators
  const renderColorIndicators = (colors: string[]) => {
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

    return (
      <div className="flex space-x-1">
        {colors.slice(0, 3).map((color) => (
          <div
            key={color}
            className="w-4 h-4 rounded-full border border-gray-200"
            style={{ backgroundColor: colorMap[color] || "#CCCCCC" }}
            title={color}
          />
        ))}
        {colors.length > 3 && (
          <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
            +{colors.length - 3}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Gallery</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadProducts}
            disabled={isLoading}
          >
            <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {/* <CreateProductButton
            onProductCreated={handleProductCreated}
            useSimpleForm={true}
            buttonText="Add Product"
          /> */}
          <Link href="/admin/products/new">
          <Button
            variant="outline"
            size="sm"
            onClick={loadProducts}
            disabled={isLoading}
          >
          Add Product
          </Button>
          </Link>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          {/* <TabsTrigger value="gallery">Gallery View</TabsTrigger> */}
          <TabsTrigger value="details">Detailed View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>

        {/* Gallery View */}
        {/* <TabsContent value="gallery" className="bg-white rounded-lg shadow-md p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-[600px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-[600px]">
              <div className="text-center p-6">
                <AlertCircle size={32} className="mx-auto text-red-500 mb-2" />
                <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
                <p className="text-gray-700">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadProducts}
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[600px] gap-4">
              <p className="text-gray-500">No products available</p>
              <CreateProductButton
                onProductCreated={handleProductCreated}
                useSimpleForm={true}
                buttonText="Create Your First Product"
              />
            </div>
          ) : (
            <div className="h-[800px]">
              <TShirtGallery
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                uploadedDesign={null}
                products={products}
              />
            </div>
          )}
        </TabsContent> */}

        {/* Detailed View */}
        <TabsContent value="details">
          {isLoading ? (
            <div className="flex items-center justify-center h-[600px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-[600px]">
              <div className="text-center p-6">
                <AlertCircle size={32} className="mx-auto text-red-500 mb-2" />
                <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
                <p className="text-gray-700">{error}</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[600px] gap-4">
              <p className="text-gray-500">No products available</p>
              {/* <CreateProductButton
                onProductCreated={handleProductCreated}
                useSimpleForm={true}
                buttonText="Create Your First Product"
              /> */}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div 
                      className="relative w-full md:w-1/2 aspect-square"
                      ref={setImageContainerRef(product._id)}
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      
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
                      
                      {/* Color variants indicator */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="absolute bottom-2 right-2">
                          {renderColorIndicators(product.colors)}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 w-full md:w-1/2">
                      <h2 className="text-xl font-bold mb-2">{product.name}</h2>
                      <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
                      
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
                        <p>{product.category} / {product.subcategory}</p>
                      </div>
                      
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                        <p className="text-gray-700">{product.description}</p>
                      </div>
                      
                      {product.tags && product.tags.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Tags</h3>
                          <div className="flex flex-wrap gap-1">
                            {product.tags.map(tag => (
                              <span key={tag} className="px-2 py-1 bg-gray-100 rounded-md text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {product.colors && product.colors.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Available Colors</h3>
                          <div className="flex flex-wrap gap-2 items-center">
                            {product.colors.map(color => (
                              <div key={color} className="flex items-center gap-1">
                                <div 
                                  className="w-4 h-4 rounded-full border border-gray-200"
                                  style={{ 
                                    backgroundColor: 
                                      color === 'White' ? '#FFFFFF' :
                                      color === 'Black' ? '#000000' :
                                      color === 'Red' ? '#FF0000' :
                                      color === 'Blue' ? '#0000FF' :
                                      color === 'Green' ? '#00FF00' :
                                      color === 'Yellow' ? '#FFFF00' :
                                      color === 'Navy Blue' ? '#000080' :
                                      color === 'Gray' ? '#808080' : '#CCCCCC'
                                  }}
                                />
                                <span className="text-xs">{color}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Placeholder (Responsive)</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">X:</span> {product.placeholder.x}
                          </div>
                          <div>
                            <span className="text-gray-500">Y:</span> {product.placeholder.y}
                          </div>
                          <div>
                            <span className="text-gray-500">Width:</span> {product.placeholder.width}
                          </div>
                          <div>
                            <span className="text-gray-500">Height:</span> {product.placeholder.height}
                          </div>
                        </div>
                        {/* Show percentage values for reference */}
                        {product.placeholder && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                            <div className="font-medium text-gray-600 mb-1">Percentage Values (for responsive scaling):</div>
                            <div className="grid grid-cols-2 gap-1">
                              <div>X%: {((product.placeholder.x / 400) * 100).toFixed(1)}%</div>
                              <div>Y%: {((product.placeholder.y / 400) * 100).toFixed(1)}%</div>
                              <div>Width%: {((product.placeholder.width / 400) * 100).toFixed(1)}%</div>
                              <div>Height%: {((product.placeholder.height / 400) * 100).toFixed(1)}%</div>
                            </div>
                            {/* Show actual container size for debugging */}
                            {containerSizes[product._id] && (
                              <div className="mt-1 pt-1 border-t border-gray-200">
                                <div className="font-medium text-gray-600">Container Size:</div>
                                <div>Width: {containerSizes[product._id].width}px, Height: {containerSizes[product._id].height}px</div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-400">
                        Created: {new Date(product.createdAt).toLocaleDateString()}
                        {product.updatedAt && ` • Updated: ${new Date(product.updatedAt).toLocaleDateString()}`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Table View */}
        <TabsContent value="table">
          {isLoading ? (
            <div className="flex items-center justify-center h-[600px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-[600px]">
              <div className="text-center p-6">
                <AlertCircle size={32} className="mx-auto text-red-500 mb-2" />
                <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
                <p className="text-gray-700">{error}</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[600px] gap-4">
              <p className="text-gray-500">No products available</p>
              {/* <CreateProductButton
                onProductCreated={handleProductCreated}
                useSimpleForm={true}
                buttonText="Create Your First Product"
              /> */}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-md">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Colors</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="relative w-12 h-12 rounded-md overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{product.category}</div>
                        <div className="text-xs text-gray-400">{product.subcategory}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {product.colors && product.colors.length > 0 ? (
                          <div className="flex items-center">
                            {renderColorIndicators(product.colors)}
                            <span className="ml-2 text-xs text-gray-500">
                              {product.colors.length} colors
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">None</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {product.tags && product.tags.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {product.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded-md text-xs">
                                {tag}
                              </span>
                            ))}
                            {product.tags.length > 2 && (
                              <span className="text-xs text-gray-500">+{product.tags.length - 2}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">None</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
