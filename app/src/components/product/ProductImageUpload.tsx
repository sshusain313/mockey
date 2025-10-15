import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import CleanMockupCanvas from '@/components/CleanMockupCanvas';
import { ImageIcon, Layers } from 'lucide-react';

interface ProductImageUploadProps {
  productImage: File | null;
  onImageChange: (file: File | null) => void;
  mockupImage: string | null;
  onMockupChange: (dataUrl: string) => void;
  category: string;
  subcategory: string;
}

const ProductImageUpload: React.FC<ProductImageUploadProps> = ({
  productImage,
  onImageChange,
  mockupImage,
  onMockupChange,
  category,
  subcategory
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeImageTab, setActiveImageTab] = useState<'upload' | 'mockup'>('upload');

  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check if the file is a PNG
      if (file.type !== 'image/png') {
        setError('Only PNG images are allowed. Please select a PNG file.');
        e.target.value = ''; // Reset the input
        return;
      }
      
      onImageChange(file);
      
      // Create a preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
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
          <div className={`border-2 border-dashed ${error ? 'border-red-500' : previewUrl ? 'border-brand-pink' : 'border-gray-300'} rounded-md p-6 flex flex-col items-center justify-center transition-colors`}>
            <Input
              id="image"
              type="file"
              onChange={handleImageChange}
              className="hidden"
              accept="image/png"
            />
            <label htmlFor="image" className="cursor-pointer w-full">
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
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium">Choose Image</p>
                  <p className="text-xs text-gray-500 mt-1">Click to browse</p>
                </div>
              )}
            </label>
          </div>
          
          {error && (
            <div className="mt-2 text-sm text-red-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}
          
          <div className="mt-2 text-xs text-gray-500 text-center">
            <span className="font-medium">Note:</span> Only PNG images are accepted
          </div>
        </TabsContent>
        
        <TabsContent value="mockup">
          {productImage ? (
            <div className="border rounded-lg">
              <CleanMockupCanvas 
                productImage={productImage}
                onExport={handleMockupExport}
                productCategory={category}
                productSubcategory={subcategory}
              />
              
              {mockupImage && (
                <div className="mt-4 p-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-700">Generated Mockup</h4>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
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
