// Razorpay client-side configuration

// Environment detection
const isTestMode = process.env.RAZORPAY_ENV === 'test' || true; // Default to test mode for safety

// Helper function to get the appropriate Razorpay key based on environment
export function getRazorpayClientKey() {
  // In test mode, use test key; otherwise use production key
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID_TEST || 'rzp_test_uEEEREXlcrVyzx';
}

// Export the key for use in components
export const RAZORPAY_CLIENT_KEY = getRazorpayClientKey();
