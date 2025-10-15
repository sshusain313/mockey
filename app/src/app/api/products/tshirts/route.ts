import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProductModel, { IProduct } from '@/models/Product';

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

// GET T-shirt products with complete data
export async function GET(request: Request) {
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Create a query to fetch T-shirt products with all required fields
    const query = {
      category: 'Apparel',
      subcategory: { $in: ['T-Shirts', 'T-Shirt'] },
      // Ensure the product has an image
      image: { $exists: true, $ne: '' },
      // Ensure the product has placeholder data
      'placeholder.x': { $exists: true },
      'placeholder.y': { $exists: true },
      'placeholder.width': { $exists: true },
      'placeholder.height': { $exists: true }
    };
    
    // Fetch products from MongoDB with the specific query
    const products = await ProductModel.find(query).sort({ createdAt: -1 });
    
    // Convert MongoDB documents to plain objects
    const formattedProducts = products.map(product => formatProductData(product));
    
    console.log(`API: Fetched ${formattedProducts.length} T-shirt products with complete data`);
    
    // If no products found in the database, return mock data
    if (formattedProducts.length === 0) {
      console.log('No T-shirt products found in database, returning mock data');
      return NextResponse.json(getMockProducts());
    }
    
    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('API Error fetching T-shirt products with details:', error);
    return NextResponse.json(getMockProducts(), { status: 200 });
  }
}

// Mock data for development when database is not available
function getMockProducts(): any[] {
  return [
    {
      _id: '1',
      name: 'Classic White T-Shirt',
      description: 'A comfortable classic white t-shirt made from 100% cotton.',
      category: 'Apparel',
      subcategory: 'T-Shirts',
      price: 24.99,
      image: '/products/tshirt-white.jpg',
      tags: ['White', 'Cotton', 'Classic', 'Unisex'],
      colors: ['White'],
      colorVariants: [
        {
          color: 'White',
          hex: '#FFFFFF',
          image: '/products/tshirt-white.jpg'
        }
      ],
      placeholder: {
        x: 150,
        y: 120,
        width: 200,
        height: 250
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '2',
      name: 'Black Graphic T-Shirt',
      description: 'A stylish black t-shirt perfect for custom designs.',
      category: 'Apparel',
      subcategory: 'T-Shirts',
      price: 29.99,
      image: '/products/tshirt-black.jpg',
      tags: ['Black', 'Cotton', 'Graphic', 'Unisex'],
      colors: ['Black'],
      colorVariants: [
        {
          color: 'Black',
          hex: '#000000',
          image: '/products/tshirt-black.jpg'
        }
      ],
      placeholder: {
        x: 150,
        y: 120,
        width: 200,
        height: 250
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '3',
      name: 'Navy Blue Crew Neck',
      description: 'A premium navy blue crew neck t-shirt.',
      category: 'Apparel',
      subcategory: 'T-Shirts',
      price: 27.99,
      image: '/products/tshirt-navy.jpg',
      tags: ['Navy Blue', 'Crew Neck', 'Premium', 'Unisex'],
      colors: ['Navy Blue'],
      colorVariants: [
        {
          color: 'Navy Blue',
          hex: '#000080',
          image: '/products/tshirt-navy.jpg'
        }
      ],
      placeholder: {
        x: 150,
        y: 120,
        width: 200,
        height: 250
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}