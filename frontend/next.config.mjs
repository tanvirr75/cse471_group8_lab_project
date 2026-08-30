/** @type {import('next').NextConfig} */
const nextConfig = {
  // Rely directly on absolute NEXT_PUBLIC_API_URL for fetching data
  // to avoid Vercel rewrite 500 HTML errors when proxying to external backends.
};

export default nextConfig;
