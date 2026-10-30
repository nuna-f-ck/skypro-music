import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  // Мы убрали сломанное правило для правил CSS, теперь Turbopack будет читать .module.css как положено по умолчанию
};

export default nextConfig;
