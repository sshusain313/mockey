'use client';

import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import PricingTable from './components/PricingTable';
import Enterprise from './components/Enterprise';
import Plans from './components/Plans';
import Tweets from './components/Tweets';
import Credits from './components/Credits';
import Faqs from './components/Faqs';
import GetStarted from './components/GetStarted';
import RazorpayCheckout from './components/RazorpayCheckout';
import TestModeToggle from './components/TestModeToggle';
import { TEST_PLANS } from './testing/razorpay-test-config';


// Define the plan type to include optional testAmount property
interface Plan {
  name: string;
  icon: string;
  price: string;
  oldPrice: string | null;
  subtext: string;
  features: string[];
  button: string;
  highlight: string | boolean;
  bg: string;
  isLifetime?: boolean;
  testAmount?: number; // Optional test amount for test mode
}

const plans: Plan[] = [
  {
    name: 'FREE',
    icon: '🆓',
    price: '$0/mo',
    oldPrice: null,
    subtext: 'No Billing',
    features: [
      '1000+ Free Mockups',
      'New Mockups Every Week',
      'JPG File Format',
    ],
    button: 'Done',
    highlight: false,
    bg: 'bg-white',
  },
  {
    name: 'PRO',
    icon: '🟠',
    price: '$4.1/mo',
    oldPrice: '$7/mo',
    subtext: 'Billed yearly',
    features: [
      'Everything in FREE +',
      'PNG File Format',
      'PRO Mockups',
      'High Quality Download',
      'Mockup Bundles',
      'Multiple Design Upload',
      'Exclusive Backgrounds',
      'No Ads',
      'Unlimited Downloads',
    ],
    button: 'Upgrade to PRO',
    highlight: 'Most Popular',
    bg: 'bg-white',
  },
  {
    name: 'LIFE TIME PRO',
    icon: '💎',
    price: '$199',
    oldPrice: null,
    subtext: 'One Time\nBuy once, use forever',
    features: [
      'Everything in PRO +',
      'Use Forever',
      'Lifetime Updates',
      'Priority Support',
    ],
    button: 'Upgrade to Lifetime PRO',
    highlight: false,
    bg: 'bg-gradient-to-b from-[#3b82f6] to-[#0f172a] text-white',
    isLifetime: true,
  },
];

export default function Pricing() {
  const [isTestMode, setIsTestMode] = useState(false);
  const [activePlans, setActivePlans] = useState(plans);
  
  // Handle test mode toggle
  const handleTestModeToggle = (testMode: boolean) => {
    setIsTestMode(testMode);
    setActivePlans(testMode ? TEST_PLANS : plans);
    console.log(`Test mode ${testMode ? 'enabled' : 'disabled'}`);
    
    // Save test mode preference to localStorage
    localStorage.setItem('razorpay_test_mode', testMode.toString());
  };
  
  // Initialize from localStorage on client-side
  useEffect(() => {
    const savedMode = localStorage.getItem('razorpay_test_mode');
    if (savedMode === 'true') {
      setIsTestMode(true);
      setActivePlans(TEST_PLANS);
    }
  }, []);
  
  return (
    <div
      className="min-h-screen py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8"
    >
      <div className="flex flex-col items-center text-center mx-auto mb-8 max-w-4xl">
        <span className="font-bricolage text-3xl sm:text-4xl md:text-5xl lg:text-[48px] leading-tight md:leading-[48px] font-bold tracking-normal text-gray-950">
          Unlock Magic With Mockey AI Premium Plans
        </span>
        <br />
        <span className="font-inter text-sm sm:text-base leading-normal sm:leading-6 font-normal tracking-normal text-gray-950 px-2 sm:px-4 md:px-8">
          Our Pro and Enterprise plans are crafted to cater to all your mockup and photography needs. Learn more about what we offer in our premium plans.
        </span>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {activePlans.map((plan, index) => (
          <div key={index} className={`${plan.bg} rounded-xl p-6 shadow-sm border border-gray-200 flex flex-col`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-3xl mb-2">{plan.icon}</span>
                <h3 className="text-xl font-semibold mt-2">{plan.name}</h3>
              </div>
              {plan.highlight && (
                <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full">
                  {plan.highlight}
                </span>
              )}
            </div>
            
            <div className="mb-4">
              <span className="text-2xl font-bold">{plan.price}</span>
              {plan.oldPrice && (
                <span className="text-gray-400 line-through ml-2">{plan.oldPrice}</span>
              )}
              {plan.subtext && (
                <p className="text-sm text-gray-500 mt-1">{plan.subtext}</p>
              )}
            </div>
            
            <ul className="mb-6 flex-grow">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            {plan.name === 'FREE' ? (
              <button 
                className="w-full py-2 px-4 rounded-lg font-medium bg-gray-100 text-gray-800"
              >
                {plan.button}
              </button>
            ) : (
              <RazorpayCheckout 
                planName={plan.name} 
                amount={plan.name === 'PRO' ? 4.1 * 100 * 100 : 199 * 100} // Convert dollars to paise (cents * 100)
                isTestMode={isTestMode}
                testAmount={plan.testAmount}
              />
            )}
          </div>
        ))}
      </div>
      
      {/* Test Mode Toggle */}
      <div className="max-w-7xl mx-auto mt-8 mb-4">
        <TestModeToggle 
          onToggle={handleTestModeToggle} 
          initialState={isTestMode} 
        />
      </div>

      <Enterprise />
      <div className="hidden md:block">
        <PricingTable />
      </div>
      <div className="block md:hidden text-center py-6 px-4">
        <p className="text-sm text-gray-600 mb-3">For detailed plan comparison, please view on a larger screen or tablet</p>
        <button className="bg-black text-white text-xs px-4 py-2 rounded-md">
          View all features
        </button>
      </div>
      <Plans />
      <Tweets />
      <Credits />
      <Faqs />
      <GetStarted />
    </div>
  );
}
