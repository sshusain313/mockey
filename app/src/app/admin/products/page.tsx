'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { deleteProductFromMockups } from '@/lib/mockupService';
import { 
  fetchAllProducts, 
  deleteProductFromServer, 
  initServerProductService,
  AdminProduct
} from '@/lib/serverProductService';
import { colorMap } from '@/lib/colorUtils';

interface Product {
  _id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  image: string;
  description: string;
  createdAt: string;
}

export default function ProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLocalMode, setIsLocalMode] = useState(false);

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (status === 'authenticated') {
      if (session?.user?.role !== 'admin') {
        router.push('/'); // Redirect non-admin users
      } else {
        // Initialize server product service
        initServerProductService().then(() => {
          // Fetch products
          fetchProducts();
          
          // Check for newly created product in sessionStorage
          checkForNewlyCreatedProduct();
        });
      }
    } else if (status === 'unauthenticated') {
      router.push('/auth/signin'); // Redirect unauthenticated users
    }
  }, [status, session, router]);

  const checkForNewlyCreatedProduct = () => {
    try {
      const newProductJson = sessionStorage.getItem('newlyCreatedProduct');
      const timestamp = sessionStorage.getItem('newlyCreatedProductTimestamp');
      
      if (newProductJson && timestamp) {
        // Check if the product was created in the last 10 seconds
        const createdTime = parseInt(timestamp);
        const currentTime = Date.now();
        const timeDiff = currentTime - createdTime;
        
        if (timeDiff < 10000) { // 10 seconds
          const newProduct = JSON.parse(newProductJson);
          
          // Add the new product to the list if it's not already there
          setProducts(prevProducts => {
            // Check if product with this ID already exists
            const exists = prevProducts.some(p => p._id === newProduct._id);
            if (!exists) {
              setSuccessMessage('Product created successfully!');
              // Add the new product at the beginning of the list
              return [newProduct, ...prevProducts];
            }
            return prevProducts;
          });
        }
        
        // Clear the sessionStorage after processing
        sessionStorage.removeItem('newlyCreatedProduct');
        sessionStorage.removeItem('newlyCreatedProductTimestamp');
      }
    } catch (err) {
      console.error('Error processing newly created product:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      try {
        // Use server product service to fetch products
        const serverProducts = await fetchAllProducts();
        
        if (serverProducts.length > 0) {
          setProducts(serverProducts);
          setIsLocalMode(false);
        } else {
          throw new Error('No products found on server');
        }
      } catch (apiError) {
        console.error('API error:', apiError);
        
        // If API fails, try to get products from local storage
        const localProducts = localStorage.getItem('adminProducts');
        if (localProducts) {
          setProducts(JSON.parse(localProducts));
          setIsLocalMode(true);
          setError('Using locally stored products due to API error');
        } else {
          // If no local products, set empty array
          setProducts([]);
          setIsLocalMode(true);
          setError('Could not fetch products from server. Starting with empty list.');
        }
      }
      
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    // Set the product ID to be deleted
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    
    try {
      setIsDeleting(true);
      
      if (isLocalMode) {
        // Delete from local state only
        setProducts(products.filter(product => product._id !== deleteId));
        
        // Update localStorage
        const updatedProducts = products.filter(product => product._id !== deleteId);
        localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
        
        // Also remove from mockups gallery
        deleteProductFromMockups(deleteId);
      } else {
        // Try to delete from server
        try {
          await deleteProductFromServer(deleteId);
          
          // Update local state
          setProducts(products.filter(product => product._id !== deleteId));
          
          // Also remove from mockups gallery
          deleteProductFromMockups(deleteId);
        } catch (apiError) {
          console.error('API delete error:', apiError);
          // Fall back to local delete
          setProducts(products.filter(product => product._id !== deleteId));
          setIsLocalMode(true);
          setError('Product removed locally only. Server update failed.');
        }
      }
      
      setDeleteId(null);
      setIsDeleting(false);
      setSuccessMessage('Product deleted successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting the product');
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  // Save products to localStorage as fallback whenever they change
  useEffect(() => {
    if (products.length > 0 && isLocalMode) {
      localStorage.setItem('adminProducts', JSON.stringify(products));
    }
  }, [products, isLocalMode]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Mockey Admin - Products</h1>
          <div className="flex items-center space-x-4">
            <span>{session?.user?.name}</span>
            <Link href="/admin/dashboard" className="text-sm hover:underline">
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Product Management</h2>
          <Link 
            href="/admin/products/new"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            Add New Product
          </Link>
        </div>

        {isLocalMode && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            <p className="font-bold">Local Mode Active</p>
            <p className="text-sm">Products are being stored in your browser only. Changes will not be saved to the server.</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subcategory
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Colors
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="h-16 w-16 object-cover rounded-md" 
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.subcategory}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.colors && product.colors.length > 0 ? (
                        <Link 
                          href={`/admin/products/preview/${product._id}`}
                          className="flex items-center space-x-1 hover:underline group"
                          title="View color variants"
                        >
                          {product.colors.slice(0, 3).map((color: string) => {
                            const colorValue = colorMap[color] || "#CCCCCC";
                            
                            return (
                              <div 
                                key={color} 
                                className="w-4 h-4 rounded-full border border-gray-200 transition-transform group-hover:scale-110" 
                                style={{ backgroundColor: colorValue }}
                                title={color}
                              ></div>
                            );
                          })}
                          
                          {product.colors.length > 3 && (
                            <span className="text-xs text-gray-500 group-hover:text-indigo-600">
                              +{product.colors.length - 3} more
                            </span>
                          )}
                        </Link>
                      ) : (
                        <span className="text-gray-400">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link 
                        href={`/admin/products/edit/${product._id}`}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
