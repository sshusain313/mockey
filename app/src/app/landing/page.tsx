import React from 'react';
import { MockupHero } from './components/MockupHero';
import { MockupLayout } from './components/MockupLayout';
import { MockupGrid } from './components/MockupGrid';

const page = () => {
  return (
    <div>
      <MockupHero />
      <MockupGrid />
      <MockupLayout />
    </div>
  );
};

export default page;
