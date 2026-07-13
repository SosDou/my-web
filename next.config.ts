import type { NextConfig } from 'next';
import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());

const nextConfig: NextConfig = {
    // 关闭 Next.js 的开发指示器
    devIndicators: false,
};

export default nextConfig;
