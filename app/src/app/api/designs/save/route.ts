import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import UserDesign from '@/models/UserDesign';
import { validateBase64Image } from '@/lib/imageValidator';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be signed in to save designs' },
        { status: 401 }
      );
    }
    
    // Get user ID from session
    const userId = session.user.id;
    
    // Parse request body
    const data = await req.json();
    const { productType, productCategory, designName, color, designImage, additionalSettings } = data;
    
    // Validate required fields
    if (!productType || !productCategory || !designName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate design image format (must be PNG)
    if (designImage) {
      const imageValidation = validateBase64Image(designImage);
      if (!imageValidation.isValid) {
        return NextResponse.json(
          { error: imageValidation.error || 'Invalid image format. Only PNG images are allowed.' },
          { status: 400 }
        );
      }
    }
    
    // Connect to database
    await dbConnect();
    
    // Check if design with same name exists for this user and product type
    const existingDesign = await UserDesign.findOne({
      userId,
      productType,
      designName
    });
    
    let design;
    
    if (existingDesign) {
      // Update existing design
      existingDesign.color = color;
      existingDesign.designImage = designImage;
      existingDesign.additionalSettings = additionalSettings || {};
      design = await existingDesign.save();
    } else {
      // Create new design
      design = await UserDesign.create({
        userId,
        productType,
        productCategory,
        designName,
        color,
        designImage,
        additionalSettings: additionalSettings || {}
      });
    }
    
    return NextResponse.json({
      success: true,
      message: existingDesign ? 'Design updated successfully' : 'Design saved successfully',
      design
    });
    
  } catch (error) {
    console.error('Error saving design:', error);
    return NextResponse.json(
      { error: 'Failed to save design' },
      { status: 500 }
    );
  }
}
