import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getApronProducts } from './actions';

export default async function ApronPage() {
  // Fetch only apron products using the specialized server action
  const products = await getApronProducts();
  
  // Log the products to verify they're properly serialized
  console.log('ApronPage: Apron products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
