import mongoose, { Schema } from 'mongoose';

// Define the interface for a Design
export interface IDesign {
  productId: string;
  designImage: string;
  userId?: string;
  createdAt: Date;
}

// Define the schema for a Design
const DesignSchema = new Schema<IDesign>({
  productId: { 
    type: String, 
    required: [true, 'Product ID is required'] 
  },
  designImage: { 
    type: String, 
    required: [true, 'Design image is required'] 
  },
  userId: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Create and export the model
export const Design = mongoose.models.Design || mongoose.model<IDesign>('Design', DesignSchema);
