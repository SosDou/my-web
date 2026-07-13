import { NextRequest, NextResponse } from "next/server";
import { locales } from "./i18n/config";
import { getLocale } from "./i18n/utils/get-locale";

export async function middleware(request: NextRequest) {
    // 获取请求路径
    const { pathname } = request.nextUrl

    // 判断请求路径中是否包含可用的语言环境
    const pathnameHasLocale = locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`))

    // 如果请求路径中包含可用的语言环境，则直接返回请求
    if (pathnameHasLocale) {
        return NextResponse.next()
    }

    // 获取请求中的语言环境
    const locale = await getLocale()

    // 克隆请求的 URL 对象
    const url = request.nextUrl.clone()

    // 将请求路径中的语言环境替换为获取到的语言环境
    url.pathname = `/${locale}${pathname}`

    // 重写请求路径并返回响应
    return NextResponse.redirect(url)
}

// 配置代理规则
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
    ],
}