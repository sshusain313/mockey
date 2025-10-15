'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Sidebar from './components/SidebarNew';
// import PngColorSelector from './components/PngColorSelector';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { IProduct, ColorVariant } from '@/models/Product';
import { getProductById } from '@/utils/productService';
import { saveDesign } from './actions';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';

// Dynamically import Konva components with no SSR
const KonvaComponents = dynamic(() => import('./components/KonvaComponents'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
});

// Loading component
const LoadingState = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Main Editor Page
const EditorPage = () => {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [designImage, setDesignImage] = useState<string | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [saveMessage, setSaveMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [colorValue, setColorValue] = useState('#FFFFFF');
  const [warpingValue, setWarpingValue] = useState(0);
  const [unclipDesign, setUnclipDesign] = useState(false);
  // Additional wrapping state variables
  const [warpingDirection, setWarpingDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const [warpingStyle, setWarpingStyle] = useState<'wave' | 'bulge' | 'pinch'>('wave');
  const [warpingFrequency, setWarpingFrequency] = useState(3);
  const [warpingAmplitude, setWarpingAmplitude] = useState(10);
  const [warpingPhase, setWarpingPhase] = useState(0);
  const [processedDesignImage, setProcessedDesignImage] = useState<string | null>(null);
  const [processedProductImage, setProcessedProductImage] = useState<string | null>(null);
  // Rotation state
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  // Scaling state
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);
  
  // Refs
  const editorRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  // Check for both 'image' and 'designImage' parameters to ensure compatibility
  const imageParam = searchParams.get('image');
  const designImageParam = searchParams.get('designImage') || imageParam;
  
  // Handle saving design to database
  const handleSaveDesign = async () => {
    if (!product || !designImage) {
      setSaveMessage({
        type: 'error',
        text: 'Cannot save: Missing product or design image'
      });
      return;
    }
    
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      // Get the design image from the Konva stage
      let designImageToSave = designImage;
      
      // If we have a stage reference, we can capture the current state
      if (stageRef.current) {
        const dataURL = stageRef.current.toDataURL();
        designImageToSave = dataURL;
      }
      
      // Save the design to the database
      const result = await saveDesign({
        productId: product._id,
        designImage: designImageToSave,
        userId: localStorage.getItem('userId') || 'anonymous'
      });
      
      if (result.success) {
        setSaveMessage({
          type: 'success',
          text: 'Design saved successfully!'
        });
        
        // Store the design ID for future reference
        if (result.designId) {
          localStorage.setItem('lastSavedDesignId', result.designId);
        }
      } else {
        setSaveMessage({
          type: 'error',
          text: result.message || 'Failed to save design'
        });
      }
    } catch (error) {
      console.error('Error saving design:', error);
      setSaveMessage({
        type: 'error',
        text: 'An unexpected error occurred while saving'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      
      try {
        // First try to get product ID from URL parameter
        let productIdToFetch = productId;
        
        // Check if we have a mockupId parameter (for backward compatibility)
        const mockupId = searchParams.get('mockupId');
        if (!productIdToFetch && mockupId) {
          console.log('Using mockupId as productId:', mockupId);
          productIdToFetch = mockupId;
        }
        
        if (!productIdToFetch) {
          // Try to get product ID from localStorage as fallback
          const storedProductId = localStorage.getItem('selectedProductId');
          if (storedProductId) {
            console.log('Using product ID from localStorage:', storedProductId);
            productIdToFetch = storedProductId;
          }
        }
        
        if (productIdToFetch) {
          console.log('Fetching product with ID:', productIdToFetch);
          try {
            const productData = await getProductById(productIdToFetch);
            console.log('Product data fetched:', productData);
            
            if (productData) {
              setProduct(productData);
              
              // Store the product ID in localStorage for persistence
              localStorage.setItem('selectedProductId', productIdToFetch);
              
              // Log successful product fetch
              console.log(`Successfully loaded product: ${productData.name}`);
              console.log(`Product details: ${productData.category} - ${productData.subcategory}`);
              console.log(`Placeholder: x=${productData.placeholder.x}, y=${productData.placeholder.y}, w=${productData.placeholder.width}, h=${productData.placeholder.height}`);
            } else {
              console.error('Product data is null or undefined');
              useFallbackProduct();
            }
          } catch (fetchError) {
            console.error('Error fetching product from server:', fetchError);
            useFallbackProduct();
          }
        } else {
          console.log('No product ID found, using fallback');
          useFallbackProduct();
        }
      } catch (error) {
        console.error('Error in product fetch process:', error);
        useFallbackProduct();
      } finally {
        setIsLoading(false);
      }
    };
    
    // Helper function to use fallback product from localStorage
    const useFallbackProduct = () => {
      console.log('Using fallback product from localStorage');
      const storedProductImage = localStorage.getItem('selectedProductImage');
      const storedPlaceholder = localStorage.getItem('productPlaceholder');
      
      if (storedProductImage && storedPlaceholder) {
        try {
          const parsedPlaceholder = JSON.parse(storedPlaceholder);
          // Create a fallback product with the required properties
          // Use type assertion with unknown first to avoid direct casting error
          const fallbackProduct = {
            _id: 'fallback',
            name: 'Custom T-Shirt',
            description: 'A custom t-shirt with your design',
            category: 'Apparel',
            subcategory: 'T-Shirts',
            price: 24.99,
            image: storedProductImage,
            tags: ['Custom', 'T-Shirt'],
            colors: ['White'],
            colorVariants: [] as ColorVariant[],
            placeholder: parsedPlaceholder,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          } as unknown as IProduct;
          
          setProduct(fallbackProduct);
          console.log('Fallback product created with stored image and placeholder');
        } catch (error) {
          console.error('Error parsing placeholder:', error);
          setProduct(null);
        }
      } else {
        console.error('No stored product image or placeholder found');
        setProduct(null);
      }
    };
    
    fetchProduct();
  }, [productId]);
  
  // Get design image from URL parameter or localStorage
  useEffect(() => {
    const loadDesignImage = () => {
      try {
        // First try to get the design from the URL parameter
        if (designImageParam) {
          console.log('Setting design image from URL parameter:', designImageParam);
          // If it's a server-uploaded image path (starts with /uploads/)
          if (designImageParam.startsWith('/uploads/')) {
            setDesignImage(designImageParam);
            // Store the path for future use
            localStorage.setItem('userUploadedDesignPath', designImageParam);
            return;
          }
          
          // Otherwise it might be a base64 image or other URL
          try {
            const decodedImage = decodeURIComponent(designImageParam);
            setDesignImage(decodedImage);
            // Also store in localStorage for persistence
            localStorage.setItem('uploadedDesignImage', decodedImage);
          } catch (decodeError) {
            console.error('Error decoding design image URL parameter:', decodeError);
            setDesignImage(designImageParam);
            localStorage.setItem('uploadedDesignImage', designImageParam);
          }
          return;
        }
        
        // Check for server-uploaded image path in localStorage (preferred method)
        const storedDesignPath = localStorage.getItem('userUploadedDesignPath');
        if (storedDesignPath) {
          console.log('Setting design image from localStorage path');
          setDesignImage(storedDesignPath);
          return;
        }
        
        // Fall back to full image data in localStorage
        const storedDesignImage = localStorage.getItem('uploadedDesignImage') || 
                                 localStorage.getItem('userUploadedDesign') || 
                                 localStorage.getItem('userUploadedDesignPreview');
        if (storedDesignImage) {
          console.log('Setting design image from localStorage data URL');
          setDesignImage(storedDesignImage);
          return;
        }
        
        console.log('No design image found');
      } catch (error) {
        console.error('Error loading design image:', error);
      }
    };
    
    loadDesignImage();
  }, [designImageParam]);
  
  // Update container size when window is resized
  useEffect(() => {
    const updateContainerSize = () => {
      if (editorRef.current) {
        // Get the actual dimensions of the editor container
        const { clientWidth, clientHeight } = editorRef.current;
        
        // Set a minimum height to prevent the canvas from being too small
        const minHeight = 400;
        // Set a maximum width and height to maintain design consistency
        const maxWidth = 800; // Limit maximum width
        const maxHeight = 800; // Limit maximum height
        
        // Calculate effective dimensions with min/max constraints
        const effectiveWidth = Math.min(maxWidth, clientWidth);
        const effectiveHeight = Math.min(maxHeight, Math.max(clientHeight, minHeight));
        
        // Maintain aspect ratio (16:9) if needed
        // const aspectRatio = 16 / 9;
        // const heightBasedOnWidth = effectiveWidth / aspectRatio;
        // const widthBasedOnHeight = effectiveHeight * aspectRatio;
        
        // if (heightBasedOnWidth <= effectiveHeight) {
        //   effectiveHeight = heightBasedOnWidth;
        // } else {
        //   effectiveWidth = widthBasedOnHeight;
        // }
        
        // Update the container size state
        setContainerSize({
          width: effectiveWidth,
          height: effectiveHeight
        });
        
        console.log(`Container size updated: ${effectiveWidth}x${effectiveHeight} (original: ${clientWidth}x${clientHeight})`);
      }
    };
    
    // Initial size update
    updateContainerSize();
    
    // Add resize event listener
    window.addEventListener('resize', updateContainerSize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', updateContainerSize);
    };
  }, []);
  
  // Process product image when color changes
  useEffect(() => {
    if (product?.image && colorValue) {
      const processProductImage = async () => {
        try {
          // Import the image processor dynamically
          const { processImageColors } = await import('@/app/utils/imageColorProcessor');
          
          // Process the product image with the selected color
          const processedProductUrl = await processImageColors(product.image, [colorValue]);
          
          // Update the processed product image
          setProcessedProductImage(processedProductUrl);
        } catch (error) {
          console.error('Error processing product image color:', error);
        }
      };
      
      processProductImage();
    }
  }, [colorValue, product?.image]);
  
  // Toggle aspect ratio maintenance
  const handleToggleAspectRatio = () => {
    setMaintainAspectRatio(!maintainAspectRatio);
  };
  
  // Handle back navigation
  const handleBackToGallery = () => {
    router.push('/apparel/tshirt');
  };

  // Handle download
  const handleDownload = () => {
    if (stageRef.current) {
      const dataURL = stageRef.current.toDataURL();
      const link = document.createElement('a');
      link.download = 'design.png';
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  // Render the editor
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header with back button and save button */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBackToGallery}
          className="flex items-center gap-1"
        >
          <ArrowLeft size={16} />
          Back to Gallery
        </Button>
        
        <div className="flex items-center gap-2">
          {saveMessage && (
            <div className={`text-sm px-3 py-1 rounded ${saveMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {saveMessage.text}
            </div>
          )}
          
          <Button
            variant="default"
            size="sm"
            onClick={handleSaveDesign}
            disabled={isSaving || !product || !designImage}
            className="flex items-center gap-1"
          >
            {isSaving ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1" />
            ) : (
              <Save size={16} />
            )}
            {isSaving ? 'Saving...' : 'Save Design'}
          </Button>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 h-screen flex-shrink-0 overflow-y-auto">
          <Sidebar
            colorValue={colorValue}
            setColorValue={setColorValue}
            warpingValue={warpingValue}
            setWarpingValue={setWarpingValue}
            unclipDesign={unclipDesign}
            setUnclipDesign={setUnclipDesign}
            activeDesign={processedDesignImage || designImage}
            // Additional wrapping properties
            warpingDirection={warpingDirection}
            setWarpingDirection={setWarpingDirection}
            warpingStyle={warpingStyle}
            setWarpingStyle={setWarpingStyle}
            warpingFrequency={warpingFrequency}
            setWarpingFrequency={setWarpingFrequency}
            warpingAmplitude={warpingAmplitude}
            setWarpingAmplitude={setWarpingAmplitude}
            warpingPhase={warpingPhase}
            setWarpingPhase={setWarpingPhase}
            setActiveDesign={setDesignImage}
            handleDownload={handleDownload}
            availableColors={product?.colors || []}
            rotationX={rotationX}
            setRotationX={setRotationX}
            rotationY={rotationY}
            setRotationY={setRotationY}
            scaleX={scaleX}
            setScaleX={setScaleX}
            scaleY={scaleY}
            setScaleY={setScaleY}
            maintainAspectRatio={maintainAspectRatio}
            setMaintainAspectRatio={setMaintainAspectRatio}
          />
          
          {/* PNG Color Selector */}
          {product && product.image && (
            <div className="px-4 pb-4">
  
            </div>
          )}
        </div>
        
        {/* Main editor area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden" ref={editorRef}>
            {isLoading ? (
              <LoadingState />
            ) : product ? (
              <Suspense fallback={<LoadingState />}>
                <KonvaComponents
                  productImage={processedProductImage || product.image}
                  designImage={designImage}
                  placeholder={product.placeholder}
                  containerWidth={containerSize.width}
                  containerHeight={containerSize.height}
                  categories={product.tags}
                  stageRef={stageRef}
                  maintainAspectRatio={maintainAspectRatio}
                  onToggleAspectRatio={handleToggleAspectRatio}
                  productName={product.name}
                  productDescription={product.description}
                  productPrice={product.price}
                  customShapePoints={product.customShapePoints || []}
                  colorValue={colorValue}
                  // Rotation props and handler
                  rotationX={rotationX}
                  rotationY={rotationY}
                  onRotationChange={(newRotationX, newRotationY) => {
                    setRotationX(newRotationX);
                    setRotationY(newRotationY);
                  }}
                  // Scaling props
                  scaleX={scaleX}
                  scaleY={scaleY}
                  onScaleChange={(newScaleX, newScaleY) => {
                    // Update the scale values
                    setScaleX(newScaleX);
                    setScaleY(newScaleY);
                  }}
                  // Wrapping props
                  warpingValue={warpingValue}
                  warpingDirection={warpingDirection}
                  warpingStyle={warpingStyle}
                  warpingFrequency={warpingFrequency}
                  warpingAmplitude={warpingAmplitude}
                  warpingPhase={warpingPhase}
                />
              </Suspense>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-50">
                <div className="text-center p-8 max-w-md">
                  <div className="mb-4 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No product selected</h3>
                  <p className="text-gray-500 mb-4">Please select a product from the gallery to start designing.</p>
                  <Button
                    onClick={handleBackToGallery}
                    className="inline-flex items-center"
                  >
                    <ArrowLeft size={16} className="mr-2" />
                    Go to Gallery
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
