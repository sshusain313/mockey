import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getScarfProducts } from './actions';

export default async function ScarfPage() {
  // Fetch only scarf products using the specialized server action
  const products = await getScarfProducts();
  
  // Log the products to verify they're properly serialized
  console.log('ScarfPage: Scarf products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
