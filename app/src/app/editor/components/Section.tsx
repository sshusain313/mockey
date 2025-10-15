'use client';

import { useEffect, useState } from 'react';
import Edit from './Edit';
import Ai from './Ai';

export default function Section() {
  const [activeTab, setActiveTab] = useState<'edit' | 'mockup'>('mockup');

  useEffect(() => {
    const handleSidebarChange = (event: CustomEvent<{ tab: 'edit' | 'mockup' }>) => {
      setActiveTab(event.detail.tab);
    };

    window.addEventListener('sidebarChange', handleSidebarChange as EventListener);

    return () => {
      window.removeEventListener('sidebarChange', handleSidebarChange as EventListener);
    };
  }, []);

  return (
    <div className="bg-red-300 ">
      {activeTab === 'edit' ? (
        <Edit /> // Render Edit component
      ) : (
        <Ai />
      )}
    </div>
  );
}
