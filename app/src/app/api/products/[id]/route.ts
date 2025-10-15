import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import ProductModel, { IProduct } from '@/models/Product';
import { AdminProduct } from '../route';

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
    placeholder: product.placeholder || {
      x: 150,
      y: 120,
      width: 200,
      height: 250
    },
    createdAt: typeof product.createdAt === 'object' && product.createdAt !== null ? (product.createdAt as Date).toISOString() : product.createdAt,
    updatedAt: product.updatedAt ? (typeof product.updatedAt === 'object' && product.updatedAt !== null ? (product.updatedAt as Date).toISOString() : product.updatedAt) : undefined
  };
}

// Helper function to format product data from MongoDB document
function formatProductData(product: any): any {
  return {
    _id: product._id.toString(),
    name: product.name,
    description: product.description,
    category: product.category,
    subcategory: product.subcategory,
    price: product.price,
    image: product.image,
    tags: product.tags || [],
    colors: product.colors || [],
    colorVariants: product.colorVariants || [],
    mockupImage: product.mockupImage || null,
    placeholder: product.placeholder || {
      x: 150,
      y: 120,
      width: 200,
      height: 250
    },
    createdAt: typeof product.createdAt === 'object' ? product.createdAt.toISOString() : product.createdAt,
    updatedAt: typeof product.updatedAt === 'object' ? product.updatedAt.toISOString() : product.updatedAt
  };
}

// GET a single product by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Connect to MongoDB
    await dbConnect();
    
    // Find product by ID
    const product = await ProductModel.findById(id);
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Convert MongoDB document to formatted product data
    const formattedProduct = formatProductData(product);
    
    return NextResponse.json(formattedProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

import { validateBase64Image } from '@/lib/imageValidator';

// PUT to update a product
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = await params;
    
    // Get updated product data from request
    const updatedProduct = await request.json();
    
    // Validate image format (must be PNG)
    if (updatedProduct.image && updatedProduct.image.startsWith('data:')) {
      const imageValidation = validateBase64Image(updatedProduct.image);
      if (!imageValidation.isValid) {
        return NextResponse.json({ error: imageValidation.error || 'Invalid image format. Only PNG images are allowed.' }, { status: 400 });
      }
    }
    
    // Validate background image format if present
    if (updatedProduct.backgroundImage && updatedProduct.backgroundImage.startsWith('data:')) {
      const bgImageValidation = validateBase64Image(updatedProduct.backgroundImage);
      if (!bgImageValidation.isValid) {
        return NextResponse.json({ error: bgImageValidation.error || 'Invalid background image format. Only PNG images are allowed.' }, { status: 400 });
      }
    }
    
    // Connect to MongoDB
    await dbConnect();
    
    // Update product in MongoDB
    const product = await ProductModel.findByIdAndUpdate(
      id,
      { ...updatedProduct, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Convert MongoDB document to AdminProduct
    const adminProduct = convertToAdminProduct(product as IProduct);
    
    return NextResponse.json(adminProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE a product
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = await params;
    
    // Connect to MongoDB
    await dbConnect();
    
    // Delete product from MongoDB
    const product = await ProductModel.findByIdAndDelete(id);
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
