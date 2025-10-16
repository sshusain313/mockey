import { IProduct } from '@/models/Product';

// Base product interface without mongoose Document properties
export interface BaseProduct {
  _id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  image: string;
  tags: string[];
  colors: string[];
  colorVariants: { color: string; hex: string; image: string; }[];
  placeholder: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  customShapePoints?: Array<{x: number, y: number}>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetch a product by ID
 * @param id Product ID
 * @returns Promise with product or null
 */
export const getProductById = async (id: string): Promise<(IProduct | BaseProduct) | null> => {
  try {
    // First try to fetch from API
    try {
      const apiResponse = await fetch(`/api/products/${id}`);
      if (apiResponse.ok) {
        const product = await apiResponse.json();
        return product;
      }
    } catch (apiError) {
      console.warn('API fetch failed, trying alternatives:', apiError);
    }
    
    // Then try to fetch from local storage if available
    if (typeof window !== 'undefined') {
      const storedProducts = localStorage.getItem('cachedProducts');
      if (storedProducts) {
        try {
          const products = JSON.parse(storedProducts);
          const product = products.find((p: IProduct) => p._id === id);
          if (product) {
            console.log('Found product in localStorage cache');
            return product;
          }
        } catch (parseError) {
          console.error('Error parsing stored products:', parseError);
        }
      }
    }
    
    // If all else fails, return a mock product
    console.log(`Using mock product for ID ${id}`);
    return getMockProduct(id);
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return getMockProduct(id);
  }
};

/**
 * Get a mock product for development/fallback
 * @param id Product ID
 * @returns Mock product
 */
const getMockProduct = (id: string): BaseProduct => {
  return {
    _id: id || 'mock_product',
    name: 'Classic T-Shirt',
    description: 'A comfortable classic t-shirt made from 100% cotton.',
    category: 'Apparel',
    subcategory: 'T-Shirts',
    price: 24.99,
    image: '/products/tshirt-white.jpg',
    tags: ['Cotton', 'Classic', 'Unisex'],
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
  };
};

/**
 * Get all products
 * @returns Promise with array of products
 */
export const getAllProducts = async (): Promise<(IProduct | BaseProduct)[]> => {
  try {
    // First try to fetch from API
    try {
      const apiResponse = await fetch('/api/products/direct');
      if (apiResponse.ok) {
        const products = await apiResponse.json();
        
        // Cache the products in localStorage for future use
        if (typeof window !== 'undefined' && products.length > 0) {
          localStorage.setItem('cachedProducts', JSON.stringify(products));
        }
        
        return products;
      }
    } catch (apiError) {
      console.warn('API fetch failed, trying alternatives:', apiError);
    }
    
    // Then try to fetch from local storage if available
    if (typeof window !== 'undefined') {
      const storedProducts = localStorage.getItem('cachedProducts');
      if (storedProducts) {
        try {
          const products = JSON.parse(storedProducts);
          console.log('Using cached products from localStorage');
          return products;
        } catch (parseError) {
          console.error('Error parsing stored products:', parseError);
        }
      }
    }
    
    // If all else fails, return mock products
    console.log('Using mock products');
    return getMockProducts();
  } catch (error) {
    console.error('Error fetching all products:', error);
    return getMockProducts();
  }
};

/**
 * Get mock products for development/fallback
 * @returns Array of mock products
 */
const getMockProducts = (): BaseProduct[] => {
  return [
    getMockProduct('1'),
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
    }
  ];
};