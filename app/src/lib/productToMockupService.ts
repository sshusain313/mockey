// import { MockupItem } from './mockupService';
// import { AdminProduct, fetchAllProducts } from './serverProductService';

// /**
//  * Convert an admin product to a mockup item
//  */
// export function convertProductToMockup(product: AdminProduct): MockupItem {
//   // Extract categories from product data
//   const categories = [product.category, product.subcategory];
  
//   // Add additional categories based on product name
//   const nameWords = product.name.split(' ');
//   const commonCategories = ['White', 'Black', 'Red', 'Blue', 'Green', 'Male', 'Female', 'Unisex', 'Round Neck', 'Closeup', 'Without People', 'Blank', 'Mannequin', 'Oversized', 'Boxy'];
  
//   for (const category of commonCategories) {
//     if (nameWords.includes(category) || (product.description && product.description.includes(category))) {
//       if (!categories.includes(category)) {
//         categories.push(category);
//       }
//     }
//   }
  
//   // Determine placeholder rectangle based on categories
//   let placeholder = {
//     x: 100,      // Default x position (center of a 400x400 image)
//     y: 100,      // Default y position
//     width: 200,  // Default width
//     height: 200  // Default height
//   };
  
//   // Adjust placeholder based on mockup type
//   if (categories.includes("Closeup")) {
//     placeholder = {
//       x: 130,
//       y: 130,
//       width: 140,
//       height: 140
//     };
//   } else if (categories.includes("Without People") || categories.includes("Blank")) {
//     placeholder = {
//       x: 100,
//       y: 100,
//       width: 200,
//       height: 200
//     };
//   } else if (categories.includes("Mannequin")) {
//     placeholder = {
//       x: 120,
//       y: 120,
//       width: 160,
//       height: 160
//     };
//   } else if (categories.includes("Oversized")) {
//     placeholder = {
//       x: 160,
//       y: 160,
//       width: 80,
//       height: 80
//     };
//   } else if (categories.includes("Boxy")) {
//     placeholder = {
//       x: 130,
//       y: 130,
//       width: 140,
//       height: 140
//     };
//   } else if (categories.includes("Side View")) {
//     placeholder = {
//       x: 140,
//       y: 120,
//       width: 120,
//       height: 160
//     };
//   } else if (categories.includes("Back View")) {
//     placeholder = {
//       x: 100,
//       y: 100,
//       width: 200,
//       height: 200
//     };
//   }
  
//   return {
//     id: parseInt(product._id.substring(0, 8), 16) || Date.now(), // Generate a numeric ID from the MongoDB ID
//     title: product.name,
//     image: product.image,
//     isPro: product.price > 50, // Example rule: products over $50 are "pro"
//     categories: categories,
//     placeholder: placeholder,
//   };
// }

// /**
//  * Fetch all products from the server and convert them to mockup items
//  */
// export async function fetchProductsAsMockups(): Promise<MockupItem[]> {
//   try {
//     // Fetch products from the server
//     const products = await fetchAllProducts();
    
//     // Convert products to mockup items
//     const mockups = products
//       .filter(product => product.category === 'Apparel' && product.subcategory === 'T-Shirt')
//       .map(convertProductToMockup);
    
//     return mockups;
//   } catch (error) {
//     console.error('Error fetching products as mockups:', error);
//     return [];
//   }
// }
