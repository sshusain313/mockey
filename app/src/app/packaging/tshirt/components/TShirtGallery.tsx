import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "@/components/icons/chevron-down";
import FAQSection from "./FaqSection";
import Image from "next/image";
interface TShirtGalleryProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

interface ExpandedSections {
  accessories: boolean;
  [key: string]: boolean;
}

export function TShirtGallery({ activeCategory, setActiveCategory }: TShirtGalleryProps) {
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
  
  const categories = [
    "Blank", "Round Neck", "Without People", "White", "Oversized", "Unisex", 
    "Closeup", "Acid Wash", "Washed", "Red", "Black", "Boxy", "Navy Blue", 
    "Mannequin", "Women"
  ];
  
  const mockups = [
    {
      id: 1,
      title: "Acid Wash Tshirt Mockup On Marble Surface Front View",
      image: "/lovable-uploads/deea1e69-a370-4b82-a0fb-2100c0c736ec.png",
      isPro: false
    },
    {
      id: 2,
      title: "Boxy Tshirt Mockup Hanging On Textured Concrete Wall",
      image: "/placeholder.svg",
      isPro: true
    },
    {
      id: 3,
      title: "Closeup Tshirt Template On Mannequin Rolled Sleeves",
      image: "/placeholder.svg",
      isPro: true
    },
    {
      id: 4,
      title: "White T-shirt Front View Against Blue Sky",
      image: "/placeholder.svg",
      isPro: false
    }
  ];
  
  return (
    <div className="flex-1 overflow-y-auto p-4 w-full">
      <div className="mb-6 overflow-x-auto whitespace-nowrap pb-2">
        <div className="flex gap-2 min-w-max">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className={`rounded-md px-4 py-2 ${
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mr-30">
        {mockups.map((mockup) => (
          <div key={mockup.id} className="rounded-lg overflow-hidden border border-gray-200 group cursor-pointer">
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
      <section className="bg-white p-6 md:p-8 rounded-xl shadow-sm max-w-7xl mr-10 ml-10 my-10 flex flex-col md:flex-row gap-6 items-center">
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
      <FAQSection />
      <section className='max-w-7xl ml-10 mt-10 relative overflow-hidden rounded-md mb-10' style={{ height: '300px' }}>
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
