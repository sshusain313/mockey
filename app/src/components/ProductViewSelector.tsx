'use client';

import React from 'react';

interface ProductViewSelectorProps {
  activeView: 'front' | 'back' | 'side';
  hasBackView: boolean;
  hasSideView: boolean;
  onViewChange: (view: 'front' | 'back' | 'side') => void;
}

const ProductViewSelector: React.FC<ProductViewSelectorProps> = ({
  activeView,
  hasBackView,
  hasSideView,
  onViewChange,
}) => {
  return (
    <div className="flex justify-center gap-2 mb-4 w-full">
      <button 
        onClick={() => onViewChange('front')}
        className={`px-4 py-2 ${activeView === 'front' ? 'bg-blue-600' : 'bg-blue-400'} text-white rounded hover:bg-blue-500 text-sm`}
      >
        Front View
      </button>
      <button 
        onClick={() => onViewChange('back')}
        className={`px-4 py-2 ${activeView === 'back' ? 'bg-blue-600' : 'bg-blue-400'} text-white rounded hover:bg-blue-500 text-sm ${!hasBackView ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={!hasBackView}
      >
        Back View
      </button>
      <button 
        onClick={() => onViewChange('side')}
        className={`px-4 py-2 ${activeView === 'side' ? 'bg-blue-600' : 'bg-blue-400'} text-white rounded hover:bg-blue-500 text-sm ${!hasSideView ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={!hasSideView}
      >
        Side View
      </button>
    </div>
  );
};

export default ProductViewSelector;
