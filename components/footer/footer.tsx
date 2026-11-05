import Link from "next/link";
import type { PageProps } from "@/i18n/config";
import { translation } from "@/i18n/translation";
import { siteConfig } from "@/config/site";
import type { IconType } from "react-icons";
import { LuMail, LuGithub } from "react-icons/lu";

// 单个二级链接的数据结构
type SecondaryLink = {
    // 二级链接的跳转地址
    href?: string;

    // 二级链接显示的文字
    label: string;

    // 文字左边的图标
    icon?: IconType;
};

// 定义 Footer 单个栏目的数据结构
type FooterSection = {
    // 一级链接的跳转地址
    href?: string;

    // 一级链接显示的文字
    label: string;

    // 文字左边的图标
    icon?: IconType;

    // 二级链接，没有二级链接时可以省略
    links?: readonly SecondaryLink[];

    // 当前栏目的网格位置样式
    className: string;
};

// Footer 组件
export default async function Footer({ params }: PageProps) {
    const { lang } = await params;
    const footer = await translation(params, "footer");
    const sections: readonly FooterSection[] = [
        // 工具
        {
            href: `/${lang}/tools`,
            label: footer.tools.label,
            className: "col-start-2 max-[720px]:col-start-1",
            links: [
                // EEG to Hypnogram
                {
                    href: `/${lang}/tools/eeg-to-hypnogram`,
                    label: footer.tools.eegToHypnogram.label,
                }
            ],
        },

        // 联系我
        {
            label: footer.contact.label,
            className: "col-start-4 max-[720px]:col-start-3",
            links: [
                {
                    label: 'Sos_Dou@qq.com',
                    icon: LuMail,
                },
                {
                    href: 'https://github.com/SosDou',
                    label: 'GitHub',
                    icon: LuGithub,
                },
            ],
        },
    ];

    // 返回网站底部区域
    return (
        <footer className="w-full border-t border-[var(--color-border)] bg-[var(--color-background)]">
            <nav
                className="mx-auto grid w-full max-w-[var(--layout-max-width)] grid-cols-4 gap-8 px-[var(--layout-padding-inline)] py-12 max-[720px]:grid-cols-3 max-[720px]:gap-x-4 max-[720px]:gap-y-8 max-[720px]:px-[var(--layout-padding-inline-mobile)] max-[720px]:py-8"
                aria-label={footer.label}
            >
                <Link
                    className="col-start-1 w-fit self-start text-lg font-semibold text-[var(--color-text)] no-underline hover:underline hover:underline-offset-4 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-current max-[720px]:col-span-full"
                    href={`/${lang}`}
                >
                    {siteConfig.myName}
                </Link>
                {sections.map(({ href, label, icon: Icon, links, className }) => (
                    <section
                        className={`flex min-w-0 flex-col items-start gap-[14px] ${className}`}
                        key={`${className}-${label}`}
                    >
                        {href ? (
                            <Link
                                className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[var(--color-text)] no-underline hover:underline hover:underline-offset-4 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-current"
                                href={href}
                            >
                                {Icon ? <Icon className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
                                {label}
                            </Link>
                        ) : (
                            <span className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[var(--color-text)]">
                                {Icon ? <Icon className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
                                {label}
                            </span>
                        )}
                        {links?.length ? (
                            <ul className="m-0 flex list-none flex-col gap-2 p-0">
                                {links.map(({ href: linkHref, label: linkLabel, icon: LinkIcon }) => (
                                    <li key={linkLabel}>
                                        {linkHref ? (
                                            <Link
                                                className="inline-flex w-fit items-center gap-2 text-sm font-normal text-[var(--color-text-secondary)] no-underline hover:underline hover:underline-offset-4 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-current"
                                                href={linkHref}
                                            >
                                                {LinkIcon ? <LinkIcon className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
                                                {linkLabel}
                                            </Link>
                                        ) : (
                                            <span className="inline-flex w-fit items-center gap-2 text-sm font-normal text-[var(--color-text-secondary)]">
                                                {LinkIcon ? <LinkIcon className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
                                                {linkLabel}
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </section>
                ))}
            </nav>
        </footer>
    );
}
