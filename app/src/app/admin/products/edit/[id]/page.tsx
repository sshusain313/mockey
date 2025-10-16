'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductForm from '@/components/ProductForm';
import SubHeader from '@/components/SubHeader';
import { AdminProduct, fetchProductById } from '@/lib/serverProductService';
import { useToast } from '@/components/ui/use-toast';
import { Palette } from 'lucide-react';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productId, setProductId] = useState<string>('');

  useEffect(() => {
    // Redirect if not authenticated
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Fetch product data
    const getProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const resolvedParams = await params;
        setProductId(resolvedParams.id);
        const productData = await fetchProductById(resolvedParams.id);
        if (productData) {
          setProduct({
            ...productData,
            tags: productData.tags || [],
            colors: productData.colors || [],
            mockupImage: productData.mockupImage || '',
          });
        } else {
          setError('Product data is null.');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again.');
        toast({
          title: 'Error',
          description: 'Failed to load product data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [params, router, session, toast]);

  const handleSuccess = (updatedProduct: AdminProduct) => {
    toast({
      title: 'Success',
      description: 'Product updated successfully',
      duration: 3000,
    });
    router.push('/admin/products');
  };

  const handleCancel = () => {
    router.push('/admin/products');
  };

  if (loading) {
    return (
      <div className=" mx-auto py-8">
        <SubHeader title="Edit Product" showBackButton />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-8xl mx-auto py-8">
        <SubHeader title="Edit Product" showBackButton />
        <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto my-4">
          <div className="text-center text-red-500">
            <p>{error || 'Product not found'}</p>
            <button
              onClick={() => router.push('/admin/products')}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Return to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    // <div className=" max-w-8xl bg-amber-200 mx-auto py-8">
    <div
    style={{ width: '100%', maxWidth: 'none' }}
    className="bg-white rounded-lg shadow-md mx-auto"
  >
      <div className="flex justify-between items-center mb-6">
        <SubHeader title="Edit Product" showBackButton />
        {/* {product.colors && product.colors.length > 0 && (
          <Link 
            href={`/admin/products/preview/${productId}`}
            className="px-4 py-2 bg-white border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors flex items-center gap-2"
          >
            <Palette className="h-4 w-4" />
            View Color Variants
          </Link>
        )} */}
      </div>
      <ProductForm 
        initialProduct={product as any}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}
