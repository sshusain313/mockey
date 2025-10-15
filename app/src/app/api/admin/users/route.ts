import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import UserModel from '@/models/User';

// GET handler to fetch all users (admin only)
export async function GET(req: NextRequest) {
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
    
    // Connect to database
    const db = await dbConnect();
    if (!db) {
      return NextResponse.json(
        { message: 'Database connection error' },
        { status: 500 }
      );
    }
    
    // Fetch all users
    const users = await UserModel.find({}).select('-password').sort({ createdAt: -1 });
    
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching users' },
      { status: 500 }
    );
  }
}

// PATCH handler to update user role (admin only)
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
    const { userId, role } = await req.json();
    
    if (!userId || !role || !['admin', 'user'].includes(role)) {
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
    
    // Don't allow changing your own role
    if (user.email === session.user.email) {
      return NextResponse.json(
        { message: 'Cannot change your own role' },
        { status: 400 }
      );
    }
    
    // Update user role
    user.role = role;
    await user.save();
    
    return NextResponse.json({ 
      message: 'User role updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { message: 'An error occurred while updating user role' },
      { status: 500 }
    );
  }
}
