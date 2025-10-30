/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove eslint config (no longer supported in Next.js 16)
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  images: {
    unoptimized: true,
    // Remove domains (deprecated) - use only remotePatterns
    // domains: ['localhost'],
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
  
  // Move serverComponentsExternalPackages out of experimental
  serverExternalPackages: ['fs', 'path', 'bcryptjs'],
  
  // Remove the experimental block with serverComponentsExternalPackages
  // experimental: {
  //   serverComponentsExternalPackages: ['fs', 'path', 'bcryptjs'],
  // },
  
  // Add turbopack config to resolve the error
  turbopack: {
    // Empty config to silence the error, or add turbopack-specific options
  },
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        stream: false,
        crypto: false,
      }
    }
    
    // Handle file uploads and buffer
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
  
  // Increase body size limit for file uploads (if needed)
  // experimental: {
  //   serverComponentsExternalPackages: [], // Remove this line entirely
  // },
}

export default nextConfig