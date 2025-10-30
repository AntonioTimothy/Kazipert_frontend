/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove deprecated eslint config
  // eslint configuration is now handled separately
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  images: {
    unoptimized: true,
    // Remove deprecated domains - use only remotePatterns
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  
  // Move serverComponentsExternalPackages to root level (no longer in experimental)
  serverExternalPackages: ['fs', 'path', 'bcryptjs'],
  
  // Remove the entire experimental block with serverComponentsExternalPackages
  // experimental: {
  //   serverComponentsExternalPackages: ['fs', 'path', 'bcryptjs'],
  // },
  
  // Add empty turbopack config to resolve the error
  turbopack: {},
  
  // Webpack configuration (kept for compatibility)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        stream: false,
        crypto: false,
      }
    }
    
    config.resolve.alias = {
      ...config.resolve.alias,
      sharp$: false,
      'onnxruntime-node$': false,
    }
    
    return config
  },
  
  // Allow serving static files from uploads directory
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, OPTIONS',
          },
        ],
      },
    ]
  },
  
  reactStrictMode: true,
}

export default nextConfig