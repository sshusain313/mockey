import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getPouchProducts } from './actions';

export default async function PouchPage() {
  // Fetch only pouch products using the specialized server action
  const products = await getPouchProducts();
  
  // Log the products to verify they're properly serialized
  console.log('PouchPage: Pouch products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
