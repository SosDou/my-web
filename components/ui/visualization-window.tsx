"use client";

import { useId, useState, type ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/i18n/dictionaries/types";

export type VisualizationWindowView<ViewId extends string = string> = {
    id: ViewId;
    label: string;
    title: string;
    description?: string;
    icon?: ReactNode;
    resettable?: boolean;
};

export type VisualizationWindowProps<ViewId extends string> = {
    translations: Dictionary["visualizationWindow"];
    views: readonly VisualizationWindowView<ViewId>[];
    children: ReactNode;
    activeViewId?: ViewId;
    defaultViewId?: ViewId;
    onViewChange?: (viewId: ViewId) => void;
    onResetView?: (viewId: ViewId) => void;
    name?: ReactNode;
    tabListLabel?: string;
    resetLabel?: string;
    className?: string;
    viewportClassName?: string;
};

export function VisualizationWindow<ViewId extends string>({
    translations,
    views,
    children,
    activeViewId,
    defaultViewId,
    onViewChange,
    onResetView,
    name,
    tabListLabel,
    resetLabel,
    className,
    viewportClassName,
}: VisualizationWindowProps<ViewId>) {
    const titleId = useId();
    const tabListId = useId();
    const [internalViewId, setInternalViewId] = useState<ViewId | undefined>(
        defaultViewId ?? views[0]?.id,
    );
    const selectedViewId = activeViewId ?? internalViewId;
    const selectedView = views.find((view) => view.id === selectedViewId) ?? views[0];

    if (!selectedView) return null;

    function selectView(viewId: ViewId) {
        if (activeViewId === undefined) setInternalViewId(viewId);
        onViewChange?.(viewId);
    }

    return (
        <section
            className={cn(
                "overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-[var(--color-overlay-shadow)]",
                className,
            )}
            aria-labelledby={titleId}
        >
            <header className="border-b border-[var(--color-border)] px-4 pb-3 pt-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
                            {name ?? translations.name}
                        </p>
                        <h3 id={titleId} className="mt-1 text-lg font-semibold leading-6">
                            {selectedView.title}
                        </h3>
                    </div>

                    {selectedView.resettable && onResetView && (
                        <button
                            type="button"
                            onClick={() => onResetView(selectedView.id)}
                            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-background-hover)] hover:text-[var(--color-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                            aria-label={resetLabel ?? translations.resetLabel}
                            title={resetLabel ?? translations.resetLabel}
                        >
                            <RotateCcw aria-hidden="true" className="size-4" />
                        </button>
                    )}
                </div>

                <div
                    id={tabListId}
                    className="mt-3 flex gap-1 rounded-lg bg-[var(--color-background-secondary)] p-1"
                    role="tablist"
                    aria-label={tabListLabel ?? translations.tabListLabel}
                >
                    {views.map((view) => {
                        const selected = view.id === selectedView.id;
                        const tabId = `${tabListId}-${view.id}`;
                        const panelId = `${tabListId}-panel`;

                        return (
                            <button
                                key={view.id}
                                id={tabId}
                                type="button"
                                role="tab"
                                aria-selected={selected}
                                aria-controls={panelId}
                                tabIndex={selected ? 0 : -1}
                                onClick={() => selectView(view.id)}
                                className={cn(
                                    "inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-2 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
                                    selected
                                        ? "bg-[var(--color-overlay-background)] text-[var(--color-text)] shadow-sm"
                                        : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]",
                                )}
                            >
                                {view.icon}
                                <span className="truncate">{view.label}</span>
                            </button>
                        );
                    })}
                </div>
            </header>

            <div
                id={`${tabListId}-panel`}
                role="tabpanel"
                aria-labelledby={`${tabListId}-${selectedView.id}`}
                className={cn("relative h-[350px] max-sm:h-[320px]", viewportClassName)}
            >
                {children}
            </div>

            {selectedView.description && (
                <footer className="border-t border-[var(--color-border)] px-4 py-3">
                    <p className="text-xs leading-5 text-[var(--color-text-secondary)]">
                        {selectedView.description}
                    </p>
                </footer>
            )}
        </section>
    );
}
