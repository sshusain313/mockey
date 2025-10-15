import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getJacketProducts } from './actions';

export default async function JacketPage() {
  // Fetch only jacket products using the specialized server action
  const products = await getJacketProducts();
  
  // Log the products to verify they're properly serialized
  console.log('JacketPage: Jacket products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
