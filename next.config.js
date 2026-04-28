/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Security headers — applied to all routes
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",            value: "nosniff" },
          { key: "X-Frame-Options",                   value: "DENY" },
          { key: "X-XSS-Protection",                  value: "1; mode=block" },
          { key: "Referrer-Policy",                   value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",                value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },

  // Redirect /payment → Flutterwave (optional convenience redirect)
  async redirects() {
    const flutterwaveLink = process.env.NEXT_PUBLIC_FLUTTERWAVE_LINK;
    if (!flutterwaveLink || flutterwaveLink === "#payment") return [];
    return [
      {
        source: "/payment",
        destination: flutterwaveLink,
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
