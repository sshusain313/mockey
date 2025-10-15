import mongoose, { Schema, Document } from 'mongoose';

export interface IUserDesign extends Document {
  userId: string;
  productType: string;
  productCategory: string;
  designName: string;
  color: string;
  designImage: string | null;
  additionalSettings: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const UserDesignSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    productType: { type: String, required: true }, // e.g., 'tshirt', 'mug', etc.
    productCategory: { type: String, required: true }, // e.g., 'apparel', 'home-living', etc.
    designName: { type: String, required: true },
    color: { type: String, required: true },
    designImage: { type: String, default: null }, // URL to the uploaded design image
    additionalSettings: { type: Object, default: {} }, // For any product-specific settings
  },
  { timestamps: true }
);

// Create a compound index for faster queries
UserDesignSchema.index({ userId: 1, productType: 1 });

export default mongoose.models.UserDesign || mongoose.model<IUserDesign>('UserDesign', UserDesignSchema);
