'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Download } from 'lucide-react';
import InvoiceGenerator from '../components/InvoiceGenerator';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('paymentId');
  const planName = searchParams.get('planName') || 'PRO';
  const amount = searchParams.get('amount') ? parseInt(searchParams.get('amount') as string) : 41000;
  const isLifetime = searchParams.get('isLifetime') === 'true';
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
      {/* Success toast notification */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center">
          <CheckCircle className="mr-2 h-5 w-5" />
          Payment successful!
        </div>
      )}

      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your payment has been processed successfully.
        </p>
        
        {paymentId && (
          <div className="bg-gray-100 p-4 rounded-md mb-6">
            <p className="text-sm text-gray-500 mb-1">Payment Reference</p>
            <p className="font-mono text-gray-800">{paymentId}</p>
          </div>
        )}
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            You can download your invoice by clicking the button below:
          </p>
          
          {paymentId && (
            <InvoiceGenerator
              paymentData={{
                paymentId,
                planName,
                amount,
                isLifetime,
                date: new Date().toLocaleDateString(),
                customerName: 'Customer',
                customerEmail: 'customer@example.com'
              }}
            />
          )}
        </div>
        
        <div className="flex flex-col space-y-3">
          <Link 
            href="/pricing"
            className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
          >
            Return to Pricing
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
