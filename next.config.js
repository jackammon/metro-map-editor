/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'canvas', 'konva'];
    }
    config.optimization.minimize = true;
    return config;
  },
  reactStrictMode: false,
  // Handle module resolution for static export
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
