import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getTubeProducts } from './actions';

export default async function TubePage() {
  // Fetch only tube products using the specialized server action
  const products = await getTubeProducts();
  
  // Log the products to verify they're properly serialized
  console.log('TubePage: Tube products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
