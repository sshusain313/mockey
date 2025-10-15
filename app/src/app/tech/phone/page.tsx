import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getPhoneProducts } from './actions';

export default async function PhonePage() {
  // Fetch only Phone products using the specialized server action
  const products = await getPhoneProducts();
  
  // Log the products to verify they're properly serialized
  console.log('PhonePage: Phone products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
