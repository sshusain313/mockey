import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import tshirtImg from "/lovable-uploads/b71d7356-f379-4e7a-890f-6e8249b6f1fc.png";
import FabricEditor from "./FabricEditor";
import { getAllMockups, MockupItem } from "@/lib/mockupService";

const MainEditor = () => {
  const [showPreview, setShowPreview] = useState(true);
  const [designData, setDesignData] = useState(null);
  const [uploadedDesign, setUploadedDesign] = useState<string | null>(null);
  
  // Get the uploaded design from local storage
  useEffect(() => {
    // Get all mockups to check if there's an uploaded design
    const mockups = getAllMockups();
    const userUploadedDesign = localStorage.getItem('userUploadedDesign');
    
    if (userUploadedDesign) {
      setUploadedDesign(userUploadedDesign);
    }
  }, []);
  
  return (
    <div className="flex-1 relative bg-green-500 overflow-hidden flex items-center justify-center">
      {/* Header elements - Google branding and feedback */}
      <div className="absolute top-4 right-4 flex items-center space-x-4">
        <div className="text-right">
          <div className="text-sm text-gray-500">Ads by</div>
          <div className="text-lg font-medium text-gray-700">Google</div>
        </div>
        <Button variant="outline" size="sm" className="text-xs">
          Send feedback
        </Button>
        <div className="text-xs text-gray-500 flex items-center">
          Why this ad? <span className="ml-1 text-gray-400">ⓘ</span>
        </div>
      </div>
      
      {/* Preview toggle button */}
      <div className="absolute top-4 right-1/2 transform translate-x-1/2">
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-white shadow-sm"
          onClick={() => setShowPreview(!showPreview)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
            <path d="M12 5C5.63636 5 1 12 1 12C1 12 5.63636 19 12 19C18.3636 19 23 12 23 12C23 12 18.3636 5 12 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Preview
        </Button>
      </div>
      
      {/* Main content - T-shirt with design */}
      <div className="relative w-4/5 h-4/5 flex items-center justify-center">
        {showPreview ? (
          <div className="relative">
            <img 
              src={tshirtImg.src} 
              alt="T-shirt with design" 
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Design overlay in preview mode */}
            {uploadedDesign && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-60 h-72">
                  <div 
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ 
                      transform: "translateY(-5%)",
                    }}
                  >
                    <img 
                      src={uploadedDesign} 
                      alt="Uploaded design" 
                      className="max-w-[60%] max-h-[60%] object-contain"
                      style={{ mixBlendMode: 'multiply' }}
                    />
                  </div>
                  
                  {/* Red selection border with handles */}
                  <div className="absolute inset-0 border-2 border-red-500">
                    {/* Corner handles */}
                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-gray-300"></div>
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-gray-300"></div>
                    <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-gray-300"></div>
                    <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-gray-300"></div>
                    
                    {/* Middle handles */}
                    <div className="absolute top-1/2 -left-1.5 transform -translate-y-1/2 w-3 h-3 bg-white border border-gray-300"></div>
                    <div className="absolute top-1/2 -right-1.5 transform -translate-y-1/2 w-3 h-3 bg-white border border-gray-300"></div>
                    <div className="absolute left-1/2 -top-1.5 transform -translate-x-1/2 w-3 h-3 bg-white border border-gray-300"></div>
                    <div className="absolute left-1/2 -bottom-1.5 transform -translate-x-1/2 w-3 h-3 bg-white border border-gray-300"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <FabricEditor 
            mockupImage={tshirtImg.src} 
            designImage={uploadedDesign}
            onDesignChange={setDesignData}
          />
        )}
      </div>
    </div>
  );
};

export default MainEditor;
