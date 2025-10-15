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
  
  return (
    <div className="min-h-screen flex flex-col w-full bg-white">
      <div className="flex flex-1 overflow-hidden">
        <TShirtSidebar 
          selectedColor={selectedColor} 
          setSelectedColor={setSelectedColor}
          uploadedDesign={uploadedDesign}
          setUploadedDesign={setUploadedDesign}
        />
        <div className="flex-1 flex flex-col">
          <TShirtHeader />
          <TShirtGallery 
            activeCategory={activeCategory} 
            setActiveCategory={setActiveCategory}
            uploadedDesign={uploadedDesign}
            products={products}
          />
        </div>
      </div>
    </div>
  );
}
