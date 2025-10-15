import React from 'react';
import { Check } from 'lucide-react';

const CheckIcon: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="bg-green-100 rounded-full p-1 transition-all duration-200 group-hover:bg-green-200">
        <Check className="h-4 w-4 text-green-600 group-hover:text-green-700" strokeWidth={3} />
      </div>
    </div>
  );
};

export default CheckIcon;
