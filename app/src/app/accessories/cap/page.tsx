import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getCapProducts } from './actions';

export default async function CapPage() {
  // Fetch only cap products using the specialized server action
  const products = await getCapProducts();
  
  // Log the products to verify they're properly serialized
  console.log('CapPage: Cap products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
