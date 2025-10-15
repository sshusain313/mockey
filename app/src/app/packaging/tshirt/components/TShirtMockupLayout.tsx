import { useState } from "react";
import { TShirtSidebar } from "./TShirtSidebar";
import { TShirtGallery } from "./TShirtGallery";
import { TShirtHeader } from "./TShirtHeader";


export function TShirtMockupLayout() {
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");
  const [activeCategory, setActiveCategory] = useState("Blank");
  
  return (
    <div className="min-h-screen flex flex-col w-full bg-white">
      <div className="flex flex-1 overflow-hidden">
        <TShirtSidebar 
          selectedColor={selectedColor} 
          setSelectedColor={setSelectedColor} 
        />
        <div className="flex-1 flex flex-col">
          <TShirtHeader />
          <TShirtGallery activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        </div>
        
      </div>
    </div>
  );
}
