import Link from "next/link";
import type { PageProps } from "@/i18n/config";
import { translation } from "@/i18n/translation";
import { LanguageSwitcher } from "../language-switcher/language-switcher";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import ThemeSwitcher from "../theme-switcher/theme-switcher";

// 导航栏组件
export default async function Navbar({ params }: PageProps) {
  // 获取当前语言环境
  const { lang } = await params;

  // 获取当前语言翻译内容
  const navbar = await translation(params, "navbar");

  // 集中定义导航链接
  const links = [
    {
      href: `/${lang}`,
      label: navbar.home,
    },
    {
      href: `/${lang}/articles`,
      label: navbar.articles,
    },
    {
      href: `/${lang}/tools`,
      label: navbar.tools,
    },
  ] as const;

  return (
    <header className="w-full border-b border-[var(--color-border)] bg-[var(--color-background)]">
      <div className="mx-auto flex min-h-16 w-full max-w-[var(--layout-max-width)] items-center px-[var(--layout-padding-inline)] max-sm:min-h-14 max-sm:px-[var(--layout-padding-inline-mobile)]">

        {/* 左侧 Logo */}
        <Link className="shrink-0 text-xl font-semibold leading-none text-[var(--color-text)] no-underline" href={`/${lang}`}>
          {siteConfig.myName}
        </Link>

        {/* 偏左侧的主要导航链接 */}
        <nav className="ml-10 flex items-center gap-2 max-sm:ml-4 max-sm:gap-0.5" aria-label={navbar.label}>
          {links.map(({ href, label }) => (
            <Button
              render={<Link href={href} />}
              nativeButton={false}
              variant="ghost"
              className="h-auto rounded-md px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] no-underline transition-colors duration-150 ease-in-out hover:bg-[var(--color-background-hover)] hover:text-[var(--color-text)] max-sm:px-2"
              key={href}
            >
              {label}
            </Button>
          ))}
        </nav>

        {/* 右侧功能按钮区域 */}
        <div className="ml-auto flex shrink-0 items-center gap-2 max-sm:gap-1">

          {/* 语言切换器 */}
          <LanguageSwitcher params={params} />

          {/* 主题切换器 */}
          <ThemeSwitcher params={params} />
        </div>
      </div>
    </header>
  );
}
