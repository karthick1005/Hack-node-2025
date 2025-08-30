/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suppress hydration warnings caused by browser extensions
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    // Suppress hydration warnings in development
    suppressHydrationWarning: true,
  },
  // Additional configuration for better development experience
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
