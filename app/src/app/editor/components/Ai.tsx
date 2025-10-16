
'use client';

import { useState } from 'react';
import { FileEdit, Pencil } from "lucide-react";

const categories = [
  { label: "T-shirt", src: "/catimg1.png", mockups: ["/custom/tshirt1.png", "/custom/tshirt2.png", "/custom/tshirt3.png", "/custom/tshirt4.png"] },
  { label: "Hoodie", src: "/catimg2.png", mockups: ["/custom/hoodie1.png", "/custom/hoodie2.png", "/custom/hoodie3.png", "/custom/hoodie4.png"] },
  { label: "Poster", src: "/catimg3.png", mockups: ["/mockups/poster1.png", "/mockups/poster2.png", "/mockups/poster3.png", "/mockups/poster4.png"] },
  { label: "Tote", src: "/catimg4.png", mockups: ["/mockups/tote1.png", "/mockups/tote2.png", "/mockups/tote3.png", "/mockups/tote4.png"] }
];

export default function SidebarLayout() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedMockup, setSelectedMockup] = useState<string | null>(null);


  return (
    <div className="flex h-screen w-68 flex-col border-r border-gray-200 bg-gray-100 ">
      <main className="flex-1 p-4 bg-gray-50 overflow-auto">
        
        {/* Top Action Button */}
        <div className="flex justify-center mb-4">
  <button className="bg-pink-400 text-white h-15 px-6 py-2 rounded-lg font-medium w-[400px] flex items-center justify-center">
    Download 
    {/* <span className="ml-2 mb-2 text-2xl">⌄</span> */}
  </button>
</div>


{selectedMockup ? (
  <div className="mt-6 pt-4">
    <button className="mb-3 text-sm text-gray-600" onClick={() => setSelectedMockup(null)}>
      ← Back
    </button>
    <div className="mb-3 border-b border-gray-200 pb-4">
      <img src={selectedMockup} alt="Selected mockup" className="rounded-sm shadow-lg w-full" />
      <div className='bg-[#E9F1FE] mt-3 font-medium text-[10px] leading-[16px] tracking-normal text-[#266EF1] font-sans'><p>Actual result may vary depending on the image and design</p></div>
    </div>
    <span className='font-medium text-[12px] leading-[16px] tracking-normal text-[#18181B] font-sans'>DESCRIBE YOUR SCENE</span>
    <textarea
  className="mt-2 text-sm text-gray-800 mb-4 w-full h-24 p-2 border border-gray-300 rounded focus:outline-none resize-none"
  placeholder="Describe your scene here..."
>
  The background is a bold mustard yellow, creating a warm and vibrant contrast that makes the crisp white T-shirt stand out stylishly.
</textarea>

    <button className="bg-black text-white px-4 py-2 rounded w-full">
      Generate (Ctrl ↵)
    </button>
    <p className="text-xs text-gray-400 text-center mt-2">Credits Cost: 2 ⚡</p>
  </div>
):(
  <div>
    <div className="flex gap-4 mb-4">
          <button className="bg-black text-white px-4 py-1 rounded">TEMPLATE</button>
          <button className="text-gray-700 bg-white px-4 py-1 rounded">PROMPT</button>
        </div>

        {/* Categories */}
        <h3 className="text-xs font-semibold text-gray-600 mb-2">CATEGORIES</h3>
        <div className="flex gap-4 mb-4">
          {categories.map((cat, index) => (
            <div
              key={index}
              className={'text-center text-xs cursor-pointer'}
              onClick={() => setSelectedCategory(cat)}
            >
              <div className={`h-14 w-14 bg-gray-200 rounded mb-1 overflow-hidden ${selectedCategory.label === cat.label ? 'ring-2 ring-gray-600 rounded p-1' : ''}`}>
                <img src={cat.src} alt={cat.label} className="h-full w-full object-cover" />
              </div>
              {cat.label}
            </div>
          ))}
        </div>
<div className="grid grid-cols-2 md:grid-cols-2 gap-4">
   {selectedCategory.mockups.map((img, i) => (
   <div 
    key={i} 
    className="bg-white shadow rounded overflow-hidden cursor-pointer"
    onClick={() => setSelectedMockup(img)}
   >
   <img src={img} alt={`Mockup ${i}`} className="w-full h-36 object-cover" />
   </div>
))}
</div>
</div>
)
}

      </main>
    </div>
  );
}
