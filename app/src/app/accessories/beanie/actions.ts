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

// Get mock beanie products for fallback
function getMockBeanieProducts() {
  return [
    {
      _id: '1',
      name: 'Classic Knit Beanie',
      description: 'A warm and comfortable knit beanie for cold weather.',
      category: 'Accessories',
      subcategory: 'Beanie',
      price: 19.99,
      image: '/products/beanie-classic.jpg',
      tags: ['Knit', 'Winter', 'Hat', 'Warm'],
      colors: ['Black'],
      colorVariants: [
        {
          color: 'Black',
          hex: '#000000',
          image: '/products/beanie-classic.jpg'
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
      name: 'Pom Pom Beanie',
      description: 'A stylish beanie with a fluffy pom pom on top.',
      category: 'Accessories',
      subcategory: 'Beanie',
      price: 24.99,
      image: '/products/beanie-pompom.jpg',
      tags: ['Pom Pom', 'Winter', 'Hat', 'Fashion'],
      colors: ['Gray'],
      colorVariants: [
        {
          color: 'Gray',
          hex: '#808080',
          image: '/products/beanie-pompom.jpg'
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
      name: 'Slouchy Beanie',
      description: 'A relaxed slouchy beanie for a casual look.',
      category: 'Accessories',
      subcategory: 'Beanie',
      price: 22.99,
      image: '/products/beanie-slouchy.jpg',
      tags: ['Slouchy', 'Casual', 'Hat', 'Trendy'],
      colors: ['Navy'],
      colorVariants: [
        {
          color: 'Navy',
          hex: '#000080',
          image: '/products/beanie-slouchy.jpg'
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
 * Fetch only beanie products
 * This function specifically filters for products with subcategory related to beanies
 */
export const getBeanieProducts = cache(async () => {
  let products = [];
  
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Create a query to fetch only beanie products
    const query = {
      // Ensure the product has an image
      image: { $exists: true, $ne: '' },
      // Ensure the product has placeholder data
      'placeholder.x': { $exists: true },
      'placeholder.y': { $exists: true },
      'placeholder.width': { $exists: true },
      'placeholder.height': { $exists: true },
      // Filter for beanie subcategory (case-insensitive)
      $or: [
        { subcategory: { $regex: 'beanie', $options: 'i' } },
        { subcategory: { $regex: 'winter hat', $options: 'i' } },
        { subcategory: { $regex: 'knit hat', $options: 'i' } },
        { subcategory: { $regex: 'skull cap', $options: 'i' } },
        { subcategory: { $regex: 'toque', $options: 'i' } }
      ]
    };
    
    // Fetch beanie products from MongoDB with the specific query
    const dbProducts = await ProductModel.find(query).sort({ createdAt: -1 });
    
    // Convert MongoDB documents to plain objects
    products = dbProducts.map(product => formatProductData(product));
    
    console.log(`Server: Fetched ${products.length} beanie products with complete data`);
    
    // If no beanie products found in the database, use mock beanie data
    if (products.length === 0) {
      console.log('No beanie products found in database, using mock beanie data');
      products = getMockBeanieProducts();
    }
  } catch (error) {
    console.error('Error fetching beanie products:', error);
    // Use mock beanie data as fallback
    products = getMockBeanieProducts();
  }
  
  return products;
});
