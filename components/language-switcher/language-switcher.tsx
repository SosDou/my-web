import Link from "next/link";
import styles from "./language-switcher.module.css";
import { PageProps, localeConfig } from "@/i18n/config";
import { translation } from "@/i18n/translation";
import { Globe } from "lucide-react";

// 语言选择器组件
export async function LanguageSwitcher({ params }: PageProps) {
    // 获取当前语言翻译内容
    const t = await translation(params);

    // 使用原生 details 元素管理菜单展开状态
    return (

        // details 作为语言选择器的根元素，同时为下拉菜单提供定位参照
        <details className={styles.root} name="navbar-menu">

            {/* summary 是原生可点击和可通过键盘操作的菜单触发器 */}
            <summary
                className={styles.trigger}
                aria-label={t.navbar.languageswitcher.trigger}
                title={t.navbar.languageswitcher.trigger}
            >
                <Globe size={20} strokeWidth={2} aria-hidden="true" />
            </summary>

            {/* nav 表示菜单中的链接是一组语言导航 */}
            <nav
                className={styles.menu}
                role="menu"
                aria-label={t.navbar.languageswitcher.menu}
            >

                {/* 直接读取项目唯一的语言配置生成所有语言选项 */}
                {localeConfig.map(({ locale, label, htmlLang }) => (

                    // 根据 locale 自动生成语言路由，不需要在配置中额外维护 href
                    <Link
                        // locale 本身唯一且稳定，可以直接作为 React 列表键
                        key={locale}

                        // 将 URL 语言标识转换为对应的根路由，例如 /cn-zh
                        href={`/${locale}`}

                        // 告诉搜索引擎这个链接对应的标准语言
                        hrefLang={htmlLang}

                        // 设置链接内容使用的标准语言，方便浏览器和辅助技术识别
                        lang={htmlLang}

                        // 应用语言菜单项的局部样式
                        className={styles.item}
                    >
                        {/* 显示 localeConfig 中维护的语言名称 */}
                        {label}
                    </Link>
                ))}
            </nav>
        </details>
    );
}