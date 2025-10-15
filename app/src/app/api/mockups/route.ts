import { NextResponse } from 'next/server';
import { MockupItem } from '@/lib/mockupService';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Path to store mockup data
const dataDir = path.join(process.cwd(), 'data');
const mockupsFile = path.join(dataDir, 'mockups.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize mockups file if it doesn't exist
if (!fs.existsSync(mockupsFile)) {
  fs.writeFileSync(mockupsFile, JSON.stringify([]));
}

// Helper function to read mockups
function readMockups(userId?: string): any[] {
  try {
    const data = fs.readFileSync(mockupsFile, 'utf8');
    const allMockups = JSON.parse(data);
    
    // If userId is provided, filter mockups by user
    if (userId) {
      return allMockups.filter((mockup: any) => 
        mockup.userId === userId || (typeof mockup.id === 'number' && mockup.id < 100) // Return user's mockups and default mockups
      );
    }
    
    return allMockups;
  } catch (error) {
    console.error('Error reading mockups:', error);
    return [];
  }
}

// Helper function to write mockups
function writeMockups(mockups: any[]): void {
  try {
    fs.writeFileSync(mockupsFile, JSON.stringify(mockups, null, 2));
  } catch (error) {
    console.error('Error writing mockups:', error);
  }
}

// GET all mockups
export async function GET(request: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    // Read mockups, filtered by user if authenticated
    const mockups = readMockups(userId);
    
    return NextResponse.json(mockups);
  } catch (error) {
    console.error('Error fetching mockups:', error);
    return NextResponse.json({ error: 'Failed to fetch mockups' }, { status: 500 });
  }
}

// POST a new mockup
export async function POST(request: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    // Get product data from request
    const productData = await request.json();
    console.log('Received product data:', productData);
    
    // Add user ID if authenticated
    if (session?.user?.id) {
      productData.userId = session.user.id;
    }
    
    // Read all mockups
    const mockups = readMockups();
    
    // Ensure product has an ID
    if (!productData.id) {
      productData.id = uuidv4();
    }
    
    // Add timestamp
    productData.createdAt = new Date().toISOString();
    
    // Convert product data to MockupItem format if needed
    let mockupData = productData;
    
    // If the data is in the product format (with name, category, etc.), convert it to MockupItem format
    if (productData.name && !productData.title) {
      const categories = [];
      if (productData.category) categories.push(productData.category);
      if (productData.subcategory) categories.push(productData.subcategory);
      
      mockupData = {
        ...productData,
        title: productData.name,
        categories: categories,
        isPro: false
      };
    }
    
    // Add to mockups
    mockups.push(mockupData);
    writeMockups(mockups);
    
    return NextResponse.json({ success: true, product: mockupData }, { status: 201 });
  } catch (error) {
    console.error('Error creating mockup:', error);
    return NextResponse.json({ error: 'Failed to create mockup', details: String(error) }, { status: 500 });
  }
}

// PUT to update all mockups (for batch operations)
export async function PUT(request: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get mockups data from request
    const mockupsData = await request.json();
    
    // Write mockups to file
    writeMockups(mockupsData);
    
    return NextResponse.json(mockupsData);
  } catch (error) {
    console.error('Error updating mockups:', error);
    return NextResponse.json({ error: 'Failed to update mockups' }, { status: 500 });
  }
}

// DELETE all mockups or user-uploaded mockups
export async function DELETE(request: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if we're deleting user uploads only or all mockups
    const url = new URL(request.url);
    const isUserUploadsOnly = url.pathname.endsWith('/user-uploads');
    
    // Read all mockups
    const allMockups = readMockups();
    
    if (isUserUploadsOnly) {
      // Keep only default mockups (those with id < 100)
      const defaultMockups = allMockups.filter((mockup: any) => 
        typeof mockup.id === 'number' && mockup.id < 100
      );
      
      // Write back only the default mockups
      writeMockups(defaultMockups);
      
      return NextResponse.json({ 
        success: true, 
        message: `Successfully deleted ${allMockups.length - defaultMockups.length} user-uploaded mockups` 
      });
    } else {
      // Delete all mockups by writing an empty array
      writeMockups([]);
      
      return NextResponse.json({ 
        success: true, 
        message: `Successfully deleted all ${allMockups.length} mockups` 
      });
    }
  } catch (error) {
    console.error('Error deleting mockups:', error);
    return NextResponse.json({ error: 'Failed to delete mockups' }, { status: 500 });
  }
}
