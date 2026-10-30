import "./HypnogramPainter.css";
import type { Dictionary } from "@/i18n/dictionaries/types";

// HypnogramPainter 组件的属性
type HypnogramPainterProps = {
    csvResult: string;
    translations: Dictionary["eegToHypnogram"]["hypnogram"];
};

type HypnogramTranslations = HypnogramPainterProps["translations"];

// 睡眠阶段类型
type SleepStage = "W" | "REM" | "N1" | "N2" | "N3";

// HypnogramEpoch 类型表示一个睡眠阶段的时间段
type HypnogramEpoch = {

    // 该阶段的索引
    epochIndex: number;

    // 该阶段的起始时间（以秒为单位）
    startSeconds: number;

    // 该阶段的持续时间（以秒为单位）
    durationSeconds: number;

    // 该阶段的睡眠阶段类型
    stage: SleepStage;
};

// HypnogramPainter 组件的解析结果类型
type ParseResult =
    | { epochs: HypnogramEpoch[]; error: null }
    | { epochs: null; error: string };

// Hypnogram CSV 文件的预期标题行
const EXPECTED_HEADER = [
    "epoch_index",
    "start_seconds",
    "duration_seconds",
    "stage_id",
    "stage",
];

// SleepStage 的顺序
const STAGES: SleepStage[] = ["W", "REM", "N1", "N2", "N3"];

// 将阶段 ID 映射为 SleepStage 类型
const STAGE_BY_ID: Record<number, SleepStage> = {
    0: "W",
    1: "N1",
    2: "N2",
    3: "N3",
    4: "REM",
};

// SVG 视图框和绘图区域的尺寸
const VIEWBOX_WIDTH = 1200;
const VIEWBOX_HEIGHT = 420;
const PLOT_LEFT = 76;
const PLOT_RIGHT = 28;
const PLOT_TOP = 28;
const PLOT_BOTTOM = 58;

function parseCsvLine(line: string): string[] | null {
    const fields: string[] = [];
    let field = "";
    let inQuotes = false;

    for (let index = 0; index < line.length; index += 1) {
        const character = line[index];

        if (character === '"') {
            if (inQuotes && line[index + 1] === '"') {
                field += '"';
                index += 1;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (character === "," && !inQuotes) {
            fields.push(field.trim());
            field = "";
        } else {
            field += character;
        }
    }

    if (inQuotes) {
        return null;
    }

    fields.push(field.trim());
    return fields;
}

function formatTranslation(
    template: string,
    values: Record<string, string | number>,
): string {
    return Object.entries(values).reduce(
        (formatted, [key, value]) =>
            formatted.replaceAll(`{${key}}`, String(value)),
        template,
    );
}

function parseHypnogramCsv(
    csvResult: string,
    translations: HypnogramTranslations["errors"],
): ParseResult {
    const lines = csvResult
        .replace(/^\uFEFF/, "")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

    if (lines.length < 2) {
        return {
            epochs: null,
            error: translations.noEpochData,
        };
    }

    const header = parseCsvLine(lines[0]);
    if (
        !header ||
        header.length !== EXPECTED_HEADER.length ||
        header.some((field, index) => field !== EXPECTED_HEADER[index])
    ) {
        return {
            epochs: null,
            error: formatTranslation(translations.invalidHeader, {
                header: EXPECTED_HEADER.join(","),
            }),
        };
    }

    const epochs: HypnogramEpoch[] = [];

    for (let lineIndex = 1; lineIndex < lines.length; lineIndex += 1) {
        const fields = parseCsvLine(lines[lineIndex]);
        if (!fields || fields.length !== EXPECTED_HEADER.length) {
            return {
                epochs: null,
                error: formatTranslation(translations.invalidRow, {
                    row: lineIndex + 1,
                }),
            };
        }

        const epochIndex = Number(fields[0]);
        const startSeconds = Number(fields[1]);
        const durationSeconds = Number(fields[2]);
        const stageId = Number(fields[3]);
        const stage = fields[4].toUpperCase() as SleepStage;

        if (
            !Number.isInteger(epochIndex) ||
            epochIndex < 0 ||
            !Number.isFinite(startSeconds) ||
            startSeconds < 0 ||
            !Number.isFinite(durationSeconds) ||
            durationSeconds <= 0 ||
            !Number.isInteger(stageId) ||
            STAGE_BY_ID[stageId] !== stage
        ) {
            return {
                epochs: null,
                error: formatTranslation(translations.invalidValues, {
                    row: lineIndex + 1,
                }),
            };
        }

        const previousEpoch = epochs.at(-1);
        if (previousEpoch && startSeconds < previousEpoch.startSeconds) {
            return {
                epochs: null,
                error: formatTranslation(translations.unorderedTimes, {
                    row: lineIndex + 1,
                }),
            };
        }

        epochs.push({
            epochIndex,
            startSeconds,
            durationSeconds,
            stage,
        });
    }

    return { epochs, error: null };
}

function formatTime(seconds: number): string {
    const roundedSeconds = Math.max(0, Math.round(seconds));
    const hours = Math.floor(roundedSeconds / 3600);
    const minutes = Math.floor((roundedSeconds % 3600) / 60);

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}`;
    }

    const remainingSeconds = roundedSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function HypnogramPainter({
    csvResult,
    translations,
}: HypnogramPainterProps) {
    const parsedResult = parseHypnogramCsv(csvResult, translations.errors);

    if (parsedResult.epochs === null) {
        return (
            <div className="hypnogram-error" role="alert">
                {parsedResult.error}
            </div>
        );
    }

    const epochs = parsedResult.epochs;
    const firstStart = epochs[0].startSeconds;
    const lastEnd = epochs.reduce(
        (latestEnd, epoch) =>
            Math.max(latestEnd, epoch.startSeconds + epoch.durationSeconds),
        firstStart,
    );
    const timeSpan = Math.max(lastEnd - firstStart, 1);
    const plotWidth = VIEWBOX_WIDTH - PLOT_LEFT - PLOT_RIGHT;
    const plotHeight = VIEWBOX_HEIGHT - PLOT_TOP - PLOT_BOTTOM;
    const stageSpacing = plotHeight / (STAGES.length - 1);
    const xForTime = (seconds: number) =>
        PLOT_LEFT + ((seconds - firstStart) / timeSpan) * plotWidth;
    const yForStage = (stage: SleepStage) =>
        PLOT_TOP + STAGES.indexOf(stage) * stageSpacing;

    let path = "";
    let previousEnd: number | null = null;

    epochs.forEach((epoch) => {
        const startX = xForTime(epoch.startSeconds);
        const end = epoch.startSeconds + epoch.durationSeconds;
        const endX = xForTime(end);
        const y = yForStage(epoch.stage);
        const isContinuous =
            previousEnd !== null &&
            Math.abs(epoch.startSeconds - previousEnd) < 0.001;

        path += isContinuous
            ? ` V ${y} H ${endX}`
            : ` M ${startX} ${y} H ${endX}`;
        previousEnd = end;
    });

    const tickCount = 6;
    const ticks = Array.from({ length: tickCount + 1 }, (_, index) => {
        const ratio = index / tickCount;
        return {
            x: PLOT_LEFT + ratio * plotWidth,
            seconds: firstStart + ratio * timeSpan,
        };
    });

    return (
        <figure className="hypnogram-figure">
            <div className="hypnogram-chart-scroll">
                <svg
                    className="hypnogram-chart"
                    viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
                    role="img"
                    aria-labelledby="hypnogram-title hypnogram-description"
                >
                    <title id="hypnogram-title">{translations.title}</title>
                    <desc id="hypnogram-description">
                        {formatTranslation(translations.description, {
                            count: epochs.length,
                        })}
                    </desc>

                    <rect
                        className="hypnogram-plot-background"
                        x={PLOT_LEFT}
                        y={PLOT_TOP}
                        width={plotWidth}
                        height={plotHeight}
                    />

                    {STAGES.map((stage) => {
                        const y = yForStage(stage);
                        return (
                            <g key={stage}>
                                <line
                                    className="hypnogram-grid-line"
                                    x1={PLOT_LEFT}
                                    x2={PLOT_LEFT + plotWidth}
                                    y1={y}
                                    y2={y}
                                />
                                <text
                                    className="hypnogram-stage-label"
                                    x={PLOT_LEFT - 16}
                                    y={y}
                                >
                                    {translations.stages[stage]}
                                </text>
                            </g>
                        );
                    })}

                    {ticks.map((tick, index) => (
                        <g key={index}>
                            <line
                                className="hypnogram-tick-line"
                                x1={tick.x}
                                x2={tick.x}
                                y1={PLOT_TOP}
                                y2={PLOT_TOP + plotHeight}
                            />
                            <text
                                className="hypnogram-time-label"
                                x={tick.x}
                                y={PLOT_TOP + plotHeight + 28}
                            >
                                {formatTime(tick.seconds - firstStart)}
                            </text>
                        </g>
                    ))}

                    <path className="hypnogram-stage-path" d={path.trim()} />

                    <text
                        className="hypnogram-axis-title"
                        x={PLOT_LEFT + plotWidth / 2}
                        y={VIEWBOX_HEIGHT - 8}
                    >
                        {translations.timeAxis}
                    </text>
                </svg>
            </div>
            <figcaption className="hypnogram-caption">
                {formatTranslation(translations.summary, {
                    count: epochs.length,
                    duration: formatTime(timeSpan),
                })}
            </figcaption>
        </figure>
    );
}
