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

// Get mock ring products for fallback
function getMockRingProducts() {
  return [
    {
      _id: 'ring-1',
      name: 'Silver Band Ring',
      description: 'A classic silver band ring perfect for custom engravings.',
      category: 'jewelry',
      subcategory: 'ring',
      price: 29.99,
      image: '/images/mockups/ring-silver-band.jpg',
      tags: ['ring', 'silver', 'band', 'jewelry'],
      colors: ['silver'],
      colorVariants: [
        {
          color: 'Silver',
          hex: '#C0C0C0',
          image: '/images/mockups/ring-silver-band.jpg'
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
      _id: 'ring-2',
      name: 'Gold Signet Ring',
      description: 'An elegant gold signet ring for personalized designs.',
      category: 'jewelry',
      subcategory: 'signet ring',
      price: 39.99,
      image: '/images/mockups/ring-gold-signet.jpg',
      tags: ['ring', 'gold', 'signet', 'jewelry'],
      colors: ['gold'],
      colorVariants: [
        {
          color: 'Gold',
          hex: '#FFD700',
          image: '/images/mockups/ring-gold-signet.jpg'
        }
      ],
      placeholder: {
        x: 150,
        y: 150,
        width: 180,
        height: 180
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'ring-3',
      name: 'Rose Gold Stacking Ring',
      description: 'A delicate rose gold stacking ring for custom designs.',
      category: 'jewelry',
      subcategory: 'stacking ring',
      price: 34.99,
      image: '/images/mockups/ring-rose-gold.jpg',
      tags: ['ring', 'rose gold', 'stacking', 'jewelry'],
      colors: ['rose gold'],
      colorVariants: [
        {
          color: 'Rose Gold',
          hex: '#B76E79',
          image: '/images/mockups/ring-rose-gold.jpg'
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
 * Fetch only ring products
 * This function specifically filters for products with subcategory related to rings
 */
export const getRingProducts = cache(async () => {
  let products = [];
  
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Create a query to fetch only ring products
    const query = {
      // Ensure the product has an image
      image: { $exists: true, $ne: '' },
      // Ensure the product has placeholder data
      'placeholder.x': { $exists: true },
      'placeholder.y': { $exists: true },
      'placeholder.width': { $exists: true },
      'placeholder.height': { $exists: true },
      // Filter for ring subcategory (case-insensitive)
      $or: [
        { subcategory: { $regex: 'ring', $options: 'i' } },
        { subcategory: { $regex: 'signet ring', $options: 'i' } },
        { subcategory: { $regex: 'band ring', $options: 'i' } },
        { subcategory: { $regex: 'stacking ring', $options: 'i' } },
        { subcategory: { $regex: 'statement ring', $options: 'i' } }
      ]
    };
    
    // Fetch ring products from MongoDB with the specific query
    const dbProducts = await ProductModel.find(query).sort({ createdAt: -1 });
    
    // Log the actual subcategories found for debugging
    if (dbProducts.length > 0) {
      const subcategoriesSet = new Set();
      dbProducts.forEach(p => subcategoriesSet.add(p.subcategory));
      const subcategories = Array.from(subcategoriesSet);
      console.log('Found ring subcategories:', subcategories);
    }
    
    // Convert MongoDB documents to plain objects
    products = dbProducts.map(product => formatProductData(product));
    
    console.log(`Server: Fetched ${products.length} ring products with complete data`);
    
    // If no ring products found in the database, use mock ring data
    if (products.length === 0) {
      console.log('No ring products found in database, using mock ring data');
      products = getMockRingProducts();
    }
  } catch (error) {
    console.error('Error fetching ring products:', error);
    // Use mock ring data as fallback
    products = getMockRingProducts();
  }
  
  return products;
});
