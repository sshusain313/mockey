import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getCosmeticProducts } from './actions';

export default async function CosmeticPage() {
  // Fetch only cosmetic products using the specialized server action
  const products = await getCosmeticProducts();
  
  // Log the products to verify they're properly serialized
  console.log('CosmeticPage: Cosmetic products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
