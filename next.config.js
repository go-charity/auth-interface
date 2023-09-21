/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: true,
      },
      {
        source: "/api/:path*",
        // destination: "https://auth-server.gocharity.com.ng/:path*",
        destination: process.env.AUTH_BACKEND_HOST,
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
