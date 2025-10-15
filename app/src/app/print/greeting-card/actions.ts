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

// Get mock greeting card products for fallback
function getMockGreetingCardProducts() {
  return [
    {
      _id: 'greeting-card-1',
      name: 'Birthday Card',
      description: 'Customizable birthday greeting card with envelope.',
      category: 'print',
      subcategory: 'birthday card',
      price: 18.99,
      image: '/images/mockups/bottle-water.jpg',
      tags: ['bottle', 'water', 'glass', 'beverage'],
      colors: ['clear', 'blue tint', 'green tint'],
      colorVariants: [
        {
          color: 'Clear',
          hex: '#F5F5F5',
          image: '/images/mockups/bottle-water-clear.jpg'
        },
        {
          color: 'Blue Tint',
          hex: '#E6F2FF',
          image: '/images/mockups/bottle-water-blue.jpg'
        }
      ],
      placeholder: {
        x: 150,
        y: 150,
        width: 180,
        height: 350
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'greeting-card-2',
      name: 'Holiday Card',
      description: 'Festive holiday greeting card for seasonal celebrations.',
      category: 'print',
      subcategory: 'holiday card',
      price: 22.99,
      image: '/images/mockups/bottle-wine.jpg',
      tags: ['bottle', 'wine', 'glass', 'beverage'],
      colors: ['green', 'clear', 'amber'],
      colorVariants: [
        {
          color: 'Green',
          hex: '#2E8B57',
          image: '/images/mockups/bottle-wine-green.jpg'
        },
        {
          color: 'Clear',
          hex: '#F5F5F5',
          image: '/images/mockups/bottle-wine-clear.jpg'
        }
      ],
      placeholder: {
        x: 150,
        y: 150,
        width: 160,
        height: 380
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'bottle-3',
      name: 'Plastic Soda Bottle',
      description: 'A standard plastic soda bottle for your custom beverage branding.',
      category: 'packaging',
      subcategory: 'soda bottle',
      price: 15.99,
      image: '/images/mockups/bottle-soda.jpg',
      tags: ['bottle', 'soda', 'plastic', 'beverage'],
      colors: ['clear', 'green tint'],
      colorVariants: [
        {
          color: 'Clear',
          hex: '#F5F5F5',
          image: '/images/mockups/bottle-soda-clear.jpg'
        },
        {
          color: 'Green Tint',
          hex: '#E6FFE6',
          image: '/images/mockups/bottle-soda-green.jpg'
        }
      ],
      placeholder: {
        x: 150,
        y: 150,
        width: 170,
        height: 340
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}

/**
 * Fetch only bottle products
 * This function specifically filters for products with subcategory related to bottles
 */
export const getGreetingCardProducts = cache(async () => {
  let products = [];
  
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Create a query to fetch only bottle products
    const query = {
      // Ensure the product has an image
      image: { $exists: true, $ne: '' },
      // Ensure the product has placeholder data
      'placeholder.x': { $exists: true },
      'placeholder.y': { $exists: true },
      'placeholder.width': { $exists: true },
      'placeholder.height': { $exists: true },
      // Filter for bottle subcategory (case-insensitive)
      $or: [
        { subcategory: { $regex: 'greeting card', $options: 'i' } },
        { subcategory: { $regex: 'birthday card', $options: 'i' } },
        { subcategory: { $regex: 'holiday card', $options: 'i' } },
        { subcategory: { $regex: 'celebration card', $options: 'i' } },
        { subcategory: { $regex: 'thank you card', $options: 'i' } },
        { subcategory: { $regex: 'invitation card', $options: 'i' } }
      ]
    };
    
    // Fetch bottle products from MongoDB with the specific query
    const dbProducts = await ProductModel.find(query).sort({ createdAt: -1 });
    
    // Log the actual subcategories found for debugging
    if (dbProducts.length > 0) {
      const subcategoriesSet = new Set();
      dbProducts.forEach(p => subcategoriesSet.add(p.subcategory));
      const subcategories = Array.from(subcategoriesSet);
      console.log('Found bottle subcategories:', subcategories);
    }
    
    // Convert MongoDB documents to plain objects
    products = dbProducts.map(product => formatProductData(product));
    
    console.log(`Server: Fetched ${products.length} greeting card products with complete data`);
    
    // If no greeting card products found in the database, use mock greeting card data
    if (products.length === 0) {
      console.log('No greeting card products found in database, using mock greeting card data');
      products = getMockGreetingCardProducts();
    }
  } catch (error) {
    console.error('Error fetching greeting card products:', error);
    products = getMockGreetingCardProducts();
  }
  
  return products;
});
