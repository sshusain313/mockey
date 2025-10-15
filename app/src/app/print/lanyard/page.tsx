import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getLanyardProducts } from './actions';

export default async function LanyardPage() {
  // Fetch only lanyard products using the specialized server action
  const products = await getLanyardProducts();
  
  // Log the products to verify they're properly serialized
  console.log('LanyardPage: Lanyard products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
