import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import MockupCanvas from '@/components/MockupCanvas';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ImageIcon, Layers, Loader2 } from 'lucide-react';
import { uploadDesignImage } from '@/app/editor/actions';

// Extended placeholder interface with percentage-based properties
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

interface ProductImageUploadProps {
  productImage: File | null;
  onImageChange: (file: File | null) => void;
  mockupImage: string | null;
  onMockupChange: (dataUrl: string) => void;
  category: string;
  subcategory: string;
  placeholder?: PlaceholderWithPercentage;
  onPlaceholderChange?: (
    placeholder: PlaceholderWithPercentage,
    view?: string,
    customShapePoints?: Array<{x: number, y: number}>
  ) => void;
}

const ProductImageUpload: React.FC<ProductImageUploadProps> = ({
  productImage,
  onImageChange,
  mockupImage,
  onMockupChange,
  category,
  subcategory,
  placeholder,
  onPlaceholderChange,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeImageTab, setActiveImageTab] = useState<'upload' | 'mockup'>('upload');
  const [error, setError] = useState<string | null>(null);
  const [hasTransparency, setHasTransparency] = useState<boolean | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Clean up the preview URL when the component unmounts
  useEffect(() => {
    return () => {
      // Revoke the object URL to avoid memory leaks
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  
  // Function to check if an image has transparency
  const checkImageTransparency = (imageUrl: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Create a canvas to analyze the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          resolve(false);
          return;
        }
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0);
        
        // Get the image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Check if any pixel has alpha < 255 (not fully opaque)
        for (let i = 3; i < data.length; i += 4) {
          if (data[i] < 255) {
            resolve(true);
            return;
          }
        }
        
        resolve(false);
      };
      
      img.onerror = () => {
        resolve(false);
      };
      
      img.src = imageUrl;
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check if the file is a PNG by both MIME type and extension
      const isPngMimeType = file.type === 'image/png';
      const isPngExtension = file.name.toLowerCase().endsWith('.png');
      
      if (!isPngMimeType || !isPngExtension) {
        setError('Only PNG images are allowed. Please select a PNG file.');
        e.target.value = ''; // Reset the input
        return;
      }
      
      // Check file size (limit to 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setError(`File size exceeds 5MB limit. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`);
        e.target.value = ''; // Reset the input
        return;
      }
      
      try {
        setIsUploading(true);
        
        // First create a local preview for immediate feedback
        const reader = new FileReader();
        reader.onload = async (event) => {
          if (event.target?.result) {
            const dataUrl = event.target.result as string;
            const img = new Image();
            
            img.onload = async () => {
              // Check if the image has transparency
              const url = URL.createObjectURL(file);
              const transparency = await checkImageTransparency(url);
              setHasTransparency(transparency);
              
              // Set the preview URL
              setPreviewUrl(url);
              
              // Upload the image to the server
              try {
                const formData = new FormData();
                formData.append('design', file);
                
                const result = await uploadDesignImage(formData);
                
                if (result.success && result.imagePath) {
                  // Store the server path for later use
                  localStorage.setItem('productImagePath', result.imagePath);
                  
                  // Pass the file to the parent component
                  onImageChange(file);
                } else {
                  // If server upload fails, still use the local file
                  console.error('Server upload failed, using local file only:', result.error);
                  onImageChange(file);
                }
              } catch (uploadError) {
                console.error('Error uploading to server:', uploadError);
                // Still use the local file if server upload fails
                onImageChange(file);
              }
            };
            
            img.onerror = () => {
              setError('The selected file is not a valid image. Please select another file.');
              e.target.value = ''; // Reset the input
            };
            
            img.src = dataUrl;
          }
        };
        
        reader.onerror = () => {
          setError('Failed to read the file. Please try again.');
          e.target.value = ''; // Reset the input
        };
        
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error processing image:', error);
        setError('An error occurred while processing the image. Please try again.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleMockupExport = (dataUrl: string) => {
    onMockupChange(dataUrl);
  };

  return (
    <div className="space-y-2">
      <Label className="text-gray-700 font-medium">Product Image</Label>

      <Tabs
        defaultValue="upload"
        value={activeImageTab}
        onValueChange={(value) => setActiveImageTab(value as 'upload' | 'mockup')}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Upload Image
          </TabsTrigger>
          <TabsTrigger
            value="mockup"
            disabled={!productImage}
            className="flex items-center gap-2"
          >
            <Layers className="h-4 w-4" />
            Create Mockup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <div
            className={`border-2 border-dashed ${
              error ? 'border-red-500' : previewUrl ? 'border-brand-pink' : 'border-gray-300'
            } rounded-md p-6 flex flex-col items-center justify-center transition-colors`}
          >
            <input
              id="product-image"
              type="file"
              accept="image/png"
              onChange={handleImageChange}
              className="hidden" /* Hide the actual input */
              disabled={isUploading}
            />
            {isUploading && (
              <div className="flex items-center mt-2 text-blue-600 text-sm">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading image...
              </div>
            )}
            <label htmlFor="product-image" className="cursor-pointer w-full">
              {previewUrl ? (
                <div className="flex flex-col items-center">
                  <div className="relative w-40 h-40 mb-4 overflow-hidden rounded-md">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="text-sm font-medium text-brand-pink">{productImage?.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {productImage && Math.round(productImage.size / 1024)} KB
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 flex flex-col items-center justify-center rounded-lg bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-gray-400 mb-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-xs font-bold text-blue-500">.PNG</span>
                  </div>
                  <Button 
                    type="button" 
                    className="bg-brand-pink hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-md"
                    onClick={() => document.getElementById('product-image')?.click()}
                  >
                    Choose PNG Image
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">Click to browse files</p>
                  <div className="mt-2 flex justify-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      PNG files only
                    </span>
                  </div>
                </div>
              )}
            </label>
          </div>
          
          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-medium text-red-800">Upload Error</span>
              </div>
              <p className="text-sm text-red-700 ml-7">{error}</p>
              <div className="mt-2 ml-7 text-xs text-red-600">
                Please select a valid PNG file to continue.
              </div>
            </div>
          )}
          
          {/* Transparency warning or success */}
          {hasTransparency === false && previewUrl && !error ? (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-center mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-medium text-yellow-800">Transparency Warning</span>
              </div>
              <p className="text-sm text-yellow-700 ml-7">
                Your image doesn't have a transparent background. For best results, use a PNG with transparency.
              </p>
              <div className="mt-2 ml-7 text-xs text-yellow-600">
                Images with solid backgrounds may not look good when placed on products.
              </div>
            </div>
          ) : hasTransparency === true && previewUrl && !error ? (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium text-green-800">Perfect! Transparency Detected</span>
              </div>
              <p className="text-sm text-green-700 ml-7">
                Your PNG has a transparent background, which is ideal for product mockups.
              </p>
              <div className="mt-2 ml-7 text-xs text-green-600">
                You can proceed to the "Create Mockup" tab to see your design on the product.
              </div>
            </div>
          ) : null}
          
          <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-sm">Image Requirements:</span>
            </div>
            <ul className="text-xs text-gray-600 space-y-1 pl-6 list-disc">
              <li><span className="font-semibold">Format:</span> PNG files only (.png extension)</li>
              <li><span className="font-semibold">Size:</span> Maximum 5MB</li>
              <li><span className="font-semibold">Transparency:</span> PNG format supports transparency which is ideal for product mockups</li>
              <li><span className="font-semibold">Resolution:</span> Recommended minimum 1000x1000 pixels for best quality</li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="mockup">
          {productImage ? (
            <div className="border rounded-lg">
              {activeImageTab === 'mockup' && (
                <div className="p-4">
                  <ErrorBoundary
                    fallback={
                      <div className="p-4 text-red-500">
                        Error loading mockup canvas. Please try again.
                      </div>
                    }
                  >
                    <MockupCanvas
                      key={`mockup-canvas-${productImage.name}`}
                      backgroundImage={previewUrl} // Pass the preview URL as the background image
                      onExport={handleMockupExport}
                      productCategory={category}
                      productSubcategory={subcategory}
                      initialPlaceholder={placeholder}
                      onPlaceholderChange={onPlaceholderChange}
                    />
                  </ErrorBoundary>
                </div>
              )}

              {mockupImage && (
                <div className="mt-4 p-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-700">Generated Mockup</h4>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      Ready to use
                    </Badge>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-md">
                    <img
                      src={mockupImage}
                      alt="Product Mockup"
                      className="max-h-40 object-contain mx-auto"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-md p-8 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500">Please upload a product image first</p>
                <Button
                  variant="link"
                  onClick={() => setActiveImageTab('upload')}
                  className="mt-2 text-brand-pink"
                >
                  Go to upload
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductImageUpload;
