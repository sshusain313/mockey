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

// Get mock earring products for fallback
function getMockEarringProducts() {
  return [
    {
      _id: 'earring-1',
      name: 'Silver Stud Earrings',
      description: 'Classic silver stud earrings for custom designs and engravings.',
      category: 'jewelry',
      subcategory: 'stud earrings',
      price: 24.99,
      image: '/images/mockups/earring-silver-stud.jpg',
      tags: ['earrings', 'silver', 'stud', 'jewelry'],
      colors: ['silver'],
      colorVariants: [
        {
          color: 'Silver',
          hex: '#C0C0C0',
          image: '/images/mockups/earring-silver-stud.jpg'
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
      _id: 'earring-2',
      name: 'Gold Hoop Earrings',
      description: 'Elegant gold hoop earrings for personalized designs.',
      category: 'jewelry',
      subcategory: 'hoop earrings',
      price: 29.99,
      image: '/images/mockups/earring-gold-hoop.jpg',
      tags: ['earrings', 'gold', 'hoop', 'jewelry'],
      colors: ['gold'],
      colorVariants: [
        {
          color: 'Gold',
          hex: '#FFD700',
          image: '/images/mockups/earring-gold-hoop.jpg'
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
      _id: 'earring-3',
      name: 'Drop Earrings',
      description: 'Stylish drop earrings for custom designs and patterns.',
      category: 'jewelry',
      subcategory: 'drop earrings',
      price: 32.99,
      image: '/images/mockups/earring-drop.jpg',
      tags: ['earrings', 'drop', 'dangle', 'jewelry'],
      colors: ['silver'],
      colorVariants: [
        {
          color: 'Silver',
          hex: '#C0C0C0',
          image: '/images/mockups/earring-drop.jpg'
        }
      ],
      placeholder: {
        x: 150,
        y: 150,
        width: 200,
        height: 250
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}

/**
 * Fetch only earring products
 * This function specifically filters for products with subcategory related to earrings
 */
export const getEarringProducts = cache(async () => {
  let products = [];
  
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Create a query to fetch only earring products
    const query = {
      // Ensure the product has an image
      image: { $exists: true, $ne: '' },
      // Ensure the product has placeholder data
      'placeholder.x': { $exists: true },
      'placeholder.y': { $exists: true },
      'placeholder.width': { $exists: true },
      'placeholder.height': { $exists: true },
      // Filter for earring subcategory (case-insensitive)
      $or: [
        { subcategory: { $regex: 'earring', $options: 'i' } },
        { subcategory: { $regex: 'earrings', $options: 'i' } },
        { subcategory: { $regex: 'stud earring', $options: 'i' } },
        { subcategory: { $regex: 'hoop earring', $options: 'i' } },
        { subcategory: { $regex: 'drop earring', $options: 'i' } },
        { subcategory: { $regex: 'dangle earring', $options: 'i' } }
      ]
    };
    
    // Fetch earring products from MongoDB with the specific query
    const dbProducts = await ProductModel.find(query).sort({ createdAt: -1 });
    
    // Log the actual subcategories found for debugging
    if (dbProducts.length > 0) {
      const subcategoriesSet = new Set();
      dbProducts.forEach(p => subcategoriesSet.add(p.subcategory));
      const subcategories = Array.from(subcategoriesSet);
      console.log('Found earring subcategories:', subcategories);
    }
    
    // Convert MongoDB documents to plain objects
    products = dbProducts.map(product => formatProductData(product));
    
    console.log(`Server: Fetched ${products.length} earring products with complete data`);
    
    // If no earring products found in the database, use mock earring data
    if (products.length === 0) {
      console.log('No earring products found in database, using mock earring data');
      products = getMockEarringProducts();
    }
  } catch (error) {
    console.error('Error fetching earring products:', error);
    // Use mock earring data as fallback
    products = getMockEarringProducts();
  }
  
  return products;
});
