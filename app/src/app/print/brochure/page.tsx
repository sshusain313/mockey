import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getBrochureProducts } from './actions';

export default async function BrochurePage() {
  // Fetch only brochure products using the specialized server action
  const products = await getBrochureProducts();
  
  // Log the products to verify they're properly serialized
  console.log('BrochurePage: Brochure products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
