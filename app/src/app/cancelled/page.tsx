'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function CancelledPage() {
  const [showToast, setShowToast] = useState(true);

  useEffect(() => {
    // Hide toast after 5 seconds
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      {/* Error toast notification */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center">
          <XCircle className="mr-2 h-5 w-5" />
          Payment was not completed
        </div>
      )}

      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="h-8 w-8 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
        
        <p className="text-gray-600 mb-6">
          Your payment was not completed. No charges have been made to your account.
        </p>
        
        <p className="text-gray-600 mb-6">
          If you encountered any issues during the payment process, please contact our support team.
        </p>
        
        <div className="flex flex-col space-y-3">
          <Link 
            href="/pricing"
            className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
          >
            Try Again
          </Link>
          
          <Link 
            href="/"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
