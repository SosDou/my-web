'use client';

import { Marker, Popup, type Map, type MarkerOptions } from 'maplibre-gl';
import { LuMapPin, LuMapPinPlus, LuTrash2, LuUndo2 } from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import type { Dictionary } from '@/i18n/dictionaries/types';
import { interpolate } from '@/i18n/utils/interpolate';

export type MapMarkerLabels = Dictionary['map']['marker'];

type MapMarkerPanelProps = {
    labels: MapMarkerLabels;
    markerCount: number;
    isMarkerMode: boolean;
    onToggleMarkerMode: () => void;
    onRemoveLast: () => void;
    onClear: () => void;
};

export function MapMarkerPanel({
    labels,
    markerCount,
    isMarkerMode,
    onToggleMarkerMode,
    onRemoveLast,
    onClear,
}: MapMarkerPanelProps) {
    const hasMarkers = markerCount > 0;
    const currentCount = interpolate(labels.currentCount, {
        count: markerCount,
    });

    return (
        <div
            className="absolute left-3 top-3 z-10 flex flex-wrap items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-overlay-background)] p-1.5 text-[var(--color-text)] shadow-[var(--color-overlay-shadow)]"
            role="group"
            aria-label={labels.panelLabel}
        >
            <span
                className="flex h-7 min-w-7 items-center justify-center gap-1 rounded-md px-1.5 text-xs font-medium"
                aria-label={currentCount}
                title={currentCount}
            >
                <LuMapPin aria-hidden="true" />
                {markerCount}
            </span>

            <Button
                type="button"
                size="sm"
                variant={isMarkerMode ? 'default' : 'outline'}
                aria-pressed={isMarkerMode}
                onClick={onToggleMarkerMode}
                title={isMarkerMode
                    ? labels.exitMarkerMode
                    : labels.enterMarkerMode}
            >
                <LuMapPinPlus aria-hidden="true" />
                {isMarkerMode
                    ? labels.markerModeActive
                    : labels.markerModeInactive}
            </Button>

            <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onRemoveLast}
                disabled={!hasMarkers}
                title={labels.removeLastMarker}
            >
                <LuUndo2 aria-hidden="true" />
                {labels.undo}
            </Button>

            <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={onClear}
                disabled={!hasMarkers}
                title={labels.clearAllMarkers}
            >
                <LuTrash2 aria-hidden="true" />
                {labels.clear}
            </Button>
        </div>
    );
}

export type MapMarkerConfig = {
    coordinates: [longitude: number, latitude: number];
    color?: string;
    popup?: string;
    options?: MarkerOptions;
};

export type MapMarkerInstance = {
    marker: Marker;
    infoWindow: Popup;
    dispose: () => void;
};

function formatCoordinates(
    longitude: number,
    latitude: number,
    labels: MapMarkerLabels,
): string {
    return `${labels.longitude} ${longitude.toFixed(6)}\n`
        + `${labels.latitude} ${latitude.toFixed(6)}`;
}

function createInfoWindowContent(
    longitude: number,
    latitude: number,
    labels: MapMarkerLabels,
    label?: string,
): {
    container: HTMLDivElement;
    coordinates: HTMLSpanElement;
} {
    const container = document.createElement('div');
    container.className = 'map-marker-info-window-content';

    if (label) {
        const labelElement = document.createElement('span');
        labelElement.className = 'map-marker-info-window-label';
        labelElement.textContent = label;
        container.append(labelElement);
    }

    const coordinates = document.createElement('span');
    coordinates.className = 'map-marker-info-window-coordinates';
    coordinates.textContent = formatCoordinates(
        longitude,
        latitude,
        labels,
    );
    container.append(coordinates);

    return { container, coordinates };
}

export function createMapMarker(
    map: Map,
    { color, coordinates, popup, options }: MapMarkerConfig,
    labels: MapMarkerLabels,
): MapMarkerInstance {
    const marker = new Marker({
        ...options,
        ...(color ? { color } : {}),
    })
        .setLngLat(coordinates)
        .addTo(map);
    const content = createInfoWindowContent(
        coordinates[0],
        coordinates[1],
        labels,
        popup,
    );
    const infoWindow = new Popup({
        anchor: 'bottom',
        className: 'map-marker-info-window',
        closeButton: false,
        closeOnClick: false,
        focusAfterOpen: false,
        maxWidth: 'none',
        offset: 32,
        subpixelPositioning: false,
    })
        .setLngLat(coordinates)
        .setDOMContent(content.container)
        .addTo(map);

    function updateInfoWindow() {
        const position = marker.getLngLat();

        infoWindow.setLngLat(position);
        content.coordinates.textContent = formatCoordinates(
            position.lng,
            position.lat,
            labels,
        );
    }

    marker.on('drag', updateInfoWindow);

    return {
        marker,
        infoWindow,
        dispose: () => {
            marker.off('drag', updateInfoWindow);
            infoWindow.remove();
            marker.remove();
        },
    };
}

export function removeMapMarkers(
    markers: readonly MapMarkerInstance[],
): void {
    markers.forEach((marker) => marker.dispose());
}

function getInfoWindowLayout(zoom: number): {
    conflictOpacity: number;
    gap: number;
} {
    if (zoom < 5) return { conflictOpacity: 0.3, gap: 18 };
    if (zoom < 8) return { conflictOpacity: 0.4, gap: 14 };
    if (zoom < 11) return { conflictOpacity: 0.55, gap: 10 };

    return { conflictOpacity: 0.7, gap: 6 };
}

function rectanglesOverlap(
    first: DOMRect,
    second: DOMRect,
    gap: number,
): boolean {
    return first.left < second.right + gap
        && first.right + gap > second.left
        && first.top < second.bottom + gap
        && first.bottom + gap > second.top;
}

function layoutInfoWindows(
    map: Map,
    markers: readonly MapMarkerInstance[],
): void {
    const { conflictOpacity, gap } = getInfoWindowLayout(map.getZoom());
    const canvas = map.getCanvas();

    const candidates = markers.map((instance) => {
        const point = map.project(instance.marker.getLngLat());
        const element = instance.infoWindow.getElement();

        element.style.visibility = 'hidden';

        return {
            element,
            point,
        };
    });

    const visibleCandidates = candidates.flatMap((candidate) => {
        const isInsideMap = candidate.point.x >= 0
            && candidate.point.x <= canvas.clientWidth
            && candidate.point.y >= 0
            && candidate.point.y <= canvas.clientHeight;

        if (!isInsideMap) return [];

        candidate.element.style.setProperty(
            '--map-marker-info-window-background-opacity',
            '100%',
        );
        candidate.element.style.visibility = 'visible';

        return [{
            ...candidate,
            isConflicting: false,
            rectangle: candidate.element.getBoundingClientRect(),
        }];
    }).sort((first, second) =>
        first.rectangle.left - second.rectangle.left);

    const activeCandidates: typeof visibleCandidates = [];

    for (const candidate of visibleCandidates) {
        while (
            activeCandidates.length > 0
            && activeCandidates[0].rectangle.right + gap
                <= candidate.rectangle.left
        ) {
            activeCandidates.shift();
        }

        for (const activeCandidate of activeCandidates) {
            if (!rectanglesOverlap(
                candidate.rectangle,
                activeCandidate.rectangle,
                gap,
            )) continue;

            candidate.isConflicting = true;
            activeCandidate.isConflicting = true;
        }

        activeCandidates.push(candidate);
        activeCandidates.sort((first, second) =>
            first.rectangle.right - second.rectangle.right);
    }

    for (const candidate of visibleCandidates) {
        candidate.element.style.setProperty(
            '--map-marker-info-window-background-opacity',
            candidate.isConflicting
                ? `${conflictOpacity * 100}%`
                : '100%',
        );
    }
}

export function observeMarkerInfoWindows(
    map: Map,
    markers: readonly MapMarkerInstance[],
): () => void {
    let animationFrame: number | undefined;

    function scheduleLayout() {
        if (animationFrame !== undefined) return;

        animationFrame = window.requestAnimationFrame(() => {
            animationFrame = undefined;
            layoutInfoWindows(map, markers);
        });
    }

    map.on('move', scheduleLayout);
    map.on('resize', scheduleLayout);
    markers.forEach(({ marker }) => marker.on('drag', scheduleLayout));
    scheduleLayout();

    return () => {
        map.off('move', scheduleLayout);
        map.off('resize', scheduleLayout);
        markers.forEach(({ marker }) => marker.off('drag', scheduleLayout));

        if (animationFrame !== undefined) {
            window.cancelAnimationFrame(animationFrame);
        }
    };
}

export function addMapMarkers(
    map: Map,
    markerConfigs: readonly MapMarkerConfig[],
    labels: MapMarkerLabels,
): () => void {
    const markers = markerConfigs.map((config) =>
        createMapMarker(map, config, labels));

    return () => {
        removeMapMarkers(markers);
    };
}
