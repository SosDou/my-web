"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuGlobe } from "react-icons/lu";
import styles from "./language-switcher.module.css";

type LocaleItem = {
    locale: string;
    label: string;
    htmlLang: string;
};

interface LanguageSwitcherClientProps {
    localeConfig: readonly LocaleItem[];
    triggerLabel: string;
    menuLabel: string;
}

export function LanguageSwitcherClient({
    localeConfig,
    triggerLabel,
    menuLabel,
}: LanguageSwitcherClientProps) {
    const pathname = usePathname();

    // 只替换 URL 的第一个路径段，也就是当前语言
    function getLocalizedPath(targetLocale: string) {
        const segments = pathname.split("/");

        if (segments.length > 1) {
            segments[1] = targetLocale;
        }

        return segments.join("/") || `/${targetLocale}`;
    }

    return (
        <details className={styles.root} name="navbar-menu">
            <summary
                className={styles.trigger}
                aria-label={triggerLabel}
                title={triggerLabel}
            >
                <LuGlobe size={20} aria-hidden="true" />
            </summary>

            <nav
                className={styles.menu}
                role="menu"
                aria-label={menuLabel}
            >
                {localeConfig.map(({ locale, label, htmlLang }) => (
                    <Link
                        key={locale}
                        href={getLocalizedPath(locale)}
                        hrefLang={htmlLang}
                        lang={htmlLang}
                        className={styles.item}
                    >
                        {label}
                    </Link>
                ))}
            </nav>
        </details>
    );
}