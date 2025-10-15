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

// Get mock cosmetic products for fallback
function getMockCosmeticProducts() {
  return [
    {
      _id: 'cosmetic-1',
      name: 'Cosmetic Jar',
      description: 'Premium cosmetic jar for creams and lotions with customizable label.',
      category: 'packaging',
      subcategory: 'cosmetic jar',
      price: 18.99,
      image: '/images/mockups/bottle-water.jpg',
      tags: ['cosmetic', 'jar', 'cream', 'lotion'],
      colors: ['clear', 'blue tint', 'green tint'],
      colorVariants: [
        {
          color: 'Clear',
          hex: '#F5F5F5',
          image: '/images/mockups/bottle-water-clear.jpg'
        },
        {
          color: 'Blue Tint',
          hex: '#E6F2FF',
          image: '/images/mockups/bottle-water-blue.jpg'
        }
      ],
      placeholder: {
        x: 150,
        y: 150,
        width: 180,
        height: 350
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'cosmetic-2',
      name: 'Makeup Container',
      description: 'Elegant makeup container with customizable branding.',
      category: 'packaging',
      subcategory: 'makeup container',
      price: 15.99,
      image: '/images/mockups/bottle-soda.jpg',
      tags: ['makeup', 'container', 'beauty', 'cosmetic'],
      colors: ['clear', 'green tint'],
      colorVariants: [
        {
          color: 'Clear',
          hex: '#F5F5F5',
          image: '/images/mockups/bottle-soda-clear.jpg'
        },
        {
          color: 'Green Tint',
          hex: '#E6FFE6',
          image: '/images/mockups/bottle-soda-green.jpg'
        }
      ],
      placeholder: {
        x: 150,
        y: 150,
        width: 170,
        height: 340
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}

/**
 * Fetch only cosmetic products
 * This function specifically filters for products with subcategory related to cosmetics
 */
export const getCosmeticProducts = cache(async () => {
  let products = [];
  
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Create a query to fetch only cosmetic products
    const query = {
      // Ensure the product has an image
      image: { $exists: true, $ne: '' },
      // Ensure the product has placeholder data
      'placeholder.x': { $exists: true },
      'placeholder.y': { $exists: true },
      'placeholder.width': { $exists: true },
      'placeholder.height': { $exists: true },
      // Filter for cosmetic subcategory (case-insensitive)
      $or: [
        { subcategory: { $regex: 'cosmetic', $options: 'i' } },
        { subcategory: { $regex: 'cosmetic jar', $options: 'i' } },
        { subcategory: { $regex: 'makeup container', $options: 'i' } },
        { subcategory: { $regex: 'beauty packaging', $options: 'i' } },
        { subcategory: { $regex: 'cream jar', $options: 'i' } },
        { subcategory: { $regex: 'lotion container', $options: 'i' } }
      ]
    };
    
    // Fetch cosmetic products from MongoDB with the specific query
    const dbProducts = await ProductModel.find(query).sort({ createdAt: -1 });
    
    // Log the actual subcategories found for debugging
    if (dbProducts.length > 0) {
      const subcategoriesSet = new Set();
      dbProducts.forEach(p => subcategoriesSet.add(p.subcategory));
      const subcategories = Array.from(subcategoriesSet);
      console.log('Found cosmetic subcategories:', subcategories);
    }
    
    // Convert MongoDB documents to plain objects
    products = dbProducts.map(product => formatProductData(product));
    
    console.log(`Server: Fetched ${products.length} cosmetic products with complete data`);
    
    // If no cosmetic products found in the database, use mock cosmetic data
    if (products.length === 0) {
      console.log('No cosmetic products found in database, using mock cosmetic data');
      products = getMockCosmeticProducts();
    }
  } catch (error) {
    console.error('Error fetching cosmetic products:', error);
    // Use mock cosmetic data as fallback
    products = getMockCosmeticProducts();
  }
  
  return products;
});
