'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import ProductForm from '@/components/ProductForm';
import { addProductToMockups } from '@/lib/mockupService';
import { AdminProduct } from '@/lib/serverProductService';
import SubHeader from '@/components/SubHeader';

export default function NewProductPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (status === 'authenticated') {
      if (session?.user?.role !== 'admin') {
        router.push('/'); // Redirect non-admin users
      }
    } else if (status === 'unauthenticated') {
      router.push('/auth/signin'); // Redirect unauthenticated users
    }
  }, [status, session, router]);

  const handleProductSuccess = (product: AdminProduct) => {
    // Store the product in sessionStorage for the products page to detect
    sessionStorage.setItem('newlyCreatedProduct', JSON.stringify(product));
    sessionStorage.setItem('newlyCreatedProductTimestamp', Date.now().toString());

    // Add the product to mockups if it's an apparel product
    if (product.category.toLowerCase() === 'apparel') {
      addProductToMockups(product);
      sessionStorage.setItem('addedToMockupGallery', 'true');
    }

    // Redirect to products page
    router.push('/admin/products');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-8xl">
      <SubHeader 
        title="Add New Product"
        showBackButton={true}
        backUrl="/admin/products"
      />

      <div className="w-full max-auto py-8 px-4">
        <div className="max-w-8xl">
          <div className="w-full">
            <ProductForm onSuccess={handleProductSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
}
