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

// Get mock Phone products for fallback
function getMockPhoneProducts() {
  return [
    {
      _id: 'phone-case-1',
      name: 'Generic Phone Case',
      description: 'Durable protective case for various phone models with customizable design area.',
      category: 'tech',
      subcategory: 'phone case',
      price: 24.99,
      image: '/images/mockups/phone-case-1.jpg',
      tags: ['phone', 'case', 'tech', 'protective'],
      colors: ['clear', 'black', 'white'],
      colorVariants: [
        {
          color: 'Clear',
          hex: '#FFFFFF',
          image: '/images/mockups/phone-case-clear.jpg'
        },
        {
          color: 'Black',
          hex: '#000000',
          image: '/images/mockups/phone-case-black.jpg'
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
      _id: 'phone-wallet-1',
      name: 'Phone Wallet Case',
      description: 'Stylish wallet case for various phone models with card slots and customizable design.',
      category: 'tech',
      subcategory: 'phone wallet',
      price: 29.99,
      image: '/images/mockups/phone-wallet-1.jpg',
      tags: ['phone', 'wallet', 'tech', 'card holder'],
      colors: ['black', 'brown', 'navy'],
      colorVariants: [
        {
          color: 'Black',
          hex: '#000000',
          image: '/images/mockups/phone-wallet-black.jpg'
        },
        {
          color: 'Brown',
          hex: '#8B4513',
          image: '/images/mockups/phone-wallet-brown.jpg'
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
    }
  ];
}
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
 * Fetch only Phone products
 * This function specifically filters for products with subcategory related to phones (excluding iPhone)
 */
export const getPhoneProducts = cache(async () => {
  let products = [];
  
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Create a query to fetch only Phone products (excluding iPhone)
    const query = {
      // Ensure the product has an image
      image: { $exists: true, $ne: '' },
      // Ensure the product has placeholder data
      'placeholder.x': { $exists: true },
      'placeholder.y': { $exists: true },
      'placeholder.width': { $exists: true },
      'placeholder.height': { $exists: true },
      // Filter for Phone subcategory (case-insensitive) but exclude iPhone
      $and: [
        { 
          $or: [
            { subcategory: { $regex: 'phone', $options: 'i' } },
            { subcategory: { $regex: 'android', $options: 'i' } },
            { subcategory: { $regex: 'samsung', $options: 'i' } },
            { subcategory: { $regex: 'pixel', $options: 'i' } },
            { subcategory: { $regex: 'oneplus', $options: 'i' } },
            { subcategory: { $regex: 'xiaomi', $options: 'i' } }
          ]
        },
        { subcategory: { $not: { $regex: 'iphone', $options: 'i' } } }
      ]
    };
    
    // Fetch Phone products from MongoDB with the specific query
    const dbProducts = await ProductModel.find(query).sort({ createdAt: -1 });
    
    // Log the actual subcategories found for debugging
    if (dbProducts.length > 0) {
      const subcategoriesSet = new Set();
      dbProducts.forEach(p => subcategoriesSet.add(p.subcategory));
      const subcategories = Array.from(subcategoriesSet);
      console.log('Found Phone subcategories:', subcategories);
    }
    
    // Convert MongoDB documents to plain objects
    products = dbProducts.map(product => formatProductData(product));
    
    console.log(`Server: Fetched ${products.length} Phone products with complete data`);
    
    // If no Phone products found in the database, use mock Phone data
    if (products.length === 0) {
      console.log('No Phone products found in database, using mock Phone data');
      products = getMockPhoneProducts();
    }
  } catch (error) {
    console.error('Error fetching Phone products:', error);
    // Use mock Phone data as fallback
    products = getMockPhoneProducts();
  }
  
  return products;
});
