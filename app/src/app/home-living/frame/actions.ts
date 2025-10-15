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

// Get mock can products for fallback
function getMockCanProducts() {
  return [
    {
      _id: 'can-1',
      name: 'Aluminum Soda Can',
      description: 'A standard aluminum soda can for your custom beverage designs.',
      category: 'home-living',
      subcategory: 'can',
      price: 12.99,
      image: '/images/mockups/can-soda.jpg',
      tags: ['can', 'soda', 'beverage', 'aluminum'],
      colors: ['silver', 'white'],
      colorVariants: [
        {
          color: 'Silver',
          hex: '#C0C0C0',
          image: '/images/mockups/can-soda-silver.jpg'
        },
        {
          color: 'White',
          hex: '#FFFFFF',
          image: '/images/mockups/can-soda-white.jpg'
        }
      ],
      placeholder: {
        x: 150,
        y: 150,
        width: 200,
        height: 300
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'can-2',
      name: 'Energy Drink Can',
      description: 'A sleek energy drink can for your custom beverage branding.',
      category: 'home-living',
      subcategory: 'energy drink can',
      price: 14.99,
      image: '/images/mockups/can-energy.jpg',
      tags: ['can', 'energy drink', 'beverage', 'slim'],
      colors: ['silver', 'black'],
      colorVariants: [
        {
          color: 'Silver',
          hex: '#C0C0C0',
          image: '/images/mockups/can-energy-silver.jpg'
        },
        {
          color: 'Black',
          hex: '#000000',
          image: '/images/mockups/can-energy-black.jpg'
        }
      ],
      placeholder: {
        x: 150,
        y: 150,
        width: 180,
        height: 320
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'can-3',
      name: 'Beer Can',
      description: 'A standard beer can for your craft brew designs.',
      category: 'home-living',
      subcategory: 'beer can',
      price: 13.99,
      image: '/images/mockups/can-beer.jpg',
      tags: ['can', 'beer', 'beverage', 'craft'],
      colors: ['silver', 'gold'],
      colorVariants: [
        {
          color: 'Silver',
          hex: '#C0C0C0',
          image: '/images/mockups/can-beer-silver.jpg'
        },
        {
          color: 'Gold',
          hex: '#FFD700',
          image: '/images/mockups/can-beer-gold.jpg'
        }
      ],
      placeholder: {
        x: 150,
        y: 150,
        width: 200,
        height: 280
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}

/**
 * Fetch only can products
 * This function specifically filters for products with subcategory related to cans
 */
export const getFrameProducts = cache(async () => {
  let products = [];
  
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Create a query to fetch only can products
    const query = {
      // Ensure the product has an image
      image: { $exists: true, $ne: '' },
      // Ensure the product has placeholder data
      'placeholder.x': { $exists: true },
      'placeholder.y': { $exists: true },
      'placeholder.width': { $exists: true },
      'placeholder.height': { $exists: true },
      // Filter for can subcategory (case-insensitive)
      $or: [
        { subcategory: { $regex: 'frame', $options: 'i' } },
        { subcategory: { $regex: 'frames', $options: 'i' } },
        { subcategory: { $regex: 'Frame', $options: 'i' } },
        { subcategory: { $regex: 'Frames', $options: 'i' } }
        // { subcategory: { $regex: 'beverage can', $options: 'i' } }
      ]
    };
    
    // Fetch can products from MongoDB with the specific query
    const dbProducts = await ProductModel.find(query).sort({ createdAt: -1 });
    
    // Log the actual subcategories found for debugging
    if (dbProducts.length > 0) {
      const subcategoriesSet = new Set();
      dbProducts.forEach(p => subcategoriesSet.add(p.subcategory));
      const subcategories = Array.from(subcategoriesSet);
      console.log('Found can subcategories:', subcategories);
    }
    
    // Convert MongoDB documents to plain objects
    products = dbProducts.map(product => formatProductData(product));
    
    console.log(`Server: Fetched ${products.length} can products with complete data`);
    
    // If no can products found in the database, use mock can data
    if (products.length === 0) {
      console.log('No can products found in database, using mock can data');
      products = getMockCanProducts();
    }
  } catch (error) {
    console.error('Error fetching can products:', error);
    // Use mock can data as fallback
    products = getMockCanProducts();
  }
  
  return products;
});
