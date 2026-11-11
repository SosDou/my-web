'use client';

import { useCallback, useMemo } from 'react';
import MapView, {
    type MapLabels,
    type MapMarkerFactory,
} from '@/components/ui/map/map';
import type { Dictionary } from '@/i18n/dictionaries/types';
import { wgs84ToGcj02 } from './transform';

const DEFAULT_CENTER: [longitude: number, latitude: number] = [
    114.057868,
    22.543099,
];

const WGS84_MARKER_COLOR = '#55cdfc';
const GCJ02_MARKER_COLOR = '#f7a8b8';

type CoordinateComparisonMapProps = {
    labels: Dictionary['wgs84Gcj02']['map'];
    mapLabels: MapLabels;
};

export function CoordinateComparisonMap({
    labels,
    mapLabels,
}: CoordinateComparisonMapProps) {
    const createCoordinateMarkers = useCallback<MapMarkerFactory>(([
        longitude,
        latitude,
    ]) => {
        const gcj02 = wgs84ToGcj02(latitude, longitude);

        return [
            {
                color: WGS84_MARKER_COLOR,
                coordinates: [longitude, latitude],
                popup: labels.wgs84Marker,
            },
            {
                color: GCJ02_MARKER_COLOR,
                coordinates: [gcj02.lng, gcj02.lat],
                popup: labels.gcj02Marker,
            },
        ];
    }, [labels.gcj02Marker, labels.wgs84Marker]);
    const defaultMarkers = useMemo(
        () => createCoordinateMarkers(DEFAULT_CENTER),
        [createCoordinateMarkers],
    );

    return (
        <div className="space-y-2">
            <div
                className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--color-text-secondary)]"
                aria-label={labels.legendLabel}
            >
                <span className="inline-flex items-center gap-1.5">
                    <span
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: WGS84_MARKER_COLOR }}
                        aria-hidden="true"
                    />
                    {labels.wgs84Coordinate}
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <span
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: GCJ02_MARKER_COLOR }}
                        aria-hidden="true"
                    />
                    {labels.gcj02Coordinate}
                </span>
            </div>

            <MapView
                center={DEFAULT_CENTER}
                enableMarkers
                labels={mapLabels}
                markerFactory={createCoordinateMarkers}
                markers={defaultMarkers}
                zoom={13}
            />
        </div>
    );
}
