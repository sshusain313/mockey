import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getBeanieProducts } from './actions';

export default async function BeaniePage() {
  // Fetch only beanie products using the specialized server action
  const products = await getBeanieProducts();
  
  // Log the products to verify they're properly serialized
  console.log('BeaniePage: Beanie products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
