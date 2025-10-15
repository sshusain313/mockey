import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getBottleProducts } from './actions';

export default async function BottlePage() {
  // Fetch only bottle products using the specialized server action
  const products = await getBottleProducts();
  
  // Log the products to verify they're properly serialized
  console.log('BottlePage: Bottle products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
