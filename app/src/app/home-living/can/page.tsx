import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getCanProducts } from './actions';

export default async function CanPage() {
  // Fetch only can products using the specialized server action
  const products = await getCanProducts();
  
  // Log the products to verify they're properly serialized
  console.log('CanPage: Can products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
