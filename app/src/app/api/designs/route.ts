import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import UserDesign from '@/models/UserDesign';

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be signed in to view your designs' },
        { status: 401 }
      );
    }
    
    // Get user ID from session
    const userId = session.user.id;
    
    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const productType = searchParams.get('productType');
    const productCategory = searchParams.get('productCategory');
    
    // Connect to database
    await dbConnect();
    
    // Build query
    const query: any = { userId };
    if (productType) query.productType = productType;
    if (productCategory) query.productCategory = productCategory;
    
    // Fetch designs
    const designs = await UserDesign.find(query).sort({ updatedAt: -1 });
    
    return NextResponse.json({
      success: true,
      designs
    });
    
  } catch (error) {
    console.error('Error fetching designs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch designs' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be signed in to delete designs' },
        { status: 401 }
      );
    }
    
    // Get user ID from session
    const userId = session.user.id;
    
    // Parse request body
    const data = await req.json();
    const { designId } = data;
    
    if (!designId) {
      return NextResponse.json(
        { error: 'Design ID is required' },
        { status: 400 }
      );
    }
    
    // Connect to database
    await dbConnect();
    
    // Find and delete the design
    const design = await UserDesign.findOne({
      _id: designId,
      userId
    });
    
    if (!design) {
      return NextResponse.json(
        { error: 'Design not found or you do not have permission to delete it' },
        { status: 404 }
      );
    }
    
    await design.deleteOne();
    
    return NextResponse.json({
      success: true,
      message: 'Design deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting design:', error);
    return NextResponse.json(
      { error: 'Failed to delete design' },
      { status: 500 }
    );
  }
}
