import Link from "next/link";
import type { PageProps } from "@/i18n/config";
import { translation } from "@/i18n/translation";
import styles from "./footer.module.css";

// 定义单个二级链接的数据结构
type SecondaryLink = {
    // 定义二级链接的跳转地址
    href: string;

    // 定义二级链接显示的文字
    label: string;
};

// 定义 Footer 单个栏目的数据结构
type FooterSection = {
    // 定义栏目一级链接的跳转地址
    href: string;

    // 定义栏目一级链接显示的文字
    label: string;

    // 定义可选的二级链接，没有二级链接时可以省略
    links?: readonly SecondaryLink[];

    // 定义当前栏目的网格位置样式
    className: string;
};

// Footer 组件
export default async function Footer({ params }: PageProps) {
    // 获取当前路由中的语言标识
    const { lang } = await params;

    // 获取当前语言的翻译内容
    const t = await translation(params);

    // 集中定义 Footer 中显示的栏目
    const sections: readonly FooterSection[] = [
        // 定义工具栏目
        {
            // 设置工具一级入口的跳转地址
            href: `/${lang}/tools`,

            // 设置工具一级入口的翻译文本
            label: t.footer.tools.label,

            // 设置工具栏目在网格中的位置
            className: styles.tools,

            // 当前没有二级链接，因此不需要声明 links
        },

        // 定义文章栏目
        {
            // 设置文章一级入口的跳转地址
            href: `/${lang}/articles`,

            // 设置文章一级入口的翻译文本
            label: t.footer.articles.label,

            // 设置文章栏目在网格中的位置
            className: styles.articles,

            // 当前没有二级链接，因此不需要声明 links
        },
    ];

    // 返回网站底部区域
    return (
        // footer 表示页面的底部信息区域
        <footer className={styles.footer}>

            {/* nav 表示 Footer 中包含一组页面导航链接 */}
            <nav className={styles.inner} aria-label={t.footer.label}>

                {/* Logo 同时作为返回当前语言首页的链接 */}
                <Link className={styles.logo} href={`/${lang}`}>

                    {/* 显示网站名称 */}
                    Tomorin
                </Link>

                {/* 根据栏目配置生成工具和文章区域 */}
                {sections.map(({ href, label, links, className }) => (

                    // section 表示一个独立的 Footer 导航栏目
                    <section

                        // 合并栏目公共样式和对应的网格位置样式
                        className={`${styles.section} ${className}`}

                        // 使用一级链接地址作为稳定的列表键
                        key={href}
                    >
                        {/* 一级链接使用主要链接样式 */}
                        <Link className={styles.primaryLink} href={href}>
                            {/* 显示当前栏目的名称 */}
                            {label}
                        </Link>

                        {/* 只有存在二级链接时才渲染二级列表 */}
                        {links?.length ? (

                            // 使用无序列表表达同一栏目下的一组二级链接
                            <ul className={styles.subList}>

                                {/* 根据二级链接配置生成列表项 */}
                                {links.map((link) => (

                                    // 使用二级链接地址作为稳定的列表键
                                    <li key={link.href}>

                                        {/* 二级链接使用较弱的文字样式 */}
                                        <Link
                                            className={styles.secondaryLink}
                                            href={link.href}
                                        >

                                            {/* 显示二级链接名称 */}
                                            {link.label}
                                        </Link>
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