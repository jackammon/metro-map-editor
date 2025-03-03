/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: 'export',
  // Disable image optimization during build to keep files under size limit
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Handle the 'canvas' module issue
    if (isServer) {
      // This makes it not try to load the canvas module on the server
      config.externals = [...(config.externals || []), 'canvas', 'konva'];
    }
    // Reduce webpack bundle size
    config.optimization.minimize = true;
    
    return config;
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
