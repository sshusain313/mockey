import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Search, Palette, Check, X, ChevronDown } from 'lucide-react';
import { predefinedColors } from '@/lib/colorUtils';
import ColorVariantPreview from './ColorVariantPreview';

interface ProductColorsProps {
  colors: string[];
  onColorsChange: (colors: string[]) => void;
  productImage?: string | null;
}

const ProductColors: React.FC<ProductColorsProps> = ({ colors = [], onColorsChange, productImage = null }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customColor, setCustomColor] = useState('');
  const [customColorName, setCustomColorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleColorToggle = (colorName: string) => {
    const currentColors = [...colors];
    if (currentColors.includes(colorName)) {
      onColorsChange(currentColors.filter(c => c !== colorName));
    } else {
      onColorsChange([...currentColors, colorName]);
    }
  };

  const removeColor = (colorName: string) => {
    onColorsChange(colors.filter(c => c !== colorName));
  };

  const addCustomColor = () => {
    if (customColorName.trim() && !colors.includes(customColorName.trim())) {
      onColorsChange([...colors, customColorName.trim()]);
      setCustomColorName('');
      setCustomColor('');
    }
  };

  const handleCustomColorKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomColor();
    }
  };

  const filteredColors = predefinedColors.filter(
    color => color.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-2 pt-4 border-t border-gray-100">
      <div className="flex justify-between items-center">
        <Label htmlFor="colors" className="text-gray-700 font-medium flex items-center gap-2">
          <Palette className="h-4 w-4 text-brand-pink" />
          Product Colors
        </Label>
        {colors.length > 0 && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {colors.length} {colors.length === 1 ? 'color' : 'colors'} selected
          </Badge>
        )}
      </div>
      <div className="flex gap-2">
        <div className="flex-1 flex gap-2">
          <div className="w-10 h-10 border border-gray-200 rounded-md overflow-hidden">
            <input 
              type="color" 
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="w-full h-full cursor-pointer"
            />
          </div>
          <Input
            id="customColorName"
            placeholder="Color name (e.g., Ruby Red)"
            value={customColorName}
            onChange={(e) => setCustomColorName(e.target.value)}
            onKeyDown={handleCustomColorKeyDown}
            className="flex-1"
          />
        </div>
        <Button 
          type="button" 
          onClick={addCustomColor}
          variant="outline"
          className="shrink-0"
          disabled={!customColorName.trim()}
        >
          Add
        </Button>
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between font-normal text-left mt-2"
          >
            Select from common colors
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-3 max-h-80 overflow-auto" align="start">
          <div className="mb-3 sticky top-0 bg-white pb-2 z-10">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search colors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            {filteredColors.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-2">No matches found</p>
            ) : (
              filteredColors.map((color) => (
                <div key={color.name} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                  <Checkbox 
                    id={`color-${color.name}`}
                    checked={colors.includes(color.name)}
                    onCheckedChange={() => handleColorToggle(color.name)}
                  />
                  <div className="w-5 h-5 rounded-full border border-gray-200" style={{ backgroundColor: color.value }}></div>
                  <label 
                    htmlFor={`color-${color.name}`}
                    className="text-sm font-medium leading-none cursor-pointer flex-1"
                  >
                    {color.name}
                  </label>
                  {colors.includes(color.name) && (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                </div>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>

      {colors.length > 0 && (
        <div className="mt-3 p-2 bg-blue-50 border border-blue-100 rounded-md text-blue-700 text-sm">
          <p>Selected colors will appear in the preview gallery below.</p>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 mt-3">
        {colors.length === 0 ? (
          <span className="text-gray-400 text-sm">No colors selected</span>
        ) : (
          colors.map(colorName => {
            // Find the color value if it's a predefined color
            const colorObj = predefinedColors.find(c => c.name === colorName);
            const colorValue = colorObj ? colorObj.value : "#CCCCCC"; // Default to gray if not found
            
            return (
              <Badge 
                key={colorName} 
                variant="outline" 
                className="px-3 py-1.5 flex items-center gap-1.5 bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
              >
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colorValue }}></span>
                {colorName}
                <button 
                  type="button" 
                  onClick={() => removeColor(colorName)}
                  className="rounded-full p-0.5 hover:bg-gray-200 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  <span className="sr-only">Remove {colorName}</span>
                </button>
              </Badge>
            );
          })
        )}
      </div>
      
      {/* Preview Gallery */}
      {colors.length > 0 && productImage && (
        <div className="mt-6">
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-medium mb-4">Color Variants Preview</h3>
            {/* Render the color variant preview component */}
            <ColorVariantPreview 
              productImage={productImage} 
              colors={colors} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductColors;
