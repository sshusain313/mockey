import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getNecklaceProducts } from './actions';

export default async function NecklacePage() {
  // Fetch only necklace products using the specialized server action
  const products = await getNecklaceProducts();
  
  // Log the products to verify they're properly serialized
  console.log('NecklacePage: Necklace products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
