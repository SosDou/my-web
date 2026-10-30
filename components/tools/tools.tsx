import type { PageProps } from "@/i18n/config";
import { translation } from "@/i18n/translation";
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";
import "./tools.css";

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
        <section className="tools-page page-container">
            <h1 className="tools-page__title">{translations.title}</h1>

            <ul className="tools-list" aria-label={translations.title}>
                {tools.map(({ href, title, description }) => (
                    <li className="tools-list__item" key={href}>
                        <Link className="tools-list__link" href={href}>

                            <span className="tools-list__content">
                                <span className="tools-list__name">{title}</span>
                                <span className="tools-list__description">{description}</span>
                            </span>

                            <LuChevronRight
                                className="tools-list__arrow"
                                aria-hidden="true"
                            />
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
