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

// Get mock jacket products for fallback
function getMockJacketProducts() {
  return [
    {
      _id: '101',
      name: 'Classic Denim Jacket',
      description: 'A timeless denim jacket with a comfortable fit and durable construction.',
      category: 'Apparel',
      subcategory: 'Jackets',
      price: 59.99,
      image: '/products/jacket-denim.jpg',
      tags: ['Denim', 'Classic', 'Casual', 'Unisex'],
      colors: ['Blue'],
      colorVariants: [
        {
          color: 'Blue',
          hex: '#1E3A8A',
          image: '/products/jacket-denim.jpg'
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
      name: 'Leather Biker Jacket',
      description: 'A stylish leather jacket with a modern fit and premium quality.',
      category: 'Apparel',
      subcategory: 'Jackets',
      price: 89.99,
      image: '/products/jacket-leather.jpg',
      tags: ['Leather', 'Biker', 'Fashion', 'Premium'],
      colors: ['Black'],
      colorVariants: [
        {
          color: 'Black',
          hex: '#000000',
          image: '/products/jacket-leather.jpg'
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
      name: 'Windbreaker Sport Jacket',
      description: 'A lightweight windbreaker perfect for outdoor activities.',
      category: 'Apparel',
      subcategory: 'Jackets',
      price: 49.99,
      image: '/products/jacket-windbreaker.jpg',
      tags: ['Windbreaker', 'Sport', 'Lightweight', 'Outdoor'],
      colors: ['Red'],
      colorVariants: [
        {
          color: 'Red',
          hex: '#DC2626',
          image: '/products/jacket-windbreaker.jpg'
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
      products = getMockJacketProducts();
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    // Use mock data as fallback
    products = getMockJacketProducts();
  }
  
  return products;
});

/**
 * Fetch only jacket products
 * This function specifically filters for products with subcategory related to jackets
 */
export const getJacketProducts = cache(async () => {
  let products = [];
  
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Create a query to fetch only jacket products
    const query = {
      // Ensure the product has an image
      image: { $exists: true, $ne: '' },
      // Ensure the product has placeholder data
      'placeholder.x': { $exists: true },
      'placeholder.y': { $exists: true },
      'placeholder.width': { $exists: true },
      'placeholder.height': { $exists: true },
      // Filter for jacket with more flexible matching
      $or: [
        { subcategory: { $regex: 'jacket', $options: 'i' } },
        { subcategory: { $regex: 'jackets', $options: 'i' } },
        { subcategory: { $regex: 'coat', $options: 'i' } },
        { subcategory: { $regex: 'coats', $options: 'i' } },
        { subcategory: { $regex: 'outerwear', $options: 'i' } },
        { tags: { $in: [/jacket/i, /coat/i, /outerwear/i, /denim jacket/i, /leather jacket/i] } }
      ]
    };
    
    // Fetch jacket products from MongoDB with the specific query
    const dbProducts = await ProductModel.find(query).sort({ createdAt: -1 });
    
    // Convert MongoDB documents to plain objects
    products = dbProducts.map(product => formatProductData(product));
    
    console.log(`Server: Fetched ${products.length} jacket products with complete data`);
    
    // If no jacket products found in the database, use mock jacket data
    if (products.length === 0) {
      console.log('No jacket products found in database, using mock jacket data');
      products = getMockJacketProducts();
    }
  } catch (error) {
    console.error('Error fetching jacket products:', error);
    // Use mock jacket data as fallback
    products = getMockJacketProducts();
  }
  
  return products;
});