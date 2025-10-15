import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getRingProducts } from './actions';

export default async function RingPage() {
  // Fetch only ring products using the specialized server action
  const products = await getRingProducts();
  
  // Log the products to verify they're properly serialized
  console.log('RingPage: Ring products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
