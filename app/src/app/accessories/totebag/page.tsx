import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getTotebagProducts } from './actions';

export default async function TotebagPage() {
  // Fetch only totebag products using the specialized server action
  const products = await getTotebagProducts();
  
  // Log the products to verify they're properly serialized
  console.log('TotebagPage: Totebag products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
