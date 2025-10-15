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

// Get mock dropper bottle products for fallback
function getMockDropperBottleProducts() {
  return [
    {
      _id: '1',
      name: 'Glass Dropper Bottle',
      description: 'A premium glass dropper bottle perfect for essential oils and serums.',
      category: 'Packaging',
      subcategory: 'dropper bottle',
      price: 7.99,
      image: '/products/dropper-glass.jpg',
      tags: ['Glass', 'Dropper', 'Essential Oil', 'Serum'],
      colors: ['Clear'],
      colorVariants: [
        {
          color: 'Clear',
          hex: '#F8F8FF',
          image: '/products/dropper-glass.jpg'
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
      name: 'Amber Dropper Bottle',
      description: 'An amber glass dropper bottle that protects light-sensitive contents.',
      category: 'Packaging',
      subcategory: 'dropper bottle',
      price: 8.99,
      image: '/products/dropper-amber.jpg',
      tags: ['Amber', 'Glass', 'UV Protection', 'Dropper'],
      colors: ['Amber'],
      colorVariants: [
        {
          color: 'Amber',
          hex: '#CD7F32',
          image: '/products/dropper-amber.jpg'
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
      name: 'Plastic Dropper Bottle',
      description: 'A lightweight plastic dropper bottle for cosmetics and skincare.',
      category: 'Packaging',
      subcategory: 'dropper bottle',
      price: 5.99,
      image: '/products/dropper-plastic.jpg',
      tags: ['Plastic', 'Dropper', 'Cosmetic', 'Skincare'],
      colors: ['White'],
      colorVariants: [
        {
          color: 'White',
          hex: '#FFFFFF',
          image: '/products/dropper-plastic.jpg'
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
 * Fetch only dropper bottle products
 * This function specifically filters for products with subcategory related to dropper bottles
 */
export const getDropperBottleProducts = cache(async () => {
  let products = [];
  
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Create a query to fetch only dropper bottle products
    const query = {
      // Ensure the product has an image
      image: { $exists: true, $ne: '' },
      // Ensure the product has placeholder data
      'placeholder.x': { $exists: true },
      'placeholder.y': { $exists: true },
      'placeholder.width': { $exists: true },
      'placeholder.height': { $exists: true },
      // Filter for dropper bottle subcategory (case-insensitive)
      $or: [
        { subcategory: { $regex: 'dropper bottle', $options: 'i' } },
        { subcategory: { $regex: 'dropper bottles', $options: 'i' } },
        { subcategory: { $regex: 'glass dropper', $options: 'i' } },
        { subcategory: { $regex: 'essential oil bottle', $options: 'i' } },
        { subcategory: { $regex: 'serum bottle', $options: 'i' } }
      ]
    };
    
    // Fetch dropper bottle products from MongoDB with the specific query
    const dbProducts = await ProductModel.find(query).sort({ createdAt: -1 });
    
    // Convert MongoDB documents to plain objects
    products = dbProducts.map(product => formatProductData(product));
    
    console.log(`Server: Fetched ${products.length} dropper bottle products with complete data`);
    
    // If no dropper bottle products found in the database, use mock dropper bottle data
    if (products.length === 0) {
      console.log('No dropper bottle products found in database, using mock dropper bottle data');
      products = getMockDropperBottleProducts();
    }
  } catch (error) {
    console.error('Error fetching dropper bottle products:', error);
    // Use mock dropper bottle data as fallback
    products = getMockDropperBottleProducts();
  }
  
  return products;
});
