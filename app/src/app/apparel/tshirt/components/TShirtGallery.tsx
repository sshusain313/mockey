'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "@/components/icons/chevron-down";
import FAQSection from "./FaqSection";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IProduct } from '@/models/Product';
import PlaceholderDesignOverlay from "./PlaceholderDesignOverlay";

interface TShirtGalleryProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  products?: IProduct[];
  uploadedDesign: string | null;
  selectedColor?: string;
}

interface ExpandedSections {
  accessories: boolean;
  [key: string]: boolean;
}

export function TShirtGallery({ 
  activeCategory, 
  setActiveCategory, 
  products = [], 
  uploadedDesign,
  selectedColor = '#FFFFFF'
}: TShirtGalleryProps) {
  const [expanded, setExpanded] = useState<ExpandedSections>({
    accessories: false
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 32;

  const toggleSection = (section: keyof ExpandedSections) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const router = useRouter();
  
  // Extract categories from products
  const extractCategories = () => {
    const categorySet = new Set<string>(["Blank"]);
    products.forEach(product => {
      if (product.category) categorySet.add(product.category);
      if (product.subcategory) categorySet.add(product.subcategory);
      product.tags?.forEach(tag => categorySet.add(tag));
      product.colors?.forEach(color => categorySet.add(color));
    });
    return Array.from(categorySet);
  };
  
  const categories = products.length > 0 ? extractCategories() : [
    "Blank", "Hoodie", "Sweatshirt", "Pullover", "White", "Black", "Navy", 
    "Gray", "Unisex", "Zip-up", "Oversized"
  ];
  
  // Define a more specific type for mockups
  interface MockupItem {
    id: string;
    title: string;
    image: string;
    categories: string[];
    placeholder?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    customShapePoints?: Array<{x: number, y: number}>;
    isPro: boolean;
  }
  
  // Convert products to mockups format
  const productMockups: MockupItem[] = products.map(product => ({
    id: product._id,
    title: product.name,
    image: product.image,
    categories: [...(product.tags || []), product.category, product.subcategory],
    placeholder: product.placeholder,
    customShapePoints: product.customShapePoints,
    isPro: false
  }));
  
  // Filter mockups by category
  const filterProductsByCategory = (mockup: any, category: string): boolean => {
    if (category === "Blank") return true;
    return mockup.categories?.some((cat: string) =>
      cat.toLowerCase() === category.toLowerCase()
    ) || false;
  };
  
  const filteredMockups = activeCategory === "Blank"
    ? productMockups
    : productMockups.filter(mockup => filterProductsByCategory(mockup, activeCategory));
    
  // Use filtered mockups if available, otherwise use fallback mockups
  const mockups: MockupItem[] = filteredMockups.length > 0 ? filteredMockups : [
    {
      id: "1",
      title: "Black Hoodie Mockup",
      image: "/products/hoodie-black.jpg",
      categories: ["Black", "Hoodie", "Unisex"],
      isPro: false,
      placeholder: {
        x: 150,
        y: 120,
        width: 200,
        height: 250
      },
      customShapePoints: undefined
    },
    {
      id: "2",
      title: "Gray Pullover Hoodie",
      image: "/products/hoodie-gray.jpg",
      categories: ["Gray", "Hoodie", "Pullover"],
      isPro: false,
      placeholder: {
        x: 150,
        y: 120,
        width: 200,
        height: 250
      },
      customShapePoints: undefined
    },
    {
      id: "3",
      title: "Navy Blue Zip-up Hoodie",
      image: "/products/hoodie-navy.jpg",
      categories: ["Navy", "Hoodie", "Zip-up"],
      isPro: false,
      placeholder: {
        x: 150,
        y: 120,
        width: 200,
        height: 250
      },
      customShapePoints: undefined
    }
  ];
  
  // Handle mockup click to navigate to editor
  const handleMockupClick = (mockup: MockupItem) => {
    // Store the product ID
    localStorage.setItem('selectedProductId', mockup.id);
    
    // Calculate and store design positioning data for consistent alignment
    if (uploadedDesign && mockup.placeholder) {
      // Store the uploaded design path
      localStorage.setItem('userUploadedDesignPath', uploadedDesign);
      
      // Store placeholder data for consistent positioning
      const placeholderData = {
        x: mockup.placeholder.x,
        y: mockup.placeholder.y,
        width: mockup.placeholder.width,
        height: mockup.placeholder.height,
        maintainAspectRatio: true,
        customShapePoints: mockup.customShapePoints || []
      };
      
      // Store the placeholder data as JSON
      localStorage.setItem('designPlaceholderData', JSON.stringify(placeholderData));
      
      // Navigate to the editor with the product ID
      router.push(`/editor?productId=${mockup.id}&fromGallery=true`);
    } else {
      // Navigate to the editor without design data
      router.push(`/editor?productId=${mockup.id}`);
    }
  };
  
  // Debug log for uploaded design
  useEffect(() => {
    if (uploadedDesign) {
      console.log('TShirtGallery has uploadedDesign:', uploadedDesign);
    }
  }, [uploadedDesign]);

  return (
    <div className="flex-1 overflow-y-auto p-2 sm:p-4 w-full">
      <div className="mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap pb-2 -mx-2 px-2 sm:mx-0 sm:px-0">
        <div className="flex gap-1 sm:gap-2 min-w-max mb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className={`rounded-md px-2 py-1 text-xs sm:text-sm sm:px-4 sm:py-2 h-auto ${
                activeCategory === category 
                  ? "bg-gray-900 text-white" 
                  : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection('accessories')}
          className="p-4 w-full text-left flex justify-between items-center"
        >
          <h3 className="text-sm font-medium uppercase text-gray-900">ACCESSORIES</h3>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              expanded.accessories ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expanded.accessories && (
          <div className="py-1">
            {["HOME & LIVING", "PRINT", "PACKAGING", "TECH", "JEWELRY"].map((item) => (
              <button
                key={item}
                className="px-4 py-2 w-full text-left text-gray-700 hover:bg-gray-50 block"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
        {mockups.map((mockup) => (
          <div 
            key={mockup.id} 
            className="rounded-lg overflow-hidden border border-gray-200 group cursor-pointer"
            onClick={() => handleMockupClick(mockup)}
          >
            <div className="relative aspect-square bg-gray-100">
              {mockup.isPro && (
                <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                  PRO
                </div>
              )}
              <img 
                src={mockup.image} 
                alt={mockup.title} 
                className="w-full h-full object-cover"
              />
              
              {/* Show design overlay if uploaded, otherwise show placeholder area */}
              {uploadedDesign ? (
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 5,
                    opacity: mockup.categories?.includes('Dark') || mockup.categories?.includes('Black') ? 0.85 : 
                            mockup.categories?.includes('Colored') ? 0.9 : 0.95,
                    mixBlendMode: mockup.categories?.includes('Dark') || mockup.categories?.includes('Black') ? 'screen' : 
                                  (mockup.categories?.includes('Colored') || 
                                   mockup.categories?.includes('Red') || 
                                   mockup.categories?.includes('Blue') || 
                                   mockup.categories?.includes('Green')) ? 'overlay' : 'multiply'
                  }}
                >
                  <PlaceholderDesignOverlay
                    designImage={uploadedDesign}
                    placeholder={mockup.placeholder ? {
                      x: Number(mockup.placeholder.x),
                      y: Number(mockup.placeholder.y),
                      width: Number(mockup.placeholder.width),
                      height: Number(mockup.placeholder.height)
                    } : {
                      x: 150,
                      y: 150,
                      width: 100,
                      height: 100
                    }}
                    customShapePoints={mockup.customShapePoints}
                    categories={mockup.categories}
                    mockupWidth={400}
                    mockupHeight={400}
                  />
                </div>
              ) : (
                /* Show placeholder area when no design is uploaded */
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 5
                  }}
                >
                  <PlaceholderDesignOverlay
                    designImage={null}
                    placeholder={mockup.placeholder ? {
                      x: Number(mockup.placeholder.x),
                      y: Number(mockup.placeholder.y),
                      width: Number(mockup.placeholder.width),
                      height: Number(mockup.placeholder.height)
                    } : {
                      x: 150,
                      y: 150,
                      width: 100,
                      height: 100
                    }}
                    customShapePoints={mockup.customShapePoints}
                    categories={mockup.categories}
                    mockupWidth={400}
                    mockupHeight={400}
                  />
                </div>
              )}
              
              <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </div>
            </div>
            <div className="p-2 text-sm text-gray-700 truncate">{mockup.title}</div>
          </div>
        ))}
        
        {/* Show more mockups */}
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={`placeholder-${index}`} className="rounded-lg overflow-hidden border border-gray-200">
            <div className="aspect-square bg-gray-100"></div>
            <div className="p-2 text-sm text-gray-700">T-shirt Mockup Example</div>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      <div className="flex justify-center items-center mt-8 mb-4">
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 rounded-md border border-gray-200 p-0"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <span className="sr-only">Previous page</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Button>
        
        {[1, 2, 3, 4, 5].map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            className={`h-9 w-9 mx-1 rounded-md p-0 ${currentPage === page ? 'bg-pink-500 text-white border-pink-500' : 'border border-gray-200'}`}
            onClick={() => setCurrentPage(page)}
          >
            <span>{page}</span>
          </Button>
        ))}
        
        <span className="mx-1">...</span>
        
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 mx-1 rounded-md border border-gray-200 p-0"
          onClick={() => setCurrentPage(32)}
        >
          <span>32</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 rounded-md border border-gray-200 p-0"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <span className="sr-only">Next page</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Button>
      </div>
      <section className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-sm max-w-9xl mx-4 sm:mx-10 my-8 sm:my-10 flex flex-col md:flex-row gap-4 sm:gap-6 items-center">
  <div className="md:w-2/3">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">
      How to Create a 3D Mockup on Mockey?
    </h2>
    <p className="text-gray-700 mb-2">To design a 3D mockup with Mockey.ai:</p>
    <p className="text-sm text-gray-800 mb-1">
      <strong>Step 1:</strong> Go to 3D Mockups, choose a product category, and select a 3D template.
    </p>
    <p className="text-sm text-gray-800 mb-1">
      <strong>Step 2:</strong> Click Upload Your Images to add multiple designs by dragging and dropping. 
      You can also change colors, add textures, or set a background.
    </p>
    <p className="text-sm text-gray-800">
      <strong>Step 3:</strong> Click Download to save your 3D mockup as a PNG or JPEG in different sizes, 
      or click Video to save it as a 5-second webm file.
    </p>
  </div>
  <div className="md:w-1/3 w-full">
    <Image
      src="/edit.webp" // 🔁 Replace with actual image path
      alt="Edit Mockups Fast"
      width={400}
      height={300}
      className="rounded-md"
    />
  </div>
</section>
      <section className='max-w-9xl mx-auto sm:mx-10 mt-10 rounded-md mb-10'>
        <FAQSection />
      </section>
      <section className='max-w-9xl mx-auto sm:mx-10 mt-10 relative overflow-hidden rounded-md mb-10 hidden sm:block' style={{ height: '400px', maxHeight: '75vw' }}>
        <div className="absolute inset-0">
          <Image 
            src='/bag-black.webp' 
            alt='bag-black' 
            fill
            sizes="100vw"
            className='object-cover' 
            priority
          />
        </div>
      </section>
    </div>
  );
}
