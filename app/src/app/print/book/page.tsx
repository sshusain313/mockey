import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getBookProducts } from './actions';

export default async function BookPage() {
  // Fetch only book products using the specialized server action
  const products = await getBookProducts();
  
  // Log the products to verify they're properly serialized
  console.log('BookPage: Book products fetched:', products.length);
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
