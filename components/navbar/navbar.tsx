import Link from "next/link";
import type { PageProps } from "@/i18n/config";
import { translation } from "@/i18n/translation";
import styles from "./navbar.module.css";
import { LanguageSwitcher } from "../language-switcher/language-switcher";

// 导出异步导航栏组件，并复用项目已有的 PageProps。
export default async function Navbar({ params }: PageProps) {
  // 获取当前语言环境。
  const { lang } = await params;

  // 获取当前语言翻译内容。
  const t = await translation(params);

  // 集中定义导航链接。
  const links = [
    {
      href: `/${lang}`,
      label: t.navbar.home,
    },
    {
      href: `/${lang}/tools`,
      label: t.navbar.tools,
    },
    {
      href: `/${lang}/articles`,
      label: t.navbar.articles,
    },
  ] as const;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* 左侧 Logo。 */}
        <Link className={styles.logo} href={`/${lang}`}>
          Tomorin
        </Link>

        {/* 偏左侧的主要导航链接。 */}
        <nav className={styles.nav} aria-label={t.navbar.label}>
          {links.map(({ href, label }) => (
            <Link className={styles.link} href={href} key={href}>
              {label}
            </Link>
          ))}
        </nav>

        {/* 右侧功能按钮区域。 */}
        <div className={styles.actions}>
          <LanguageSwitcher params={params} />
        </div>
      </div>
    </header>
  );
}