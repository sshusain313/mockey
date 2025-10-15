import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getGamingPadProducts } from './actions';

export default async function GamingPadPage() {
  // Fetch only gaming pad products using the specialized server action
  const products = await getGamingPadProducts();
  
  // Log the products to verify they're properly serialized
  console.log('GamingPadPage: Gaming pad products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
