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

// Get mock jersey products for fallback
function getMockJerseyProducts() {
  return [
    {
      _id: '1',
      name: 'Basketball Jersey',
      description: 'A professional-grade basketball jersey with moisture-wicking fabric.',
      category: 'Apparel',
      subcategory: 'Jerseys',
      price: 39.99,
      image: '/products/jersey-basketball.jpg',
      tags: ['Basketball', 'Sports', 'Athletic', 'Team'],
      colors: ['Red'],
      colorVariants: [
        {
          color: 'Red',
          hex: '#DC2626',
          image: '/products/jersey-basketball.jpg'
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
      name: 'Soccer Jersey',
      description: 'A lightweight soccer jersey perfect for the field or casual wear.',
      category: 'Apparel',
      subcategory: 'Jerseys',
      price: 44.99,
      image: '/products/jersey-soccer.jpg',
      tags: ['Soccer', 'Football', 'Sports', 'Team'],
      colors: ['Blue'],
      colorVariants: [
        {
          color: 'Blue',
          hex: '#1E3A8A',
          image: '/products/jersey-soccer.jpg'
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
      name: 'Hockey Jersey',
      description: 'A durable hockey jersey with room for team logos and numbers.',
      category: 'Apparel',
      subcategory: 'Jerseys',
      price: 49.99,
      image: '/products/jersey-hockey.jpg',
      tags: ['Hockey', 'Ice Hockey', 'Sports', 'Team'],
      colors: ['Black'],
      colorVariants: [
        {
          color: 'Black',
          hex: '#000000',
          image: '/products/jersey-hockey.jpg'
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
      products = getMockJerseyProducts();
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    // Use mock data as fallback
    products = getMockJerseyProducts();
  }
  
  return products;
});

/**
 * Fetch only jersey products
 * This function specifically filters for products with subcategory related to jerseys
 */
export const getJerseyProducts = cache(async () => {
  let products = [];
  
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Create a query to fetch only jersey products
    const query = {
      // Ensure the product has an image
      image: { $exists: true, $ne: '' },
      // Ensure the product has placeholder data
      'placeholder.x': { $exists: true },
      'placeholder.y': { $exists: true },
      'placeholder.width': { $exists: true },
      'placeholder.height': { $exists: true },
      // Filter for jersey with more flexible matching
      $or: [
        { subcategory: { $regex: 'jersey', $options: 'i' } },
        { subcategory: { $regex: 'jerseys', $options: 'i' } },
        { subcategory: { $regex: 'sports jersey', $options: 'i' } },
        { subcategory: { $regex: 'team jersey', $options: 'i' } },
        { subcategory: { $regex: 'athletic jersey', $options: 'i' } },
        { tags: { $in: [/jersey/i, /basketball/i, /soccer/i, /football/i, /hockey/i] } }
      ]
    };
    
    // Fetch jersey products from MongoDB with the specific query
    const dbProducts = await ProductModel.find(query).sort({ createdAt: -1 });
    
    // Convert MongoDB documents to plain objects
    products = dbProducts.map(product => formatProductData(product));
    
    console.log(`Server: Fetched ${products.length} jersey products with complete data`);
    
    // If no jersey products found in the database, use mock jersey data
    if (products.length === 0) {
      console.log('No jersey products found in database, using mock jersey data');
      products = getMockJerseyProducts();
    }
  } catch (error) {
    console.error('Error fetching jersey products:', error);
    // Use mock jersey data as fallback
    products = getMockJerseyProducts();
  }
  
  return products;
});