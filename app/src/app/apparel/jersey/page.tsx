import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getJerseyProducts } from './actions';

export default async function JerseyPage() {
  // Fetch only jersey products using the specialized server action
  const products = await getJerseyProducts();
  
  // Log the products to verify they're properly serialized
  console.log('JerseyPage: Jersey products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
