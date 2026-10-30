import Link from "next/link";
import type { PageProps } from "@/i18n/config";
import { translation } from "@/i18n/translation";
import styles from "./footer.module.css";
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
    const t = await translation(params);
    const sections: readonly FooterSection[] = [
        // 工具
        {
            href: `/${lang}/tools`,
            label: t.footer.tools.label,
            className: styles.tools,
            links: [
                // EEG to Hypnogram
                {
                    href: `/${lang}/tools/eeg-to-hypnogram`,
                    label: t.footer.tools.eegToHypnogram.label,
                }
            ],
        },

        // 文章
        // {
        //     href: `/${lang}/articles`,
        //     label: t.footer.articles.label,
        //     className: styles.articles,
        // },

        // 联系我
        {
            label: t.footer.contact.label,
            className: styles.contact,
            links: [
                {
                    label: '1813962881@qq.com',
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
        <footer className={styles.footer}>
            <nav className={styles.inner} aria-label={t.footer.label}>
                <Link className={styles.logo} href={`/${lang}`}>
                    {siteConfig.myName}
                </Link>
                {sections.map(({ href, label, icon: Icon, links, className }) => (
                    <section
                        className={`${styles.section} ${className}`}
                        key={`${className}-${label}`}
                    >
                        {href ? (
                            <Link className={styles.primaryLink} href={href}>
                                {Icon ? <Icon className={styles.linkIcon} aria-hidden="true" /> : null}
                                {label}
                            </Link>
                        ) : (
                            <span className={styles.primaryLink}>
                                {Icon ? <Icon className={styles.linkIcon} aria-hidden="true" /> : null}
                                {label}
                            </span>
                        )}
                        {links?.length ? (
                            <ul className={styles.subList}>
                                {links.map(({ href: linkHref, label: linkLabel, icon: LinkIcon }) => (
                                    <li key={linkLabel}>
                                        {linkHref ? (
                                            <Link
                                                className={styles.secondaryLink}
                                                href={linkHref}
                                            >
                                                {LinkIcon ? <LinkIcon className={styles.linkIcon} aria-hidden="true" /> : null}
                                                {linkLabel}
                                            </Link>
                                        ) : (
                                            <span className={styles.secondaryLink}>
                                                {LinkIcon ? <LinkIcon className={styles.linkIcon} aria-hidden="true" /> : null}
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
