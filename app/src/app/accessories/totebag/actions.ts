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

// Get mock totebag products for fallback
function getMockTotebagProducts() {
  return [
    {
      _id: '1',
      name: 'Canvas Tote Bag',
      description: 'A durable canvas tote bag perfect for shopping or daily use.',
      category: 'Accessories',
      subcategory: 'Tote Bags',
      price: 19.99,
      image: '/products/totebag-canvas.jpg',
      tags: ['Canvas', 'Eco-friendly', 'Reusable', 'Shopping'],
      colors: ['Natural'],
      colorVariants: [
        {
          color: 'Natural',
          hex: '#F5F5DC',
          image: '/products/totebag-canvas.jpg'
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
    },
    {
      _id: '2',
      name: 'Black Cotton Tote',
      description: 'A stylish black cotton tote bag for a modern look.',
      category: 'Accessories',
      subcategory: 'Tote Bags',
      price: 24.99,
      image: '/products/totebag-black.jpg',
      tags: ['Cotton', 'Black', 'Fashion', 'Casual'],
      colors: ['Black'],
      colorVariants: [
        {
          color: 'Black',
          hex: '#000000',
          image: '/products/totebag-black.jpg'
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
    },
    {
      _id: '3',
      name: 'Patterned Tote Bag',
      description: 'A colorful patterned tote bag to brighten your day.',
      category: 'Accessories',
      subcategory: 'Tote Bags',
      price: 29.99,
      image: '/products/totebag-pattern.jpg',
      tags: ['Patterned', 'Colorful', 'Unique', 'Fashion'],
      colors: ['Multi'],
      colorVariants: [
        {
          color: 'Multi',
          hex: '#FFFFFF',
          image: '/products/totebag-pattern.jpg'
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
 * Fetch only totebag products
 * This function specifically filters for products with subcategory related to tote bags
 */
export const getTotebagProducts = cache(async () => {
  let products = [];
  
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Create a query to fetch only totebag products
    const query = {
      // Ensure the product has an image
      image: { $exists: true, $ne: '' },
      // Ensure the product has placeholder data
      'placeholder.x': { $exists: true },
      'placeholder.y': { $exists: true },
      'placeholder.width': { $exists: true },
      'placeholder.height': { $exists: true },
      // Filter for totebag subcategory (case-insensitive)
      $or: [
        { subcategory: { $regex: 'tote bag', $options: 'i' } },
        { subcategory: { $regex: 'totebag', $options: 'i' } },
        { subcategory: { $regex: 'tote bags', $options: 'i' } },
        { subcategory: { $regex: 'shopping bag', $options: 'i' } }
      ]
    };
    
    // Fetch totebag products from MongoDB with the specific query
    const dbProducts = await ProductModel.find(query).sort({ createdAt: -1 });
    
    // Convert MongoDB documents to plain objects
    products = dbProducts.map(product => formatProductData(product));
    
    console.log(`Server: Fetched ${products.length} totebag products with complete data`);
    
    // If no totebag products found in the database, use mock totebag data
    if (products.length === 0) {
      console.log('No totebag products found in database, using mock totebag data');
      products = getMockTotebagProducts();
    }
  } catch (error) {
    console.error('Error fetching totebag products:', error);
    // Use mock totebag data as fallback
    products = getMockTotebagProducts();
  }
  
  return products;
});
