import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getLaptopProducts } from './actions';

export default async function LaptopPage() {
  // Fetch only laptop products using the specialized server action
  const products = await getLaptopProducts();
  
  // Log the products to verify they're properly serialized
  console.log('LaptopPage: Laptop products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
