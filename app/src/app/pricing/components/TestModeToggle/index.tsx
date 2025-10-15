'use client';

import React, { useEffect, useState } from 'react';

interface TestModeToggleProps {
  onToggle: (isTestMode: boolean) => void;
  initialState?: boolean;
}

const TestModeToggle: React.FC<TestModeToggleProps> = ({ 
  onToggle, 
  initialState = false 
}) => {
  const [isTestMode, setIsTestMode] = useState(initialState);

  // Initialize from localStorage on client-side
  useEffect(() => {
    const savedMode = localStorage.getItem('razorpay_test_mode');
    if (savedMode) {
      setIsTestMode(savedMode === 'true');
    }
  }, []);

  const handleToggle = () => {
    const newMode = !isTestMode;
    setIsTestMode(newMode);
    localStorage.setItem('razorpay_test_mode', String(newMode));
    onToggle(newMode);
  };

  return (
    <div className="flex items-center justify-end mb-4">
      <div className="flex items-center">
        <span className="mr-2 text-sm font-medium text-gray-700">
          {isTestMode ? 'Test Mode: ON' : 'Test Mode: OFF'}
        </span>
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            isTestMode ? 'bg-indigo-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isTestMode ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      {isTestMode && (
        <div className="ml-2 text-xs text-gray-500 bg-yellow-100 px-2 py-1 rounded">
          Using test credentials - payments won't be charged
        </div>
      )}
    </div>
  );
};

export default TestModeToggle;
