import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getIPhoneProducts } from './actions';

export default async function IPhonePage() {
  // Fetch only iPhone products using the specialized server action
  const products = await getIPhoneProducts();
  
  // Log the products to verify they're properly serialized
  console.log('IPhonePage: iPhone products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
