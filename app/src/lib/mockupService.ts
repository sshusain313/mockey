// This service handles synchronization between admin products and mockup galleries

// Define the types for our data structures
export interface AdminProduct {
  _id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  image: string;
  description: string;
  createdAt: string;
}

export interface MockupItem {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  isPro?: boolean;
  categories?: string[];
  placeholder?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  colorVariants?: Array<{
    color: string;
    hex: string;
    image: string;
  }>;
}

// Local storage keys
const MOCKUP_STORAGE_KEY = 'mockupItems';
const ADMIN_PRODUCTS_KEY = 'localProducts';
const LAST_MOCKUP_ID_KEY = 'lastMockupId';

// Get the next available ID for mockups
export function getNextMockupId(): number {
  const lastId = localStorage.getItem(LAST_MOCKUP_ID_KEY);
  const nextId = lastId ? parseInt(lastId) + 1 : 100; // Start from 100 if no existing ID
  localStorage.setItem(LAST_MOCKUP_ID_KEY, nextId.toString());
  return nextId;
}

// Convert an admin product to a mockup item
export function convertToMockupItem(product: AdminProduct): MockupItem {
  // Extract categories from product data
  const categories: string[] = [];
  
  // Add category and subcategory as tags
  if (product.category) categories.push(product.category);
  if (product.subcategory) categories.push(product.subcategory);
  
  // Extract additional categories from product name
  const nameWords = product.name.split(' ');
  const commonCategories = ['White', 'Black', 'Red', 'Blue', 'Green', 'Male', 'Female', 'Unisex', 'Round Neck'];
  
  for (const category of commonCategories) {
    if (nameWords.includes(category) || product.description.includes(category)) {
      if (!categories.includes(category)) {
        categories.push(category);
      }
    }
  }
  
  // Determine placeholder based on categories
  let placeholder: any = {
    x: 100,      // Default x position (center of a 400x400 image)
    y: 100,      // Default y position
    width: 200,  // Default width
    height: 200, // Default height
    shape: 'rectangle' // Default shape
  };
  
  // Check if this is a product that would benefit from a polygon placeholder
  const needsPolygonPlaceholder = 
    categories.includes("Mug") || 
    categories.includes("Cup") || 
    categories.includes("Curved") || 
    categories.includes("Hat") || 
    categories.includes("Cap");
  
  // Adjust placeholder based on mockup type
  if (categories.includes("Closeup")) {
    placeholder = {
      x: 130,
      y: 130,
      width: 140,
      height: 140,
      shape: 'rectangle'
    };
  } else if (categories.includes("Without People") || categories.includes("Blank")) {
    placeholder = {
      x: 100,
      y: 100,
      width: 200,
      height: 200,
      shape: 'rectangle'
    };
  } else if (categories.includes("Mannequin")) {
    placeholder = {
      x: 120,
      y: 120,
      width: 160,
      height: 160,
      shape: 'rectangle'
    };
  } else if (categories.includes("Oversized")) {
    placeholder = {
      x: 160,
      y: 160,
      width: 80,
      height: 80,
      shape: 'rectangle'
    };
  } else if (categories.includes("Boxy")) {
    placeholder = {
      x: 130,
      y: 130,
      width: 140,
      height: 140,
      shape: 'rectangle'
    };
  } else if (categories.includes("Side View")) {
    placeholder = {
      x: 140,
      y: 120,
      width: 120,
      height: 160,
      shape: 'rectangle'
    };
  } else if (categories.includes("Back View")) {
    placeholder = {
      x: 100,
      y: 100,
      width: 200,
      height: 200,
      shape: 'rectangle'
    };
  }
  
  // Create polygon placeholders for curved surfaces
  if (needsPolygonPlaceholder) {
    const centerX = placeholder.x + placeholder.width / 2;
    const centerY = placeholder.y + placeholder.height / 2;
    
    // Create a polygon that simulates a curved surface
    const points = [];
    const numPoints = 12; // Number of points to create a smooth curve
    const curveFactor = categories.includes("Mug") || categories.includes("Cup") ? 0.3 : 0.2;
    
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const xRadius = placeholder.width / 2;
      const yRadius = placeholder.height / 2;
      
      // Apply curve factor to create a more realistic curved surface
      const curveX = Math.cos(angle) * xRadius * (1 + Math.sin(angle) * curveFactor);
      const curveY = Math.sin(angle) * yRadius;
      
      points.push({
        x: centerX + curveX,
        y: centerY + curveY
      });
    }
    
    placeholder = {
      ...placeholder,
      shape: 'polygon',
      points: points
    };
  }
  
  // Create mockup item
  return {
    id: getNextMockupId().toString(), // Convert number to string
    title: product.name,
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
    isPro: false, // Default to free
    categories: categories,
    placeholder: placeholder
  };
}

// Save a mockup item to local storage
export function saveMockupItem(mockupItem: MockupItem): void {
  // Get existing mockups
  const existingMockupsJson = localStorage.getItem(MOCKUP_STORAGE_KEY);
  const existingMockups: MockupItem[] = existingMockupsJson ? JSON.parse(existingMockupsJson) : [];
  
  // Add new mockup at the beginning of the array
  existingMockups.unshift(mockupItem);
  
  // Save back to local storage
  localStorage.setItem(MOCKUP_STORAGE_KEY, JSON.stringify(existingMockups));
}

// Get all mockup items from local storage
export function getAllMockups(): MockupItem[] {
  const mockupsJson = localStorage.getItem(MOCKUP_STORAGE_KEY);
  return mockupsJson ? JSON.parse(mockupsJson) : [];
}

// Add a new product to mockups
export function addProductToMockups(product: AdminProduct): void {
  // Only add to mockups if it's an apparel product
  if (product.category === 'Apparel') {
    const mockupItem = convertToMockupItem(product);
    saveMockupItem(mockupItem);
  }
}

// Initialize the mockup service by syncing with admin products
export function initMockupService(): void {
  // Get admin products
  const productsJson = localStorage.getItem(ADMIN_PRODUCTS_KEY);
  if (productsJson) {
    const products: AdminProduct[] = JSON.parse(productsJson);
    
    // Check if we already have mockups
    const existingMockups = getAllMockups();
    if (existingMockups.length === 0) {
      // Convert all apparel products to mockups
      const apparelProducts = products.filter(p => p.category === 'Apparel');
      const mockups = apparelProducts.map(convertToMockupItem);
      
      // Save all mockups
      localStorage.setItem(MOCKUP_STORAGE_KEY, JSON.stringify(mockups));
    }
  }
}

// Delete a mockup item by product ID
export function deleteProductFromMockups(productId: string): void {
  // Get existing mockups
  const existingMockupsJson = localStorage.getItem(MOCKUP_STORAGE_KEY);
  if (!existingMockupsJson) return;
  
  const existingMockups: MockupItem[] = JSON.parse(existingMockupsJson);
  
  // Find the mockup item that corresponds to the product
  // Since we don't store the product ID in the mockup item, we need to use other methods
  // For now, we'll use the title to match (in a real app, you'd want a more reliable method)
  
  // First, try to get the product details from local storage
  const productsJson = localStorage.getItem(ADMIN_PRODUCTS_KEY);
  if (productsJson) {
    const products: AdminProduct[] = JSON.parse(productsJson);
    const productToDelete = products.find(p => p._id === productId);
    
    if (productToDelete) {
      // Filter out mockups with the same title as the deleted product
      const updatedMockups = existingMockups.filter(mockup => 
        mockup.title !== productToDelete.name
      );
      
      // Save the updated mockups back to local storage
      localStorage.setItem(MOCKUP_STORAGE_KEY, JSON.stringify(updatedMockups));
    }
  }
}

// Clear all user-uploaded mockups (keeping only the default ones)
export function clearUserUploadedMockups(): void {
  // Remove all mockups from localStorage
  localStorage.removeItem(MOCKUP_STORAGE_KEY);
  
  // Reset the last mockup ID
  localStorage.removeItem(LAST_MOCKUP_ID_KEY);
}
