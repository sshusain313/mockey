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

// Get mock iPhone products for fallback
function getMockIPhoneProducts() {
  return [
    {
      _id: 'iphone-case-1',
      name: 'iPhone 13 Pro Case',
      description: 'Durable protective case for iPhone 13 Pro with customizable design area.',
      category: 'tech',
      subcategory: 'iphone case',
      price: 24.99,
      image: '/images/mockups/iphone-case-1.jpg',
      tags: ['iphone', 'case', 'tech', 'protective'],
      colors: ['clear', 'black', 'white'],
      colorVariants: [
        {
          color: 'Clear',
          hex: '#FFFFFF',
          image: '/images/mockups/iphone-case-clear.jpg'
        },
        {
          color: 'Black',
          hex: '#000000',
          image: '/images/mockups/iphone-case-black.jpg'
        }
      ],
      placeholder: {
        x: 120,
        y: 150,
        width: 160,
        height: 300
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'iphone-wallet-1',
      name: 'iPhone Wallet Case',
      description: 'Stylish wallet case for iPhone with card slots and customizable design.',
      category: 'tech',
      subcategory: 'iphone wallet',
      price: 29.99,
      image: '/images/mockups/iphone-wallet-1.jpg',
      tags: ['iphone', 'wallet', 'tech', 'card holder'],
      colors: ['black', 'brown', 'navy'],
      colorVariants: [
        {
          color: 'Black',
          hex: '#000000',
          image: '/images/mockups/iphone-wallet-black.jpg'
        },
        {
          color: 'Brown',
          hex: '#8B4513',
          image: '/images/mockups/iphone-wallet-brown.jpg'
        }
      ],
      placeholder: {
        x: 110,
        y: 140,
        width: 180,
        height: 320
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'iphone-skin-1',
      name: 'iPhone Skin Decal',
      description: 'Decorative skin decal for iPhone with full customization options.',
      category: 'tech',
      subcategory: 'iphone skin',
      price: 14.99,
      image: '/images/mockups/iphone-skin-1.jpg',
      tags: ['iphone', 'skin', 'tech', 'decal'],
      colors: ['clear'],
      colorVariants: [
        {
          color: 'Clear',
          hex: '#FFFFFF',
          image: '/images/mockups/iphone-skin-clear.jpg'
        }
      ],
      placeholder: {
        x: 125,
        y: 160,
        width: 150,
        height: 280
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}

/**
 * Fetch only iPhone products
 * This function specifically filters for products with subcategory related to iPhones
 */
export const getIPhoneProducts = cache(async () => {
  let products = [];
  
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Create a query to fetch only iPhone products
    const query = {
      // Ensure the product has an image
      image: { $exists: true, $ne: '' },
      // Ensure the product has placeholder data
      'placeholder.x': { $exists: true },
      'placeholder.y': { $exists: true },
      'placeholder.width': { $exists: true },
      'placeholder.height': { $exists: true },
      // Filter for iPhone subcategory (case-insensitive)
      $or: [
        { subcategory: { $regex: 'iphone', $options: 'i' } },
        { subcategory: { $regex: 'iphone case', $options: 'i' } },
        { subcategory: { $regex: 'iphone cover', $options: 'i' } },
        { subcategory: { $regex: 'iphone skin', $options: 'i' } },
        { subcategory: { $regex: 'iphone wallet', $options: 'i' } },
        { subcategory: { $regex: 'phone case', $options: 'i' } }
      ]
    };
    
    // Fetch iPhone products from MongoDB with the specific query
    const dbProducts = await ProductModel.find(query).sort({ createdAt: -1 });
    
    // Log the actual subcategories found for debugging
    if (dbProducts.length > 0) {
      const subcategoriesSet = new Set();
      dbProducts.forEach(p => subcategoriesSet.add(p.subcategory));
      const subcategories = Array.from(subcategoriesSet);
      console.log('Found iPhone subcategories:', subcategories);
    }
    
    // Convert MongoDB documents to plain objects
    products = dbProducts.map(product => formatProductData(product));
    
    console.log(`Server: Fetched ${products.length} iPhone products with complete data`);
    
    // If no iPhone products found in the database, use mock iPhone data
    if (products.length === 0) {
      console.log('No iPhone products found in database, using mock iPhone data');
      products = getMockIPhoneProducts();
    }
  } catch (error) {
    console.error('Error fetching iPhone products:', error);
    // Use mock iPhone data as fallback
    products = getMockIPhoneProducts();
  }
  
  return products;
});
