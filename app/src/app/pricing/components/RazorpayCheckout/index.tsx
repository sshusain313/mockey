'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Define the Razorpay window interface
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayCheckoutProps {
  planName: string;
  amount: number; // Amount in paise (e.g., ₹100 = 10000 paise)
  buttonText?: string;
  buttonClassName?: string;
  isLifetime?: boolean;
  isTestMode?: boolean;
  testAmount?: number;
}

const RazorpayCheckout: React.FC<RazorpayCheckoutProps> = ({
  planName,
  amount,
  buttonText,
  buttonClassName,
  isLifetime = false,
  isTestMode = false,
  testAmount,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const router = useRouter();

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('Razorpay script loaded successfully');
      setIsScriptLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!isScriptLoaded) {
      console.error('Razorpay script not loaded yet');
      return;
    }

    setIsLoading(true);

    try {
      // Create order on the server
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: isTestMode && testAmount ? testAmount : amount,
          currency: 'INR',
          receipt: `receipt_order_${Date.now()}`,
          notes: {
            planName,
            isLifetime: isLifetime ? 'true' : 'false',
            isTestMode: isTestMode ? 'true' : 'false',
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await response.json();
      
      if (!orderData.id) {
        throw new Error('Invalid order data received');
      }

      // Initialize Razorpay
      const options = {
        key: orderData.key_id, // Razorpay Key ID from environment
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Mockey',
        description: `Payment for ${planName} Plan`,
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            // Verify payment on server
            const verifyResponse = await fetch('/api/payment-success', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                planName,
                amount: orderData.amount,
                isLifetime,
                customerName: 'Customer', // This should be dynamic in a real app
                customerEmail: 'customer@example.com', // This should be dynamic in a real app
              }),
            });

            if (!verifyResponse.ok) {
              console.error('Payment verification failed with status:', verifyResponse.status);
              const errorText = await verifyResponse.text();
              console.error('Error details:', errorText);
              throw new Error('Payment verification failed');
            }

            const verifyData = await verifyResponse.json();
            console.log('Payment successful:', response.razorpay_payment_id);
            // Redirect to success page with all necessary data for invoice generation
            router.push(`/success?paymentId=${response.razorpay_payment_id}&planName=${encodeURIComponent(planName)}&amount=${orderData.amount}&isLifetime=${isLifetime}`);
          } catch (error) {
            console.error('Payment verification error:', error);
            // Still redirect to success page for testing purposes with all necessary data
            router.push(`/success?paymentId=${response.razorpay_payment_id}&planName=${encodeURIComponent(planName)}&amount=${orderData.amount}&isLifetime=${isLifetime}`);
          }
        },
        prefill: {
          name: 'Customer Name', // This should be dynamic in a real app
          email: 'customer@example.com', // This should be dynamic in a real app
          contact: '9999999999', // This should be dynamic in a real app
        },
        notes: {
          planName,
          isLifetime: isLifetime ? 'true' : 'false',
        },
        theme: {
          color: '#F37254',
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading || !isScriptLoaded}
      className={buttonClassName || 'w-full py-2 px-4 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50'}
    >
      {isLoading ? 'Processing...' : buttonText || 'Pay Now'}
    </button>
  );
};

export default RazorpayCheckout;
