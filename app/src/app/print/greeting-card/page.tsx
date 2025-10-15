import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getGreetingCardProducts } from './actions';

export default async function GreetingCardPage() {
  // Fetch only greeting card products using the specialized server action
  const products = await getGreetingCardProducts();
  
  // Log the products to verify they're properly serialized
  console.log('GreetingCardPage: Greeting card products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
