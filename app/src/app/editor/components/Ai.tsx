// // import React from 'react'
// // import { Button } from '@/components/ui/button';
// // import { ChevronDown, Download, Shirt, Image, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
// // import Sidebar from './Sidebar';
// // import { 
// //   NavigationMenu,
// //   NavigationMenuContent,
// //   NavigationMenuItem,
// //   NavigationMenuLink,
// //   NavigationMenuList,
// //   NavigationMenuTrigger,
// //   navigationMenuTriggerStyle
// // } from "@/components/ui/navigation-menu";
// // import { 
// //   Carousel, 
// //   CarouselContent, 
// //   CarouselItem, 
// //   CarouselNext, 
// //   CarouselPrevious 
// // } from "@/components/ui/carousel";
// // import { Card } from "@/components/ui/card";
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// // const Ai = () => {
// //      // Categories for the sidebar
// //   const categories = [
// //     { 
// //       name: "T-shirt", 
// //       icon: Shirt, 
// //       image: "/lovable-uploads/50c39a82-7031-4284-848b-59cf07ddc6b7.png"
// //     },
// //     { 
// //       name: "Hoodie", 
// //       icon: ShoppingBag, 
// //       image: "/lovable-uploads/100e2683-e29c-4709-84da-6cb9524a6c5c.png"
// //     },
// //     { 
// //       name: "Poster", 
// //       icon: Image, 
// //       image: "/lovable-uploads/0880f70d-08e4-43e5-9d4a-2e876ebbcc10.png"
// //     },
// //     { 
// //       name: "Tote", 
// //       icon: Image, 
// //       image: "/lovable-uploads/78572dab-7bdf-4f54-9f6a-eca7d211cdcb.png"
// //     }
// //   ];

// //   // Example mockup products for tote bags
// //   const toteExamples = [
// //     {
// //       id: 1,
// //       image: "/lovable-uploads/c1618e75-ae91-4ce9-90dd-40c9576d1e5a.png",
// //       name: "Tote Bag Example 1"
// //     },
// //     {
// //       id: 2,
// //       image: "/lovable-uploads/c1618e75-ae91-4ce9-90dd-40c9576d1e5a.png",
// //       name: "Tote Bag Example 2"
// //     },
// //     {
// //       id: 3,
// //       image: "/lovable-uploads/c1618e75-ae91-4ce9-90dd-40c9576d1e5a.png",
// //       name: "Tote Bag Example 3"
// //     }
// //   ];

// //   return (
// //     <aside className="w-64 h-[calc(100vh-4rem)] border-r border-gray-200 bg-white p-3 overflow-y-auto">
// //     {/* Download Button */}
// //     <div className="mb-5">
// //       <Button className="w-full bg-pink-400 hover:bg-pink-500 text-white flex items-center justify-between">
// //         <span>Download</span>
// //         <ChevronDown size={16} />
// //       </Button>
// //     </div>

// //     {/* Template/Prompt Tabs */}
// //     <Tabs defaultValue="template" className="mb-5">
// //       <TabsList className="w-full grid grid-cols-2">
// //         <TabsTrigger value="template" className="uppercase font-bold">Template</TabsTrigger>
// //         <TabsTrigger value="prompt" className="uppercase">Prompt</TabsTrigger>
// //       </TabsList>
// //     </Tabs>

// //     {/* Categories Label */}
// //     <div className="mb-3 uppercase text-gray-800 text-xs font-semibold">
// //       Categories
// //     </div>

// //     {/* Category Carousel */}
// //     <div className="relative mb-5">
// //       <Carousel 
// //         className="w-full"
// //         opts={{
// //           align: "start",
// //           loop: true,
// //         }}
// //       >
// //         <CarouselContent className="pl-0">
// //           {categories.map((category) => (
// //             <CarouselItem key={category.name} className="basis-1/3 pl-2 first:pl-0">
// //               <div className="flex flex-col items-center">
// //                 <div className="rounded-md mb-1 w-full aspect-square flex items-center justify-center overflow-hidden">
// //                   <img 
// //                     src={category.image} 
// //                     alt={category.name} 
// //                     className="w-full h-full object-cover"
// //                   />
// //                 </div>
// //                 <span className="text-xs text-gray-600">{category.name}</span>
// //               </div>
// //             </CarouselItem>
// //           ))}
// //         </CarouselContent>
// //         <CarouselPrevious className="absolute left-0 top-1/3 -translate-y-1/2 -translate-x-1 w-5 h-5 bg-white/80 shadow-sm" />
// //         <CarouselNext className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-1 w-5 h-5 bg-white/80 shadow-sm" />
// //       </Carousel>
// //     </div>

// //     {/* Tote Bag Examples */}
// //     <div className="grid grid-cols-2 gap-2">
// //       {toteExamples.map((example) => (
// //         <div key={example.id} className="mb-2 last:col-span-2">
// //           <div className="aspect-square rounded-md overflow-hidden border border-gray-100">
// //             <img 
// //               src={example.image} 
// //               alt={example.name} 
// //               className="w-full h-full object-cover"
// //             />
// //           </div>
// //         </div>
// //       ))}
// //     </div>
// //   </aside>
// //   )
// // }

// // export default Ai

// import { FileEdit, Pencil } from "lucide-react";

// export default function SidebarLayout() {
//   return (
//     <div className="flex h-screen w-78 flex-col border-r border-gray-200 bg-gray-100">
      
//       {/* Main Content */}
//       <main className="flex-1 p-4 bg-gray-50 overflow-auto">
//         {/* Top Action Button */}
//         <div className="flex justify-center mb-4">
//           <button className="bg-pink-400 text-white h-15 px-6 py-2 rounded-lg font-medium w-[400px]">
//             Download <span className="ml-1">⌄</span>
//           </button>
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-4 mb-4">
//           <button className="bg-black text-white px-4 py-1 rounded">TEMPLATE</button>
//           <button className="text-gray-700 bg-white px-4 py-1 rounded">PROMPT</button>
//         </div>

//         {/* Categories */}
//         <h3 className="text-xs font-semibold text-gray-600 mb-2">CATEGORIES</h3>
//         <div className="flex gap-4 mb-4">
//   {[
//     { label: "T-shirt", src: "/catimg1.png" },
//     { label: "Hoodie", src: "/catimg2.png" },
//     { label: "Poster", src: "/catimg3.png" },
//     { label: "Tote", src: "/catimg4.png" }
//   ].map(({ label, src }, index) => (
//     <div key={index} className="text-center text-xs">
//       <div className="h-14 w-14 bg-gray-200 rounded mb-1 overflow-hidden">
//         <img src={src} alt={label} className="h-full w-full object-cover" />
//       </div>
//       {label}
//     </div>
//   ))}
// </div>


//         {/* Mockup Previews */}
//         <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
//           {[...Array(4)].map((_, i) => (
//             <div key={i} className="bg-white shadow rounded overflow-hidden">
//               <div className="h-36 bg-gray-300"></div>
//             </div>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// }


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
