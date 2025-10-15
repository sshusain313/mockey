import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getDropperBottleProducts } from './actions';

export default async function DropperBottlePage() {
  // Fetch only dropper bottle products using the specialized server action
  const products = await getDropperBottleProducts();
  
  // Log the products to verify they're properly serialized
  console.log('DropperBottlePage: Dropper bottle products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
