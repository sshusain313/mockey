import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getFlyerProducts } from './actions';

export default async function FlyerPage() {
  // Fetch only flyer products using the specialized server action
  const products = await getFlyerProducts();
  
  // Log the products to verify they're properly serialized
  console.log('FlyerPage: Flyer products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
