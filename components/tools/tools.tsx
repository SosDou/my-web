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
        <section className="page-container w-full py-10 pb-16 [--tools-link-color:#0969da] [--tools-link-hover-color:#0550ae] dark:[--tools-link-color:#58a6ff] dark:[--tools-link-hover-color:#79c0ff] max-sm:py-7 max-sm:pb-12">
            <h1 className="m-0 text-[clamp(28px,4vw,36px)] font-semibold leading-tight tracking-[-0.02em] text-[var(--color-text)]">{translations.title}</h1>

            <ul className="mx-auto mt-10 w-[min(100%,760px)] list-none overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-background)] p-0 max-sm:mt-7" aria-label={translations.title}>
                {tools.map(({ href, title, description }) => (
                    <li className="border-t border-[var(--color-border)] first:border-t-0" key={href}>
                        <Link
                            className="group flex min-h-24 items-center gap-4 p-5 px-6 text-inherit no-underline transition-colors duration-[120ms] ease-in-out hover:bg-[var(--color-background-secondary)] focus-visible:relative focus-visible:z-[1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--tools-link-color)] focus-visible:outline-offset-[-2px] max-sm:min-h-[88px] max-sm:gap-3 max-sm:p-4"
                            href={href}
                        >

                            <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                                <span className="w-fit text-base font-semibold leading-[1.4] text-[var(--tools-link-color)] group-hover:text-[var(--tools-link-hover-color)] group-hover:underline group-hover:underline-offset-[3px]">{title}</span>
                                <span className="text-sm leading-normal text-[var(--color-text-secondary)]">{description}</span>
                            </span>

                            <LuChevronRight
                                className="h-[18px] w-[18px] shrink-0 text-[var(--color-text-secondary)] transition-transform duration-[120ms] ease-in-out group-hover:translate-x-0.5"
                                aria-hidden="true"
                            />
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
