import mongoose, { Schema, Document } from 'mongoose';

// Enhance the Product interface to include color variants
export interface IProduct extends Document {
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

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    backgroundImage: { type: String, required: false }, // Made optional
    mockupImage: { type: String, required: false }, // Added mockupImage field
    // Placeholder rectangle for design placement
    placeholder: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
    },
    // Custom shape points for magnetic lasso
    customShapePoints: {
      type: [{
        x: Number,
        y: Number
      }],
      default: []
    },
    tags: { type: [String], default: [] }, // Array of strings for tags
    colors: { type: [String], default: [] }, // Array of strings for color options
    // Add color variants schema
    colorVariants: {
      type: [{
        color: String,
        hex: String,
        image: String
      }],
      default: []
    }
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
