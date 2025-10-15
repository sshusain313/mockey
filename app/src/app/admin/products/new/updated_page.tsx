// 'use client';

// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';
// import Link from 'next/link';
// import ProductForm from '@/components/ProductForm';
// import { AdminProduct } from '@/lib/serverProductService';

// export default function NewProductPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     // Check if user is authenticated and is an admin
//     if (status === 'authenticated') {
//       if (session?.user?.role !== 'admin') {
//         router.push('/'); // Redirect non-admin users
//       }
//     } else if (status === 'unauthenticated') {
//       router.push('/auth/signin'); // Redirect unauthenticated users
//     }
//   }, [status, session, router]);

//   const handleProductSuccess = (product: AdminProduct) => {
//     // Store the newly created product in sessionStorage for the products page to pick up
//     sessionStorage.setItem('newlyCreatedProduct', JSON.stringify(product));
//     sessionStorage.setItem('newlyCreatedProductTimestamp', Date.now().toString());
    
//     // Redirect to products page
//     router.push('/admin/products');
//   };

//   const handleCancel = () => {
//     router.push('/admin/products');
//   };

//   if (status === 'loading') {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-green-500 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-gray-900">Create New Product</h1>
//           <Link href="/admin/products" className="text-blue-600 hover:text-blue-800 font-medium">
//             Back to Products
//           </Link>
//         </div>
        
//         <ProductForm 
//           onSuccess={handleProductSuccess}
//           onCancel={handleCancel}
//         />
//       </div>
//     </div>
//   );
// }
