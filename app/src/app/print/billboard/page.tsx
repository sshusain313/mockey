import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getBillboardProducts } from './actions';

export default async function BillboardPage() {
  // Fetch only billboard products using the specialized server action
  const products = await getBillboardProducts();
  
  // Log the products to verify they're properly serialized
  console.log('BillboardPage: Billboard products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
