import { browserLocaleMap, defaultLocale, isLocale, Locale } from "./config";
import { cookies, headers } from "next/headers";

// 获取本地语言环境
export async function getLocale(): Promise<Locale> {
    // 获取 cookie 对象
    const cookieStore = await cookies();

    // 获取 cookie 中的语言环境
    const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;

    // 如果请求中的语言环境为可用的语言环境，则返回该语言环境
    if (cookieLocale && isLocale(cookieLocale)) {
        return cookieLocale;
    }

    // 获取请求头对象
    const headersList = await headers();

    // 获取请求头中的语言环境
    const acceptLanguage = headersList.get('accept-language')?.toLowerCase() ?? ''

    // 解析请求头中的语言环境
    const languages = acceptLanguage.split(',').map((item) => item.split(';')[0]?.trim()).filter(Boolean);

    for (const language of languages) {
        // 将请求头中的语言环境转化为标准格式，例如将 "zh_CN" 转化为 "zh-cn"
        const normalizedLanguage = language.replace('_', '-');

        // 根据映射关系获取可用的语言环境
        const matchedLocale = browserLocaleMap[normalizedLanguage];

        // 如果请求头中的语言环境为可用的语言环境，则返回该语言环境
        if (matchedLocale) {
            return matchedLocale;
        }
    }

    // 如果请求头中的语言环境都不可用，则返回默认语言环境
    return defaultLocale;
}