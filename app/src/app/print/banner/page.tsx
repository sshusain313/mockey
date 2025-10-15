import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getBannerProducts } from './actions';

export default async function BannerPage() {
  // Fetch only banner products using the specialized server action
  const products = await getBannerProducts();
  
  // Log the products to verify they're properly serialized
  console.log('BannerPage: Banner products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
