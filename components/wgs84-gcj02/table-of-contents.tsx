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
        { id: "conversion-explanation", label: "转换方法详细解释", level: 2 },
        { id: "conversion-constants", label: "一、常量", level: 3 },
        { id: "coordinate-offset-formulas", label: "二、坐标偏移计算公式", level: 3 },
        { id: "wgs84-to-gcj02", label: "三、WGS-84 转换为 GCJ-02", level: 3 },
        { id: "gcj02-to-wgs84", label: "四、GCJ-02 反算为 WGS-84", level: 3 },
        { id: "wait-why", label: "等一下！这些公式是怎么来的？", level: 2 }
    ];

    return (
        <aside
            aria-label="文章目录"
            className="fixed left-[calc(50%+412px)] top-24 z-10 max-h-[calc(100vh-7.5rem)] w-max min-w-52 max-w-[calc(50vw-428px)] overflow-y-auto max-[1279px]:hidden"
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
