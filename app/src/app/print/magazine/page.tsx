import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getMagazineProducts } from './actions';

export default async function MagazinePage() {
  // Fetch only magazine products using the specialized server action
  const products = await getMagazineProducts();
  
  // Log the products to verify they're properly serialized
  console.log('MagazinePage: Magazine products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
