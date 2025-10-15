import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface TShirtSidebarProps {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
}

export function TShirtSidebar({ selectedColor, setSelectedColor }: TShirtSidebarProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    apparel: true,
    accessories: false,
    homeLiving: false,
    print: false,
    packaging: false,
    tech: false,
    jewelry: false
  });

  const toggleSection = (section: string) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="w-60 border-r border-gray-200 flex-shrink-0 bg-white overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Instant Preview</h2>
      </div>
      
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium uppercase text-gray-900 mb-4">DESIGN</h3>
        <Button 
          variant="outline" 
          className="w-full justify-between border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
        >
          Upload Design
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </Button>
      </div>
      
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium uppercase text-gray-900 mb-4">COLOR</h3>
        <div className="flex flex-col gap-4">
          <Button 
            variant="outline"
            className="w-full justify-between border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-5 h-5 rounded-full border border-gray-300"
                style={{ backgroundColor: selectedColor }}
              />
              <span>#{selectedColor.replace('#', '')}</span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
          
          <div className="w-full h-5 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 rounded" />
        </div>
      </div>
      
      <div className="border-b border-gray-200">
        <Button 
          onClick={() => toggleSection('apparel')}
          className="p-4 w-full text-left flex justify-between items-center"
        >
          <h3 className="text-sm font-medium uppercase text-gray-900">APPAREL</h3>
          <ChevronDown className={`h-4 w-4 transition-transform ${expanded.apparel ? 'rotate-180' : ''}`} />
        </Button>
        
        {expanded.apparel && (
          <div className="py-1">
            {["T-shirt", "Tank Top", "Hoodie", "Sweatshirt", "Jacket", "Crop Top", "Apron", "Scarf", "Jersey"].map((item) => (
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
      
      <div className="border-b border-gray-200">
        <button 
          onClick={() => toggleSection('accessories')}
          className="p-4 w-full text-left flex justify-between items-center"
        >
          <h3 className="text-sm font-medium uppercase text-gray-900">ACCESSORIES</h3>
          <ChevronDown className={`h-4 w-4 transition-transform ${expanded.accessories ? 'rotate-180' : ''}`} />
        </button>
        
        {expanded.accessories && (
          <div className="py-1">
            {["Bags", "Hats", "Belts", "Gloves"].map((item) => (
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

      <div className="border-b border-gray-200">
        <button 
          onClick={() => toggleSection('homeLiving')}
          className="p-4 w-full text-left flex justify-between items-center"
        >
          <h3 className="text-sm font-medium uppercase text-gray-900">HOME & LIVING</h3>
          <ChevronDown className={`h-4 w-4 transition-transform ${expanded.homeLiving ? 'rotate-180' : ''}`} />
        </button>
        
        {expanded.homeLiving && (
          <div className="py-1">
            {["Mugs", "Cushions", "Frames", "Candles"].map((item) => (
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

      <div className="border-b border-gray-200">
        <button 
          onClick={() => toggleSection('print')}
          className="p-4 w-full text-left flex justify-between items-center"
        >
          <h3 className="text-sm font-medium uppercase text-gray-900">PRINT</h3>
          <ChevronDown className={`h-4 w-4 transition-transform ${expanded.print ? 'rotate-180' : ''}`} />
        </button>
        
        {expanded.print && (
          <div className="py-1">
            {["Posters", "Flyers", "Business Cards", "Stickers"].map((item) => (
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

      <div className="border-b border-gray-200">
        <button 
          onClick={() => toggleSection('packaging')}
          className="p-4 w-full text-left flex justify-between items-center"
        >
          <h3 className="text-sm font-medium uppercase text-gray-900">PACKAGING</h3>
          <ChevronDown className={`h-4 w-4 transition-transform ${expanded.packaging ? 'rotate-180' : ''}`} />
        </button>
        
        {expanded.packaging && (
          <div className="py-1">
            {["Boxes", "Pouches", "Bottles", "Tubes"].map((item) => (
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

      <div className="border-b border-gray-200">
        <button 
          onClick={() => toggleSection('tech')}
          className="p-4 w-full text-left flex justify-between items-center"
        >
          <h3 className="text-sm font-medium uppercase text-gray-900">TECH</h3>
          <ChevronDown className={`h-4 w-4 transition-transform ${expanded.tech ? 'rotate-180' : ''}`} />
        </button>
        
        {expanded.tech && (
          <div className="py-1">
            {["Phone Cases", "Laptop Sleeves", "Chargers", "Headphones"].map((item) => (
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

      <div className="border-b border-gray-200">
        <button 
          onClick={() => toggleSection('jewelry')}
          className="p-4 w-full text-left flex justify-between items-center"
        >
          <h3 className="text-sm font-medium uppercase text-gray-900">JEWELRY</h3>
          <ChevronDown className={`h-4 w-4 transition-transform ${expanded.jewelry ? 'rotate-180' : ''}`} />
        </button>
        
        {expanded.jewelry && (
          <div className="py-1">
            {["Rings", "Necklaces", "Bracelets", "Earrings"].map((item) => (
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
    </div>
  );
}

