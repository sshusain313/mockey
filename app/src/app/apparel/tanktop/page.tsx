import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getTankTopProducts } from './actions';

export default async function TankTopPage() {
  // Fetch only tank top products using the specialized server action
  const products = await getTankTopProducts();
  
  // Log the products to verify they're properly serialized
  console.log('TankTopPage: Tank top products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
