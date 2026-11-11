import type { PageProps } from "@/i18n/config";
import { translation } from "@/i18n/translation";
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";

type ToolListItem = {
    // 工具的跳转地址
    href: string;

    // 工具的显示名称
    title: string;

    // 工具的描述信息
    description: string;
};

export default async function Tools({ params }: PageProps) {
    const { lang } = await params;
    const translations = await translation(params, "tools");

    // 工具列表
    const tools: readonly ToolListItem[] = [
        {
            href: `/${lang}/tools/eeg-to-hypnogram`,
            title: translations.eegToHypnogram.title,
            description: translations.eegToHypnogram.description,
        },
    ];

    return (
        <section className="page-container page-shell w-full">
            <h1 className="page-title text-[var(--ds-color-foreground)]">{translations.title}</h1>

            <ul className="list-panel w-full list-none p-0" aria-label={translations.title}>
                {tools.map(({ href, title, description }) => (
                    <li className="border-t border-[var(--color-border)] first:border-t-0" key={href}>
                        <Link
                            className="list-panel-link group text-inherit no-underline focus-visible:relative focus-visible:z-[1]"
                            href={href}
                        >

                            <span className="flex min-w-0 flex-1 flex-col gap-2">
                                <span className="w-fit text-ds-body font-semibold text-link group-hover:text-[var(--ds-color-link-hover)] group-hover:underline group-hover:underline-offset-[3px]">{title}</span>
                                <span className="text-ds-body-sm text-muted-foreground">{description}</span>
                            </span>

                            <LuChevronRight
                                className="h-[18px] w-[18px] shrink-0 text-[var(--color-text-secondary)] transition-transform duration-[var(--ds-motion-fast)] ease-in-out group-hover:translate-x-0.5"
                                aria-hidden="true"
                            />
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
