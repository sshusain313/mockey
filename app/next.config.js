/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Expose Razorpay keys as public environment variables
    NEXT_PUBLIC_RAZORPAY_KEY_ID_TEST: 'rzp_test_5LysgPNccoRNtkXYJsqylwn80TgOzQY8OcC6c0',
    // Set environment to test mode
    RAZORPAY_ENV: 'test',
  },
  images: {
    // Migrate from deprecated `images.domains` to `images.remotePatterns`
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  // Disable ESLint during build for production
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
