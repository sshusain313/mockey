import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getHoodieProducts } from './actions';

export default async function HoodiePage() {
  // Fetch only hoodie products using the specialized server action
  const products = await getHoodieProducts();
  
  // Log the products to verify they're properly serialized
  console.log('HoodiePage: Hoodie products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
