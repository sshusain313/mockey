import React from 'react';
import { TShirtMockupLayout } from './components/TShirtMockupLayout';
import { getPhoneCoverProducts, debugAllSubcategories } from './actions';

export default async function PhoneCoverPage() {
  // First, debug all available categories and subcategories
  await debugAllSubcategories();
  
  // Fetch only phone cover products using the specialized server action
  const products = await getPhoneCoverProducts();
  
  // Log the products to verify they're properly serialized
  console.log('PhoneCoverPage: Phone cover products fetched:', products.length);
  
  // Log a sample product if available
  if (products.length > 0) {
    console.log('Sample phone cover product:', {
      _id: products[0]._id,
      name: products[0].name,
      category: products[0].category,
      subcategory: products[0].subcategory,
      placeholder: products[0].placeholder
    });
  }
  
  return (
    <div>
      <TShirtMockupLayout products={products} />
    </div>
  );
}
