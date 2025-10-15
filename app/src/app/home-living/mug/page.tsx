import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getMugProducts } from './actions';

export default async function MugPage() {
  // Fetch only mug products using the specialized server action
  const products = await getMugProducts();
  
  // Log the products to verify they're properly serialized
  console.log('MugPage: Mug products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
