'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Map, NavigationControl, setWorkerUrl } from 'maplibre-gl';
import type { MapMouseEvent } from 'maplibre-gl';
import { createMapMarker, MapMarkerPanel, observeMarkerInfoWindows, removeMapMarkers, type MapMarkerConfig, type MapMarkerInstance } from './map-marker';
import { getMapStyleUrl, observeMapTheme } from './map-theme';
import type { Dictionary } from '@/i18n/dictionaries/types';

export type { MapMarkerConfig } from './map-marker';
export type MapLabels = Dictionary['map'];

export type MapMarkerFactory = (
    coordinates: [longitude: number, latitude: number],
) => readonly MapMarkerConfig[];

setWorkerUrl(
    new URL(
        'maplibre-gl/dist/maplibre-gl-worker.mjs',
        import.meta.url,
    ).toString(),
);

function getLocalCenter(): [number, number] {
    if (typeof window !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            return [longitude, latitude];
        });
    }

    return [13.388, 52.517];
}


type MapViewProps = {
    center?: [longitude: number, latitude: number];
    enableMarkers?: boolean;
    labels: MapLabels;
    markerColor?: string;
    markerFactory?: MapMarkerFactory;
    markers?: readonly MapMarkerConfig[];
    zoom?: number;
};

export default function MapView({
    center,
    enableMarkers = false,
    labels,
    markerColor = 'var(--ds-color-brand-primary)',
    markerFactory,
    markers,
    zoom = 9.5,
}: MapViewProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<Map | null>(null);
    const markerInstancesRef = useRef<MapMarkerInstance[]>([]);
    const [markerGroups, setMarkerGroups] = useState<MapMarkerConfig[][]>(
        () => (markers ?? []).map((marker) => [marker]),
    );
    const [isMarkerMode, setIsMarkerMode] = useState(false);
    const markerConfigs = useMemo(
        () => markerGroups.flat(),
        [markerGroups],
    );
    const markerCount = enableMarkers ? markerConfigs.length : 0;

    const clearMarkers = useCallback(() => {
        setMarkerGroups([]);
    }, []);

    const addMarker = useCallback((longitude: number, latitude: number) => {
        const coordinates: [number, number] = [longitude, latitude];
        const markerGroup: MapMarkerConfig[] = markerFactory
            ? [...markerFactory(coordinates)]
            : [{
                coordinates,
                color: markerColor,
            }];

        if (markerGroup.length === 0) return;

        setMarkerGroups((currentGroups) => [
            ...currentGroups,
            markerGroup,
        ]);
    }, [markerColor, markerFactory]);

    const toggleMarkerMode = useCallback(() => {
        setIsMarkerMode((enabled) => !enabled);
    }, []);

    const removeLastMarker = useCallback(() => {
        setMarkerGroups((currentGroups) => currentGroups.slice(0, -1));
    }, []);

    useEffect(() => {
        if (!mapContainer.current) return;

        const map = new Map({
            container: mapContainer.current,
            locale: labels.mapLibre,
            style: getMapStyleUrl(),
            center: center ?? getLocalCenter(),
            zoom,
        });

        mapRef.current = map;

        map.addControl(
            new NavigationControl(),
            'top-right',
        );

        const stopObservingTheme = observeMapTheme(map);

        return () => {
            stopObservingTheme();
            removeMapMarkers(markerInstancesRef.current);
            markerInstancesRef.current = [];
            mapRef.current = null;
            map.remove();
        };
    }, [center, labels.mapLibre, zoom]);

    useEffect(() => {
        const map = mapRef.current;

        if (!map) return;

        removeMapMarkers(markerInstancesRef.current);
        markerInstancesRef.current = [];

        if (!enableMarkers) return;

        markerInstancesRef.current = markerConfigs.map((config) =>
            createMapMarker(map, config, labels.marker));
        const stopObservingInfoWindows = observeMarkerInfoWindows(
            map,
            markerInstancesRef.current,
        );

        return () => {
            stopObservingInfoWindows();
            removeMapMarkers(markerInstancesRef.current);
            markerInstancesRef.current = [];
        };
    }, [enableMarkers, labels.marker, markerConfigs]);

    useEffect(() => {
        const map = mapRef.current;

        if (!map || !enableMarkers || !isMarkerMode) return;

        const canvas = map.getCanvas();
        const previousCursor = canvas.style.cursor;

        function handleMapClick(event: MapMouseEvent) {
            addMarker(event.lngLat.lng, event.lngLat.lat);
        }

        canvas.style.cursor = 'crosshair';
        map.on('click', handleMapClick);

        return () => {
            map.off('click', handleMapClick);
            canvas.style.cursor = previousCursor;
        };
    }, [addMarker, enableMarkers, isMarkerMode]);

    return (
        <div className="relative h-[480px] w-full overflow-hidden rounded-xl">
            <div
                ref={mapContainer}
                className="h-full w-full"
            />

            {enableMarkers && (
                <MapMarkerPanel
                    labels={labels.marker}
                    markerCount={markerCount}
                    isMarkerMode={isMarkerMode}
                    onToggleMarkerMode={toggleMarkerMode}
                    onRemoveLast={removeLastMarker}
                    onClear={clearMarkers}
                />
            )}
        </div>
    );
}
