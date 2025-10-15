// This service handles server-side storage for products with MongoDB
import { getSession } from 'next-auth/react';

// API endpoint
const PRODUCTS_API_ENDPOINT = '/api/products';

// Product interface
export interface AdminProduct {
  _id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  image: string;
  description: string;
  tags?: string[];
  colors?: string[];
  mockupImage?: string | null;
  placeholder: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  createdAt: string;
  updatedAt?: string;
}

/**
 * Fetch a product by ID from the server
 */
export async function fetchProductById(productId: string): Promise<AdminProduct | null> {
  try {
    // Get the user session
    const session = await getSession();
    
    // If user is not logged in, return null
    if (!session) {
      console.warn('User not authenticated, cannot fetch product');
      return null;
    }
    
    const response = await fetch(`${PRODUCTS_API_ENDPOINT}/${productId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    // Fallback to local storage if server request fails
    const localProducts = getLocalProducts();
    const product = localProducts.find(p => p._id === productId);
    return product || null;
  }
}

/**
 * Fetch all products from the server
 */
export async function fetchAllProducts(): Promise<AdminProduct[]> {
  try {
    // Get the user session
    const session = await getSession();
    
    // If user is not logged in, return empty array
    if (!session) {
      console.warn('User not authenticated, cannot fetch products');
      return [];
    }
    
    const response = await fetch(PRODUCTS_API_ENDPOINT);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fallback to local storage if server request fails
    return getLocalProducts();
  }
}

/**
 * Fetch products from database (alias for fetchAllProducts for compatibility)
 */
export async function fetchProductsFromDB(): Promise<AdminProduct[]> {
  return fetchAllProducts();
}

/**
 * Save a product to the server
 */
export async function saveProductToServer(product: Omit<AdminProduct, '_id' | 'createdAt'>): Promise<AdminProduct> {
  try {
    // Get the user session
    const session = await getSession();
    
    // If user is not logged in, save to local storage and return
    if (!session) {
      console.warn('User not authenticated, cannot save product to server');
      return saveLocalProduct(product as AdminProduct);
    }
    
    const response = await fetch(PRODUCTS_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to save product: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving product to server:', error);
    // Fallback to local storage
    return saveLocalProduct(product as AdminProduct);
  }
}

/**
 * Update a product on the server
 */
export async function updateProductOnServer(productId: string, product: Partial<AdminProduct>): Promise<AdminProduct> {
  try {
    // Get the user session
    const session = await getSession();
    
    // If user is not logged in, update in local storage and return
    if (!session) {
      console.warn('User not authenticated, cannot update product on server');
      return updateLocalProduct(productId, product);
    }
    
    const response = await fetch(`${PRODUCTS_API_ENDPOINT}/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update product: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating product on server:', error);
    // Fallback to local storage
    return updateLocalProduct(productId, product);
  }
}

/**
 * Delete a product from the server
 */
export async function deleteProductFromServer(productId: string): Promise<void> {
  try {
    // Get the user session
    const session = await getSession();
    
    // If user is not logged in, delete from local storage and return
    if (!session) {
      console.warn('User not authenticated, cannot delete product from server');
      deleteLocalProduct(productId);
      return;
    }
    
    const response = await fetch(`${PRODUCTS_API_ENDPOINT}/${productId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete product: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting product from server:', error);
    // Fallback to local storage
    deleteLocalProduct(productId);
  }
}

// Local storage fallback functions
function getLocalProducts(): AdminProduct[] {
  if (typeof window === 'undefined') return [];
  
  const productsJson = localStorage.getItem('adminProducts');
  return productsJson ? JSON.parse(productsJson) : [];
}

function saveLocalProduct(product: AdminProduct): AdminProduct {
  if (typeof window === 'undefined') return product;
  
  const products = getLocalProducts();
  
  // Generate ID if not provided
  if (!product._id) {
    product._id = Date.now().toString();
    product.createdAt = new Date().toISOString();
  }
  
  products.push(product);
  localStorage.setItem('adminProducts', JSON.stringify(products));
  return product;
}

function updateLocalProduct(productId: string, updatedFields: Partial<AdminProduct>): AdminProduct {
  if (typeof window === 'undefined') return updatedFields as AdminProduct;
  
  const products = getLocalProducts();
  const productIndex = products.findIndex(p => p._id === productId);
  
  if (productIndex === -1) {
    throw new Error(`Product with ID ${productId} not found`);
  }
  
  const updatedProduct = {
    ...products[productIndex],
    ...updatedFields,
    updatedAt: new Date().toISOString()
  };
  
  products[productIndex] = updatedProduct;
  localStorage.setItem('adminProducts', JSON.stringify(products));
  
  return updatedProduct;
}

function deleteLocalProduct(productId: string): void {
  if (typeof window === 'undefined') return;
  
  const products = getLocalProducts();
  const updatedProducts = products.filter(product => product._id !== productId);
  localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
}

/**
 * Initialize the server product service
 * This will sync local products to the server if they don't exist there
 */
export async function initServerProductService(): Promise<void> {
  try {
    // Get the user session
    const session = await getSession();
    
    // If user is not logged in, return
    if (!session) {
      console.warn('User not authenticated, cannot initialize server product service');
      return;
    }
    
    // Check if we have products on the server
    const serverProducts = await fetchAllProducts();
    
    if (serverProducts.length === 0) {
      // If no server products, get local products and upload them
      const localProducts = getLocalProducts();
      
      if (localProducts.length > 0) {
        // Upload each product individually to ensure proper MongoDB document creation
        for (const product of localProducts) {
          // Remove _id and createdAt to let MongoDB generate them
          const { _id, createdAt, ...productData } = product;
          await saveProductToServer(productData);
        }
        
        // Clear local storage after successful upload
        localStorage.removeItem('adminProducts');
      }
    }
  } catch (error) {
    console.error('Error initializing server product service:', error);
  }
}
