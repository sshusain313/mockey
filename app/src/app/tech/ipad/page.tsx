import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getIPadProducts } from './actions';

export default async function IPadPage() {
  // Fetch only iPad products using the specialized server action
  const products = await getIPadProducts();
  
  // Log the products to verify they're properly serialized
  console.log('IPadPage: iPad products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
