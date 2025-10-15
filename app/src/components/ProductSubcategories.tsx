import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { ChevronDown, Check, X } from 'lucide-react';

interface SubcategoryOption {
  value: string;
  label: string;
  category: string;
}

interface ProductSubcategoriesProps {
  category: string;
  subcategories: string[];
  onSubcategoryChange: (subcategories: string[]) => void;
}

// Subcategory options map
const subcategoryOptions: Record<string, SubcategoryOption[]> = {
  apparel: [
    { value: 't-shirt', label: 'T-Shirt', category: 'apparel' },
    { value: 'hoodie', label: 'Hoodie', category: 'apparel' },
    { value: 'tank tops', label: 'Tank Tops', category: 'apparel' },
    { value: 'jacket', label: 'Jacket', category: 'apparel' },
    { value: 'crop top', label: 'Crop Top', category: 'apparel' },
    { value: 'apron', label: 'Apron', category: 'apparel' },
    { value: 'scarf', label: 'Scarf', category: 'apparel' },
    { value: 'jersey', label: 'Jersey', category: 'apparel' },

  ],
  tech: [
    { value: 'iphone', label: 'iPhone', category: 'tech' },
    { value: 'laptop', label: 'Laptop', category: 'tech' },
    { value: 'ipad', label: 'iPad', category: 'tech' },
    { value: 'macbook', label: 'Macbook', category: 'tech' },
    { value: 'phone', label: 'Phone', category: 'tech' },
  ],
  home: [
    { value: 'can', label: 'can', category: 'home' },
    { value: 'mug', label: 'mug', category: 'home' },
    { value: 'cushion', label: 'cushion', category: 'home' },
    { value: 'coaster', label: 'Coaster', category: 'home' },
  ],
  accessories: [
    { value: 'tote bag', label: 'Totebag', category: 'accessories' },
    { value: 'cap', label: 'cap', category: 'accessories' },
    { value: 'phone-cover', label: 'phone-cover', category: 'accessories' },
    { value: 'beanie', label: 'Beanie', category: 'accessories' },
    { value: 'gaming pad', label: 'Gaming Pad', category: 'accessories' },
  ],
  print: [
    { value: 'business card', label: 'Business Card', category: 'print' },
    { value: 'book', label: 'Book', category: 'print' },
    { value: 'id card', label: 'Id Card', category: 'print' },
    { value: 'poster', label: 'Poster', category: 'print' },
    { value: 'flyer', label: 'Flyer', category: 'print' },
    { value: 'greeting card', label: 'Greeting Card', category: 'print' },
    { value: 'billboard', label: 'Billboard', category: 'print' },
    { value: 'magazine', label: 'Magazine', category: 'print' },
    { value: 'brochure', label: 'Brochure', category: 'print' },
    { value: 'lanyard', label: 'Lanyard', category: 'print' },
    { value: 'banner', label: 'Banner', category: 'print' },
    { value: 'canvas', label: 'Canvas', category: 'print' },
    { value: 'notebook', label: 'Notebook', category: 'print' },
  ],
  packaging: [
    { value: 'box', label: 'Box', category: 'packaging' },
    { value: 'bottle', label: 'Bottle', category: 'packaging' },
    { value: 'dropper bottle', label: 'Dropper Bottle', category: 'packaging' },
    { value: 'pouch', label: 'Pouch', category: 'packaging' },
    { value: 'cosmetic', label: 'Cosmetic', category: 'packaging' },
  ]
};

const ProductSubcategories: React.FC<ProductSubcategoriesProps> = ({ 
  category, 
  subcategories, 
  onSubcategoryChange 
}) => {
  const handleSubcategoryToggle = (value: string) => {
    const currentSubcategories = [...subcategories];
    if (currentSubcategories.includes(value)) {
      onSubcategoryChange(currentSubcategories.filter(sc => sc !== value));
    } else {
      onSubcategoryChange([...currentSubcategories, value]);
    }
  };

  const removeSubcategory = (value: string) => {
    onSubcategoryChange(subcategories.filter(sc => sc !== value));
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="subcategories" className="text-gray-700 font-medium">Subcategories</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            role="combobox" 
            aria-expanded={true} 
            disabled={!category}
            className="w-full justify-between font-normal text-left"
          >
            Select subcategories
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 max-h-72 overflow-auto" align="start">
          <div className="p-2">
            {category && subcategoryOptions[category]?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                <Checkbox 
                  id={`subcategory-${option.value}`}
                  checked={subcategories.includes(option.value)}
                  onCheckedChange={() => handleSubcategoryToggle(option.value)}
                />
                <label 
                  htmlFor={`subcategory-${option.value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                >
                  {option.label}
                </label>
                {subcategories.includes(option.value) && (
                  <Check className="h-4 w-4 text-green-500" />
                )}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex flex-wrap gap-2 mt-3">
        {subcategories.length === 0 && category && (
          <span className="text-gray-400 text-sm">No subcategories selected</span>
        )}
        {subcategories.map(value => {
          const currentOptions = subcategoryOptions[category] || [];
          const option = currentOptions.find(o => o.value === value);
          return (
            <Badge key={value} variant="secondary" className="px-3 py-1.5 flex items-center gap-1.5">
              {option?.label || value}
              <button 
                type="button" 
                onClick={() => removeSubcategory(value)}
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

export default ProductSubcategories;
