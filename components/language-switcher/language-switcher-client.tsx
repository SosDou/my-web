"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuGlobe } from "react-icons/lu";
import { buttonVariants, Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
        <details className="relative inline-block" name="navbar-menu">
            <summary
                className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "cursor-pointer list-none rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-background-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current [&::-webkit-details-marker]:hidden",
                )}
                aria-label={triggerLabel}
                title={triggerLabel}
            >
                <LuGlobe
                    className="h-5 w-5 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.6]"
                    aria-hidden="true"
                />
            </summary>

            <nav
                className="absolute right-0 top-[calc(100%+6px)] z-10 w-max rounded-md border border-[var(--color-border)] bg-[var(--color-overlay-background)] p-1 shadow-[var(--color-overlay-shadow)]"
                role="menu"
                aria-label={menuLabel}
            >
                {localeConfig.map(({ locale, label, htmlLang }) => (
                    <Button
                        key={locale}
                        render={(
                            <Link
                                href={getLocalizedPath(locale)}
                                hrefLang={htmlLang}
                                lang={htmlLang}
                            />
                        )}
                        nativeButton={false}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start whitespace-nowrap rounded px-2 py-1.5 text-[var(--color-text)] no-underline hover:bg-[var(--color-background-hover)] focus-visible:bg-[var(--color-background-hover)]"
                    >
                        {label}
                    </Button>
                ))}
            </nav>
        </details>
    );
}
