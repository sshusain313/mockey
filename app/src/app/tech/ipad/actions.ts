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

// Get mock mug products for fallback
function getMockMugProducts() {
  return [
    {
      _id: '1',
      name: 'Ceramic Coffee Mug',
      description: 'A classic ceramic coffee mug perfect for your morning brew.',
      category: 'Home',
      subcategory: 'mug',
      price: 14.99,
      image: '/products/mug-ceramic.jpg',
      tags: ['Ceramic', 'Coffee', 'Kitchen', 'Drinkware'],
      colors: ['White'],
      colorVariants: [
        {
          color: 'White',
          hex: '#FFFFFF',
          image: '/products/mug-ceramic.jpg'
        }
      ],
      placeholder: {
        x: 150,
        y: 150,
        width: 200,
        height: 200
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '2',
      name: 'Black Travel Mug',
      description: 'A sleek black travel mug to keep your drinks hot or cold.',
      category: 'Home',
      subcategory: 'mug',
      price: 19.99,
      image: '/products/mug-travel.jpg',
      tags: ['Travel', 'Insulated', 'Modern', 'On-the-go'],
      colors: ['Black'],
      colorVariants: [
        {
          color: 'Black',
          hex: '#000000',
          image: '/products/mug-travel.jpg'
        }
      ],
      placeholder: {
        x: 150,
        y: 150,
        width: 200,
        height: 200
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '3',
      name: 'Colorful Patterned Mug',
      description: 'A vibrant patterned mug to brighten your day.',
      category: 'Home',
      subcategory: 'mug',
      price: 16.99,
      image: '/products/mug-pattern.jpg',
      tags: ['Patterned', 'Colorful', 'Gift', 'Unique'],
      colors: ['Multi'],
      colorVariants: [
        {
          color: 'Multi',
          hex: '#FFFFFF',
          image: '/products/mug-pattern.jpg'
        }
      ],
      placeholder: {
        x: 150,
        y: 150,
        width: 200,
        height: 200
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}

/**
 * Get mock iPad products for fallback
 */
function getMockIPadProducts() {
  return [
    {
      _id: 'ipad-case-1',
      name: 'iPad Case - Protective Cover',
      description: 'Premium protective case for iPad with customizable design area.',
      category: 'tech',
      subcategory: 'ipad case',
      price: 29.99,
      image: '/images/mockups/ipad-case-1.jpg',
      tags: ['ipad', 'case', 'tech', 'protective'],
      colors: ['black', 'white', 'clear'],
      placeholder: {
        x: 120,
        y: 150,
        width: 250,
        height: 200
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'ipad-sleeve-1',
      name: 'iPad Sleeve - Padded Protection',
      description: 'Stylish padded sleeve for iPad with customizable design area.',
      category: 'tech',
      subcategory: 'ipad sleeve',
      price: 24.99,
      image: '/images/mockups/ipad-sleeve-1.jpg',
      tags: ['ipad', 'sleeve', 'tech', 'padded'],
      colors: ['black', 'gray', 'navy'],
      placeholder: {
        x: 100,
        y: 120,
        width: 280,
        height: 220
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}

/**
 * Fetch only iPad products
 * This function specifically filters for products with subcategory related to iPads
 */
export const getIPadProducts = cache(async () => {
  let products = [];
  
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Create a query to fetch only iPad products
    const query = {
      // Ensure the product has an image
      image: { $exists: true, $ne: '' },
      // Ensure the product has placeholder data
      'placeholder.x': { $exists: true },
      'placeholder.y': { $exists: true },
      'placeholder.width': { $exists: true },
      'placeholder.height': { $exists: true },
      // Filter for iPad subcategory (case-insensitive)
      $or: [
        { subcategory: { $regex: 'ipad', $options: 'i' } },
        { subcategory: { $regex: 'ipad case', $options: 'i' } },
        { subcategory: { $regex: 'ipad cover', $options: 'i' } },
        { subcategory: { $regex: 'ipad sleeve', $options: 'i' } },
        { subcategory: { $regex: 'tablet', $options: 'i' } }
      ]
    };
    
    // Fetch iPad products from MongoDB with the specific query
    const dbProducts = await ProductModel.find(query).sort({ createdAt: -1 });
    
    // Log the actual subcategories found for debugging
    if (dbProducts.length > 0) {
      const subcategoriesSet = new Set();
      dbProducts.forEach(p => subcategoriesSet.add(p.subcategory));
      const subcategories = Array.from(subcategoriesSet);
      console.log('Found iPad subcategories:', subcategories);
    }
    
    // Convert MongoDB documents to plain objects
    products = dbProducts.map(product => formatProductData(product));
    
    console.log(`Server: Fetched ${products.length} iPad products with complete data`);
    
    // If no iPad products found in the database, use mock iPad data
    if (products.length === 0) {
      console.log('No iPad products found in database, using mock iPad data');
      products = getMockIPadProducts();
    }
  } catch (error) {
    console.error('Error fetching iPad products:', error);
    // Use mock iPad data as fallback
    products = getMockIPadProducts();
  }
  
  return products;
});
