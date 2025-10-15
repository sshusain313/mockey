import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import UserModel from '@/models/User';
import { updateUserSubscription, resetDownloadCount } from '@/lib/downloadService';

// PATCH handler to update user subscription (admin only)
export async function PATCH(req: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user is an admin
    if (session.user?.role !== 'admin') {
      return NextResponse.json(
        { message: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }
    
    // Parse request body
    const { userId, subscriptionType } = await req.json();
    
    if (!userId || !subscriptionType || !['free', 'pro', 'lifetime'].includes(subscriptionType)) {
      return NextResponse.json(
        { message: 'Invalid request data' },
        { status: 400 }
      );
    }
    
    // Connect to database
    const db = await dbConnect();
    if (!db) {
      return NextResponse.json(
        { message: 'Database connection error' },
        { status: 500 }
      );
    }
    
    // Find user by ID
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Update the user's subscription
    user.subscription = subscriptionType;
    await user.save();
    
    // Reset the user's download count
    await resetDownloadCount(userId);
    
    return NextResponse.json({ 
      message: 'User subscription updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription
      }
    });
  } catch (error) {
    console.error('Error updating user subscription:', error);
    return NextResponse.json(
      { message: 'An error occurred while updating user subscription' },
      { status: 500 }
    );
  }
}