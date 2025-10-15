'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const demoPages = [
    { path: '/demo/draggable-design', label: 'Draggable Design' },
    { path: '/demo/custom-placeholder', label: 'Custom Shape Placeholder' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-pink-600">
              KnockUp Mockup Editor
            </Link>
            
            <nav className="flex space-x-4">
              {demoPages.map((page) => (
                <Link
                  key={page.path}
                  href={page.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === page.path
                      ? 'bg-pink-100 text-pink-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {page.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>
      
      <main>{children}</main>
      
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-500 text-sm">
            KnockUp Mockup Editor Demo - Enhanced Design Positioning
          </p>
        </div>
      </footer>
    </div>
  );
}
