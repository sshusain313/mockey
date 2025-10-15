'use server';

import dbConnect from '@/lib/mongodb';
import ProductModel, { IProduct } from '@/models/Product';

/**
 * Fetches all products directly from the database
 * @returns Array of products
 */
export async function fetchProductsFromDB(): Promise<IProduct[]> {
  try {
    await dbConnect();
    const products = await ProductModel.find({}).sort({ createdAt: -1 });
    
    // Convert MongoDB documents to plain objects
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error('Error fetching products from DB:', error);
    throw new Error('Failed to fetch products');
  }
}

/**
 * Fetches products by category directly from the database
 * @param category Category to filter by
 * @returns Array of filtered products
 */
export async function fetchProductsByCategory(category: string): Promise<IProduct[]> {
  try {
    await dbConnect();
    const query = category ? { category } : {};
    const products = await ProductModel.find(query).sort({ createdAt: -1 });
    
    // Convert MongoDB documents to plain objects
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    throw new Error('Failed to fetch products by category');
  }
}

/**
 * Fetches a single product by ID directly from the database
 * @param id Product ID
 * @returns Product object or null if not found
 */
export async function fetchProductById(id: string): Promise<IProduct | null> {
  try {
    await dbConnect();
    const product = await ProductModel.findById(id);
    
    if (!product) {
      return null;
    }
    
    // Convert MongoDB document to plain object
    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw new Error('Failed to fetch product');
  }
}