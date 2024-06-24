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
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.module.rules.push({
        test: /\.csv$/,
        loader: "csv-loader",
        options: {
          dynamicTyping: true,
          header: true,
          skipEmptyLines: true,
        },
      });
    }
    return config;
  },
  rewrites: () => [
    // {
    //   source: "/api/v1/user/image/list/",
    //   destination: `https://tialabs-api.tiapod.tiacloud.dev/api/v1/user/image/list/`,
    // },
    {
      source: "/api/v1/:path*/",
      destination: `${process.env.NEXT_PUBLIC_BE_URL}/:path*/`,
    },
  ],
  trailingSlash: true,

  async headers() {
    return [
      {
        source: "/api/v1/:path*",
        headers: [
          {
            key: "cache-control",
            value: "no-cache",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
