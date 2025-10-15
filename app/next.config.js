/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Expose Razorpay keys as public environment variables
    NEXT_PUBLIC_RAZORPAY_KEY_ID_TEST: 'rzp_test_5LysgPNccoRNtkXYJsqylwn80TgOzQY8OcC6c0',
    // Set environment to test mode
    RAZORPAY_ENV: 'test',
  },
  images: {
    domains: ['res.cloudinary.com', 'lh3.googleusercontent.com'],
  },
  // Updated configuration for external packages
  serverExternalPackages: ['pdf-lib'],
  // Disable ESLint during build for production
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
