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

// Get mock tanktop products for fallback
function getMockTanktopProducts() {
  return [
    {
      _id: '101',
      name: 'Classic White Tank Top',
      description: 'A comfortable classic white tank top made from 100% cotton.',
      category: 'Apparel',
      subcategory: 'Tank Tops',
      price: 19.99,
      image: '/products/tanktop-white.jpg',
      tags: ['White', 'Cotton', 'Classic', 'Unisex'],
      colors: ['White'],
      colorVariants: [
        {
          color: 'White',
          hex: '#FFFFFF',
          image: '/products/tanktop-white.jpg'
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
      _id: '102',
      name: 'Black Athletic Tank Top',
      description: 'A stylish black tank top perfect for workouts and custom designs.',
      category: 'Apparel',
      subcategory: 'Tank Tops',
      price: 22.99,
      image: '/products/tanktop-black.jpg',
      tags: ['Black', 'Athletic', 'Workout', 'Unisex'],
      colors: ['Black'],
      colorVariants: [
        {
          color: 'Black',
          hex: '#000000',
          image: '/products/tanktop-black.jpg'
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
      _id: '103',
      name: 'Navy Blue Fitness Tank',
      description: 'A premium navy blue fitness tank top for active lifestyles.',
      category: 'Apparel',
      subcategory: 'Tank Tops',
      price: 24.99,
      image: '/products/tanktop-navy.jpg',
      tags: ['Navy Blue', 'Fitness', 'Premium', 'Unisex'],
      colors: ['Navy Blue'],
      colorVariants: [
        {
          color: 'Navy Blue',
          hex: '#000080',
          image: '/products/tanktop-navy.jpg'
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

/**
 * Fetch all products
 * This is a general function that can be used to fetch all products
 */
export const getProducts = cache(async () => {
  let products = [];
  
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Create a query to fetch all products with required fields
    const query = {
      // Ensure the product has an image
      image: { $exists: true, $ne: '' },
      // Ensure the product has placeholder data
      'placeholder.x': { $exists: true },
      'placeholder.y': { $exists: true },
      'placeholder.width': { $exists: true },
      'placeholder.height': { $exists: true }
    };
    
    // Fetch products from MongoDB with the specific query
    const dbProducts = await ProductModel.find(query).sort({ createdAt: -1 });
    
    // Convert MongoDB documents to plain objects
    products = dbProducts.map(product => formatProductData(product));
    
    console.log(`Server: Fetched ${products.length} products with complete data`);
    
    // If no products found in the database, use mock data
    if (products.length === 0) {
      console.log('No products found in database, using mock data');
      products = getMockTanktopProducts();
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    // Use mock data as fallback
    products = getMockTanktopProducts();
  }
  
  return products;
});

/**
 * Fetch only tank tops products
 * This function specifically filters for products with subcategory 'Tank Tops'
 */
export const getTankTopProducts = cache(async () => {
  let products = [];
  
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Create a query to fetch only tank tops products
    const query = {
      // Ensure the product has an image
      image: { $exists: true, $ne: '' },
      // Ensure the product has placeholder data
      'placeholder.x': { $exists: true },
      'placeholder.y': { $exists: true },
      'placeholder.width': { $exists: true },
      'placeholder.height': { $exists: true },
      // Filter for tank tops with more flexible matching
      $or: [
        { subcategory: { $regex: 'tank', $options: 'i' } },
        { subcategory: { $regex: 'tank top', $options: 'i' } },
        { subcategory: { $regex: 'tanktop', $options: 'i' } },
        { subcategory: { $regex: 'tank tops', $options: 'i' } },
        { tags: { $in: [/tank/i, /tank top/i, /tanktop/i] } }
      ]
    };
    
    // Fetch tank top products from MongoDB with the specific query
    const dbProducts = await ProductModel.find(query).sort({ createdAt: -1 });
    
    // Convert MongoDB documents to plain objects
    products = dbProducts.map(product => formatProductData(product));
    
    console.log(`Server: Fetched ${products.length} tank tops products with complete data`);
    
    // If no tank tops products found in the database, use mock tank tops data
    if (products.length === 0) {
      console.log('No tank tops products found in database, using mock tank tops data');
      products = getMockTanktopProducts();
    }
  } catch (error) {
    console.error('Error fetching tank tops products:', error);
    // Use mock tank tops data as fallback
    products = getMockTanktopProducts();
  }
  
  return products;
});