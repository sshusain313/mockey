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

// Get mock necklace products for fallback
function getMockNecklaceProducts() {
  return [
    {
      _id: 'necklace-1',
      name: 'Silver Pendant Necklace',
      description: 'A beautiful silver pendant necklace for custom designs and engravings.',
      category: 'jewelry',
      subcategory: 'pendant necklace',
      price: 34.99,
      image: '/images/mockups/necklace-silver-pendant.jpg',
      tags: ['necklace', 'silver', 'pendant', 'jewelry'],
      colors: ['silver'],
      colorVariants: [
        {
          color: 'Silver',
          hex: '#C0C0C0',
          image: '/images/mockups/necklace-silver-pendant.jpg'
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
      _id: 'necklace-2',
      name: 'Gold Chain Necklace',
      description: 'An elegant gold chain necklace for personalized designs.',
      category: 'jewelry',
      subcategory: 'chain necklace',
      price: 39.99,
      image: '/images/mockups/necklace-gold-chain.jpg',
      tags: ['necklace', 'gold', 'chain', 'jewelry'],
      colors: ['gold'],
      colorVariants: [
        {
          color: 'Gold',
          hex: '#FFD700',
          image: '/images/mockups/necklace-gold-chain.jpg'
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
      _id: 'necklace-3',
      name: 'Locket Necklace',
      description: 'A classic locket necklace for custom images and designs.',
      category: 'jewelry',
      subcategory: 'locket necklace',
      price: 42.99,
      image: '/images/mockups/necklace-locket.jpg',
      tags: ['necklace', 'locket', 'pendant', 'jewelry'],
      colors: ['silver'],
      colorVariants: [
        {
          color: 'Silver',
          hex: '#C0C0C0',
          image: '/images/mockups/necklace-locket.jpg'
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
 * Fetch only necklace products
 * This function specifically filters for products with subcategory related to necklaces
 */
export const getNecklaceProducts = cache(async () => {
  let products = [];
  
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Create a query to fetch only necklace products
    const query = {
      // Ensure the product has an image
      image: { $exists: true, $ne: '' },
      // Ensure the product has placeholder data
      'placeholder.x': { $exists: true },
      'placeholder.y': { $exists: true },
      'placeholder.width': { $exists: true },
      'placeholder.height': { $exists: true },
      // Filter for necklace subcategory (case-insensitive)
      $or: [
        { subcategory: { $regex: 'necklace', $options: 'i' } },
        { subcategory: { $regex: 'pendant', $options: 'i' } },
        { subcategory: { $regex: 'chain necklace', $options: 'i' } },
        { subcategory: { $regex: 'pendant necklace', $options: 'i' } },
        { subcategory: { $regex: 'locket', $options: 'i' } },
        { subcategory: { $regex: 'choker', $options: 'i' } }
      ]
    };
    
    // Fetch necklace products from MongoDB with the specific query
    const dbProducts = await ProductModel.find(query).sort({ createdAt: -1 });
    
    // Log the actual subcategories found for debugging
    if (dbProducts.length > 0) {
      const subcategoriesSet = new Set();
      dbProducts.forEach(p => subcategoriesSet.add(p.subcategory));
      const subcategories = Array.from(subcategoriesSet);
      console.log('Found necklace subcategories:', subcategories);
    }
    
    // Convert MongoDB documents to plain objects
    products = dbProducts.map(product => formatProductData(product));
    
    console.log(`Server: Fetched ${products.length} necklace products with complete data`);
    
    // If no necklace products found in the database, use mock necklace data
    if (products.length === 0) {
      console.log('No necklace products found in database, using mock necklace data');
      products = getMockNecklaceProducts();
    }
  } catch (error) {
    console.error('Error fetching necklace products:', error);
    // Use mock necklace data as fallback
    products = getMockNecklaceProducts();
  }
  
  return products;
});
