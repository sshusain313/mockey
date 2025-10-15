import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

// Define the color processing options
interface ColorProcessingOptions {
  hexColor: string;
  preserveTransparency?: boolean;
  blendMode?: 'multiply' | 'screen' | 'overlay';
  intensity?: number; // 0-1 value for color intensity
}

/**
 * Generates a color variant of a product image
 */
export async function generateColorVariant(
  imageBuffer: Buffer,
  options: ColorProcessingOptions
): Promise<Buffer> {
  try {
    // Parse the hex color
    const hex = options.hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Get image metadata
    const metadata = await sharp(imageBuffer).metadata();
    const { width, height } = metadata;
    
    if (options.preserveTransparency) {
      // Extract alpha channel to preserve transparency
      const alphaChannel = await sharp(imageBuffer)
        .extractChannel(3) // Alpha is channel 3
        .toBuffer();
      
      // Create a colored layer
      const colorLayer = await sharp({
        create: {
          width: width!,
          height: height!,
          channels: 3,
          background: { r, g, b }
        }
      }).toBuffer();
      
      // Apply the alpha mask to the color layer
      return await sharp(colorLayer)
        .joinChannel(alphaChannel)
        .png()
        .toBuffer();
    } else {
      // For non-transparent images or different blend modes
      const intensity = options.intensity || 0.8;
      const blendMode = options.blendMode || 'multiply';
      
      // Apply color using composite with blend mode
      return await sharp(imageBuffer)
        .composite([
          {
            input: {
              create: {
                width: width!,
                height: height!,
                channels: 4,
                background: { r, g, b, alpha: Math.round(255 * intensity) }
              }
            },
            blend: blendMode
          }
        ])
        .png()
        .toBuffer();
    }
  } catch (error) {
    console.error('Error generating color variant:', error);
    throw new Error('Failed to generate color variant');
  }
}

/**
 * Saves an image buffer to the file system and returns the path
 */
export async function saveImageToFileSystem(
  buffer: Buffer,
  filename: string,
  subfolder: string = 'products'
): Promise<string> {
  try {
    // Create a unique filename
    const uniqueFilename = `${path.parse(filename).name}-${uuidv4()}.png`;
    
    // Ensure the directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', subfolder);
    await fs.mkdir(uploadDir, { recursive: true });
    
    // Save the file
    const filePath = path.join(uploadDir, uniqueFilename);
    await fs.writeFile(filePath, buffer);
    
    // Return the public URL
    return `/uploads/${subfolder}/${uniqueFilename}`;
  } catch (error) {
    console.error('Error saving image:', error);
    throw new Error('Failed to save image');
  }
}