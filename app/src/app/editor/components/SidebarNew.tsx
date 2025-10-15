'use client';

import { Download, ChevronDown, RotateCcw } from 'lucide-react';
import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';

interface SidebarProps {
  colorValue: string;
  setColorValue: (color: string) => void;
  warpingValue: number;
  setWarpingValue: (value: number) => void;
  unclipDesign: boolean;
  setUnclipDesign: (value: boolean) => void;
  activeDesign: string | null;
  setActiveDesign?: (design: string | null) => void;
  handleDownload: () => void;
  availableColors?: string[]; // Colors available from admin
  // Rotation props
  rotationX: number;
  setRotationX: (value: number) => void;
  rotationY: number;
  setRotationY: (value: number) => void;
  // Scaling props
  scaleX: number;
  setScaleX: (value: number) => void;
  scaleY: number;
  setScaleY: (value: number) => void;
  maintainAspectRatio: boolean;
  setMaintainAspectRatio: (value: boolean) => void;
  // Additional wrapping properties
  warpingDirection: 'horizontal' | 'vertical';
  setWarpingDirection: (direction: 'horizontal' | 'vertical') => void;
  warpingStyle: 'wave' | 'bulge' | 'pinch';
  setWarpingStyle: (style: 'wave' | 'bulge' | 'pinch') => void;
  warpingFrequency: number;
  setWarpingFrequency: (value: number) => void;
  warpingAmplitude: number;
  setWarpingAmplitude: (value: number) => void;
  warpingPhase: number;
  setWarpingPhase: (value: number) => void;
}

const Sidebar = ({
  colorValue,
  setColorValue,
  warpingValue,
  setWarpingValue,
  unclipDesign,
  setUnclipDesign,
  activeDesign,
  setActiveDesign,
  handleDownload,
  availableColors = [], // Default to empty array if not provided
  rotationX,
  setRotationX,
  rotationY,
  setRotationY,
  scaleX,
  setScaleX,
  scaleY,
  setScaleY,
  maintainAspectRatio,
  setMaintainAspectRatio,
  // Additional wrapping properties
  warpingDirection,
  setWarpingDirection,
  warpingStyle,
  setWarpingStyle,
  warpingFrequency,
  setWarpingFrequency,
  warpingAmplitude,
  setWarpingAmplitude,
  warpingPhase,
  setWarpingPhase
}: SidebarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filename, setFilename] = useState("design.png");
  const [newColorInput, setNewColorInput] = useState("");
  const [savedColors, setSavedColors] = useState<string[]>([]);
  
  // Advanced wrapping toggle state
  const [showAdvancedWrapping, setShowAdvancedWrapping] = useState(false);

  // All predefined color options
  const allColorOptions = [
    { name: "White", value: "#FFFFFF" },
    { name: "Black", value: "#000000" },
    { name: "Red", value: "#FF0000" },
    { name: "Green", value: "#00FF00" },
    { name: "Blue", value: "#0000FF" },
    { name: "Yellow", value: "#FFFF00" },
    { name: "Purple", value: "#800080" },
    { name: "Orange", value: "#FFA500" },
    { name: "Pink", value: "#FFC0CB" },
    { name: "Gray", value: "#808080" },
  ];
  
  // Filter color options based on what's available from admin
  const colorOptions = availableColors.length > 0
    ? allColorOptions.filter(color => {
        // Check if this color is in the available colors list
        return availableColors.some(availableColor => {
          // Convert both to lowercase for case-insensitive comparison
          // Check both by name and by hex value
          return (
            color.name.toLowerCase() === availableColor.toLowerCase() ||
            color.value.toLowerCase() === availableColor.toLowerCase()
          );
        });
      })
    : allColorOptions; // If no available colors specified, show all options
  
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && setActiveDesign) {
      // Check if the file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      // Create a URL for the uploaded image
      const imageUrl = URL.createObjectURL(file);
      console.log('Created object URL for uploaded image:', imageUrl);
      
      // Set the active design
      setActiveDesign(imageUrl);
      setFilename(file.name);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setColorValue(e.target.value);
  };
  
  // The handleResetWarping function is defined later in the file

  const handleColorInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewColorInput(e.target.value);
  };

  const handleColorInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newColorInput) {
      addColor(newColorInput);
    }
  };

  const addColor = (color: string) => {
    // Validate the color format
    if (!/^#[0-9A-F]{6}$/i.test(color)) {
      // Try to convert it to a valid hex
      if (/^[0-9A-F]{6}$/i.test(color)) {
        color = `#${color}`;
      } else {
        alert('Please enter a valid hex color code (e.g., #FF0000 or FF0000).');
        return;
      }
    }
    
    // Check if the color already exists
    if (savedColors.includes(color)) {
      alert('This color is already in your palette.');
      return;
    }
    
    // Add the color to the list
    setSavedColors([...savedColors, color]);
    setNewColorInput('');
  };

  const removeColor = (colorToRemove: string) => {
    setSavedColors(savedColors.filter(color => color !== colorToRemove));
  };

  const selectPredefinedColor = (colorValue: string) => {
    setColorValue(colorValue);
  };

  const handleWarpingChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWarpingValue(parseInt(e.target.value));
  };

  const handleUnclipChange = () => {
    setUnclipDesign(!unclipDesign);
  };

  const handleResetWarping = () => {
    setWarpingValue(0);
    setWarpingDirection('horizontal');
    setWarpingStyle('wave');
    setWarpingFrequency(3);
    setWarpingAmplitude(10);
    setWarpingPhase(0);
  };
  
  // Generate CSS transform based on wrapping settings
  const getWarpingTransform = () => {
    // Base transform for intensity
    let transform = '';
    
    // Apply different transforms based on style
    switch (warpingStyle) {
      case 'wave':
        if (warpingDirection === 'horizontal') {
          // Horizontal wave effect
          const skewY = warpingValue / 5;
          const scaleY = 1 + (Math.abs(warpingValue) / 100);
          transform = `skewY(${skewY}deg) scaleY(${scaleY})`;
          
          // Add wave effect with advanced parameters if enabled
          if (showAdvancedWrapping) {
            const translateY = Math.sin(warpingPhase * Math.PI / 180) * warpingAmplitude;
            transform += ` translateY(${translateY}px)`;
          }
        } else {
          // Vertical wave effect
          const skewX = warpingValue / 5;
          const scaleX = 1 + (Math.abs(warpingValue) / 100);
          transform = `skewX(${skewX}deg) scaleX(${scaleX})`;
          
          // Add wave effect with advanced parameters if enabled
          if (showAdvancedWrapping) {
            const translateX = Math.sin(warpingPhase * Math.PI / 180) * warpingAmplitude;
            transform += ` translateX(${translateX}px)`;
          }
        }
        break;
        
      case 'bulge':
        // Bulge effect (expand from center)
        const bulgeScale = 1 + (warpingValue / 50);
        transform = `scale(${bulgeScale})`;
        
        // Add advanced bulge parameters if enabled
        if (showAdvancedWrapping) {
          const rotateAngle = (warpingPhase / 10) % 360;
          transform += ` rotate(${rotateAngle}deg)`;
        }
        break;
        
      case 'pinch':
        // Pinch effect (contract from center)
        const pinchScale = Math.max(0.5, 1 - (Math.abs(warpingValue) / 50));
        transform = `scale(${pinchScale})`;
        
        // Add skew for advanced pinch effect if enabled
        if (showAdvancedWrapping) {
          const skewAngle = warpingValue / 10;
          if (warpingDirection === 'horizontal') {
            transform += ` skewY(${skewAngle}deg)`;
          } else {
            transform += ` skewX(${skewAngle}deg)`;
          }
        }
        break;
    }
    
    return transform;
  };

  // Handlers for rotation controls
  const handleRotationXChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRotationX(parseInt(e.target.value));
  };

  const handleRotationYChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRotationY(parseInt(e.target.value));
  };

  const handleResetRotation = () => {
    setRotationX(0);
    setRotationY(0);
  };

  // Handlers for scaling controls
  const handleScaleXChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newScaleX = parseFloat(e.target.value);
    setScaleX(newScaleX);
    
    // If maintaining aspect ratio, update Y scale accordingly
    if (maintainAspectRatio) {
      setScaleY(newScaleX);
    }
  };

  const handleScaleYChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newScaleY = parseFloat(e.target.value);
    setScaleY(newScaleY);
    
    // If maintaining aspect ratio, update X scale accordingly
    if (maintainAspectRatio) {
      setScaleX(newScaleY);
    }
  };

  const handleToggleAspectRatio = () => {
    setMaintainAspectRatio(!maintainAspectRatio);
    
    // If turning on aspect ratio, make both scales match the X scale
    if (!maintainAspectRatio) {
      setScaleY(scaleX);
    }
  };

  const handleResetScale = () => {
    setScaleX(1);
    setScaleY(1);
  };

  return (
    <div className="p-4 overflow-y-auto">
      {/* Download Button */}
      <button 
        onClick={handleDownload}
        className="w-full bg-green-500 text-white rounded-md py-3 mb-6 flex items-center justify-center gap-2"
      >
        <Download className="h-4 w-4" />
        Download
      </button>

      {/* Design Section */}
      <div className="mb-6">
        <h3 className="text-sm font-medium uppercase text-gray-900 mb-2">DESIGN</h3>
        <div className="space-y-2">
          <button 
            onClick={handleUploadClick}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Upload Design
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          
          {activeDesign && (
            <div className="mt-2 space-y-2">
              <div className="border border-gray-200 rounded-md p-2">
                <Image 
                  src={activeDesign} 
                  alt="Uploaded design" 
                  width={200} 
                  height={200} 
                  className="mx-auto object-contain" 
                  style={{ maxHeight: '200px' }}
                />
              </div>
              <div className="text-sm text-gray-500 truncate">{filename}</div>
            </div>
          )}
        </div>
      </div>

      {/* Color Section */}
      <div className="mb-6">
        <h3 className="text-sm font-medium uppercase text-gray-900 mb-2">COLOR</h3>
        <div className="space-y-3">
          <input 
            type="color" 
            value={colorValue} 
            onChange={handleColorChange}
            className="w-full h-10 rounded-md cursor-pointer"
          />
          
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newColorInput} 
              onChange={handleColorInputChange}
              onKeyDown={handleColorInputKeyDown}
              placeholder="Add hex color (e.g. #FF0000)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <button 
              onClick={() => newColorInput && addColor(newColorInput)}
              className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm"
            >
              Add
            </button>
          </div>
          
          <div className="mt-2">
            <h4 className="text-xs font-medium text-gray-700 mb-2">Saved Colors</h4>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color, index) => (
                <div 
                  key={index}
                  className="w-6 h-6 rounded-full border border-gray-300 cursor-pointer"
                  style={{ backgroundColor: color.value }}
                  onClick={() => selectPredefinedColor(color.value)}
                  title={color.name}
                />
              ))}
            </div>
            
            <div className="mt-2 space-y-2">
              {savedColors.length > 0 ? (
                savedColors.map((color, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                    <div 
                      className="w-5 h-5 rounded-full border border-gray-300" 
                      style={{ backgroundColor: color }}
                      onClick={() => setColorValue(color)}
                    ></div>
                    <span 
                      className="text-xs cursor-pointer" 
                      onClick={() => setColorValue(color)}
                    >
                      {color.substring(1, 7)}
                    </span>
                    <button 
                      onClick={() => removeColor(color)}
                      className="text-gray-500 hover:text-gray-700 ml-auto"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500">No colors saved yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Wrapping Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium uppercase text-gray-900 mb-2">WRAPPING</h3>
          <button 
            onClick={handleResetWarping}
            className="p-1 border border-gray-300 rounded-md text-xs flex items-center gap-1"
            title="Reset all wrapping effects"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        </div>
        
        {/* Basic Wrapping Intensity */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-gray-600">Intensity</label>
            <div className="flex items-center gap-1">
              <div className="w-12 h-6 border border-gray-300 rounded-md flex items-center justify-center text-xs">
                {warpingValue}%
              </div>
            </div>
          </div>
          <input 
            type="range" 
            min="-30" 
            max="30" 
            value={warpingValue} 
            onChange={handleWarpingChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        {/* Wrapping Direction */}
        <div className="mb-4">
          <label className="text-xs text-gray-600 block mb-2">Direction</label>
          <div className="grid grid-cols-2 gap-2">
            <button 
              className={`p-2 border rounded-md text-xs flex flex-col items-center ${warpingDirection === 'horizontal' ? 'bg-blue-100 border-blue-400' : 'border-gray-300'}`}
              onClick={() => setWarpingDirection('horizontal')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 7a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 13a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Horizontal
            </button>
            <button 
              className={`p-2 border rounded-md text-xs flex flex-col items-center ${warpingDirection === 'vertical' ? 'bg-blue-100 border-blue-400' : 'border-gray-300'}`}
              onClick={() => setWarpingDirection('vertical')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7 3a1 1 0 011-1v12a1 1 0 11-2 0V3a1 1 0 011-1zm6 0a1 1 0 011-1v12a1 1 0 11-2 0V3a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Vertical
            </button>
          </div>
        </div>
        
        {/* Wrapping Style */}
        <div className="mb-4">
          <label className="text-xs text-gray-600 block mb-2">Style</label>
          <div className="grid grid-cols-3 gap-2">
            <button 
              className={`p-2 border rounded-md text-xs flex flex-col items-center ${warpingStyle === 'wave' ? 'bg-blue-100 border-blue-400' : 'border-gray-300'}`}
              onClick={() => setWarpingStyle('wave')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 2.293a1 1 0 010 1.414l-7.5 7.5a1 1 0 01-1.414 0l-3.5-3.5a1 1 0 111.414-1.414L9 8.586l6.793-6.793a1 1 0 011.414 0z" />
              </svg>
              Wave
            </button>
            <button 
              className={`p-2 border rounded-md text-xs flex flex-col items-center ${warpingStyle === 'bulge' ? 'bg-blue-100 border-blue-400' : 'border-gray-300'}`}
              onClick={() => setWarpingStyle('bulge')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
              </svg>
              Bulge
            </button>
            <button 
              className={`p-2 border rounded-md text-xs flex flex-col items-center ${warpingStyle === 'pinch' ? 'bg-blue-100 border-blue-400' : 'border-gray-300'}`}
              onClick={() => setWarpingStyle('pinch')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
              Pinch
            </button>
          </div>
        </div>
        
        {/* Advanced Options Toggle */}
        <div className="mb-2">
          <button 
            onClick={() => setShowAdvancedWrapping(!showAdvancedWrapping)}
            className="flex items-center justify-between w-full px-3 py-2 text-xs text-left text-gray-700 bg-gray-100 rounded-md"
          >
            <span>Advanced Options</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showAdvancedWrapping ? 'transform rotate-180' : ''}`} />
          </button>
        </div>
        
        {/* Advanced Options Panel */}
        {showAdvancedWrapping && (
          <div className="p-3 bg-gray-50 rounded-md mb-2">
            {/* Frequency */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-gray-600">Frequency</label>
                <div className="w-12 h-6 border border-gray-300 rounded-md flex items-center justify-center text-xs bg-white">
                  {warpingFrequency}
                </div>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={warpingFrequency} 
                onChange={(e) => setWarpingFrequency(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            {/* Amplitude */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-gray-600">Amplitude</label>
                <div className="w-12 h-6 border border-gray-300 rounded-md flex items-center justify-center text-xs bg-white">
                  {warpingAmplitude}
                </div>
              </div>
              <input 
                type="range" 
                min="1" 
                max="20" 
                value={warpingAmplitude} 
                onChange={(e) => setWarpingAmplitude(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            {/* Phase */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-gray-600">Phase</label>
                <div className="w-12 h-6 border border-gray-300 rounded-md flex items-center justify-center text-xs bg-white">
                  {warpingPhase}°
                </div>
              </div>
              <input 
                type="range" 
                min="0" 
                max="360" 
                value={warpingPhase} 
                onChange={(e) => setWarpingPhase(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}
        
        {/* Preview Box */}
        <div className="border border-gray-300 rounded-md p-3 bg-gray-50">
          <div className="text-xs font-medium text-gray-700 mb-2">Preview</div>
          <div className="bg-white border border-gray-200 rounded-md h-24 flex items-center justify-center overflow-hidden">
            <div 
              className="w-16 h-16 bg-blue-500 flex items-center justify-center text-white text-xs font-bold"
              style={{
                transform: `${getWarpingTransform()}`,
                transition: 'transform 0.3s ease'
              }}
            >
              WRAP
            </div>
          </div>
        </div>
      </div>

      {/* Rotation Controls Section */}
      <div className="mb-6">
        <h3 className="text-sm font-medium uppercase text-gray-900 mb-2">ROTATION</h3>
        
        {/* X-Axis Rotation */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-gray-600">X-Axis</label>
            <div className="flex items-center gap-1">
              <div className="w-12 h-8 border border-gray-300 rounded-md flex items-center justify-center text-sm">
                {rotationX}°
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="range" 
              min="-45" 
              max="45" 
              value={rotationX} 
              onChange={handleRotationXChange}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
        
        {/* Y-Axis Rotation */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-gray-600">Y-Axis</label>
            <div className="flex items-center gap-1">
              <div className="w-12 h-8 border border-gray-300 rounded-md flex items-center justify-center text-sm">
                {rotationY}°
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="range" 
              min="-45" 
              max="45" 
              value={rotationY} 
              onChange={handleRotationYChange}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
        
        {/* Reset Button */}
        <button 
          onClick={handleResetRotation}
          className="w-full py-1 px-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm flex items-center justify-center gap-1 transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          Reset Rotation
        </button>
      </div>

      {/* Scaling Controls Section */}
      <div className="mb-6">
        <h3 className="text-sm font-medium uppercase text-gray-900 mb-2">SCALING</h3>
        
        {/* Maintain Aspect Ratio Toggle */}
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs text-gray-600">Maintain Aspect Ratio</label>
          <div 
            className={`w-10 h-6 rounded-full p-1 cursor-pointer ${maintainAspectRatio ? 'bg-blue-500' : 'bg-gray-300'}`}
            onClick={handleToggleAspectRatio}
          >
            <div 
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${maintainAspectRatio ? 'translate-x-4' : ''}`}
            ></div>
          </div>
        </div>
        
        {/* X-Scale */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-gray-600">Width Scale</label>
            <div className="flex items-center gap-1">
              <div className="w-12 h-8 border border-gray-300 rounded-md flex items-center justify-center text-sm">
                {scaleX.toFixed(2)}x
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="range" 
              min="0.5" 
              max="2" 
              step="0.01"
              value={scaleX} 
              onChange={handleScaleXChange}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
        
        {/* Y-Scale - Only shown if not maintaining aspect ratio */}
        {!maintainAspectRatio && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-gray-600">Height Scale</label>
              <div className="flex items-center gap-1">
                <div className="w-12 h-8 border border-gray-300 rounded-md flex items-center justify-center text-sm">
                  {scaleY.toFixed(2)}x
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="range" 
                min="0.5" 
                max="2" 
                step="0.01"
                value={scaleY} 
                onChange={handleScaleYChange}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}
        
        {/* Reset Button */}
        <button 
          onClick={handleResetScale}
          className="w-full py-1 px-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm flex items-center justify-center gap-1 transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          Reset Scale
        </button>
      </div>

      {/* Unclip Design Section */}
      <div className="mb-6">
        <h3 className="text-sm font-medium uppercase text-gray-900 mb-2">UNCLIP DESIGN</h3>
        <div className="flex items-center">
          <div 
            className={`w-10 h-6 rounded-full p-1 cursor-pointer ${unclipDesign ? 'bg-blue-500' : 'bg-gray-300'}`}
            onClick={handleUnclipChange}
          >
            <div 
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${unclipDesign ? 'translate-x-4' : ''}`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
