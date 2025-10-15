import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getMacbookProducts } from './actions';

export default async function MacbookPage() {
  // Fetch only Macbook products using the specialized server action
  const products = await getMacbookProducts();
  
  // Log the products to verify they're properly serialized
  console.log('MacbookPage: Macbook products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
