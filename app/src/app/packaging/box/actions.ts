'use server';

import dbConnect from '@/lib/mongodb';
import ProductModel, { IProduct } from '@/models/Product';
import { cache } from 'react';

// Helper function to format product data from MongoDB document
function formatProductData(product: any): any {
  // Create a serializable placeholder object
  const placeholder = product.placeholder ? {
    x: product.placeholder.x,
    y: product.placeholder.y,
    width: product.placeholder.width,
    height: product.placeholder.height
  } : {
    x: 150,
    y: 120,
    width: 200,
    height: 250
  };

  // Format color variants to ensure they're serializable
  const colorVariants = (product.colorVariants || []).map((variant: any) => ({
    color: variant.color,
    hex: variant.hex,
    image: variant.image
  }));

  return {
    _id: product._id.toString(),
    name: product.name,
    description: product.description,
    category: product.category,
    subcategory: product.subcategory,
    price: product.price,
    image: product.image,
    tags: Array.isArray(product.tags) ? [...product.tags] : [],
    colors: Array.isArray(product.colors) ? [...product.colors] : [],
    colorVariants: colorVariants,
    mockupImage: product.mockupImage || null,
    placeholder: placeholder,
    createdAt: product.createdAt instanceof Date ? product.createdAt.toISOString() : 
               typeof product.createdAt === 'string' ? product.createdAt : 
               new Date().toISOString(),
    updatedAt: product.updatedAt instanceof Date ? product.updatedAt.toISOString() : 
               typeof product.updatedAt === 'string' ? product.updatedAt : 
               new Date().toISOString()
  };
}

// Get mock box products for fallback
function getMockBoxProducts() {
  return [
    {
      _id: '1',
      name: 'Cardboard Gift Box',
      description: 'A sturdy cardboard gift box perfect for packaging your custom products.',
      category: 'Packaging',
      subcategory: 'box',
      price: 8.99,
      image: '/products/box-cardboard.jpg',
      tags: ['Cardboard', 'Gift', 'Packaging', 'Recyclable'],
      colors: ['Brown'],
      colorVariants: [
        {
          color: 'Brown',
          hex: '#8B4513',
          image: '/products/box-cardboard.jpg'
        }
      ],
      placeholder: {
        x: 150,
        y: 150,
        width: 200,
        height: 200
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '2',
      name: 'Premium White Box',
      description: 'An elegant white box for premium product packaging.',
      category: 'Packaging',
      subcategory: 'box',
      price: 12.99,
      image: '/products/box-white.jpg',
      tags: ['Premium', 'White', 'Elegant', 'Gift'],
      colors: ['White'],
      colorVariants: [
        {
          color: 'White',
          hex: '#FFFFFF',
          image: '/products/box-white.jpg'
        }
      ],
      placeholder: {
        x: 150,
        y: 150,
        width: 200,
        height: 200
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '3',
      name: 'Kraft Paper Box',
      description: 'An eco-friendly kraft paper box for sustainable packaging.',
      category: 'Packaging',
      subcategory: 'box',
      price: 9.99,
      image: '/products/box-kraft.jpg',
      tags: ['Kraft', 'Eco-friendly', 'Sustainable', 'Natural'],
      colors: ['Natural'],
      colorVariants: [
        {
          color: 'Natural',
          hex: '#D2B48C',
          image: '/products/box-kraft.jpg'
        }
      ],
      placeholder: {
        x: 150,
        y: 150,
        width: 200,
        height: 200
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}

/**
 * Fetch only box products
 * This function specifically filters for products with subcategory related to boxes
 */
export const getBoxProducts = cache(async () => {
  let products = [];
  
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Create a query to fetch only box products
    const query = {
      // Ensure the product has an image
      image: { $exists: true, $ne: '' },
      // Ensure the product has placeholder data
      'placeholder.x': { $exists: true },
      'placeholder.y': { $exists: true },
      'placeholder.width': { $exists: true },
      'placeholder.height': { $exists: true },
      // Filter for box subcategory (case-insensitive)
      $or: [
        { subcategory: { $regex: 'box', $options: 'i' } },
        { subcategory: { $regex: 'boxes', $options: 'i' } },
        { subcategory: { $regex: 'packaging box', $options: 'i' } },
        { subcategory: { $regex: 'gift box', $options: 'i' } },
        { subcategory: { $regex: 'cardboard box', $options: 'i' } }
      ]
    };
    
    // Fetch box products from MongoDB with the specific query
    const dbProducts = await ProductModel.find(query).sort({ createdAt: -1 });
    
    // Convert MongoDB documents to plain objects
    products = dbProducts.map(product => formatProductData(product));
    
    console.log(`Server: Fetched ${products.length} box products with complete data`);
    
    // If no box products found in the database, use mock box data
    if (products.length === 0) {
      console.log('No box products found in database, using mock box data');
      products = getMockBoxProducts();
    }
  } catch (error) {
    console.error('Error fetching box products:', error);
    // Use mock box data as fallback
    products = getMockBoxProducts();
  }
  
  return products;
});
