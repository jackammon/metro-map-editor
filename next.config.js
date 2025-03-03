/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    // Handle the 'canvas' module issue
    if (isServer) {
      // This makes it not try to load the canvas module on the server
      config.externals = [...(config.externals || []), 'canvas', 'konva'];
    }
    return config;
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
