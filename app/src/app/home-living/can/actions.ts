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

// Get mock apron products for fallback
function getMockCanProducts() {
  return [
    {
      _id: '1',
      name: 'Classic Chef Apron',
      description: 'A professional-grade chef apron with pockets for utensils.',
      category: 'Apparel',
      subcategory: 'Aprons',
      price: 29.99,
      image: '/products/apron-chef.jpg',
      tags: ['Chef', 'Professional', 'Kitchen', 'Cooking'],
      colors: ['White'],
      colorVariants: [
        {
          color: 'White',
          hex: '#FFFFFF',
          image: '/products/apron-chef.jpg'
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
      name: 'Barista Canvas Apron',
      description: 'A stylish canvas apron perfect for baristas and coffee enthusiasts.',
      category: 'Apparel',
      subcategory: 'Aprons',
      price: 34.99,
      image: '/products/apron-barista.jpg',
      tags: ['Barista', 'Canvas', 'Coffee', 'Cafe'],
      colors: ['Brown'],
      colorVariants: [
        {
          color: 'Brown',
          hex: '#8B4513',
          image: '/products/apron-barista.jpg'
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
      name: 'Artist Smock Apron',
      description: 'A full-coverage apron designed for artists and craftspeople.',
      category: 'Apparel',
      subcategory: 'Aprons',
      price: 39.99,
      image: '/products/apron-artist.jpg',
      tags: ['Artist', 'Smock', 'Crafts', 'Painting'],
      colors: ['Blue'],
      colorVariants: [
        {
          color: 'Blue',
          hex: '#1E3A8A',
          image: '/products/apron-artist.jpg'
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
      products = getMockCanProducts();
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    // Use mock data as fallback
    products = getMockCanProducts();
  }
  
  return products;
});

/**
 * Fetch only apron products
 * This function specifically filters for products with subcategory related to aprons
 */
export const getCanProducts = cache(async () => {
  let products = [];
  
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Create a query to fetch only apron products
    const query = {
      // Ensure the product has an image
      image: { $exists: true, $ne: '' },
      // Ensure the product has placeholder data
      'placeholder.x': { $exists: true },
      'placeholder.y': { $exists: true },
      'placeholder.width': { $exists: true },
      'placeholder.height': { $exists: true },
      // Filter for apron with more flexible matching
      $or: [
        { subcategory: { $regex: 'can', $options: 'i' } },
        { subcategory: { $regex: 'cans', $options: 'i' } },
        // { subcategory: { $regex: 'chef apron', $options: 'i' } },
        // { subcategory: { $regex: 'kitchen apron', $options: 'i' } },
        // { subcategory: { $regex: 'cooking apron', $options: 'i' } },
        // { tags: { $in: [/apron/i, /chef/i, /kitchen/i, /cooking/i, /barista/i] } }
      ]
    };
    
    // Fetch apron products from MongoDB with the specific query
    const dbProducts = await ProductModel.find(query).sort({ createdAt: -1 });
    
    // Convert MongoDB documents to plain objects
    products = dbProducts.map(product => formatProductData(product));
    
    console.log(`Server: Fetched ${products.length} can products with complete data`);
    
    // If no apron products found in the database, use mock apron data
    if (products.length === 0) {
      console.log('No apron products found in database, using mock apron data');
      products = getMockCanProducts();
    }
  } catch (error) {
    console.error('Error fetching apron products:', error);
    // Use mock apron data as fallback
    products = getMockCanProducts();
  }
  
  return products;
});