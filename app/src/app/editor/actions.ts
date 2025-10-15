"use server";

import { revalidatePath } from "next/cache";
import mongoose from 'mongoose';
import { Design } from '@/models/Design';
import { writeFile, mkdir } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { existsSync } from 'fs';

// Define a default MongoDB URL in case the environment variable is not available
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/mockey';

// Connect to MongoDB
async function connectToDatabase() {
  try {
    if (mongoose.connection.readyState >= 1) {
      return mongoose.connection;
    }
    
    console.log('Connecting to MongoDB with URL:', MONGODB_URL);
    return await mongoose.connect(MONGODB_URL);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to database');
  }
}

// Server action to upload design image
export async function uploadDesignImage(formData: FormData) {
  try {
    const file = formData.get('design') as File;
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public/uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }
    
    // Generate a unique filename
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${uuidv4()}-${file.name.replace(/\s/g, '_')}`;
    const filepath = path.join(uploadsDir, filename);
    
    // Write the file to the uploads directory
    await writeFile(filepath, buffer);
    
    // Return the path that can be used in <Image> components
    return { success: true, imagePath: `/uploads/${filename}` };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { success: false, error: 'Failed to upload image' };
  }
}

// Server action to save design
export async function saveDesign(designData: any) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Create a new design document
    const design = await Design.create({
      productId: designData.productId,
      designImage: designData.designImage,
      userId: designData.userId || 'anonymous'
    });
    
    // Revalidate the path to update UI
    revalidatePath("/editor");
    
    return { success: true, message: "Design saved successfully", designId: design._id };
  } catch (error) {
    console.error("Error saving design:", error);
    return { success: false, message: "Failed to save design" };
  }
}
