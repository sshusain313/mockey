// Client-safe type definitions for Product model

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  image: string;
  tags: string[];
  colors: string[]; // Color values/names
  colorVariants: ColorVariant[]; // New field for color variants
  mockupImage?: string | null;
  // Placeholder rectangle for design placement
  placeholder: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  // Custom shape points for magnetic lasso
  customShapePoints?: Array<{x: number, y: number}>;
  createdAt: string;
  updatedAt: string;
}

// Define the ColorVariant interface
export interface ColorVariant {
  color: string; // Color value/name
  hex: string;   // Hex code
  image: string; // URL to the variant image
}