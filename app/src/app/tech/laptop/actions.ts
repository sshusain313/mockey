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

// Get mock laptop products for fallback
function getMockLaptopProducts() {
  return [
    {
      _id: 'laptop-skin-1',
      name: 'Laptop Skin Decal',
      description: 'Full-coverage laptop skin decal with customizable design area.',
      category: 'tech',
      subcategory: 'laptop skin',
      price: 24.99,
      image: '/images/mockups/laptop-skin-1.jpg',
      tags: ['laptop', 'skin', 'tech', 'decal'],
      colors: ['clear'],
      colorVariants: [
        {
          color: 'Clear',
          hex: '#FFFFFF',
          image: '/images/mockups/laptop-skin-clear.jpg'
        }
      ],
      placeholder: {
        x: 150,
        y: 120,
        width: 300,
        height: 200
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'laptop-sleeve-1',
      name: 'Laptop Sleeve Case',
      description: 'Protective laptop sleeve with customizable design area.',
      category: 'tech',
      subcategory: 'laptop sleeve',
      price: 29.99,
      image: '/images/mockups/laptop-sleeve-1.jpg',
      tags: ['laptop', 'sleeve', 'tech', 'case'],
      colors: ['black', 'gray', 'navy'],
      colorVariants: [
        {
          color: 'Black',
          hex: '#000000',
          image: '/images/mockups/laptop-sleeve-black.jpg'
        },
        {
          color: 'Gray',
          hex: '#808080',
          image: '/images/mockups/laptop-sleeve-gray.jpg'
        }
      ],
      placeholder: {
        x: 180,
        y: 140,
        width: 260,
        height: 180
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'laptop-sticker-1',
      name: 'Laptop Sticker Pack',
      description: 'Set of customizable laptop stickers with various designs.',
      category: 'tech',
      subcategory: 'laptop sticker',
      price: 12.99,
      image: '/images/mockups/laptop-sticker-1.jpg',
      tags: ['laptop', 'sticker', 'tech', 'pack'],
      colors: ['multi'],
      colorVariants: [
        {
          color: 'Multi',
          hex: '#FFFFFF',
          image: '/images/mockups/laptop-sticker-multi.jpg'
        }
      ],
      placeholder: {
        x: 160,
        y: 130,
        width: 280,
        height: 190
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}

/**
 * Fetch only laptop products
 * This function specifically filters for products with subcategory related to laptops
 */
export const getLaptopProducts = cache(async () => {
  let products = [];
  
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Create a query to fetch only laptop products
    const query = {
      // Ensure the product has an image
      image: { $exists: true, $ne: '' },
      // Ensure the product has placeholder data
      'placeholder.x': { $exists: true },
      'placeholder.y': { $exists: true },
      'placeholder.width': { $exists: true },
      'placeholder.height': { $exists: true },
      // Filter for laptop subcategory (case-insensitive)
      $or: [
        { subcategory: { $regex: 'laptop', $options: 'i' } },
        { subcategory: { $regex: 'laptop case', $options: 'i' } },
        { subcategory: { $regex: 'laptop sleeve', $options: 'i' } },
        { subcategory: { $regex: 'laptop skin', $options: 'i' } },
        { subcategory: { $regex: 'laptop sticker', $options: 'i' } },
        { subcategory: { $regex: 'notebook', $options: 'i' } }
      ]
    };
    
    // Fetch laptop products from MongoDB with the specific query
    const dbProducts = await ProductModel.find(query).sort({ createdAt: -1 });
    
    // Log the actual subcategories found for debugging
    if (dbProducts.length > 0) {
      const subcategoriesSet = new Set();
      dbProducts.forEach(p => subcategoriesSet.add(p.subcategory));
      const subcategories = Array.from(subcategoriesSet);
      console.log('Found laptop subcategories:', subcategories);
    }
    
    // Convert MongoDB documents to plain objects
    products = dbProducts.map(product => formatProductData(product));
    
    console.log(`Server: Fetched ${products.length} laptop products with complete data`);
    
    // If no laptop products found in the database, use mock laptop data
    if (products.length === 0) {
      console.log('No laptop products found in database, using mock laptop data');
      products = getMockLaptopProducts();
    }
  } catch (error) {
    console.error('Error fetching laptop products:', error);
    // Use mock laptop data as fallback
    products = getMockLaptopProducts();
  }
  
  return products;
});
