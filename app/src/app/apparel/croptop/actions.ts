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

// Get mock croptop products for fallback
function getMockCroptopProducts() {
  return [
    {
      _id: '1',
      name: 'Basic Cotton Crop Top',
      description: 'A comfortable cotton crop top perfect for casual wear.',
      category: 'Apparel',
      subcategory: 'Crop Tops',
      price: 24.99,
      image: '/products/croptop-basic.jpg',
      tags: ['Cotton', 'Casual', 'Basic', 'Summer'],
      colors: ['White'],
      colorVariants: [
        {
          color: 'White',
          hex: '#FFFFFF',
          image: '/products/croptop-basic.jpg'
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
      name: 'Athletic Crop Top',
      description: 'A stretchy, breathable crop top designed for workouts and active lifestyles.',
      category: 'Apparel',
      subcategory: 'Crop Tops',
      price: 29.99,
      image: '/products/croptop-athletic.jpg',
      tags: ['Athletic', 'Workout', 'Fitness', 'Stretchy'],
      colors: ['Black'],
      colorVariants: [
        {
          color: 'Black',
          hex: '#000000',
          image: '/products/croptop-athletic.jpg'
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
      name: 'Graphic Print Crop Top',
      description: 'A stylish crop top with space for custom graphic designs.',
      category: 'Apparel',
      subcategory: 'Crop Tops',
      price: 27.99,
      image: '/products/croptop-graphic.jpg',
      tags: ['Graphic', 'Fashion', 'Trendy', 'Custom'],
      colors: ['Pink'],
      colorVariants: [
        {
          color: 'Pink',
          hex: '#FFC0CB',
          image: '/products/croptop-graphic.jpg'
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
      products = getMockCroptopProducts();
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    // Use mock data as fallback
    products = getMockCroptopProducts();
  }
  
  return products;
});

/**
 * Fetch only crop top products
 * This function specifically filters for products with subcategory related to crop tops
 */
export const getCroptopProducts = cache(async () => {
  let products = [];
  
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Create a query to fetch only crop top products
    const query = {
      // Ensure the product has an image
      image: { $exists: true, $ne: '' },
      // Ensure the product has placeholder data
      'placeholder.x': { $exists: true },
      'placeholder.y': { $exists: true },
      'placeholder.width': { $exists: true },
      'placeholder.height': { $exists: true },
      // Filter for crop top with more flexible matching
      $or: [
        { subcategory: { $regex: 'crop top', $options: 'i' } },
        { subcategory: { $regex: 'crop tops', $options: 'i' } },
        { subcategory: { $regex: 'croptop', $options: 'i' } },
        { subcategory: { $regex: 'croptops', $options: 'i' } },
        { subcategory: { $regex: 'cropped top', $options: 'i' } },
        { tags: { $in: [/crop top/i, /croptop/i, /cropped/i, /midriff/i] } }
      ]
    };
    
    // Fetch crop top products from MongoDB with the specific query
    const dbProducts = await ProductModel.find(query).sort({ createdAt: -1 });
    
    // Convert MongoDB documents to plain objects
    products = dbProducts.map(product => formatProductData(product));
    
    console.log(`Server: Fetched ${products.length} crop top products with complete data`);
    
    // If no crop top products found in the database, use mock crop top data
    if (products.length === 0) {
      console.log('No crop top products found in database, using mock crop top data');
      products = getMockCroptopProducts();
    }
  } catch (error) {
    console.error('Error fetching crop top products:', error);
    // Use mock crop top data as fallback
    products = getMockCroptopProducts();
  }
  
  return products;
});