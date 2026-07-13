// 网站正式域名
const domain = "www.mikurin.fun";

// 网站公共配置
export const siteConfig = {
  myName: "Tomorin",

  // 不包含协议的域名，用于需要纯域名的场景
  domain,

  // 完整的网站地址，用于 Metadata、Sitemap 和 Robots
  url: `https://${domain}`,
} as const;