import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import Image from "next/image";

export function MockupHero() {
  return (
    <div className="flex flex-col md:flex-row gap-10 mt-8">
      {/* Left side - Grid of models */}
      <div className="w-full md:w-1/2 flex justify-end">
        
          <Image 
            src="/hero.jpg"
            alt="hero"
            width={400}
            height={400}
          />
      
      </div>
      
      {/* Right side - Text content */}
      <div className="w-full md:w-1/2 flex flex-col justify-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Free <span className="text-[#E3508E]">Mockup</span> Generator
        </h1>
        <p className="text-lg text-gray-900 mb-8 w-1/2">
          Generate <span className='#E3508E'>1000+</span>  Instant Mockups across apparel, wall-decore, print, device, all for <span className="text-[#E3508E]">free</span>.
        </p>
        <div className="space-y-4 flex">
          <Button className="bg-[#E3508E] hover:bg-[#E3508E] text-white px-6 py-6 rounded-lg text-lg">
            <Upload className="mr-2" />
            Upload Design
          </Button>
          <p className="text-gray-900 ml-10 mt-2">For instant preview</p>
        </div>
      </div>
    </div>
  );
}
