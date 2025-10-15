'use client';

import React, { useState } from 'react';
import { Circle, Square, Triangle, Hexagon, Star, Pentagon } from 'lucide-react';

export type GeometricPattern = 'rectangle' | 'circle' | 'triangle' | 'hexagon' | 'star' | 'pentagon' | 'custom';

interface GeometricPatternSelectorProps {
  onPatternSelect: (pattern: GeometricPattern) => void;
  selectedPattern: GeometricPattern;
}

const GeometricPatternSelector: React.FC<GeometricPatternSelectorProps> = ({
  onPatternSelect,
  selectedPattern,
}) => {
  const patterns: { id: GeometricPattern; icon: React.ReactNode; label: string }[] = [
    {
      id: 'rectangle',
      icon: <Square className="w-6 h-6" />,
      label: 'Rectangle',
    },
    {
      id: 'circle',
      icon: <Circle className="w-6 h-6" />,
      label: 'Circle',
    },
    {
      id: 'triangle',
      icon: <Triangle className="w-6 h-6" />,
      label: 'Triangle',
    },
    {
      id: 'hexagon',
      icon: <Hexagon className="w-6 h-6" />,
      label: 'Hexagon',
    },
    {
      id: 'star',
      icon: <Star className="w-6 h-6" />,
      label: 'Star',
    },
    {
      id: 'pentagon',
      icon: <Pentagon className="w-6 h-6" />,
      label: 'Pentagon',
    },
    {
      id: 'custom',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3 11C3 7.22876 3 5.34315 4.17157 4.17157C5.34315 3 7.22876 3 11 3H13C16.7712 3 18.6569 3 19.8284 4.17157C21 5.34315 21 7.22876 21 11V13C21 16.7712 21 18.6569 19.8284 19.8284C18.6569 21 16.7712 21 13 21H11C7.22876 21 5.34315 21 4.17157 19.8284C3 18.6569 3 16.7712 3 13V11Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="4 4"
          />
          <path
            d="M12 12C12 10.8954 12.8954 10 14 10C15.1046 10 16 10.8954 16 12C16 13.1046 15.1046 14 14 14C12.8954 14 12 13.1046 12 12Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M16 16L14 14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M8 8L10 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      label: 'Custom Shape',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h3 className="text-lg font-medium mb-3">Placeholder Shape</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {patterns.map((pattern) => (
          <button
            key={pattern.id}
            onClick={() => onPatternSelect(pattern.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-md transition-colors ${
              selectedPattern === pattern.id
                ? 'bg-blue-100 text-blue-600 border-2 border-blue-400'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
            }`}
            title={pattern.label}
          >
            <div className="mb-1">{pattern.icon}</div>
            <span className="text-xs">{pattern.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GeometricPatternSelector;
