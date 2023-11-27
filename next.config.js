/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "tialabs-api.tiapod.tiacloud.dev",
      "tialabsbackendstorage.blob.core.windows.net",
    ],
  },
  env: {
    NEXT_PUBLIC_BE_URL: process.env.NEXT_PUBLIC_BE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
};

module.exports = nextConfig;
