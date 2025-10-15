'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';


interface PricingCardProps {
  plan: {
    name: string;
    icon: string;
    price: string;
    oldPrice: string | null;
    subtext: string;
    features: string[];
    button: string;
    highlight: string | boolean;
    bg: string;
    isLifetime?: boolean;
  };
  index: number;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, index }) => {
  return (
    <div
      className={`relative flex flex-col rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 ${plan.bg} text-center`}
    >
      {/* Most Popular Badge */}
      {plan.highlight && (
        <div className="absolute top-2 right-2 bg-black text-white text-xs font-medium px-2 py-0.5 rounded z-10">
          ↑ {plan.highlight}
        </div>
      )}

      {/* Header */}
      <div
        className={`flex items-center justify-center gap-2 text-xs sm:text-sm font-medium mb-3 sm:mb-4 ${plan.isLifetime ? 'text-white' : 'text-gray-900'}`}
      >
        <div className="text-lg sm:text-xl">{plan.icon}</div>
        <div>{plan.name}</div>
      </div>

      {/* Price Section */}
      <div
        className={`text-xl sm:text-2xl font-semibold mb-1 ${plan.isLifetime ? 'text-white' : 'text-gray-900'}`}
      >
        {plan.price}
      </div>
      {plan.oldPrice && (
        <div className="text-sm text-gray-400 line-through">{plan.oldPrice}</div>
      )}
      <div
        className={`text-xs sm:text-sm mb-3 sm:mb-4 whitespace-pre-wrap ${plan.isLifetime ? 'text-white/70' : 'text-gray-500'}`}
      >
        {plan.subtext}
      </div>

      {/* Features */}
      <ul
        className={`flex-1 space-y-1.5 sm:space-y-2 text-xs sm:text-sm mb-4 sm:mb-6 ${plan.isLifetime ? 'text-white' : 'text-gray-700'}`}
      >
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-1.5 sm:gap-2 justify-center">
            <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={14} />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {/* Button */}
      <button
        className={`w-full py-1.5 sm:py-2 text-xs sm:text-sm rounded-md font-medium transition ${plan.isLifetime ? 'bg-white text-gray-900 hover:bg-gray-200' : plan.highlight ? 'bg-pink-500 text-white hover:bg-pink-600' : index === 2 ? 'bg-black text-white hover:bg-gray-800' : 'bg-white text-black border border-gray-300 hover:bg-gray-50'}`}
      >
        {plan.button}
      </button>
    </div>
  );
};

export default PricingCard;
