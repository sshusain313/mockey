import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import ProductModel, { IProduct } from '@/models/Product';

// Define product type for API responses
export interface AdminProduct {
  _id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  image: string;
  description: string;
  tags?: string[];
  colors?: string[];
  mockupImage?: string | null;
  placeholder: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  customShapePoints?: Array<{x: number, y: number}>;
  createdAt: string;
  updatedAt?: string;
}

// Helper function to convert MongoDB document to AdminProduct
function convertToAdminProduct(product: IProduct): AdminProduct {
  return {
    _id: product._id.toString(),
    name: product.name,
    category: product.category,
    subcategory: product.subcategory,
    price: product.price,
    image: product.image,
    description: product.description,
    tags: product.tags || [],
    colors: product.colors || [],
    mockupImage: product.mockupImage || null,
    placeholder: product.placeholder || {
      x: 100,
      y: 100,
      width: 200,
      height: 200
    },
    customShapePoints: product.customShapePoints || [],
    createdAt: typeof product.createdAt === 'object' && product.createdAt !== null ? new Date(product.createdAt).toISOString() : product.createdAt,
    updatedAt: product.updatedAt ? (typeof product.updatedAt === 'object' && product.updatedAt !== null ? new Date(product.updatedAt).toISOString() : product.updatedAt) : undefined
  };
}

// GET all products
export async function GET(request: Request) {
  try {
    // Get the URL to check for query parameters
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const subcategory = url.searchParams.get('subcategory');
    
    // Connect to MongoDB and ensure connection is established
    const mongoose = await dbConnect();
    if (!mongoose) {
      console.error('Failed to connect to MongoDB');
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
    
    let query = {};
    
    // Add filters if provided
    if (category) {
      query = { ...query, category };
    }
    
    if (subcategory) {
      query = { ...query, subcategory };
    }
    
    // Fetch products from MongoDB with the query
    const products = await ProductModel.find(query).sort({ createdAt: -1 });
    
    // Convert MongoDB documents to AdminProduct objects
    const adminProducts = products.map((product) => convertToAdminProduct(product as IProduct));
    
    return NextResponse.json(adminProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

import { validateBase64Image } from '@/lib/imageValidator';

// POST a new product
export async function POST(request: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get product data from request
    const productData = await request.json();
    
    // Validate required fields
    if (!productData.name || !productData.category || !productData.price) {
      return NextResponse.json({ error: 'Missing required fields: name, category, and price are required' }, { status: 400 });
    }

    // Validate placeholder data
    if (!productData.placeholder || 
        typeof productData.placeholder.x !== 'number' || 
        typeof productData.placeholder.y !== 'number' || 
        typeof productData.placeholder.width !== 'number' || 
        typeof productData.placeholder.height !== 'number') {
      return NextResponse.json({ 
        error: 'Invalid placeholder data. Must include x, y, width, and height as numbers' 
      }, { status: 400 });
    }
    
    // Validate image format (must be PNG)
    if (productData.image) {
      const imageValidation = validateBase64Image(productData.image);
      if (!imageValidation.isValid) {
        return NextResponse.json({ error: imageValidation.error || 'Invalid image format. Only PNG images are allowed.' }, { status: 400 });
      }
    }
    
    // Validate background image format if present
    if (productData.backgroundImage) {
      const bgImageValidation = validateBase64Image(productData.backgroundImage);
      if (!bgImageValidation.isValid) {
        return NextResponse.json({ error: bgImageValidation.error || 'Invalid background image format. Only PNG images are allowed.' }, { status: 400 });
      }
    }
    
    // Validate mockup image format if present
    if (productData.mockupImage) {
      const mockupImageValidation = validateBase64Image(productData.mockupImage);
      if (!mockupImageValidation.isValid) {
        return NextResponse.json({ error: mockupImageValidation.error || 'Invalid mockup image format. Only PNG images are allowed.' }, { status: 400 });
      }
    }
    
    // Connect to MongoDB
    await dbConnect();
    
    // Create new product in MongoDB
    const newProduct = await ProductModel.create(productData);
    
    // Convert MongoDB document to AdminProduct
    const adminProduct = convertToAdminProduct(newProduct as IProduct);
    
    return NextResponse.json(adminProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

// PUT to update all products (for batch operations)
export async function PUT(request: Request) {
  try {
    // Get user session
    const userSession = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!userSession?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get products data from request
    const productsData = await request.json();
    
    // Connect to MongoDB
    await dbConnect();
    
    try {
      // Delete all existing products
      await ProductModel.deleteMany({});
      
      // Insert all new products
      const insertedProducts = await ProductModel.insertMany(productsData);
      
      // Convert MongoDB documents to AdminProduct objects
      const adminProducts = insertedProducts.map((product) => 
        convertToAdminProduct(product as IProduct)
      );
      
      return NextResponse.json(adminProducts);
    } catch (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error updating products:', error);
    return NextResponse.json({ error: 'Failed to update products' }, { status: 500 });
  }
}

// DELETE all products
export async function DELETE(request: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Connect to MongoDB
    await dbConnect();
    
    // Delete all products
    const result = await ProductModel.deleteMany({});
    
    return NextResponse.json({ 
      success: true, 
      message: `Successfully deleted ${result.deletedCount} products` 
    });
  } catch (error) {
    console.error('Error deleting all products:', error);
    return NextResponse.json({ error: 'Failed to delete all products' }, { status: 500 });
  }
}
