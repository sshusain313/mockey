import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import UserModel from '@/models/User';
import UserDownload from '@/models/UserDownload';
import Product from '@/models/Product';
import mongoose from 'mongoose';

// Helper function to get date range
function getDateRange(days: number) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  return { startDate, endDate };
}

// GET handler to fetch analytics data (admin only)
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

    // Get query parameters
    const url = new URL(req.url);
    const period = url.searchParams.get('period') || '30'; // Default to 30 days
    const { startDate, endDate } = getDateRange(parseInt(period));
    
    // Fetch user analytics
    const totalUsers = await UserModel.countDocuments();
    const newUsers = await UserModel.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate }
    });
    
    // Get user subscription breakdown
    const freeUsers = await UserModel.countDocuments({ subscription: 'free' });
    const proUsers = await UserModel.countDocuments({ subscription: 'pro' });
    const lifetimeUsers = await UserModel.countDocuments({ subscription: 'lifetime' });
    
    // Get user signups by date for the selected period
    const userSignupsByDate = await UserModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Fetch download analytics
    const totalDownloads = await UserDownload.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$downloadCount' }
        }
      }
    ]);
    
    // Get downloads by date for the selected period
    // Note: This is an approximation since we don't store individual download timestamps
    const downloadsByDate = await UserDownload.aggregate([
      {
        $match: {
          updatedAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } },
          count: { $sum: '$downloadCount' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Fetch product analytics
    const totalProducts = await Product.countDocuments();
    const newProducts = await Product.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate }
    });
    
    // Get products by category
    const productsByCategory = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    // Calculate estimated revenue (simplified)
    // In a real app, you would use actual payment data
    const estimatedMonthlyRevenue = proUsers * 9.99; // Assuming $9.99/month for Pro
    const estimatedLifetimeRevenue = lifetimeUsers * 99.99; // Assuming $99.99 for Lifetime
    
    return NextResponse.json({
      userAnalytics: {
        totalUsers,
        newUsers,
        subscriptionBreakdown: {
          free: freeUsers,
          pro: proUsers,
          lifetime: lifetimeUsers
        },
        signupsByDate: userSignupsByDate
      },
      downloadAnalytics: {
        totalDownloads: totalDownloads.length > 0 ? totalDownloads[0].total : 0,
        downloadsByDate
      },
      productAnalytics: {
        totalProducts,
        newProducts,
        productsByCategory
      },
      revenueAnalytics: {
        estimatedMonthlyRevenue,
        estimatedLifetimeRevenue,
        estimatedTotalRevenue: estimatedMonthlyRevenue + estimatedLifetimeRevenue
      }
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching analytics data' },
      { status: 500 }
    );
  }
}