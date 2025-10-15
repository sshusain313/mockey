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

// Get mock phone cover products for fallback
function getMockPhoneCoverProducts() {
  return [
    {
      _id: '1',
      name: 'iPhone 13 Clear Case',
      description: 'A transparent case for iPhone 13 that showcases your custom design.',
      category: 'Accessories',
      subcategory: 'Phone Covers',
      price: 24.99,
      image: '/products/phone-cover-clear.jpg',
      tags: ['Clear', 'iPhone 13', 'Protective', 'Custom'],
      colors: ['Clear'],
      colorVariants: [
        {
          color: 'Clear',
          hex: '#FFFFFF',
          image: '/products/phone-cover-clear.jpg'
        }
      ],
      placeholder: {
        x: 100,
        y: 150,
        width: 180,
        height: 300
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '2',
      name: 'Samsung Galaxy S22 Case',
      description: 'A durable black case for Samsung Galaxy S22 with customizable back panel.',
      category: 'Accessories',
      subcategory: 'Phone Covers',
      price: 22.99,
      image: '/products/phone-cover-black.jpg',
      tags: ['Black', 'Samsung', 'Galaxy S22', 'Protective'],
      colors: ['Black'],
      colorVariants: [
        {
          color: 'Black',
          hex: '#000000',
          image: '/products/phone-cover-black.jpg'
        }
      ],
      placeholder: {
        x: 100,
        y: 150,
        width: 180,
        height: 300
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '3',
      name: 'iPhone 14 Pro Silicone Case',
      description: 'A soft silicone case for iPhone 14 Pro with customizable design area.',
      category: 'Accessories',
      subcategory: 'Phone Covers',
      price: 29.99,
      image: '/products/phone-cover-silicone.jpg',
      tags: ['Silicone', 'iPhone 14 Pro', 'Soft Touch', 'Premium'],
      colors: ['Navy Blue'],
      colorVariants: [
        {
          color: 'Navy Blue',
          hex: '#000080',
          image: '/products/phone-cover-silicone.jpg'
        }
      ],
      placeholder: {
        x: 100,
        y: 150,
        width: 180,
        height: 300
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}

/**
 * Fetch all products
 * This is a generic function that fetches all products with proper placeholder data
 */
export const getAllProducts = cache(async () => {
  let products = [];
  
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Create a query to fetch only products with proper placeholder data
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
      products = getMockPhoneCoverProducts();
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    // Use mock data as fallback
    products = getMockPhoneCoverProducts();
  }
  
  return products;
});

/**
 * Fetch only phone cover products
 * This function specifically filters for products with subcategory related to phone covers
 */
/**
 * Debug function to check all available subcategories in the database
 * This is a temporary function to help troubleshoot product fetching
 */
export const debugAllSubcategories = cache(async () => {
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Get all products
    const allProducts = await ProductModel.find().select('category subcategory');
    
    // Group by category and subcategory
    const categoriesMap = new Map();
    
    allProducts.forEach(product => {
      const category = product.category || 'uncategorized';
      const subcategory = product.subcategory || 'unspecified';
      
      if (!categoriesMap.has(category)) {
        categoriesMap.set(category, new Set());
      }
      
      categoriesMap.get(category).add(subcategory);
    });
    
    // Convert to a more readable format
    const result: Record<string, string[]> = {};
    categoriesMap.forEach((subcategories, category) => {
      result[category] = Array.from(subcategories) as string[];
    });
    
    console.log('All categories and subcategories:', result);
    return result;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {};
  }
});

export const getPhoneCoverProducts = cache(async () => {
  let products = [];
  
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Create a query to fetch only phone cover products
    const query = {
      // Ensure the product has an image
      image: { $exists: true, $ne: '' },
      // Ensure the product has placeholder data
      'placeholder.x': { $exists: true },
      'placeholder.y': { $exists: true },
      'placeholder.width': { $exists: true },
      'placeholder.height': { $exists: true },
      // Filter for accessories category first
      category: 'accessories',
      // Then use a broader match for phone-related subcategories
      $or: [
        // { subcategory: { $regex: 'phone', $options: 'i' } },
        // { subcategory: { $regex: 'mobile', $options: 'i' } },
        { subcategory: 'phone-cover' },
        { subcategory: 'phonecover' },
        { subcategory: 'phone_cover' },
        { subcategory: 'mobile-cover' },
        { subcategory: 'mobilecover' }
      ]
    };
    
    // Fetch phone cover products from MongoDB with the specific query
    const dbProducts = await ProductModel.find(query).sort({ createdAt: -1 });
    
    // Log the actual subcategories found for debugging
    if (dbProducts.length > 0) {
      const subcategoriesSet = new Set();
      dbProducts.forEach(p => subcategoriesSet.add(p.subcategory));
      const subcategories = Array.from(subcategoriesSet);
      console.log('Found phone cover subcategories:', subcategories);
    }
    
    // Convert MongoDB documents to plain objects
    products = dbProducts.map(product => formatProductData(product));
    
    console.log(`Server: Fetched ${products.length} phone cover products with complete data`);
    
    // If no phone cover products found in the database, use mock phone cover data
    if (products.length === 0) {
      console.log('No phone cover products found in database, using mock phone cover data');
      // Use mock phone cover data
      products = getMockPhoneCoverProducts();
    }
  } catch (error) {
    console.error('Error fetching phone cover products:', error);
    // Use mock phone cover data as fallback
    products = getMockPhoneCoverProducts();
  }
  
  return products;
});