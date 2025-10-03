/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/app/project02',
  // This is important - ensures API routes work correctly
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: []
    }
  },
}

export default nextConfig;
