'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { IProduct } from '@/models/Product';
import ProductForm from './ProductForm';
import SimpleProductForm from './SimpleProductForm';

interface CreateProductButtonProps {
  onProductCreated: (products: IProduct[]) => void;
  useSimpleForm?: boolean;
  buttonText?: string;
  buttonVariant?: 'default' | 'outline' | 'ghost' | 'link';
}

export default function CreateProductButton({ 
  onProductCreated, 
  useSimpleForm = false,
  buttonText = "Create Product",
  buttonVariant = "default"
}: CreateProductButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleProductSuccess = async (product: any) => {
    setIsOpen(false);
    
    // Fetch the updated product list
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const products = await response.json();
        onProductCreated(products);
      } else {
        console.error('Failed to fetch updated products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        variant={buttonVariant}
        className={buttonVariant === "default" ? "bg-brand-pink hover:bg-brand-pink/90" : ""}
      >
        {buttonText}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={useSimpleForm ? "max-w-md" : "max-w-6xl max-h-[90vh] overflow-y-auto"}>
          <DialogHeader>
            <DialogTitle>Create New Product</DialogTitle>
          </DialogHeader>
          
          {useSimpleForm ? (
            <SimpleProductForm 
              onSuccess={handleProductSuccess} 
              onCancel={() => setIsOpen(false)} 
            />
          ) : (
            <ProductForm 
              onSuccess={handleProductSuccess} 
              onCancel={() => setIsOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
