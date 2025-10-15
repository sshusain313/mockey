import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Search, Tag, Check, X, ChevronDown } from 'lucide-react';

// Predefined categories for quick selection
const predefinedCategories = [
  "Blank",
  "Round Neck",
  "Without People",
  "White",
  "Oversized",
  "Unisex",
  "Closeup",
  "Acid Wash",
  "Washed",
  "Red",
  "Black",
  "Boxy",
  "Navy Blue",
  "Mannequin",
  "Women"
];

interface ProductTagsProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

const ProductTags: React.FC<ProductTagsProps> = ({ tags, onTagsChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customTag, setCustomTag] = useState('');

  const handleTagToggle = (tag: string) => {
    const currentTags = [...tags];
    if (currentTags.includes(tag)) {
      onTagsChange(currentTags.filter(t => t !== tag));
    } else {
      onTagsChange([...currentTags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    onTagsChange(tags.filter(t => t !== tag));
  };

  const addCustomTag = () => {
    if (customTag.trim() && !tags.includes(customTag.trim())) {
      onTagsChange([...tags, customTag.trim()]);
      setCustomTag('');
    }
  };

  const handleCustomTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomTag();
    }
  };

  const filteredCategories = predefinedCategories.filter(
    category => category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-2 pt-4 border-t border-gray-100">
      <Label htmlFor="tags" className="text-gray-700 font-medium flex items-center gap-2">
        <Tag className="h-4 w-4 text-brand-pink" />
        Product Tags & Attributes
      </Label>
      <div className="flex gap-2">
        <Input
          id="customTag"
          placeholder="Add custom tag..."
          value={customTag}
          onChange={(e) => setCustomTag(e.target.value)}
          onKeyDown={handleCustomTagKeyDown}
          className="flex-1"
        />
        <Button 
          type="button" 
          onClick={addCustomTag}
          variant="outline"
          className="shrink-0"
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
            Select from common tags
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-3 max-h-80 overflow-auto" align="start">
          <div className="mb-3 sticky top-0 bg-white pb-2 z-10">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            {filteredCategories.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-2">No matches found</p>
            ) : (
              filteredCategories.map((tag) => (
                <div key={tag} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                  <Checkbox 
                    id={`tag-${tag}`}
                    checked={tags.includes(tag)}
                    onCheckedChange={() => handleTagToggle(tag)}
                  />
                  <label 
                    htmlFor={`tag-${tag}`}
                    className="text-sm font-medium leading-none cursor-pointer flex-1"
                  >
                    {tag}
                  </label>
                  {tags.includes(tag) && (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                </div>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex flex-wrap gap-2 mt-3">
        {tags.length === 0 ? (
          <span className="text-gray-400 text-sm">No tags selected</span>
        ) : (
          tags.map(tag => (
            <Badge 
              key={tag} 
              variant="outline" 
              className="px-3 py-1.5 flex items-center gap-1.5 bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
            >
              {tag}
              <button 
                type="button" 
                onClick={() => removeTag(tag)}
                className="rounded-full p-0.5 hover:bg-gray-200 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                <span className="sr-only">Remove {tag}</span>
              </button>
            </Badge>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductTags;
