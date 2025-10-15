'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Download, Shirt, Image, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import Sidebar from './Sidebar';
import Section  from './Section';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MockupsShowcase = () => {
  // Categories for the sidebar
  const categories = [
    { 
      name: "T-shirt", 
      icon: Shirt, 
      image: "/lovable-uploads/50c39a82-7031-4284-848b-59cf07ddc6b7.png"
    },
    { 
      name: "Hoodie", 
      icon: ShoppingBag, 
      image: "/lovable-uploads/100e2683-e29c-4709-84da-6cb9524a6c5c.png"
    },
    { 
      name: "Poster", 
      icon: Image, 
      image: "/lovable-uploads/0880f70d-08e4-43e5-9d4a-2e876ebbcc10.png"
    },
    { 
      name: "Tote", 
      icon: Image, 
      image: "/lovable-uploads/78572dab-7bdf-4f54-9f6a-eca7d211cdcb.png"
    }
  ];

  // Example mockup products for tote bags
  const toteExamples = [
    {
      id: 1,
      image: "/lovable-uploads/c1618e75-ae91-4ce9-90dd-40c9576d1e5a.png",
      name: "Tote Bag Example 1"
    },
    {
      id: 2,
      image: "/lovable-uploads/c1618e75-ae91-4ce9-90dd-40c9576d1e5a.png",
      name: "Tote Bag Example 2"
    },
    {
      id: 3,
      image: "/lovable-uploads/c1618e75-ae91-4ce9-90dd-40c9576d1e5a.png",
      name: "Tote Bag Example 3"
    }
  ];

  return (
    <div className="flex flex-col h-screen">

      {/* Main Content */}
      <div className="flex flex-1">
        {/* <Sidebar />
        <Section /> */}

        {/* Main Content - Upload Area */}
        <main className="flex-1 p-6 flex items-center justify-center bg-gray-50 bg-grid">
          <div className="w-full max-w-xl aspect-square border-2 border-dashed border-pink-300 rounded-lg flex flex-col items-center justify-center p-6 bg-white">
            <div className="w-16 h-16 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
              <img
                src="/path-to-your-image.png" // Replace with the correct image path
                alt="Icon"
                className="w-8 h-8"
              />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">Click or drag and drop to upload your image</h3>
            <p className="text-sm text-gray-500">PNG and JPG (max. 10MB)</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MockupsShowcase;
