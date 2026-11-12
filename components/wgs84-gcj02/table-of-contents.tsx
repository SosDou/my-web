import type { Dictionary } from "@/i18n/dictionaries/types";

type TableOfContentsItem = {
    id: string;
    label: string;
    level: 1 | 2 | 3;
};

type TableOfContentsProps = {
    translations: Dictionary["wgs84Gcj02"];
};

export function TableOfContents({ translations }: TableOfContentsProps) {
    const { sections } = translations;
    const tableOfContents: TableOfContentsItem[] = [
        { id: "article-title", label: translations.title, level: 1 },
        { id: "what-is-wgs84-gcj02", label: sections.overview.title, level: 2 },
        { id: "wgs84-gcj02-differences", label: sections.differences.title, level: 2 },
        { id: "wgs84-gcj02-conversion", label: sections.conversion.title, level: 2 },
        { id: "conversion-explanation", label: sections.explanation.title, level: 2 },
        { id: "conversion-constants", label: sections.constants.title, level: 3 },
        { id: "coordinate-offset-formulas", label: sections.offsetFormulas.title, level: 3 },
        { id: "wgs84-to-gcj02", label: sections.forward.title, level: 3 },
        { id: "gcj02-to-wgs84", label: sections.inverse.title, level: 3 },
        { id: "wait-why", label: sections.origins.title, level: 2 },
        { id: "part-polynomial", label: sections.polynomial.title, level: 3 },
        { id: "part-square-root", label: sections.squareRoot.title, level: 3 },
        { id: "part-sine-disturbance", label: sections.sine.title, level: 3 },
    ];

    return (
        <aside
            aria-label={translations.tableOfContents.ariaLabel}
            className="fixed left-[calc(50%+412px)] top-24 z-10 max-h-[calc(100vh-7.5rem)] w-max min-w-52 max-w-[calc(50vw-428px)] overflow-y-auto max-[1279px]:hidden"
        >
            <nav className="border-l border-[var(--color-border)] pl-4">
                <p className="mb-3 text-sm font-semibold text-[var(--color-text)]">
                    {translations.tableOfContents.title}
                </p>
                <ol className="space-y-2">
                    {tableOfContents.map((item) => (
                        <li
                            key={item.id}
                            className={item.level === 2 ? "pl-3" : item.level === 3 ? "pl-6" : undefined}
                        >
                            <a
                                href={`#${item.id}`}
                                className="block break-words text-sm leading-5 text-[var(--color-text-secondary)] no-underline transition-colors hover:text-[var(--color-text)]"
                            >
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ol>
            </nav>
        </aside>
    );
}
