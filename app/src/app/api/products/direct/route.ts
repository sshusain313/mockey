import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProductModel, { IProduct } from '@/models/Product';

/**
 * GET handler to fetch products directly from the database
 * @param request Request object
 * @returns JSON response with products
 */
export async function GET(request: Request) {
  try {
    // Get the URL to check for query parameters
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const subcategory = url.searchParams.get('subcategory');
    const limit = parseInt(url.searchParams.get('limit') || '100');
    
    // Connect to MongoDB
    await dbConnect();
    
    let query: any = {};
    
    // Add filters if provided
    if (category) {
      query.category = category;
    }
    
    if (subcategory) {
      query.subcategory = subcategory;
    }
    
    // Fetch products from MongoDB with the query
    const products = await ProductModel.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);
    
    // Convert MongoDB documents to plain objects
    const plainProducts = JSON.parse(JSON.stringify(products));
    
    return NextResponse.json(plainProducts);
  } catch (error) {
    console.error('Error fetching products directly:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}