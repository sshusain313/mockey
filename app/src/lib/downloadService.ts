import { getServerSession } from 'next-auth/next';
import { getSession } from 'next-auth/react';
import dbConnect from './mongodb';
import User from '@/models/User';
import UserDownload from '@/models/UserDownload';
import mongoose from 'mongoose';

// Define download limits based on subscription type
const DOWNLOAD_LIMITS: Record<string, number> = {
  free: 10,
  pro: 100,
  lifetime: Infinity
};

/**
 * Check if a user can download based on their subscription and download count
 * @returns Object with canDownload status and subscription information
 */
export async function checkDownloadEligibility() {
  try {
    await dbConnect();
    
    // Get the current user session
    // Try to get server session first (for API routes)
    let session = await getServerSession();
    
    // If no server session, try client-side session (for client components)
    if (!session) {
      session = await getSession();
    }
    
    // If no user is logged in, they can't download
    if (!session || !session.user || !session.user.email) {
      return {
        canDownload: false,
        message: 'Please sign in to download designs',
        subscription: 'none',
        downloadsRemaining: 0,
        totalAllowed: 0
      };
    }
    
    // Find the user in the database
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return {
        canDownload: false,
        message: 'User not found',
        subscription: 'none',
        downloadsRemaining: 0,
        totalAllowed: 0
      };
    }
    
    // Get the user's subscription type
    const subscriptionType = user.subscription || 'free';
    const downloadLimit = DOWNLOAD_LIMITS[subscriptionType as keyof typeof DOWNLOAD_LIMITS] || DOWNLOAD_LIMITS.free;
    
    // Find or create the user's download record
    let userDownload = await UserDownload.findOne({ userId: user._id });
    
    if (!userDownload) {
      userDownload = new UserDownload({
        userId: user._id,
        downloadCount: 0
      });
      await userDownload.save();
    }
    
    // For lifetime subscription, always allow downloads
    if (subscriptionType === 'lifetime') {
      return {
        canDownload: true,
        message: 'You have unlimited downloads with your Lifetime subscription',
        subscription: subscriptionType,
        downloadsRemaining: Infinity,
        totalAllowed: Infinity
      };
    }
    
    // Check if the user has reached their download limit
    const downloadsRemaining = downloadLimit - userDownload.downloadCount;
    const canDownload = downloadsRemaining > 0;
    
    return {
      canDownload,
      message: canDownload 
        ? `You have ${downloadsRemaining} downloads remaining` 
        : 'You have reached your download limit. Please upgrade your subscription to continue downloading.',
      subscription: subscriptionType,
      downloadsRemaining,
      totalAllowed: downloadLimit
    };
  } catch (error) {
    console.error('Error checking download eligibility:', error);
    return {
      canDownload: false,
      message: 'An error occurred while checking download eligibility',
      subscription: 'unknown',
      downloadsRemaining: 0,
      totalAllowed: 0
    };
  }
}

/**
 * Increment the user's download count
 * @returns Success status and updated download information
 */
export async function incrementDownloadCount() {
  try {
    await dbConnect();
    
    // Get the current user session
    // Try to get server session first (for API routes)
    let session = await getServerSession();
    
    // If no server session, try client-side session (for client components)
    if (!session) {
      session = await getSession();
    }
    
    // If no user is logged in, they can't download
    if (!session || !session.user || !session.user.email) {
      return {
        success: false,
        message: 'User not authenticated'
      };
    }
    
    // Find the user in the database
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return {
        success: false,
        message: 'User not found'
      };
    }
    
    // Find or create the user's download record
    let userDownload = await UserDownload.findOne({ userId: user._id });
    
    if (!userDownload) {
      userDownload = new UserDownload({
        userId: user._id,
        downloadCount: 1 // Set to 1 for the first download
      });
    } else {
      // Increment the download count
      userDownload.downloadCount += 1;
    }
    
    // Update the lastUpdated timestamp
    userDownload.updatedAt = new Date();
    
    // Save the updated download record
    await userDownload.save();
    
    // Get the user's subscription type and download limit
    const subscriptionType = user.subscription || 'free';
    const downloadLimit = DOWNLOAD_LIMITS[subscriptionType as keyof typeof DOWNLOAD_LIMITS] || DOWNLOAD_LIMITS.free;
    
    // Calculate downloads remaining
    const downloadsRemaining = subscriptionType === 'lifetime' 
      ? Infinity 
      : downloadLimit - userDownload.downloadCount;
    
    return {
      success: true,
      message: 'Download count incremented successfully',
      downloadsRemaining,
      totalAllowed: subscriptionType === 'lifetime' ? Infinity : downloadLimit,
      downloadCount: userDownload.downloadCount
    };
  } catch (error) {
    console.error('Error incrementing download count:', error);
    return {
      success: false,
      message: 'An error occurred while incrementing download count'
    };
  }
}

/**
 * Reset the user's download count
 * Useful for monthly resets or subscription changes
 */
export async function resetDownloadCount(userId: string) {
  try {
    await dbConnect();
    
    // Find the user's download record
    const userDownload = await UserDownload.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    
    if (userDownload) {
      userDownload.downloadCount = 0;
      userDownload.lastResetDate = new Date();
      userDownload.updatedAt = new Date();
      await userDownload.save();
      
      return {
        success: true,
        message: 'Download count reset successfully'
      };
    }
    
    return {
      success: false,
      message: 'User download record not found'
    };
  } catch (error) {
    console.error('Error resetting download count:', error);
    return {
      success: false,
      message: 'An error occurred while resetting download count'
    };
  }
}

/**
 * Update user subscription and reset download count
 */
export async function updateUserSubscription(email: string, subscriptionType: 'free' | 'pro' | 'lifetime') {
  try {
    await dbConnect();
    
    // Find the user
    const user = await User.findOne({ email });
    
    if (!user) {
      return {
        success: false,
        message: 'User not found'
      };
    }
    
    // Update the user's subscription
    user.subscription = subscriptionType;
    await user.save();
    
    // Reset the user's download count
    await resetDownloadCount(user._id.toString());
    
    return {
      success: true,
      message: `Subscription updated to ${subscriptionType} successfully`
    };
  } catch (error) {
    console.error('Error updating user subscription:', error);
    return {
      success: false,
      message: 'An error occurred while updating user subscription'
    };
  }
}
