import { IProduct } from '@/models/ProductTypes';

/**
 * Fetch all products from the API
 * @returns Promise with array of products
 */
export const fetchAllProducts = async (): Promise<IProduct[]> => {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return mock data as fallback
    return getMockProducts();
  }
};

/**
 * Fetch a product by ID from the API
 * @param id Product ID
 * @returns Promise with product or null
 */
export const fetchProductById = async (id: string): Promise<IProduct | null> => {
  try {
    const response = await fetch(`/api/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    // Return mock product as fallback
    const mockProducts = getMockProducts();
    return mockProducts.find(p => p._id === id) || null;
  }
};

/**
 * Fetch products by category from the API
 * @param category Category name
 * @returns Promise with array of products
 */
export const fetchProductsByCategory = async (category: string): Promise<IProduct[]> => {
  try {
    const response = await fetch(`/api/products?category=${encodeURIComponent(category)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch products by category');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    // Return filtered mock data as fallback
    const mockProducts = getMockProducts();
    return mockProducts.filter(p => p.category === category);
  }
};

/**
 * Fetch products by subcategory from the API
 * @param subcategory Subcategory name
 * @returns Promise with array of products
 */
export const fetchProductsBySubcategory = async (subcategory: string): Promise<IProduct[]> => {
  try {
    const response = await fetch(`/api/products?subcategory=${encodeURIComponent(subcategory)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch products by subcategory');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching products for subcategory ${subcategory}:`, error);
    // Return filtered mock data as fallback
    const mockProducts = getMockProducts();
    return mockProducts.filter(p => p.subcategory === subcategory);
  }
};

/**
 * Fetch T-shirt products with complete data for the gallery from the API
 * @returns Promise with array of complete product data
 */
export const fetchTShirtProductsWithDetails = async (): Promise<IProduct[]> => {
  try {
    const response = await fetch('/api/products/tshirts');
    if (!response.ok) {
      throw new Error('Failed to fetch T-shirt products');
    }
    const products = await response.json();
    console.log(`Fetched ${products.length} T-shirt products with complete data`);
    return products;
  } catch (error) {
    console.error('Error fetching T-shirt products with details:', error);
    // Return filtered mock data as fallback
    const mockProducts = getMockProducts();
    const tshirtProducts = mockProducts.filter(p => 
      p.category === 'Apparel' && 
      (p.subcategory === 'T-Shirts' || p.subcategory === 'T-Shirt')
    );
    return tshirtProducts;
  }
};

/**
 * Function to convert products to MockupItem format for the gallery
 * @param products Array of products
 * @returns Array of MockupItems
 */
export const convertProductsToMockupItems = (products: IProduct[]) => {
  return products.map(product => ({
    id: product._id,
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
    categories: [...(product.tags || []), product.category, product.subcategory],
    placeholder: product.placeholder,
    colorVariants: product.colorVariants
  }));
};

/**
 * Mock data for development when API is not available
 * @returns Array of mock products
 */
export const getMockProducts = (): IProduct[] => {
  return [
    {
      _id: '1',
      name: 'Classic White T-Shirt',
      description: 'A comfortable classic white t-shirt made from 100% cotton.',
      category: 'Apparel',
      subcategory: 'T-Shirts',
      price: 24.99,
      image: '/products/tshirt-white.jpg',
      tags: ['White', 'Cotton', 'Classic', 'Unisex'],
      colors: ['White'],
      colorVariants: [
        {
          color: 'White',
          hex: '#FFFFFF',
          image: '/products/tshirt-white.jpg'
        }
      ],
      placeholder: {
        x: 150,
        y: 120,
        width: 200,
        height: 250
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '2',
      name: 'Black Graphic T-Shirt',
      description: 'A stylish black t-shirt perfect for custom designs.',
      category: 'Apparel',
      subcategory: 'T-Shirts',
      price: 29.99,
      image: '/products/tshirt-black.jpg',
      tags: ['Black', 'Cotton', 'Graphic', 'Unisex'],
      colors: ['Black'],
      colorVariants: [
        {
          color: 'Black',
          hex: '#000000',
          image: '/products/tshirt-black.jpg'
        }
      ],
      placeholder: {
        x: 150,
        y: 120,
        width: 200,
        height: 250
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '3',
      name: 'Navy Blue Crew Neck',
      description: 'A premium navy blue crew neck t-shirt.',
      category: 'Apparel',
      subcategory: 'T-Shirts',
      price: 27.99,
      image: '/products/tshirt-navy.jpg',
      tags: ['Navy Blue', 'Crew Neck', 'Premium', 'Unisex'],
      colors: ['Navy Blue'],
      colorVariants: [
        {
          color: 'Navy Blue',
          hex: '#000080',
          image: '/products/tshirt-navy.jpg'
        }
      ],
      placeholder: {
        x: 150,
        y: 120,
        width: 200,
        height: 250
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '4',
      name: 'Red Round Neck T-Shirt',
      description: 'A vibrant red round neck t-shirt for a bold look.',
      category: 'Apparel',
      subcategory: 'T-Shirts',
      price: 26.99,
      image: '/products/tshirt-red.jpg',
      tags: ['Red', 'Round Neck', 'Bold', 'Unisex'],
      colors: ['Red'],
      colorVariants: [
        {
          color: 'Red',
          hex: '#FF0000',
          image: '/products/tshirt-red.jpg'
        }
      ],
      placeholder: {
        x: 150,
        y: 120,
        width: 200,
        height: 250
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '5',
      name: 'Oversized Vintage Tee',
      description: 'An oversized vintage style t-shirt with a relaxed fit.',
      category: 'Apparel',
      subcategory: 'T-Shirts',
      price: 34.99,
      image: '/products/tshirt-oversized.jpg',
      tags: ['Oversized', 'Vintage', 'Relaxed Fit', 'Unisex'],
      colors: ['Beige'],
      colorVariants: [
        {
          color: 'Beige',
          hex: '#F5F5DC',
          image: '/products/tshirt-oversized.jpg'
        }
      ],
      placeholder: {
        x: 150,
        y: 120,
        width: 200,
        height: 250
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '6',
      name: 'Acid Wash Graphic Tee',
      description: 'A trendy acid wash t-shirt with a distressed look.',
      category: 'Apparel',
      subcategory: 'T-Shirts',
      price: 32.99,
      image: '/products/tshirt-acid-wash.jpg',
      tags: ['Acid Wash', 'Distressed', 'Trendy', 'Unisex'],
      colors: ['Gray'],
      colorVariants: [
        {
          color: 'Gray',
          hex: '#808080',
          image: '/products/tshirt-acid-wash.jpg'
        }
      ],
      placeholder: {
        x: 150,
        y: 120,
        width: 200,
        height: 250
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
};