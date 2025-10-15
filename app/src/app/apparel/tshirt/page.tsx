import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getTShirtProducts } from './actions';

export default async function TShirtPage() {
  // Fetch only t-shirt products using the specialized server action
  const products = await getTShirtProducts();
  
  // Log the products to verify they're properly serialized
  console.log('TShirtPage: T-shirt products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
