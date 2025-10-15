import React from 'react';
import { Button } from '@/components/ui/button';
import CheckIcon from './CheckIcon';
import XMarkIcon from './XMarkIcon';

interface PlanFeature {
  name: string;
  free: boolean;
  pro: boolean;
  max: boolean;
  lifetime: boolean;
}

const PricingTable: React.FC = () => {
  // Plan features data
  const features: Record<string, PlanFeature[]> = {
    "Edit": [
      {
        name: "Unlimited",
        free: false,
        pro: true,
        max: true,
        lifetime: true,
      },
    ],
    "Download": [
      {
        name: "Unlimited",
        free: false,
        pro: true,
        max: true,
        lifetime: true,
      },
    ],
    "Format": [
      {
        name: "JPG",
        free: true,
        pro: true,
        max: true,
        lifetime: true,
      },
      {
        name: "PNG",
        free: false,
        pro: true,
        max: true,
        lifetime: true,
      },
    ],
    "PRO Mockups": [
      {
        name: "Accessible",
        free: false,
        pro: true,
        max: true,
        lifetime: true,
      },
    ],
    "Multiple Design Upload": [
      {
        name: "Upto 2 Design",
        free: false,
        pro: true,
        max: true,
        lifetime: true,
      },
    ],
    "Size": [
      {
        name: "400 × 500",
        free: true,
        pro: true,
        max: true,
        lifetime: true,
      },
      {
        name: "800 × 1000",
        free: false,
        pro: true,
        max: true,
        lifetime: true,
      },
      {
        name: "1600 × 2000",
        free: false,
        pro: true,
        max: true,
        lifetime: true,
      },
    ],
    "Mockup Type": [
      {
        name: "Normal",
        free: true,
        pro: true,
        max: true,
        lifetime: true,
      },
      {
        name: "Bundle",
        free: false,
        pro: true,
        max: true,
        lifetime: true,
      },
    ],
    "Background": [
      {
        name: "Custom Upload",
        free: true,
        pro: true,
        max: true,
        lifetime: true,
      },
      {
        name: "Pro Backgrounds",
        free: false,
        pro: true,
        max: true,
        lifetime: true,
      },
    ],
    "Ads": [
      {
        name: "No Interruption",
        free: false,
        pro: true,
        max: true,
        lifetime: true,
      },
    ],
    "AI Tools": [
      {
        name: "Credit",
        free: false,
        pro: false,
        max: true,
        lifetime: false,
      },
      {
        name: "Background Remover",
        free: false,
        pro: false,
        max: true,
        lifetime: false,
      },
      {
        name: "Background Blur",
        free: false,
        pro: false,
        max: true,
        lifetime: false,
      },
      {
        name: "Background Generator",
        free: false,
        pro: false,
        max: true,
        lifetime: false,
      },
    ],
  };

  return (
    <div className="container mx-auto bg-pricing-gradient px-4 py-8 sm:py-12 md:py-16 max-w-6xl overflow-x-auto">
      <div className="text-start mb-6 sm:mb-8 md:mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Compare plans & features</h2>
        <p className="text-gray-500 text-sm sm:text-base md:text-xl mb-2 sm:mb-4">
          See how our plans stack up against each other and choose the one that works for you.
        </p>
      </div>

      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col min-w-[700px]">
          {/* Table Header */}
          <div className="grid grid-cols-5 pb-4 sm:pb-6 bg-white sticky top-0 z-10">
            <div className="col-span-1">
              <div className="text-xs sm:text-sm font-medium text-gray-500 mb-2 sm:mb-3">Plans</div>
              <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                <div className="w-2 sm:w-3 h-2 sm:h-3 bg-pink-500 rounded-full"></div>
                <span className="text-xs sm:text-sm font-medium">Annual Discounting</span>
              </div>
            </div>

            {/* Plan headers */}
            <div className="col-span-1 flex flex-col items-center">
              <div className="h-6 sm:h-8 w-6 sm:w-8 bg-blue-400 rounded-lg mb-2 sm:mb-3 flex items-center justify-center">
                <span className="text-white text-[10px] sm:text-xs font-medium">FREE</span>
              </div>
              <p className="text-xs sm:text-sm font-bold">FREE</p>
              <p className="mb-2 sm:mb-3 text-xs sm:text-sm text-gray-700">$0/mo</p>
              <Button variant="outline" className="text-[10px] sm:text-xs h-6 sm:h-8 px-2 sm:px-3">
                Get started
              </Button>
            </div>

            <div className="col-span-1 flex flex-col items-center">
              <div className="h-6 sm:h-8 w-6 sm:w-8 bg-orange-400 rounded-lg mb-2 sm:mb-3 flex items-center justify-center">
                <span className="text-white text-[10px] sm:text-xs font-medium">PRO</span>
              </div>
              <p className="text-xs sm:text-sm font-bold">PRO</p>
              <p className="mb-2 sm:mb-3 text-xs sm:text-sm text-gray-700">$4.1/mo</p>
              <Button variant="default" className="bg-black text-white text-[10px] sm:text-xs h-6 sm:h-8 px-2 sm:px-3">
                Upgrade
              </Button>
            </div>

            <div className="col-span-1 flex flex-col items-center">
              <div className="h-6 sm:h-8 w-6 sm:w-8 bg-purple-400 rounded-lg mb-2 sm:mb-3 flex items-center justify-center">
                <span className="text-white text-[10px] sm:text-xs font-medium">MAX</span>
              </div>
              <p className="text-xs sm:text-sm font-bold">MAX</p>
              <p className="mb-2 sm:mb-3 text-xs sm:text-sm text-gray-700">$15.2/mo</p>
              <Button variant="default" className="bg-black text-white text-[10px] sm:text-xs h-6 sm:h-8 px-2 sm:px-3">
                Upgrade
              </Button>
            </div>

            <div className="col-span-1 flex flex-col items-center">
              <div className="h-6 sm:h-8 w-6 sm:w-8 bg-emerald-400 rounded-lg mb-2 sm:mb-3 flex items-center justify-center">
                <span className="text-white text-[10px] sm:text-xs font-medium">PRO</span>
              </div>
              <p className="text-xs sm:text-sm font-bold">LIFETIME PRO</p>
              <p className="mb-2 sm:mb-3 text-xs sm:text-sm text-gray-700">$199</p>
              <Button variant="default" className="bg-black text-white text-[10px] sm:text-xs h-6 sm:h-8 px-2 sm:px-3">
                Upgrade
              </Button>
            </div>
          </div>

          {/* Features comparison */}
          {Object.entries(features).map(([category, featuresList], categoryIndex) => (
            <div key={category} className={categoryIndex > 0 ? "mt-4 sm:mt-6 md:mt-8" : ""}>
              <h3 className="font-bold text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">{category}</h3>
              {featuresList.map((feature, featureIndex) => (
                <div 
                  key={`${category}-${featureIndex}`} 
                  className="grid grid-cols-5 py-2 sm:py-3 border-b border-gray-100"
                >
                  <div className="col-span-1 text-xs sm:text-sm md:text-md text-gray-900">
                    {feature.name}
                  </div>
                  <div className="col-span-1 flex justify-center">
                    {feature.free ? <CheckIcon /> : <XMarkIcon />}
                  </div>
                  <div className="col-span-1 flex justify-center">
                    {feature.pro ? <CheckIcon /> : <XMarkIcon />}
                  </div>
                  <div className="col-span-1 flex justify-center">
                    {feature.max ? <CheckIcon /> : <XMarkIcon />}
                  </div>
                  <div className="col-span-1 flex justify-center">
                    {feature.lifetime ? <CheckIcon /> : <XMarkIcon />}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingTable;
