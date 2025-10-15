'use client';

import Link from 'next/link';
import { ChevronLeft } from 'react-feather';

interface SubHeaderProps {
  title: string;
  showBackButton?: boolean;
  backUrl?: string;
}

export default function SubHeader({ title, showBackButton = false, backUrl = '/admin/products' }: SubHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          {showBackButton && (
            <Link href={backUrl} className="mr-4 text-white hover:text-gray-200 transition-colors">
              <ChevronLeft size={24} />
            </Link>
          )}
          <h1 className="text-2xl font-bold text-white">{title}</h1>
        </div>
        <div className="flex items-center">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
            <span className="text-white text-sm">Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
}
