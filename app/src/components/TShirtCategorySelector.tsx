import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronDown, Check } from 'lucide-react';

interface CategoryOption {
  value: string;
  label: string;
}

const tshirtCategories: CategoryOption[] = [
  { value: 'blank', label: 'Blank' },
  { value: 'round_neck', label: 'Round Neck' },
  { value: 'v_neck', label: 'V-Neck' },
  { value: 'polo', label: 'Polo' },
  { value: 'long_sleeve', label: 'Long Sleeve' },
  { value: 'short_sleeve', label: 'Short Sleeve' },
  { value: 'oversized', label: 'Oversized' },
  { value: 'slim_fit', label: 'Slim Fit' },
  { value: 'regular_fit', label: 'Regular Fit' },
  { value: 'crew_neck', label: 'Crew Neck' },
  { value: 'henley', label: 'Henley' },
  { value: 'raglan', label: 'Raglan' },
  { value: 'graphic', label: 'Graphic' },
  { value: 'plain', label: 'Plain' },
  { value: 'striped', label: 'Striped' },
  { value: 'patterned', label: 'Patterned' },
  { value: 'white', label: 'White' },
  { value: 'black', label: 'Black' },
  { value: 'colored', label: 'Colored' },
  { value: 'unisex', label: 'Unisex' },
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'kids', label: 'Kids' },
  { value: 'with_model', label: 'With Model' },
  { value: 'without_model', label: 'Without Model' },
  { value: 'front_view', label: 'Front View' },
  { value: 'back_view', label: 'Back View' },
  { value: 'side_view', label: 'Side View' },
  { value: 'folded', label: 'Folded' },
  { value: 'hanging', label: 'Hanging' },
  { value: 'flat_lay', label: 'Flat Lay' },
];

interface TShirtCategorySelectorProps {
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
  label?: string;
}

const TShirtCategorySelector: React.FC<TShirtCategorySelectorProps> = ({
  selectedCategories,
  onChange,
  label = 'T-Shirt Categories'
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleToggleCategory = (value: string) => {
    if (selectedCategories.includes(value)) {
      onChange(selectedCategories.filter(cat => cat !== value));
    } else {
      onChange([...selectedCategories, value]);
    }
  };

  const removeCategory = (value: string) => {
    onChange(selectedCategories.filter(cat => cat !== value));
  };

  const filteredCategories = searchTerm 
    ? tshirtCategories.filter(cat => 
        cat.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : tshirtCategories;

  return (
    <div className="space-y-2">
      <Label htmlFor="tshirt-categories" className="text-gray-700 font-medium">{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            role="combobox" 
            className="w-full justify-between font-normal text-left"
          >
            Select T-Shirt categories
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 max-h-80 overflow-auto" align="start">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full p-2 mb-2 border rounded text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {filteredCategories.map((option) => (
              <div key={option.value} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                <Checkbox 
                  id={`category-${option.value}`}
                  checked={selectedCategories.includes(option.value)}
                  onCheckedChange={() => handleToggleCategory(option.value)}
                />
                <label 
                  htmlFor={`category-${option.value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                >
                  {option.label}
                </label>
                {selectedCategories.includes(option.value) && (
                  <Check className="h-4 w-4 text-green-500" />
                )}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex flex-wrap gap-2 mt-3">
        {selectedCategories.length === 0 && (
          <span className="text-gray-400 text-sm">No categories selected</span>
        )}
        {selectedCategories.map(value => {
          const option = tshirtCategories.find(cat => cat.value === value);
          return (
            <Badge key={value} variant="secondary" className="px-3 py-1.5 flex items-center gap-1.5">
              {option?.label || value}
              <button 
                type="button" 
                onClick={() => removeCategory(value)}
                className="rounded-full p-0.5 hover:bg-gray-200 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                <span className="sr-only">Remove {option?.label || value}</span>
              </button>
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default TShirtCategorySelector;
