// import { IProduct, ColorVariant } from '@/models/Product';
// import ProductModel from '@/models/Product';
// import dbConnect from '@/lib/mongodb';

// /**
//  * Fetch all products directly from the database
//  * @returns Promise with array of products
//  */
// export const fetchAllProducts = async (): Promise<IProduct[]> => {
//   try {
//     // Connect to the database
//     await dbConnect();
    
//     // Fetch all products from MongoDB
//     const products = await ProductModel.find().sort({ createdAt: -1 });
    
//     // Convert MongoDB documents to plain objects
//     return products.map(product => formatProductData(product));
//   } catch (error) {
//     console.error('Error fetching products from database:', error);
//     // Return mock data as fallback
//     return getMockProducts();
//   }
// };

// /**
//  * Fetch a product by ID directly from the database
//  * @param id Product ID
//  * @returns Promise with product or null
//  */
// export const fetchProductById = async (id: string): Promise<IProduct | null> => {
//   try {
//     // Connect to the database
//     await dbConnect();
    
//     // Fetch product by ID from MongoDB
//     const product = await ProductModel.findById(id);
    
//     if (!product) {
//       return null;
//     }
    
//     // Convert MongoDB document to plain object
//     return formatProductData(product);
//   } catch (error) {
//     console.error(`Error fetching product with ID ${id} from database:`, error);
    
//     // Return mock product as fallback
//     const mockProducts = getMockProducts();
//     return mockProducts.find(p => p._id === id) || null;
//   }
// };

// /**
//  * Fetch products by category directly from the database
//  * @param category Category name
//  * @returns Promise with array of products
//  */
// export const fetchProductsByCategory = async (category: string): Promise<IProduct[]> => {
//   try {
//     // Connect to the database
//     await dbConnect();
    
//     // Fetch products by category from MongoDB
//     const products = await ProductModel.find({ category }).sort({ createdAt: -1 });
    
//     // Convert MongoDB documents to plain objects
//     return products.map(product => formatProductData(product));
//   } catch (error) {
//     console.error(`Error fetching products for category ${category} from database:`, error);
    
//     // Return filtered mock data as fallback
//     const mockProducts = getMockProducts();
//     return mockProducts.filter(p => p.category === category);
//   }
// };

// /**
//  * Fetch products by subcategory directly from the database
//  * @param subcategory Subcategory name
//  * @returns Promise with array of products
//  */
// export const fetchProductsBySubcategory = async (subcategory: string): Promise<IProduct[]> => {
//   try {
//     // Connect to the database
//     await dbConnect();
    
//     // Fetch products by subcategory from MongoDB
//     const products = await ProductModel.find({ subcategory }).sort({ createdAt: -1 });
    
//     // Convert MongoDB documents to plain objects
//     return products.map(product => formatProductData(product));
//   } catch (error) {
//     console.error(`Error fetching products for subcategory ${subcategory} from database:`, error);
    
//     // Return filtered mock data as fallback
//     const mockProducts = getMockProducts();
//     return mockProducts.filter(p => p.subcategory === subcategory);
//   }
// };

// /**
//  * Helper function to format product data from MongoDB document
//  * @param product MongoDB product document
//  * @returns Formatted product data
//  */
// const formatProductData = (product: any): IProduct => {
//   return {
//     _id: product._id.toString(),
//     name: product.name,
//     description: product.description,
//     category: product.category,
//     subcategory: product.subcategory,
//     price: product.price,
//     image: product.image,
//     tags: product.tags || [],
//     colors: product.colors || [],
//     colorVariants: product.colorVariants || [],
//     mockupImage: product.mockupImage || null,
//     placeholder: product.placeholder || {
//       x: 150,
//       y: 120,
//       width: 200,
//       height: 250
//     },
//     createdAt: typeof product.createdAt === 'object' ? product.createdAt.toISOString() : product.createdAt,
//     updatedAt: typeof product.updatedAt === 'object' ? product.updatedAt.toISOString() : product.updatedAt
//   };
// };

// /**
//  * Mock data for development when database is not available
//  * @returns Array of mock products
//  */
// export const getMockProducts = (): IProduct[] => {
//   return [
//     {
//       _id: '1',
//       name: 'Classic White T-Shirt',
//       description: 'A comfortable classic white t-shirt made from 100% cotton.',
//       category: 'Apparel',
//       subcategory: 'T-Shirts',
//       price: 24.99,
//       image: '/products/tshirt-white.jpg',
//       tags: ['White', 'Cotton', 'Classic', 'Unisex'],
//       colors: ['White'],
//       colorVariants: [
//         {
//           color: 'White',
//           hex: '#FFFFFF',
//           image: '/products/tshirt-white.jpg'
//         }
//       ],
//       placeholder: {
//         x: 150,
//         y: 120,
//         width: 200,
//         height: 250
//       },
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString()
//     },
//     {
//       _id: '2',
//       name: 'Black Graphic T-Shirt',
//       description: 'A stylish black t-shirt perfect for custom designs.',
//       category: 'Apparel',
//       subcategory: 'T-Shirts',
//       price: 29.99,
//       image: '/products/tshirt-black.jpg',
//       tags: ['Black', 'Cotton', 'Graphic', 'Unisex'],
//       colors: ['Black'],
//       colorVariants: [
//         {
//           color: 'Black',
//           hex: '#000000',
//           image: '/products/tshirt-black.jpg'
//         }
//       ],
//       placeholder: {
//         x: 150,
//         y: 120,
//         width: 200,
//         height: 250
//       },
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString()
//     },
//     {
//       _id: '3',
//       name: 'Navy Blue Crew Neck',
//       description: 'A premium navy blue crew neck t-shirt.',
//       category: 'Apparel',
//       subcategory: 'T-Shirts',
//       price: 27.99,
//       image: '/products/tshirt-navy.jpg',
//       tags: ['Navy Blue', 'Crew Neck', 'Premium', 'Unisex'],
//       colors: ['Navy Blue'],
//       colorVariants: [
//         {
//           color: 'Navy Blue',
//           hex: '#000080',
//           image: '/products/tshirt-navy.jpg'
//         }
//       ],
//       placeholder: {
//         x: 150,
//         y: 120,
//         width: 200,
//         height: 250
//       },
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString()
//     },
//     {
//       _id: '4',
//       name: 'Red Round Neck T-Shirt',
//       description: 'A vibrant red round neck t-shirt for a bold look.',
//       category: 'Apparel',
//       subcategory: 'T-Shirts',
//       price: 26.99,
//       image: '/products/tshirt-red.jpg',
//       tags: ['Red', 'Round Neck', 'Bold', 'Unisex'],
//       colors: ['Red'],
//       colorVariants: [
//         {
//           color: 'Red',
//           hex: '#FF0000',
//           image: '/products/tshirt-red.jpg'
//         }
//       ],
//       placeholder: {
//         x: 150,
//         y: 120,
//         width: 200,
//         height: 250
//       },
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString()
//     },
//     {
//       _id: '5',
//       name: 'Oversized Vintage Tee',
//       description: 'An oversized vintage style t-shirt with a relaxed fit.',
//       category: 'Apparel',
//       subcategory: 'T-Shirts',
//       price: 34.99,
//       image: '/products/tshirt-oversized.jpg',
//       tags: ['Oversized', 'Vintage', 'Relaxed Fit', 'Unisex'],
//       colors: ['Beige'],
//       colorVariants: [
//         {
//           color: 'Beige',
//           hex: '#F5F5DC',
//           image: '/products/tshirt-oversized.jpg'
//         }
//       ],
//       placeholder: {
//         x: 150,
//         y: 120,
//         width: 200,
//         height: 250
//       },
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString()
//     },
//     {
//       _id: '6',
//       name: 'Acid Wash Graphic Tee',
//       description: 'A trendy acid wash t-shirt with a distressed look.',
//       category: 'Apparel',
//       subcategory: 'T-Shirts',
//       price: 32.99,
//       image: '/products/tshirt-acid-wash.jpg',
//       tags: ['Acid Wash', 'Distressed', 'Trendy', 'Unisex'],
//       colors: ['Gray'],
//       colorVariants: [
//         {
//           color: 'Gray',
//           hex: '#808080',
//           image: '/products/tshirt-acid-wash.jpg'
//         }
//       ],
//       placeholder: {
//         x: 150,
//         y: 120,
//         width: 200,
//         height: 250
//       },
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString()
//     }
//   ];
// };

// /**
//  * Function to convert products to MockupItem format for the gallery
//  * @param products Array of products
//  * @returns Array of MockupItems
//  */
// export const convertProductsToMockupItems = (products: IProduct[]) => {
//   return products.map(product => ({
//     id: product._id,
//     name: product.name,
//     description: product.description,
//     price: product.price,
//     image: product.image,
//     categories: [...(product.tags || []), product.category, product.subcategory],
//     placeholder: product.placeholder,
//     colorVariants: product.colorVariants
//   }));
// };

// /**
//  * Fetch T-shirt products with complete data for the gallery
//  * This function specifically fetches products with all required fields for the TShirtGallery
//  * @returns Promise with array of complete product data
//  */
// export const fetchTShirtProductsWithDetails = async (): Promise<IProduct[]> => {
//   try {
//     // Connect to the database
//     await dbConnect();
    
//     // Create a query to fetch T-shirt products with all required fields
//     const query = {
//       category: 'Apparel',
//       subcategory: { $in: ['T-Shirts', 'T-Shirt'] },
//       // Ensure the product has an image
//       image: { $exists: true, $ne: '' },
//       // Ensure the product has placeholder data
//       'placeholder.x': { $exists: true },
//       'placeholder.y': { $exists: true },
//       'placeholder.width': { $exists: true },
//       'placeholder.height': { $exists: true }
//     };
    
//     // Fetch products from MongoDB with the specific query
//     const products = await ProductModel.find(query).sort({ createdAt: -1 });
    
//     // Convert MongoDB documents to plain objects
//     const formattedProducts = products.map(product => formatProductData(product));
    
//     console.log(`Fetched ${formattedProducts.length} T-shirt products with complete data`);
    
//     return formattedProducts;
//   } catch (error) {
//     console.error('Error fetching T-shirt products with details:', error);
    
//     // Return filtered mock data as fallback
//     const mockProducts = getMockProducts();
//     const tshirtProducts = mockProducts.filter(p => 
//       p.category === 'Apparel' && 
//       (p.subcategory === 'T-Shirts' || p.subcategory === 'T-Shirt')
//     );
    
//     return tshirtProducts;
//   }
// };
