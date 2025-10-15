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

// Get mock products for fallback
function getMockProducts() {
  return [
    {
      _id: '1',
      name: 'Classic White T-Shirt',
      description: 'A comfortable classic white t-shirt made from 100% cotton.',
      category: 'Apparel',
      subcategory: 'T-Shirts',
      price: 24.99,
      image: '/products/tshirt-white.jpg',
      tags: ['White', 'Cotton', 'Classic', 'Unisex'],
      colors: ['White'],
      colorVariants: [
        {
          color: 'White',
          hex: '#FFFFFF',
          image: '/products/tshirt-white.jpg'
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
      name: 'Black Graphic T-Shirt',
      description: 'A stylish black t-shirt perfect for custom designs.',
      category: 'Apparel',
      subcategory: 'T-Shirts',
      price: 29.99,
      image: '/products/tshirt-black.jpg',
      tags: ['Black', 'Cotton', 'Graphic', 'Unisex'],
      colors: ['Black'],
      colorVariants: [
        {
          color: 'Black',
          hex: '#000000',
          image: '/products/tshirt-black.jpg'
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
      name: 'Navy Blue Crew Neck',
      description: 'A premium navy blue crew neck t-shirt.',
      category: 'Apparel',
      subcategory: 'T-Shirts',
      price: 27.99,
      image: '/products/tshirt-navy.jpg',
      tags: ['Navy Blue', 'Crew Neck', 'Premium', 'Unisex'],
      colors: ['Navy Blue'],
      colorVariants: [
        {
          color: 'Navy Blue',
          hex: '#000080',
          image: '/products/tshirt-navy.jpg'
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
      products = getMockProducts();
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    // Use mock data as fallback
    products = getMockProducts();
  }
  
  return products;
});

/**
 * Fetch only hoodie products
 * This function specifically filters for products with subcategory 'hoodie' or 'Hoodies'
 */
export const getHoodieProducts = cache(async () => {
  let products = [];
  
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Create a query to fetch only hoodie products
    const query = {
      // Ensure the product has an image
      image: { $exists: true, $ne: '' },
      // Ensure the product has placeholder data
      'placeholder.x': { $exists: true },
      'placeholder.y': { $exists: true },
      'placeholder.width': { $exists: true },
      'placeholder.height': { $exists: true },
      // Filter for hoodie subcategory (case-insensitive)
      $or: [
        { subcategory: { $regex: 'hoodie', $options: 'i' } },
        { subcategory: { $regex: 'hoodies', $options: 'i' } },
        { subcategory: { $regex: 'sweatshirt', $options: 'i' } }
      ]
    };
    
    // Fetch hoodie products from MongoDB with the specific query
    const dbProducts = await ProductModel.find(query).sort({ createdAt: -1 });
    
    // Convert MongoDB documents to plain objects
    products = dbProducts.map(product => formatProductData(product));
    
    console.log(`Server: Fetched ${products.length} hoodie products with complete data`);
    
    // If no hoodie products found in the database, use mock hoodie data
    if (products.length === 0) {
      console.log('No hoodie products found in database, using mock hoodie data');
      // Filter mock products to only include hoodies
      products = getMockProducts().filter(product => {
        const subcategory = product.subcategory.toLowerCase();
        return subcategory.includes('hoodie') || 
               subcategory.includes('hoodies') || 
               subcategory.includes('sweatshirt');
      });
    }
  } catch (error) {
    console.error('Error fetching hoodie products:', error);
    // Use mock hoodie data as fallback
    products = getMockProducts().filter(product => {
      const subcategory = product.subcategory.toLowerCase();
      return subcategory.includes('hoodie') || 
             subcategory.includes('hoodies') || 
             subcategory.includes('sweatshirt');
    });
  }
  
  return products;
});

