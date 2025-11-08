'use client';

import { useState, useEffect } from "react";
import { TShirtSidebar } from "./TShirtSidebar";
import { TShirtGallery } from "./TShirtGallery";
import { TShirtHeader } from "./TShirtHeader";
import { IProduct } from "@/models/Product";

interface TShirtMockupLayoutProps {
  products?: IProduct[];
}

export function TShirtMockupLayout({ products = [] }: TShirtMockupLayoutProps) {
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");
  const [activeCategory, setActiveCategory] = useState("Blank");
  const [uploadedDesign, setUploadedDesign] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Debug log to see what products are being passed
  useEffect(() => {
    console.log('TShirtMockupLayout received products count:', products.length);
    // Log the first product to check its structure
    if (products.length > 0) {
      console.log('First product sample:', {
        _id: products[0]._id,
        name: products[0].name,
        placeholder: products[0].placeholder,
        createdAt: products[0].createdAt
      });
    }
  }, [products]);
  
  // Detect mobile screen size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <div className="min-h-screen flex flex-col w-full bg-white">
      {/* Mobile Header */}
      {isMobile && (
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-3 flex justify-between items-center shadow-sm">
          <h1 className="text-lg font-bold">Jersey Gallery</h1>
          {uploadedDesign && (
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
              <div className="w-5 h-5 rounded-full border border-gray-200 overflow-hidden">
                <img
                  src={uploadedDesign}
                  alt="Your design"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs text-gray-600">Design</span>
            </div>
          )}
        </div>
      )}
      
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Sidebar - only shown on desktop */}
        {!isMobile && (
          <TShirtSidebar 
            selectedColor={selectedColor} 
            setSelectedColor={setSelectedColor}
            uploadedDesign={uploadedDesign}
            setUploadedDesign={setUploadedDesign}
          />
        )}
        
        <div className="flex-1 flex flex-col">
          {!isMobile && <TShirtHeader />}
          <TShirtGallery 
            activeCategory={activeCategory} 
            setActiveCategory={setActiveCategory}
            uploadedDesign={uploadedDesign}
            products={products}
            selectedColor={selectedColor}
          />
        </div>
      </div>
    </div>
  );
}
