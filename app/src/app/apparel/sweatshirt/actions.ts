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

// Get mock sweatshirt products for fallback
function getMockSweatshirtProducts() {
  return [
    {
      _id: '1',
      name: 'Classic Crew Neck Sweatshirt',
      description: 'A comfortable crew neck sweatshirt perfect for everyday wear.',
      category: 'Apparel',
      subcategory: 'Sweatshirts',
      price: 34.99,
      image: '/products/sweatshirt-crew.jpg',
      tags: ['Crew Neck', 'Casual', 'Comfortable', 'Unisex'],
      colors: ['Gray'],
      colorVariants: [
        {
          color: 'Gray',
          hex: '#6B7280',
          image: '/products/sweatshirt-crew.jpg'
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
      name: 'Pullover Sweatshirt',
      description: 'A warm pullover sweatshirt with space for custom designs.',
      category: 'Apparel',
      subcategory: 'Sweatshirts',
      price: 39.99,
      image: '/products/sweatshirt-pullover.jpg',
      tags: ['Pullover', 'Warm', 'Casual', 'Winter'],
      colors: ['Black'],
      colorVariants: [
        {
          color: 'Black',
          hex: '#000000',
          image: '/products/sweatshirt-pullover.jpg'
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
      name: 'Athletic Quarter-Zip Sweatshirt',
      description: 'A performance quarter-zip sweatshirt for active lifestyles.',
      category: 'Apparel',
      subcategory: 'Sweatshirts',
      price: 44.99,
      image: '/products/sweatshirt-quarter-zip.jpg',
      tags: ['Quarter-Zip', 'Athletic', 'Performance', 'Active'],
      colors: ['Blue'],
      colorVariants: [
        {
          color: 'Blue',
          hex: '#1E3A8A',
          image: '/products/sweatshirt-quarter-zip.jpg'
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
      products = getMockSweatshirtProducts();
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    // Use mock data as fallback
    products = getMockSweatshirtProducts();
  }
  
  return products;
});

/**
 * Fetch only sweatshirt products
 * This function specifically filters for products with subcategory related to sweatshirts
 */
export const getSweatshirtProducts = cache(async () => {
  let products = [];
  
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Create a query to fetch only sweatshirt products
    const query = {
      // Ensure the product has an image
      image: { $exists: true, $ne: '' },
      // Ensure the product has placeholder data
      'placeholder.x': { $exists: true },
      'placeholder.y': { $exists: true },
      'placeholder.width': { $exists: true },
      'placeholder.height': { $exists: true },
      // Filter for sweatshirt with more flexible matching
      $or: [
        { subcategory: { $regex: 'sweatshirt', $options: 'i' } },
        { subcategory: { $regex: 'sweatshirts', $options: 'i' } },
        { subcategory: { $regex: 'crew neck', $options: 'i' } },
        { subcategory: { $regex: 'pullover', $options: 'i' } },
        { subcategory: { $regex: 'quarter zip', $options: 'i' } },
        { tags: { $in: [/sweatshirt/i, /pullover/i, /crew neck/i, /quarter zip/i] } }
      ]
    };
    
    // Fetch sweatshirt products from MongoDB with the specific query
    const dbProducts = await ProductModel.find(query).sort({ createdAt: -1 });
    
    // Convert MongoDB documents to plain objects
    products = dbProducts.map(product => formatProductData(product));
    
    console.log(`Server: Fetched ${products.length} sweatshirt products with complete data`);
    
    // If no sweatshirt products found in the database, use mock sweatshirt data
    if (products.length === 0) {
      console.log('No sweatshirt products found in database, using mock sweatshirt data');
      products = getMockSweatshirtProducts();
    }
  } catch (error) {
    console.error('Error fetching sweatshirt products:', error);
    // Use mock sweatshirt data as fallback
    products = getMockSweatshirtProducts();
  }
  
  return products;
});