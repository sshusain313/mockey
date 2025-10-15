import React from 'react';
import { X } from 'lucide-react';

const XMarkIcon: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="bg-red-100 rounded-full p-1 transition-all duration-200 group-hover:bg-red-200">
        <X className="h-4 w-4 text-red-600 group-hover:text-red-700" strokeWidth={3} />
      </div>
    </div>
  );
};

export default XMarkIcon;
