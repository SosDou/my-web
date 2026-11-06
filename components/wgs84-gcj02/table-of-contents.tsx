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
    const tableOfContents: TableOfContentsItem[] = [
        { id: "article-title", label: translations.title, level: 1 },
        { id: "what-is-wgs84-gcj02", label: "什么是 WGS84 和 GCJ02", level: 2 },
        { id: "wgs84-gcj02-differences", label: "WGS84 与 GCJ02 的区别", level: 2 },
        { id: "wgs84-gcj02-conversion", label: "WGS84 与 GCJ02 的转换", level: 2 },
    ];

    return (
        <aside
            aria-label="文章目录"
            className="fixed left-[calc(50%+412px)] top-24 z-10 max-h-[calc(100vh-7.5rem)] w-52 overflow-y-auto max-[1279px]:hidden"
        >
            <nav className="border-l border-[var(--color-border)] pl-4">
                <p className="mb-3 text-sm font-semibold text-[var(--color-text)]">目录</p>
                <ol className="space-y-2">
                    {tableOfContents.map((item) => (
                        <li
                            key={item.id}
                            className={item.level === 2 ? "pl-3" : item.level === 3 ? "pl-6" : undefined}
                        >
                            <a
                                href={`#${item.id}`}
                                className="block text-sm leading-5 text-[var(--color-text-secondary)] no-underline transition-colors hover:text-[var(--color-text)]"
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
