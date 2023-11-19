/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['sharp', 'onnxruntime-node'],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "huggingface.co",
      },
      {
        protocol: "https",
        hostname: "aeiljuispo.cloudimg.io",
      },
    ],
  },
}

module.exports = nextConfig
