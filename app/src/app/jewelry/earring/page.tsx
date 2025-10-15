import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getEarringProducts } from './actions';

export default async function EarringPage() {
  // Fetch only earring products using the specialized server action
  const products = await getEarringProducts();
  
  // Log the products to verify they're properly serialized
  console.log('EarringPage: Earring products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
