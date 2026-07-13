import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

// 生成 robots.txt
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      // 适用于所有搜索引擎爬虫
      userAgent: "*",

      // 允许抓取整个网站
      allow: "/",
    },

    // 网站地图地址
    sitemap: `${siteConfig.url}/sitemap.xml`,

    // 网站正式主机地址
    host: siteConfig.url,
  };
}