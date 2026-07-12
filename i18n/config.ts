// 定义单个语言配置必须具备的结构，仅用于约束配置格式
type LocaleDefinition = {
  // URL 中使用的语言标识，例如 /cn-zh
  locale: string;

  // 语言选择菜单中显示的名称
  label: string;

  // HTML lang 属性使用的标准语言标识
  htmlLang: string;

  // 浏览器可能返回的语言标识
  browserLocales: readonly string[];
};

// 整个项目唯一需要手动维护的语言配置
export const localeConfig = [
  // 简体中文配置
  {
    // URL 路由语言标识
    locale: "cn-zh",

    // 语言菜单显示名称
    label: "简体中文",

    // HTML 标准语言标识
    htmlLang: "zh-CN",

    // 可以识别为简体中文的浏览器语言
    browserLocales: ["zh-cn", "zh-sg", "zh-hans"],
  },

  // 美式英语配置
  {
    // URL 路由语言标识
    locale: "us-en",

    // 语言菜单显示名称
    label: "English",

    // HTML 标准语言标识
    htmlLang: "en-US",

    // 可以识别为美式英语的浏览器语言
    browserLocales: ["en-us"],
  },
] as const satisfies readonly LocaleDefinition[];

// 从 localeConfig 自动生成 Locale 类型，不需要手动维护联合类型
export type Locale = (typeof localeConfig)[number]["locale"];

// 从 localeConfig 自动生成所有可用语言列表
export const locales = localeConfig.map(({ locale }) => locale);

// 从 localeConfig 自动生成 URL 语言与 HTML 语言的映射
export const htmlLangMap = Object.fromEntries(
  // 将每项配置转换为 [URL语言, HTML语言]
  localeConfig.map(({ locale, htmlLang }) => [locale, htmlLang]),
) as Record<Locale, string>;

// 从 localeConfig 自动生成浏览器语言映射
export const browserLocaleMap = Object.fromEntries(
  // 遍历每个项目语言
  localeConfig.flatMap(({ locale, browserLocales }) =>
    // 将一个项目语言对应的多个浏览器语言展开成键值对
    browserLocales.map(
      (browserLocale) => [browserLocale, locale] as const,
    ),
  ),
) as Record<string, Locale>;

// 默认语言环境
export const defaultLocale: Locale = 'us-en';

// 判断是否未可用的语言环境
export function isLocale(value: string): value is Locale {
    return locales.includes(value as Locale);
}

// 定义通用的 params 类型
export type PageParams = {
    lang: string
};

// 定义页面组件的 props 类型
export type PageProps = {
    params: Promise<PageParams>
};