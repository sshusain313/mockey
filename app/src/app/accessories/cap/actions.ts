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

// Get mock cap products for fallback
function getMockCapProducts() {
  return [
    {
      _id: '1',
      name: 'Classic Baseball Cap',
      description: 'A classic baseball cap with adjustable strap for a perfect fit.',
      category: 'Accessories',
      subcategory: 'Caps',
      price: 19.99,
      image: '/products/cap-baseball.jpg',
      tags: ['Baseball', 'Classic', 'Adjustable', 'Casual'],
      colors: ['Navy'],
      colorVariants: [
        {
          color: 'Navy',
          hex: '#000080',
          image: '/products/cap-baseball.jpg'
        }
      ],
      placeholder: {
        x: 150,
        y: 100,
        width: 200,
        height: 150
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '2',
      name: 'Snapback Cap',
      description: 'A modern snapback cap with a flat brim and adjustable back.',
      category: 'Accessories',
      subcategory: 'Caps',
      price: 24.99,
      image: '/products/cap-snapback.jpg',
      tags: ['Snapback', 'Flat Brim', 'Urban', 'Streetwear'],
      colors: ['Black'],
      colorVariants: [
        {
          color: 'Black',
          hex: '#000000',
          image: '/products/cap-snapback.jpg'
        }
      ],
      placeholder: {
        x: 150,
        y: 100,
        width: 200,
        height: 150
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '3',
      name: 'Trucker Cap',
      description: 'A breathable trucker cap with mesh back panels for ventilation.',
      category: 'Accessories',
      subcategory: 'Caps',
      price: 22.99,
      image: '/products/cap-trucker.jpg',
      tags: ['Trucker', 'Mesh', 'Breathable', 'Outdoor'],
      colors: ['Red'],
      colorVariants: [
        {
          color: 'Red',
          hex: '#FF0000',
          image: '/products/cap-trucker.jpg'
        }
      ],
      placeholder: {
        x: 150,
        y: 100,
        width: 200,
        height: 150
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}

/**
 * Fetch only cap products
 * This function specifically filters for products with subcategory related to caps
 */
export const getCapProducts = cache(async () => {
  let products = [];
  
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Create a query to fetch only cap products
    const query = {
      // Ensure the product has an image
      image: { $exists: true, $ne: '' },
      // Ensure the product has placeholder data
      'placeholder.x': { $exists: true },
      'placeholder.y': { $exists: true },
      'placeholder.width': { $exists: true },
      'placeholder.height': { $exists: true },
      // Filter for cap subcategory (case-insensitive)
      $or: [
        { subcategory: { $regex: 'cap', $options: 'i' } },
        { subcategory: { $regex: 'caps', $options: 'i' } },
        { subcategory: { $regex: 'hat', $options: 'i' } },
        { subcategory: { $regex: 'hats', $options: 'i' } },
        { subcategory: { $regex: 'baseball cap', $options: 'i' } }
      ]
    };
    
    // Fetch cap products from MongoDB with the specific query
    const dbProducts = await ProductModel.find(query).sort({ createdAt: -1 });
    
    // Convert MongoDB documents to plain objects
    products = dbProducts.map(product => formatProductData(product));
    
    console.log(`Server: Fetched ${products.length} cap products with complete data`);
    
    // If no cap products found in the database, use mock cap data
    if (products.length === 0) {
      console.log('No cap products found in database, using mock cap data');
      products = getMockCapProducts();
    }
  } catch (error) {
    console.error('Error fetching cap products:', error);
    // Use mock cap data as fallback
    products = getMockCapProducts();
  }
  
  return products;
});
