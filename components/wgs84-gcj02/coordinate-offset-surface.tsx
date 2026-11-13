"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import {
    BufferGeometry,
    CanvasTexture,
    Color,
    DoubleSide,
    Float32BufferAttribute,
    SRGBColorSpace,
    Sprite,
    SpriteMaterial,
    Vector3,
} from "three";
import { VisualizationWindow } from "@/components/ui/visualization-window";
import type { Dictionary } from "@/i18n/dictionaries/types";
import { CHINA_BBOX, wgs84ToGcj02 } from "./transform";

type OffsetDirection = "longitude" | "latitude";
type SurfaceLabels = Dictionary["wgs84Gcj02"]["surface"];

const LONGITUDE_SEGMENTS = 660;
const LATITUDE_SEGMENTS = 88;
const SURFACE_WIDTH = 8;
const SURFACE_DEPTH = 6.7;
const SURFACE_HEIGHT = 3;
const CAMERA_POSITION: [number, number, number] = [9, -11, 8];
const CAMERA_TARGET: [number, number, number] = [0, 0, 1.4];
const COLOR_STOPS = ["#2563eb", "#22d3ee", "#fbbf24", "#f97316"];
const COLORS = COLOR_STOPS.map((color) => new Color(color));
const TICK_FRACTIONS = [0, 0.5, 1] as const;

type AxisTick = {
    axis: "x" | "y" | "z";
    position?: [number, number, number];
    labelPosition: [number, number, number];
    labelOffset?: [number, number];
    label: string;
    middle: boolean;
    title?: boolean;
};

type SurfaceData = {
    geometry: BufferGeometry;
    minimum: number;
    maximum: number;
};

type LabelTexture = {
    texture: CanvasTexture;
    width: number;
    height: number;
};

function createLabelTexture(tick: AxisTick): LabelTexture {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("A 2D canvas is required for axis labels.");

    const font = `${tick.title ? 600 : 500} 36px system-ui, sans-serif`;
    context.font = font;
    canvas.width = Math.ceil(context.measureText(tick.label).width) + 32;
    canvas.height = 64;
    context.font = font;
    context.textBaseline = "middle";
    context.fillStyle = "rgba(255, 255, 255, 0.94)";
    context.beginPath();
    context.roundRect(1, 1, canvas.width - 2, canvas.height - 2, 10);
    context.fill();
    context.fillStyle = tick.title ? "#0f172a" : "#334155";
    context.fillText(tick.label, 16, canvas.height / 2);

    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    const height = tick.title ? 0.54 : 0.46;
    return { texture, height, width: height * canvas.width / canvas.height };
}

function formatDegrees(value: number, digits: number): string {
    return `${Number(value.toFixed(digits))}°`;
}

function createAxisTicks(
    data: SurfaceData,
    direction: OffsetDirection,
    labels: SurfaceLabels,
): AxisTick[] {
    const xStart = -SURFACE_WIDTH / 2;
    const xEnd = SURFACE_WIDTH / 2;
    const yStart = -SURFACE_DEPTH / 2;
    const yEnd = SURFACE_DEPTH / 2;

    const ticks: AxisTick[] = TICK_FRACTIONS.flatMap((fraction) => {
        const x = xStart + fraction * SURFACE_WIDTH;
        const y = yStart + fraction * SURFACE_DEPTH;
        const z = 0.15 + fraction * SURFACE_HEIGHT;

        return [
            {
                axis: "x" as const,
                position: [x, yStart, 0] as [number, number, number],
                labelPosition: [x, yStart - (fraction === 0 ? 1.15 : 0.55), 0] as [number, number, number],
                label: formatDegrees(
                    CHINA_BBOX.minLng + fraction * (CHINA_BBOX.maxLng - CHINA_BBOX.minLng),
                    4,
                ),
                middle: fraction === 0.5,
            },
            {
                axis: "y" as const,
                position: [xStart, y, 0] as [number, number, number],
                labelPosition: fraction === 0
                    ? [xStart, yStart, 0]
                    : [xStart - 0.55, y, 0],
                labelOffset: fraction === 0 ? [38, -40] : undefined,
                label: formatDegrees(
                    CHINA_BBOX.minLat + fraction * (CHINA_BBOX.maxLat - CHINA_BBOX.minLat),
                    4,
                ),
                middle: fraction === 0.5,
            },
            {
                axis: "z" as const,
                position: [xStart, yStart, z] as [number, number, number],
                labelPosition: [xStart - (fraction === 0 ? 0.95 : 0.55), yStart, z] as [number, number, number],
                label: formatDegrees(data.minimum + fraction * (data.maximum - data.minimum), 5),
                middle: fraction === 0.5,
            },
        ];
    });

    return [
        ...ticks,
        {
            axis: "x",
            labelPosition: [xEnd, yStart, 0],
            labelOffset: [65, 0],
            label: `X ${labels.longitudeAxis}`,
            middle: false,
            title: true,
        },
        {
            axis: "y",
            labelPosition: [xStart - 0.8, yEnd + 1.5, 0.9],
            label: `Y ${labels.latitudeAxis}`,
            middle: false,
            title: true,
        },
        {
            axis: "z",
            labelPosition: [xStart - 0.55, yStart, SURFACE_HEIGHT + 0.9],
            label: `Z ${direction === "longitude" ? labels.longitudeOffsetAxis : labels.latitudeOffsetAxis}`,
            middle: false,
            title: true,
        },
    ];
}

function AxisLabels({ ticks }: { ticks: AxisTick[] }) {
    const textures = useMemo(
        () => typeof document === "undefined" ? [] : ticks.map(createLabelTexture),
        [ticks],
    );
    const sprites = useRef<(Sprite | null)[]>([]);
    const center = useMemo(() => new Vector3(), []);
    const corner = useMemo(() => new Vector3(), []);
    const cameraRight = useMemo(() => new Vector3(), []);
    const cameraUp = useMemo(() => new Vector3(), []);
    const { invalidate } = useThree();

    useEffect(() => () => textures.forEach(({ texture }) => texture.dispose()), [textures]);

    useEffect(() => invalidate(), [invalidate, textures]);

    useFrame(({ camera, size }) => {
        if (textures.length !== ticks.length) return;
        cameraRight.setFromMatrixColumn(camera.matrixWorld, 0);
        cameraUp.setFromMatrixColumn(camera.matrixWorld, 1);

        const rectangles = ticks.map((tick, index) => {
            const sprite = sprites.current[index];
            if (!sprite) return null;
            sprite.visible = size.width >= 608 || !(tick.middle || (tick.title && tick.axis !== "x"));
            if (!sprite.visible) return null;

            center.set(...tick.labelPosition).project(camera);
            let mobileShift = 0;
            if (size.width < 608 && !tick.title) {
                if (tick.axis === "z") mobileShift = 40;
                if (tick.axis === "x" && tick.position?.[0] === -SURFACE_WIDTH / 2) {
                    mobileShift = 40;
                }
            }
            const x = (center.x + 1) * size.width / 2 + (tick.labelOffset?.[0] ?? 0) + mobileShift;
            const y = (1 - center.y) * size.height / 2 + (tick.labelOffset?.[1] ?? 0);
            const depth = center.z;
            sprite.position.set(2 * x / size.width - 1, 1 - 2 * y / size.height, depth).unproject(camera);

            corner.copy(sprite.position).addScaledVector(cameraRight, sprite.scale.x / 2).project(camera);
            const halfWidth = Math.abs((corner.x + 1) * size.width / 2 - x);
            corner.copy(sprite.position).addScaledVector(cameraUp, sprite.scale.y / 2).project(camera);
            const halfHeight = Math.abs((1 - corner.y) * size.height / 2 - y);

            return {
                left: x - halfWidth,
                right: x + halfWidth,
                top: y - halfHeight,
                bottom: y + halfHeight,
            };
        });

        rectangles.forEach((rectangle, index) => {
            const sprite = sprites.current[index];
            if (!sprite || !rectangle) return;
            const overlaps = rectangles.some((other, otherIndex) => {
                if (otherIndex === index || !other) return false;
                const overlapWidth = Math.min(rectangle.right, other.right)
                    - Math.max(rectangle.left, other.left);
                const overlapHeight = Math.min(rectangle.bottom, other.bottom)
                    - Math.max(rectangle.top, other.top);
                if (overlapWidth <= 0 || overlapHeight <= 0) return false;
                const area = (rectangle.right - rectangle.left) * (rectangle.bottom - rectangle.top);
                const otherArea = (other.right - other.left) * (other.bottom - other.top);
                return overlapWidth * overlapHeight > Math.min(area, otherArea) * 0.15;
            });
            (sprite.material as SpriteMaterial).opacity = overlaps ? 0.7 : 1;
        });
    });

    return textures.length === ticks.length && ticks.map((tick, index) => {
        const label = textures[index];
        return (
            <sprite
                key={`${tick.axis}-${index}`}
                ref={(sprite) => { sprites.current[index] = sprite; }}
                position={tick.labelPosition}
                scale={[label.width, label.height, 1]}
            >
                <spriteMaterial map={label.texture} transparent depthTest depthWrite={false} toneMapped={false} />
            </sprite>
        );
    });
}

function buildSurface(direction: OffsetDirection): SurfaceData {
    const rowLength = LONGITUDE_SEGMENTS + 1;
    const vertexCount = rowLength * (LATITUDE_SEGMENTS + 1);
    const positions = new Float32Array(vertexCount * 3);
    const values = new Float64Array(vertexCount);
    let minimum = Infinity;
    let maximum = -Infinity;

    for (let row = 0; row <= LATITUDE_SEGMENTS; row += 1) {
        const latitude = CHINA_BBOX.minLat
            + (row / LATITUDE_SEGMENTS) * (CHINA_BBOX.maxLat - CHINA_BBOX.minLat);
        for (let column = 0; column <= LONGITUDE_SEGMENTS; column += 1) {
            const longitude = CHINA_BBOX.minLng
                + (column / LONGITUDE_SEGMENTS) * (CHINA_BBOX.maxLng - CHINA_BBOX.minLng);
            const converted = wgs84ToGcj02(latitude, longitude);
            const value = direction === "longitude"
                ? converted.lng - longitude
                : converted.lat - latitude;
            const index = row * rowLength + column;

            positions[index * 3] = (column / LONGITUDE_SEGMENTS - 0.5) * SURFACE_WIDTH;
            positions[index * 3 + 1] = (row / LATITUDE_SEGMENTS - 0.5) * SURFACE_DEPTH;
            values[index] = value;
            minimum = Math.min(minimum, value);
            maximum = Math.max(maximum, value);
        }
    }

    const colors = new Float32Array(vertexCount * 3);
    const color = new Color();
    const span = maximum - minimum || 1;

    for (let index = 0; index < vertexCount; index += 1) {
        const fraction = (values[index] - minimum) / span;
        const scaled = fraction * (COLORS.length - 1);
        const stop = Math.min(Math.floor(scaled), COLORS.length - 2);
        color.copy(COLORS[stop]).lerp(COLORS[stop + 1], scaled - stop);
        positions[index * 3 + 2] = 0.15 + fraction * SURFACE_HEIGHT;
        colors[index * 3] = color.r;
        colors[index * 3 + 1] = color.g;
        colors[index * 3 + 2] = color.b;
    }

    const triangles: number[] = [];
    for (let row = 0; row < LATITUDE_SEGMENTS; row += 1) {
        for (let column = 0; column < LONGITUDE_SEGMENTS; column += 1) {
            const lowerLeft = row * rowLength + column;
            const lowerRight = lowerLeft + 1;
            const upperLeft = lowerLeft + rowLength;
            const upperRight = upperLeft + 1;
            triangles.push(lowerLeft, lowerRight, upperLeft, lowerRight, upperRight, upperLeft);
        }
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
    geometry.setIndex(triangles);
    geometry.computeVertexNormals();
    return { geometry, minimum, maximum };
}

function SurfaceControls({ resetToken }: { resetToken: number }) {
    const { camera, invalidate } = useThree();
    const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null);

    useEffect(() => {
        camera.up.set(0, 0, 1);
        camera.position.set(...CAMERA_POSITION);
        controls.current?.target.set(...CAMERA_TARGET);
        controls.current?.update();
        invalidate();
    }, [camera, invalidate, resetToken]);

    return (
        <OrbitControls
            ref={controls}
            enablePan={false}
            minDistance={6}
            maxDistance={30}
            maxPolarAngle={Math.PI / 2 - 0.05}
            rotateSpeed={0.7}
            zoomSpeed={0.8}
        />
    );
}

function SurfaceScene({
    data,
    resetToken,
    ticks,
}: {
    data: SurfaceData;
    resetToken: number;
    ticks: AxisTick[];
}) {
    const xStart = -SURFACE_WIDTH / 2;
    const xEnd = SURFACE_WIDTH / 2;
    const yStart = -SURFACE_DEPTH / 2;
    const yEnd = SURFACE_DEPTH / 2;

    return (
        <>
            <color attach="background" args={["#f5f8fc"]} />
            <ambientLight intensity={1.6} />
            <directionalLight position={[3, -4, 9]} intensity={1.4} />
            <mesh geometry={data.geometry}>
                <meshStandardMaterial vertexColors side={DoubleSide} roughness={0.9} />
            </mesh>
            <gridHelper
                args={[SURFACE_WIDTH, 8, "#9caec0", "#d7e1ea"]}
                position={[0, 0, 0]}
                rotation={[Math.PI / 2, 0, 0]}
            />
            <Line points={[[xStart, yStart, 0], [xEnd + 0.3, yStart, 0]]} color="#334155" lineWidth={1.5} />
            <Line points={[[xStart, yStart, 0], [xStart, yEnd + 0.3, 0]]} color="#334155" lineWidth={1.5} />
            <Line points={[[xStart, yStart, 0], [xStart, yStart, SURFACE_HEIGHT + 0.7]]} color="#334155" lineWidth={1.5} />
            {ticks.map((tick, index) => {
                if (!tick.position) return null;
                const [x, y, z] = tick.position;
                const points: [[number, number, number], [number, number, number]] = tick.axis === "x"
                    ? [[x, y - 0.12, z], [x, y + 0.12, z]]
                    : [[x - 0.12, y, z], [x + 0.12, y, z]];
                return <Line key={`${tick.axis}-${index}`} points={points} color="#334155" lineWidth={1.5} />;
            })}
            <SurfaceControls resetToken={resetToken} />
            <AxisLabels ticks={ticks} />
        </>
    );
}

type CoordinateOffsetSurfaceProps = {
    labels: SurfaceLabels;
    windowTranslations: Dictionary["visualizationWindow"];
};

export function CoordinateOffsetSurface({
    labels,
    windowTranslations,
}: CoordinateOffsetSurfaceProps) {
    const [direction, setDirection] = useState<OffsetDirection>("longitude");
    const [resetToken, setResetToken] = useState(0);
    const data = useMemo(() => buildSurface(direction), [direction]);
    const ticks = useMemo(() => createAxisTicks(data, direction, labels), [data, direction, labels]);

    useEffect(() => () => data.geometry.dispose(), [data]);

    const views = [
        {
            id: "longitude" as const,
            label: labels.longitudeTab,
            title: labels.longitudeTitle,
            description: labels.description,
            resettable: true,
        },
        {
            id: "latitude" as const,
            label: labels.latitudeTab,
            title: labels.latitudeTitle,
            description: labels.description,
            resettable: true,
        },
    ];

    return (
        <VisualizationWindow
            translations={windowTranslations}
            views={views}
            activeViewId={direction}
            onViewChange={setDirection}
            onResetView={() => setResetToken((token) => token + 1)}
            viewportClassName="h-[460px] max-sm:h-[400px]"
        >
            <Canvas
                camera={{ position: CAMERA_POSITION, fov: 45, near: 0.1, far: 100 }}
                dpr={[1, 1.75]}
                frameloop="demand"
                style={{ touchAction: "none" }}
                fallback={<p className="p-4 text-sm">{labels.webglUnavailable}</p>}
            >
                <SurfaceScene
                    data={data}
                    resetToken={resetToken}
                    ticks={ticks}
                />
            </Canvas>
            <div className="pointer-events-none absolute left-2 top-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-2.5 py-2 text-[11px] leading-5 text-[var(--color-text)] shadow-sm sm:left-3 sm:top-3">
                <div>{labels.longitudeRange}: {CHINA_BBOX.minLng}°–{CHINA_BBOX.maxLng}°</div>
                <div>{labels.latitudeRange}: {CHINA_BBOX.minLat}°–{CHINA_BBOX.maxLat}°</div>
                <div className="sm:hidden">Y {labels.latitudeAxis}</div>
                <div className="sm:hidden">Z {direction === "longitude" ? labels.longitudeOffsetAxis : labels.latitudeOffsetAxis}</div>
            </div>
            <div
                className="pointer-events-none absolute bottom-2 left-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-2.5 py-2 text-[11px] text-[var(--color-text)] shadow-sm sm:bottom-3 sm:left-auto sm:right-3"
                aria-label={labels.colorLegend}
            >
                <div className="mb-1 font-medium">{labels.colorLegend}</div>
                <div
                    className="h-2.5 w-32 rounded-full"
                    style={{ background: `linear-gradient(to right, ${COLOR_STOPS.join(", ")})` }}
                    aria-hidden="true"
                />
                <div className="mt-1 flex justify-between gap-2 tabular-nums">
                    <span>{data.minimum.toFixed(5)}°</span>
                    <span>{data.maximum.toFixed(5)}°</span>
                </div>
            </div>
        </VisualizationWindow>
    );
}
