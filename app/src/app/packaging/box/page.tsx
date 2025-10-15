import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getBoxProducts } from './actions';

export default async function BoxPage() {
  // Fetch only box products using the specialized server action
  const products = await getBoxProducts();
  
  // Log the products to verify they're properly serialized
  console.log('BoxPage: Box products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
