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

// Get mock Macbook products for fallback
function getMockMacbookProducts() {
  return [
    {
      _id: 'macbook-case-1',
      name: 'MacBook Pro 13" Case',
      description: 'Durable protective case for MacBook Pro 13" with customizable design area.',
      category: 'tech',
      subcategory: 'macbook case',
      price: 34.99,
      image: '/images/mockups/macbook-case-1.jpg',
      tags: ['macbook', 'case', 'tech', 'protective', 'laptop'],
      colors: ['clear', 'black', 'white'],
      colorVariants: [
        {
          color: 'Clear',
          hex: '#FFFFFF',
          image: '/images/mockups/macbook-case-clear.jpg'
        },
        {
          color: 'Black',
          hex: '#000000',
          image: '/images/mockups/macbook-case-black.jpg'
        }
      ],
      placeholder: {
        x: 120,
        y: 150,
        width: 360,
        height: 240
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'macbook-skin-1',
      name: 'MacBook Pro Skin',
      description: 'Stylish skin for MacBook Pro with customizable design.',
      category: 'tech',
      subcategory: 'macbook skin',
      price: 29.99,
      image: '/images/mockups/macbook-skin-1.jpg',
      tags: ['macbook', 'skin', 'tech', 'laptop', 'decal'],
      colors: ['clear', 'matte'],
      colorVariants: [
        {
          color: 'Clear',
          hex: '#FFFFFF',
          image: '/images/mockups/macbook-skin-clear.jpg'
        }
      ],
      placeholder: {
        x: 150,
        y: 120,
        width: 350,
        height: 220
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}

/**
 * Fetch only Macbook products
 * This function specifically filters for products with subcategory related to Macbooks
 */
export const getMacbookProducts = cache(async () => {
  let products = [];
  
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Create a query to fetch only Macbook products
    const query = {
      // Ensure the product has an image
      image: { $exists: true, $ne: '' },
      // Ensure the product has placeholder data
      'placeholder.x': { $exists: true },
      'placeholder.y': { $exists: true },
      'placeholder.width': { $exists: true },
      'placeholder.height': { $exists: true },
      // Filter for Macbook subcategory (case-insensitive)
      $or: [
        { subcategory: { $regex: 'macbook', $options: 'i' } },
        { subcategory: { $regex: 'macbook case', $options: 'i' } },
        { subcategory: { $regex: 'macbook cover', $options: 'i' } },
        { subcategory: { $regex: 'macbook skin', $options: 'i' } },
        { subcategory: { $regex: 'macbook sleeve', $options: 'i' } },
        { subcategory: { $regex: 'laptop case', $options: 'i' } },
        { subcategory: { $regex: 'laptop skin', $options: 'i' } },
        { subcategory: { $regex: 'laptop sleeve', $options: 'i' } }
      ]
    };
    
    // Fetch Macbook products from MongoDB with the specific query
    const dbProducts = await ProductModel.find(query).sort({ createdAt: -1 });
    
    // Log the actual subcategories found for debugging
    if (dbProducts.length > 0) {
      const subcategoriesSet = new Set();
      dbProducts.forEach(p => subcategoriesSet.add(p.subcategory));
      const subcategories = Array.from(subcategoriesSet);
      console.log('Found Macbook subcategories:', subcategories);
    }
    
    // Convert MongoDB documents to plain objects
    products = dbProducts.map(product => formatProductData(product));
    
    console.log(`Server: Fetched ${products.length} Macbook products with complete data`);
    
    // If no Macbook products found in the database, use mock Macbook data
    if (products.length === 0) {
      console.log('No Macbook products found in database, using mock Macbook data');
      products = getMockMacbookProducts();
    }
  } catch (error) {
    console.error('Error fetching Macbook products:', error);
    // Use mock Macbook data as fallback
    products = getMockMacbookProducts();
  }
  
  return products;
});
