/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Read the target backend URL from .env, or fallback to the teammate's default (5002)
    const backendUrl = process.env.BACKEND_API_URL || 'http://127.0.0.1:5002';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ]
  },
}

export default nextConfig;
