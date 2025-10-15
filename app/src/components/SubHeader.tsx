import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface SubHeaderProps {
  title: string;
  showBackButton?: boolean;
  backUrl?: string;
}

const SubHeader: React.FC<SubHeaderProps> = ({ 
  title, 
  showBackButton = false,
  backUrl = "/admin/products" 
}) => {
  return (
    <div className="w-full bg-gradient-to-r from-black to-gray-900 text-white px-6 py-5 flex items-center justify-between shadow-md">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex items-center space-x-4">
        <div className="flex items-center text-sm bg-white/10 px-3 py-1.5 rounded-full">
          <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2"></span>
          Admin User
        </div>
        {showBackButton && (
          <Link href={backUrl}>
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default SubHeader;
