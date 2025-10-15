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

// Get mock gaming pad products for fallback
function getMockGamingPadProducts() {
  return [
    {
      _id: '1',
      name: 'RGB Gaming Mouse Pad',
      description: 'A premium RGB gaming mouse pad with customizable lighting effects.',
      category: 'Accessories',
      subcategory: 'Gaming Pad',
      price: 29.99,
      image: '/products/gaming-pad-rgb.jpg',
      tags: ['RGB', 'Gaming', 'Mouse Pad', 'Custom'],
      colors: ['Black'],
      colorVariants: [
        {
          color: 'Black',
          hex: '#000000',
          image: '/products/gaming-pad-rgb.jpg'
        }
      ],
      placeholder: {
        x: 150,
        y: 150,
        width: 300,
        height: 200
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '2',
      name: 'Extended Gaming Mouse Pad',
      description: 'An extra-large gaming mouse pad for keyboard and mouse.',
      category: 'Accessories',
      subcategory: 'Gaming Pad',
      price: 24.99,
      image: '/products/gaming-pad-extended.jpg',
      tags: ['Extended', 'Gaming', 'Mouse Pad', 'Large'],
      colors: ['Black'],
      colorVariants: [
        {
          color: 'Black',
          hex: '#000000',
          image: '/products/gaming-pad-extended.jpg'
        }
      ],
      placeholder: {
        x: 150,
        y: 150,
        width: 350,
        height: 150
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '3',
      name: 'Pro Gaming Mouse Pad',
      description: 'A professional gaming mouse pad with precision tracking surface.',
      category: 'Accessories',
      subcategory: 'Gaming Pad',
      price: 19.99,
      image: '/products/gaming-pad-pro.jpg',
      tags: ['Pro', 'Gaming', 'Mouse Pad', 'Precision'],
      colors: ['Red'],
      colorVariants: [
        {
          color: 'Red',
          hex: '#FF0000',
          image: '/products/gaming-pad-pro.jpg'
        }
      ],
      placeholder: {
        x: 150,
        y: 150,
        width: 250,
        height: 250
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}

/**
 * Fetch only gaming pad products
 * This function specifically filters for products with subcategory related to gaming pads
 */
export const getGamingPadProducts = cache(async () => {
  let products = [];
  
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Create a query to fetch only gaming pad products
    const query = {
      // Ensure the product has an image
      image: { $exists: true, $ne: '' },
      // Ensure the product has placeholder data
      'placeholder.x': { $exists: true },
      'placeholder.y': { $exists: true },
      'placeholder.width': { $exists: true },
      'placeholder.height': { $exists: true },
      // Filter for gaming pad subcategory (case-insensitive)
      $or: [
        { subcategory: { $regex: 'gaming pad', $options: 'i' } },
        { subcategory: { $regex: 'gaming mouse pad', $options: 'i' } },
        { subcategory: { $regex: 'mouse pad', $options: 'i' } },
        { subcategory: { $regex: 'mousepad', $options: 'i' } },
        { subcategory: { $regex: 'gaming mousepad', $options: 'i' } }
      ]
    };
    
    // Fetch gaming pad products from MongoDB with the specific query
    const dbProducts = await ProductModel.find(query).sort({ createdAt: -1 });
    
    // Convert MongoDB documents to plain objects
    products = dbProducts.map(product => formatProductData(product));
    
    console.log(`Server: Fetched ${products.length} gaming pad products with complete data`);
    
    // If no gaming pad products found in the database, use mock gaming pad data
    if (products.length === 0) {
      console.log('No gaming pad products found in database, using mock gaming pad data');
      products = getMockGamingPadProducts();
    }
  } catch (error) {
    console.error('Error fetching gaming pad products:', error);
    // Use mock gaming pad data as fallback
    products = getMockGamingPadProducts();
  }
  
  return products;
});
