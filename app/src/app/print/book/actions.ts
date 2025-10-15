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

// Get mock book products for fallback
function getMockBookProducts() {
  return [
    {
      _id: 'book-cover-1',
      name: 'Hardcover Book Cover Design',
      description: 'Custom hardcover book cover design with full customization options.',
      category: 'print',
      subcategory: 'book cover',
      price: 29.99,
      image: '/images/mockups/book-cover-1.jpg',
      tags: ['book', 'cover', 'print', 'hardcover'],
      colors: ['white', 'black', 'custom'],
      colorVariants: [
        {
          color: 'White',
          hex: '#FFFFFF',
          image: '/images/mockups/book-cover-white.jpg'
        },
        {
          color: 'Black',
          hex: '#000000',
          image: '/images/mockups/book-cover-black.jpg'
        }
      ],
      placeholder: {
        x: 150,
        y: 120,
        width: 300,
        height: 450
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'book-jacket-1',
      name: 'Dust Jacket Design',
      description: 'Professional dust jacket design for hardcover books.',
      category: 'print',
      subcategory: 'book jacket',
      price: 24.99,
      image: '/images/mockups/book-jacket-1.jpg',
      tags: ['book', 'jacket', 'print', 'dust jacket'],
      colors: ['white', 'custom'],
      colorVariants: [
        {
          color: 'White',
          hex: '#FFFFFF',
          image: '/images/mockups/book-jacket-white.jpg'
        }
      ],
      placeholder: {
        x: 180,
        y: 140,
        width: 280,
        height: 420
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'book-interior-1',
      name: 'Book Interior Layout',
      description: 'Professional interior layout design for books and publications.',
      category: 'print',
      subcategory: 'book interior',
      price: 34.99,
      image: '/images/mockups/book-interior-1.jpg',
      tags: ['book', 'interior', 'print', 'layout'],
      colors: ['white'],
      colorVariants: [
        {
          color: 'White',
          hex: '#FFFFFF',
          image: '/images/mockups/book-interior-white.jpg'
        }
      ],
      placeholder: {
        x: 160,
        y: 130,
        width: 290,
        height: 430
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}

/**
 * Fetch only book products
 * This function specifically filters for products with subcategory related to books
 */
export const getBookProducts = cache(async () => {
  let products = [];
  
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Create a query to fetch only book products
    const query = {
      // Ensure the product has an image
      image: { $exists: true, $ne: '' },
      // Ensure the product has placeholder data
      'placeholder.x': { $exists: true },
      'placeholder.y': { $exists: true },
      'placeholder.width': { $exists: true },
      'placeholder.height': { $exists: true },
      // Filter for book subcategory (case-insensitive)
      $or: [
        { subcategory: { $regex: 'book', $options: 'i' } },
        { subcategory: { $regex: 'book cover', $options: 'i' } },
        { subcategory: { $regex: 'book jacket', $options: 'i' } },
        { subcategory: { $regex: 'book interior', $options: 'i' } },
        { subcategory: { $regex: 'publication', $options: 'i' } },
        { subcategory: { $regex: 'novel', $options: 'i' } }
      ]
    };
    
    // Fetch book products from MongoDB with the specific query
    const dbProducts = await ProductModel.find(query).sort({ createdAt: -1 });
    
    // Log the actual subcategories found for debugging
    if (dbProducts.length > 0) {
      const subcategoriesSet = new Set();
      dbProducts.forEach(p => subcategoriesSet.add(p.subcategory));
      const subcategories = Array.from(subcategoriesSet);
      console.log('Found book subcategories:', subcategories);
    }
    
    // Convert MongoDB documents to plain objects
    products = dbProducts.map(product => formatProductData(product));
    
    console.log(`Server: Fetched ${products.length} book products with complete data`);
    
    // If no book products found in the database, use mock book data
    if (products.length === 0) {
      console.log('No book products found in database, using mock book data');
      products = getMockBookProducts();
    }
  } catch (error) {
    console.error('Error fetching book products:', error);
    // Use mock book data as fallback
    products = getMockBookProducts();
  }
  
  return products;
});
