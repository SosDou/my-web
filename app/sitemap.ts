import type { MetadataRoute } from "next";
import { htmlLangMap, locales } from "@/i18n/config";
import { siteConfig } from "@/config/site";

// 不包含语言前缀的公开页面
const routes = [
  {
    path: "",
    changeFrequency: "monthly",
    priority: 1,
  },
  {
    path: "/about",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/tools",
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    path: "/articles",
    changeFrequency: "weekly",
    priority: 0.8,
  },
] as const;

// 生成网站地图
export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap((route) => {
    // 生成当前页面的所有语言版本地址
    const languages = Object.fromEntries(
      locales.map((locale) => [
        htmlLangMap[locale],
        `${siteConfig.url}/${locale}${route.path}`,
      ]),
    );

    return locales.map((locale) => ({
      // 当前语言页面地址
      url: `${siteConfig.url}/${locale}${route.path}`,

      // 页面预计更新频率
      changeFrequency: route.changeFrequency,

      // 页面相对重要程度
      priority: route.priority,

      // 当前页面的其他语言版本
      alternates: {
        languages,
      },
    }));
  });
}