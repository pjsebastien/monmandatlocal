import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration SEO-optimisée
  poweredByHeader: false,
  compress: true,
  trailingSlash: false,

  // Configuration des images externes (WordPress)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.blog.monmandatlocal.fr",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "blog.monmandatlocal.fr",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.monmandatlocal.fr",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "monmandatlocal.fr",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
        pathname: "/avatar/**",
      },
    ],
  },
};

export default nextConfig;
