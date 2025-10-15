import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getSweatshirtProducts } from './actions';

export default async function SweatshirtPage() {
  // Fetch only sweatshirt products using the specialized server action
  const products = await getSweatshirtProducts();
  
  // Log the products to verify they're properly serialized
  console.log('SweatshirtPage: Sweatshirt products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
