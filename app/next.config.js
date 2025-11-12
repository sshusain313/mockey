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
  // Optimize webpack for faster compilation
  webpack: (config, { isServer }) => {
    // Exclude heavy canvas libraries from server-side bundle
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'canvas': 'commonjs canvas',
        'fabric': 'commonjs fabric',
        'konva': 'commonjs konva',
        'react-konva': 'commonjs react-konva',
      });
    }

    // Optimize module resolution
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
      },
    };

    // Reduce bundle size by optimizing node_modules
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
    };

    return config;
  },
  // Enable experimental features for faster builds
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // Reduce compilation overhead
  swcMinify: true,
  // Compress output
  compress: true,
};

module.exports = nextConfig;
