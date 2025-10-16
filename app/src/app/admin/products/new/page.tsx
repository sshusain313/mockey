'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductForm from '@/components/ProductForm';
import { addProductToMockups } from '@/lib/mockupService';
import SubHeader from '@/components/SubHeader';

export default function NewProductPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('editId');
  const [initialProduct, setInitialProduct] = useState<any | null>(null);
  const [prefillLoading, setPrefillLoading] = useState<boolean>(false);
  
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

  useEffect(() => {
    const loadForEdit = async () => {
      if (!editId) return;
      try {
        setPrefillLoading(true);
        const res = await fetch(`/api/products/${editId}`);
        if (!res.ok) throw new Error('Failed to load product');
        const p = await res.json();
        // Map API product to ProductForm initialProduct shape
        setInitialProduct({
          id: p._id,
          name: p.name,
          description: p.description,
          category: p.category,
          subcategory: p.subcategory,
          price: p.price,
          tags: p.tags || [],
          colors: p.colors || [],
          image: p.image || null,
          mockupImage: p.mockupImage || null,
          customShapePoints: p.customShapePoints || [],
          placeholder: p.placeholder || { x: 150, y: 150, width: 100, height: 100 },
        });
      } catch (e) {
        console.error('Prefill failed:', e);
      } finally {
        setPrefillLoading(false);
      }
    };
    loadForEdit();
  }, [editId]);

  const handleProductSuccess = (product: any) => {
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
        title={editId ? 'Edit Product' : 'Add New Product'}
        showBackButton={true}
        backUrl="/admin/products"
      />

      <div className="w-full max-auto py-8 px-4">
        <div className="max-w-8xl">
          <div className="w-full">
            {editId && prefillLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <ProductForm onSuccess={handleProductSuccess} initialProduct={initialProduct || undefined} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
