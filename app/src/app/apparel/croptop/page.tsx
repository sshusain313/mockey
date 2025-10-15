import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getCroptopProducts } from './actions';

export default async function CroptopPage() {
  // Fetch only crop top products using the specialized server action
  const products = await getCroptopProducts();
  
  // Log the products to verify they're properly serialized
  console.log('CroptopPage: Crop top products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
