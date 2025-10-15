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

// Get mock scarf products for fallback
function getMockScarfProducts() {
  return [
    {
      _id: '1',
      name: 'Wool Winter Scarf',
      description: 'A warm wool scarf perfect for cold winter days.',
      category: 'Apparel',
      subcategory: 'Scarves',
      price: 24.99,
      image: '/products/scarf-wool.jpg',
      tags: ['Wool', 'Winter', 'Warm', 'Accessory'],
      colors: ['Red'],
      colorVariants: [
        {
          color: 'Red',
          hex: '#DC2626',
          image: '/products/scarf-wool.jpg'
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
      name: 'Silk Fashion Scarf',
      description: 'An elegant silk scarf with space for custom designs.',
      category: 'Apparel',
      subcategory: 'Scarves',
      price: 29.99,
      image: '/products/scarf-silk.jpg',
      tags: ['Silk', 'Fashion', 'Elegant', 'Accessory'],
      colors: ['Blue'],
      colorVariants: [
        {
          color: 'Blue',
          hex: '#1E3A8A',
          image: '/products/scarf-silk.jpg'
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
      name: 'Cotton Summer Scarf',
      description: 'A lightweight cotton scarf for summer fashion.',
      category: 'Apparel',
      subcategory: 'Scarves',
      price: 19.99,
      image: '/products/scarf-cotton.jpg',
      tags: ['Cotton', 'Summer', 'Lightweight', 'Fashion'],
      colors: ['White'],
      colorVariants: [
        {
          color: 'White',
          hex: '#FFFFFF',
          image: '/products/scarf-cotton.jpg'
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
      products = getMockScarfProducts();
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    // Use mock data as fallback
    products = getMockScarfProducts();
  }
  
  return products;
});

/**
 * Fetch only scarf products
 * This function specifically filters for products with subcategory related to scarves
 */
export const getScarfProducts = cache(async () => {
  let products = [];
  
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Create a query to fetch only scarf products
    const query = {
      // Ensure the product has an image
      image: { $exists: true, $ne: '' },
      // Ensure the product has placeholder data
      'placeholder.x': { $exists: true },
      'placeholder.y': { $exists: true },
      'placeholder.width': { $exists: true },
      'placeholder.height': { $exists: true },
      // Filter for scarf with more flexible matching
      $or: [
        { subcategory: { $regex: 'scarf', $options: 'i' } },
        { subcategory: { $regex: 'scarves', $options: 'i' } },
        { subcategory: { $regex: 'neck scarf', $options: 'i' } },
        { subcategory: { $regex: 'fashion scarf', $options: 'i' } },
        { subcategory: { $regex: 'winter scarf', $options: 'i' } },
        { tags: { $in: [/scarf/i, /scarves/i, /neckwear/i, /winter accessory/i] } }
      ]
    };
    
    // Fetch scarf products from MongoDB with the specific query
    const dbProducts = await ProductModel.find(query).sort({ createdAt: -1 });
    
    // Convert MongoDB documents to plain objects
    products = dbProducts.map(product => formatProductData(product));
    
    console.log(`Server: Fetched ${products.length} scarf products with complete data`);
    
    // If no scarf products found in the database, use mock scarf data
    if (products.length === 0) {
      console.log('No scarf products found in database, using mock scarf data');
      products = getMockScarfProducts();
    }
  } catch (error) {
    console.error('Error fetching scarf products:', error);
    // Use mock scarf data as fallback
    products = getMockScarfProducts();
  }
  
  return products;
});