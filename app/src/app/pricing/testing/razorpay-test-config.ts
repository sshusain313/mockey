// Test configuration for Razorpay integration

// Test keys
export const RAZORPAY_TEST_KEY_ID = 'rzp_test_uEEEREXlcrVyzx';
export const RAZORPAY_TEST_KEY_SECRET = 'C8ol7Ovs9NhoGjkmpjwGgOaM';

// Test plans with small amounts for testing
export const TEST_PLANS = [
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
    testAmount: 100, // ₹1 for testing
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
    testAmount: 200, // ₹2 for testing
  },
];
