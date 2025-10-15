// import { ChevronDown } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";

// interface TShirtSidebarProps {
//   selectedColor: string;
//   setSelectedColor: (color: string) => void;
// }

// export function TShirtSidebar({ selectedColor, setSelectedColor }: TShirtSidebarProps) {
//   const [expanded, setExpanded] = useState<Record<string, boolean>>({
//     apparel: true,
//     accessories: false,
//     homeLiving: false,
//     print: false,
//     packaging: false,
//     tech: false,
//     jewelry: false
//   });

//   const toggleSection = (section: string) => {
//     setExpanded(prev => ({
//       ...prev,
//       [section]: !prev[section]
//     }));
//   };

//   return (
//     <div className="w-60 border-r border-gray-200 flex-shrink-0 bg-white overflow-y-auto">
//       <div className="p-4 border-b border-gray-200">
//         <h2 className="text-lg font-medium text-gray-900">Instant Preview</h2>
//       </div>
      
//       <div className="p-4 border-b border-gray-200">
//         <h3 className="text-sm font-medium uppercase text-gray-900 mb-4">DESIGN</h3>
//         <Button 
//           variant="outline" 
//           className="w-full justify-between border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
//         >
//           Upload Design
//           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//             <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
//             <polyline points="17 8 12 3 7 8" />
//             <line x1="12" y1="3" x2="12" y2="15" />
//           </svg>
//         </Button>
//       </div>
      
//       <div className="p-4 border-b border-gray-200">
//         <h3 className="text-sm font-medium uppercase text-gray-900 mb-4">COLOR</h3>
//         <div className="flex flex-col gap-4">
//           <Button 
//             variant="outline"
//             className="w-full justify-between border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
//           >
//             <div className="flex items-center gap-2">
//               <div 
//                 className="w-5 h-5 rounded-full border border-gray-300"
//                 style={{ backgroundColor: selectedColor }}
//               />
//               <span>#{selectedColor.replace('#', '')}</span>
//             </div>
//             <ChevronDown className="h-4 w-4" />
//           </Button>
          
//           <div className="w-full h-5 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 rounded" />
//         </div>
//       </div>
      
//       <div className="border-b border-gray-200">
//         <Button 
//           onClick={() => toggleSection('apparel')}
//           className="p-4 w-full text-left flex justify-between items-center"
//         >
//           <h3 className="text-sm font-medium uppercase text-gray-900">APPAREL</h3>
//           <ChevronDown className={`h-4 w-4 transition-transform ${expanded.apparel ? 'rotate-180' : ''}`} />
//         </Button>
        
//         {expanded.apparel && (
//           <div className="py-1">
//             {["T-shirt", "Tank Top", "Hoodie", "Sweatshirt", "Jacket", "Crop Top", "Apron", "Scarf", "Jersey"].map((item) => (
//               <button 
//                 key={item} 
//                 className="px-4 py-2 w-full text-left text-gray-700 hover:bg-gray-50 block"
//               >
//                 {item}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>
      
//       <div className="border-b border-gray-200">
//         <button 
//           onClick={() => toggleSection('accessories')}
//           className="p-4 w-full text-left flex justify-between items-center"
//         >
//           <h3 className="text-sm font-medium uppercase text-gray-900">ACCESSORIES</h3>
//           <ChevronDown className={`h-4 w-4 transition-transform ${expanded.accessories ? 'rotate-180' : ''}`} />
//         </button>
        
//         {expanded.accessories && (
//           <div className="py-1">
//             {["Bags", "Hats", "Belts", "Gloves"].map((item) => (
//               <button 
//                 key={item} 
//                 className="px-4 py-2 w-full text-left text-gray-700 hover:bg-gray-50 block"
//               >
//                 {item}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       <div className="border-b border-gray-200">
//         <button 
//           onClick={() => toggleSection('homeLiving')}
//           className="p-4 w-full text-left flex justify-between items-center"
//         >
//           <h3 className="text-sm font-medium uppercase text-gray-900">HOME & LIVING</h3>
//           <ChevronDown className={`h-4 w-4 transition-transform ${expanded.homeLiving ? 'rotate-180' : ''}`} />
//         </button>
        
//         {expanded.homeLiving && (
//           <div className="py-1">
//             {["Mugs", "Cushions", "Frames", "Candles"].map((item) => (
//               <button 
//                 key={item} 
//                 className="px-4 py-2 w-full text-left text-gray-700 hover:bg-gray-50 block"
//               >
//                 {item}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       <div className="border-b border-gray-200">
//         <button 
//           onClick={() => toggleSection('print')}
//           className="p-4 w-full text-left flex justify-between items-center"
//         >
//           <h3 className="text-sm font-medium uppercase text-gray-900">PRINT</h3>
//           <ChevronDown className={`h-4 w-4 transition-transform ${expanded.print ? 'rotate-180' : ''}`} />
//         </button>
        
//         {expanded.print && (
//           <div className="py-1">
//             {["Posters", "Flyers", "Business Cards", "Stickers"].map((item) => (
//               <button 
//                 key={item} 
//                 className="px-4 py-2 w-full text-left text-gray-700 hover:bg-gray-50 block"
//               >
//                 {item}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       <div className="border-b border-gray-200">
//         <button 
//           onClick={() => toggleSection('packaging')}
//           className="p-4 w-full text-left flex justify-between items-center"
//         >
//           <h3 className="text-sm font-medium uppercase text-gray-900">PACKAGING</h3>
//           <ChevronDown className={`h-4 w-4 transition-transform ${expanded.packaging ? 'rotate-180' : ''}`} />
//         </button>
        
//         {expanded.packaging && (
//           <div className="py-1">
//             {["Boxes", "Pouches", "Bottles", "Tubes"].map((item) => (
//               <button 
//                 key={item} 
//                 className="px-4 py-2 w-full text-left text-gray-700 hover:bg-gray-50 block"
//               >
//                 {item}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       <div className="border-b border-gray-200">
//         <button 
//           onClick={() => toggleSection('tech')}
//           className="p-4 w-full text-left flex justify-between items-center"
//         >
//           <h3 className="text-sm font-medium uppercase text-gray-900">TECH</h3>
//           <ChevronDown className={`h-4 w-4 transition-transform ${expanded.tech ? 'rotate-180' : ''}`} />
//         </button>
        
//         {expanded.tech && (
//           <div className="py-1">
//             {["Phone Cases", "Laptop Sleeves", "Chargers", "Headphones"].map((item) => (
//               <button 
//                 key={item} 
//                 className="px-4 py-2 w-full text-left text-gray-700 hover:bg-gray-50 block"
//               >
//                 {item}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       <div className="border-b border-gray-200">
//         <button 
//           onClick={() => toggleSection('jewelry')}
//           className="p-4 w-full text-left flex justify-between items-center"
//         >
//           <h3 className="text-sm font-medium uppercase text-gray-900">JEWELRY</h3>
//           <ChevronDown className={`h-4 w-4 transition-transform ${expanded.jewelry ? 'rotate-180' : ''}`} />
//         </button>
        
//         {expanded.jewelry && (
//           <div className="py-1">
//             {["Rings", "Necklaces", "Bracelets", "Earrings"].map((item) => (
//               <button 
//                 key={item} 
//                 className="px-4 py-2 w-full text-left text-gray-700 hover:bg-gray-50 block"
//               >
//                 {item}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


'use client';

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { uploadDesignImage } from "@/app/editor/actions";

interface TShirtSidebarProps {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  uploadedDesign: string | null;
  setUploadedDesign: (design: string | null) => void;
}

export function TShirtSidebar({ selectedColor, setSelectedColor, uploadedDesign, setUploadedDesign }: TShirtSidebarProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    apparel: true,
    accessories: false,
    homeLiving: false,
    print: false,
    packaging: false,
    tech: false,
    jewelry: false
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load design from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !uploadedDesign) {
      try {
        // First try to load the server-uploaded image path (preferred method)
        const savedDesignPath = localStorage.getItem('userUploadedDesignPath');
        if (savedDesignPath) {
          console.log('Loading design path from localStorage in TShirtSidebar');
          setUploadedDesign(savedDesignPath);
          return;
        }
        
        // Fallback to the full data URL if path is not available
        const savedDesign = localStorage.getItem('userUploadedDesign');
        if (savedDesign && savedDesign.startsWith('data:')) {
          console.log('Loading design from localStorage in TShirtSidebar');
          
          // Preload the image to ensure it's ready for display
          const img = new window.Image();
          img.onload = () => {
            setUploadedDesign(savedDesign);
          };
          img.onerror = () => {
            console.warn('Failed to load saved design, removing from localStorage');
            localStorage.removeItem('userUploadedDesign');
          };
          img.src = savedDesign;
        }
        
        // Also check for preview if neither of the above worked
        const savedPreview = localStorage.getItem('userUploadedDesignPreview');
        if (!savedDesignPath && !savedDesign && savedPreview) {
          setUploadedDesign(savedPreview);
        }
      } catch (error) {
        console.error('Error loading design from localStorage:', error);
        // Clean up all design storage on error
        localStorage.removeItem('userUploadedDesign');
        localStorage.removeItem('userUploadedDesignPath');
        localStorage.removeItem('userUploadedDesignPreview');
      }
    }
  }, [uploadedDesign, setUploadedDesign]);

  const toggleSection = (section: string) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if the file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image is too large. Please upload an image smaller than 5MB.');
        return;
      }

      try {
        setIsUploading(true);
        
        // Method 1: Server Action Upload
        // Create a FormData object to send the file to the server
        const formData = new FormData();
        formData.append('design', file);
        
        // Upload the image using the server action
        const result = await uploadDesignImage(formData);
        
        if (result.success) {
          // Set the uploaded design with the path returned from the server
          if (result.imagePath) {
            setUploadedDesign(result.imagePath);
            
            // Store just the path in localStorage (much smaller than base64)
            localStorage.setItem('userUploadedDesignPath', result.imagePath);
          }
          console.log('Design path saved to localStorage');
          
          // Method 2: Also store a temporary preview in localStorage for the current session
          // This is a fallback in case the server-side image isn't available yet
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target && e.target.result) {
              const dataUrl = e.target.result as string;
              localStorage.setItem('userUploadedDesignPreview', dataUrl);
            }
          };
          reader.readAsDataURL(file);
        } else {
          console.error('Error saving design to localStorage:', result.error);
          alert(`Failed to upload image: ${result.error}`);
        }
      } catch (error) {
        console.error('Error uploading design:', error);
        alert('Failed to upload design. Please try again.');
        
        // Fallback to client-side approach if server action fails
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target && e.target.result) {
            const dataUrl = e.target.result as string;
            setUploadedDesign(dataUrl);
            try {
              localStorage.setItem('userUploadedDesign', dataUrl);
              console.log('Design saved to localStorage as fallback');
            } catch (storageError) {
              console.error('Failed to save to localStorage:', storageError);
            }
          }
        };
        reader.readAsDataURL(file);
      } finally {
        setIsUploading(false);
      }
    }
    
    // Reset the input so the same file can be selected again
    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <div className="w-70 border-r border-gray-200 flex-shrink-0 bg-white overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Instant Preview</h2>
      </div>
      
      <div className="mt-6 space-y-4 px-4">
        <h3 className="text-sm font-medium text-gray-900">Design</h3>
        <div className="space-y-2">
          <Button 
            onClick={handleUploadClick} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload Design'}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          
          {uploadedDesign && (
            <div className="mt-4 space-y-2">
              <div className="border border-gray-200 rounded-md p-2 relative">
                <Image 
                  src={uploadedDesign} 
                  alt="Uploaded design" 
                  width={200} 
                  height={200} 
                  className="mx-auto object-contain" 
                  style={{ maxHeight: '200px' }}
                />
              </div>
              <Button 
                onClick={() => {
                  setUploadedDesign(null);
                  localStorage.removeItem('userUploadedDesign');
                  localStorage.removeItem('userUploadedDesignPath');
                  localStorage.removeItem('userUploadedDesignPreview');
                }} 
                variant="outline" 
                className="w-full text-red-600 border-red-600 hover:bg-red-50"
              >
                Remove Design
              </Button>
            </div>
          )}
        </div>
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
