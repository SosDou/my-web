"use client";

import { useState } from "react";

import {
    CodeBlock,
    CodeBlockActions,
    CodeBlockContent,
    CodeBlockCopyButton,
    CodeBlockHeader,
    CodeBlockTitle,
} from "@/components/ui/code-block";

export const typescriptCoordinateCodeString = String.raw`const CHINA_BBOX = {
  minLng: 72.004,
  maxLng: 137.8347,
  minLat: 0.8293,
  maxLat: 55.8271,
} as const;

export interface MapCoordinate {
  lat: number;
  lng: number;
}

const GCJ02_ELLIPSOID_A = 6_378_245;
const GCJ02_ECCENTRICITY_SQUARED = 0.006_693_421_622_965_943;
const GCJ02_INVERSE_THRESHOLD = 1e-7;
const GCJ02_INVERSE_MAX_ITERATIONS = 10;

function isInChinaBBox(lng: number, lat: number): boolean {
  return Number.isFinite(lng)
    && Number.isFinite(lat)
    && lng >= CHINA_BBOX.minLng
    && lng <= CHINA_BBOX.maxLng
    && lat >= CHINA_BBOX.minLat
    && lat <= CHINA_BBOX.maxLat;
}

function transformLongitude(lng: number, lat: number): number {
  let result = 300 + lng + 2 * lat + 0.1 * lng * lng
    + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
  result += ((20 * Math.sin(6 * lng * Math.PI)
    + 20 * Math.sin(2 * lng * Math.PI)) * 2) / 3;
  result += ((20 * Math.sin(lng * Math.PI)
    + 40 * Math.sin((lng / 3) * Math.PI)) * 2) / 3;
  result += ((150 * Math.sin((lng / 12) * Math.PI)
    + 300 * Math.sin((lng / 30) * Math.PI)) * 2) / 3;
  return result;
}

function transformLatitude(lng: number, lat: number): number {
  let result = -100 + 2 * lng + 3 * lat + 0.2 * lat * lat
    + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
  result += ((20 * Math.sin(6 * lng * Math.PI)
    + 20 * Math.sin(2 * lng * Math.PI)) * 2) / 3;
  result += ((20 * Math.sin(lat * Math.PI)
    + 40 * Math.sin((lat / 3) * Math.PI)) * 2) / 3;
  result += ((160 * Math.sin((lat / 12) * Math.PI)
    + 320 * Math.sin((lat * Math.PI) / 30)) * 2) / 3;
  return result;
}

export function wgs84ToGcj02(lat: number, lng: number): MapCoordinate {
  if (!isInChinaBBox(lng, lat)) return { lat, lng };

  const offsetLng = lng - 105;
  const offsetLat = lat - 35;
  let deltaLat = transformLatitude(offsetLng, offsetLat);
  let deltaLng = transformLongitude(offsetLng, offsetLat);
  const radLat = (lat / 180) * Math.PI;
  const sinLat = Math.sin(radLat);
  const magic = 1 - GCJ02_ECCENTRICITY_SQUARED * sinLat * sinLat;
  const sqrtMagic = Math.sqrt(magic);

  deltaLat = (deltaLat * 180) / (
    ((GCJ02_ELLIPSOID_A * (1 - GCJ02_ECCENTRICITY_SQUARED))
      / (magic * sqrtMagic)) * Math.PI
  );
  deltaLng = (deltaLng * 180) / (
    (GCJ02_ELLIPSOID_A / sqrtMagic) * Math.cos(radLat) * Math.PI
  );

  return { lat: lat + deltaLat, lng: lng + deltaLng };
}

export function gcj02ToWgs84(lat: number, lng: number): MapCoordinate {
  if (!isInChinaBBox(lng, lat)) return { lat, lng };

  let wgsLat = lat;
  let wgsLng = lng;

  for (let i = 0; i < GCJ02_INVERSE_MAX_ITERATIONS; i += 1) {
    const converted = wgs84ToGcj02(wgsLat, wgsLng);
    const deltaLat = converted.lat - lat;
    const deltaLng = converted.lng - lng;
    wgsLat -= deltaLat;
    wgsLng -= deltaLng;

    if (Math.abs(deltaLat) < GCJ02_INVERSE_THRESHOLD
      && Math.abs(deltaLng) < GCJ02_INVERSE_THRESHOLD) break;
  }

  return { lat: wgsLat, lng: wgsLng };
}`;

export const pythonCoordinateCodeString = String.raw`from dataclasses import dataclass
from math import cos, isfinite, pi, sin, sqrt


CHINA_BBOX = {
    "min_lng": 72.004,
    "max_lng": 137.8347,
    "min_lat": 0.8293,
    "max_lat": 55.8271,
}

GCJ02_ELLIPSOID_A = 6_378_245.0
GCJ02_ECCENTRICITY_SQUARED = 0.006_693_421_622_965_943
GCJ02_INVERSE_THRESHOLD = 1e-7
GCJ02_INVERSE_MAX_ITERATIONS = 10


@dataclass(frozen=True)
class MapCoordinate:
    lat: float
    lng: float


def _is_in_china_bbox(lng: float, lat: float) -> bool:
    return (
        isfinite(lng)
        and isfinite(lat)
        and CHINA_BBOX["min_lng"] <= lng <= CHINA_BBOX["max_lng"]
        and CHINA_BBOX["min_lat"] <= lat <= CHINA_BBOX["max_lat"]
    )


def _transform_longitude(lng: float, lat: float) -> float:
    result = (
        300 + lng + 2 * lat + 0.1 * lng * lng
        + 0.1 * lng * lat + 0.1 * sqrt(abs(lng))
    )
    result += ((20 * sin(6 * lng * pi) + 20 * sin(2 * lng * pi)) * 2) / 3
    result += ((20 * sin(lng * pi) + 40 * sin((lng / 3) * pi)) * 2) / 3
    result += ((150 * sin((lng / 12) * pi) + 300 * sin((lng / 30) * pi)) * 2) / 3
    return result


def _transform_latitude(lng: float, lat: float) -> float:
    result = (
        -100 + 2 * lng + 3 * lat + 0.2 * lat * lat
        + 0.1 * lng * lat + 0.2 * sqrt(abs(lng))
    )
    result += ((20 * sin(6 * lng * pi) + 20 * sin(2 * lng * pi)) * 2) / 3
    result += ((20 * sin(lat * pi) + 40 * sin((lat / 3) * pi)) * 2) / 3
    result += ((160 * sin((lat / 12) * pi) + 320 * sin((lat * pi) / 30)) * 2) / 3
    return result


def wgs84_to_gcj02(lat: float, lng: float) -> MapCoordinate:
    if not _is_in_china_bbox(lng, lat):
        return MapCoordinate(lat, lng)

    offset_lng = lng - 105
    offset_lat = lat - 35
    delta_lat = _transform_latitude(offset_lng, offset_lat)
    delta_lng = _transform_longitude(offset_lng, offset_lat)
    rad_lat = (lat / 180) * pi
    sin_lat = sin(rad_lat)
    magic = 1 - GCJ02_ECCENTRICITY_SQUARED * sin_lat * sin_lat
    sqrt_magic = sqrt(magic)

    delta_lat = (delta_lat * 180) / (
        ((GCJ02_ELLIPSOID_A * (1 - GCJ02_ECCENTRICITY_SQUARED))
         / (magic * sqrt_magic)) * pi
    )
    delta_lng = (delta_lng * 180) / (
        (GCJ02_ELLIPSOID_A / sqrt_magic) * cos(rad_lat) * pi
    )

    return MapCoordinate(lat + delta_lat, lng + delta_lng)


def gcj02_to_wgs84(lat: float, lng: float) -> MapCoordinate:
    if not _is_in_china_bbox(lng, lat):
        return MapCoordinate(lat, lng)

    wgs_lat = lat
    wgs_lng = lng

    for _ in range(GCJ02_INVERSE_MAX_ITERATIONS):
        converted = wgs84_to_gcj02(wgs_lat, wgs_lng)
        delta_lat = converted.lat - lat
        delta_lng = converted.lng - lng
        wgs_lat -= delta_lat
        wgs_lng -= delta_lng

        if (abs(delta_lat) < GCJ02_INVERSE_THRESHOLD
                and abs(delta_lng) < GCJ02_INVERSE_THRESHOLD):
            break

    return MapCoordinate(wgs_lat, wgs_lng)`;

export const cppCoordinateCodeString = String.raw`#include <cmath>

struct MapCoordinate {
    double lat;
    double lng;
};

namespace {
constexpr double MIN_LNG = 72.004;
constexpr double MAX_LNG = 137.8347;
constexpr double MIN_LAT = 0.8293;
constexpr double MAX_LAT = 55.8271;
constexpr double PI = 3.14159265358979323846;
constexpr double GCJ02_ELLIPSOID_A = 6378245.0;
constexpr double GCJ02_ECCENTRICITY_SQUARED = 0.006693421622965943;
constexpr double GCJ02_INVERSE_THRESHOLD = 1e-7;
constexpr int GCJ02_INVERSE_MAX_ITERATIONS = 10;

bool isInChinaBBox(double lng, double lat) {
    return std::isfinite(lng) && std::isfinite(lat)
        && lng >= MIN_LNG && lng <= MAX_LNG
        && lat >= MIN_LAT && lat <= MAX_LAT;
}

double transformLongitude(double lng, double lat) {
    double result = 300 + lng + 2 * lat + 0.1 * lng * lng
        + 0.1 * lng * lat + 0.1 * std::sqrt(std::abs(lng));
    result += ((20 * std::sin(6 * lng * PI) + 20 * std::sin(2 * lng * PI)) * 2) / 3;
    result += ((20 * std::sin(lng * PI) + 40 * std::sin((lng / 3) * PI)) * 2) / 3;
    result += ((150 * std::sin((lng / 12) * PI) + 300 * std::sin((lng / 30) * PI)) * 2) / 3;
    return result;
}

double transformLatitude(double lng, double lat) {
    double result = -100 + 2 * lng + 3 * lat + 0.2 * lat * lat
        + 0.1 * lng * lat + 0.2 * std::sqrt(std::abs(lng));
    result += ((20 * std::sin(6 * lng * PI) + 20 * std::sin(2 * lng * PI)) * 2) / 3;
    result += ((20 * std::sin(lat * PI) + 40 * std::sin((lat / 3) * PI)) * 2) / 3;
    result += ((160 * std::sin((lat / 12) * PI) + 320 * std::sin((lat * PI) / 30)) * 2) / 3;
    return result;
}
}  // namespace

MapCoordinate wgs84ToGcj02(double lat, double lng) {
    if (!isInChinaBBox(lng, lat)) return {lat, lng};

    const double offsetLng = lng - 105;
    const double offsetLat = lat - 35;
    double deltaLat = transformLatitude(offsetLng, offsetLat);
    double deltaLng = transformLongitude(offsetLng, offsetLat);
    const double radLat = (lat / 180) * PI;
    const double sinLat = std::sin(radLat);
    const double magic = 1 - GCJ02_ECCENTRICITY_SQUARED * sinLat * sinLat;
    const double sqrtMagic = std::sqrt(magic);

    deltaLat = (deltaLat * 180) / (
        ((GCJ02_ELLIPSOID_A * (1 - GCJ02_ECCENTRICITY_SQUARED))
         / (magic * sqrtMagic)) * PI
    );
    deltaLng = (deltaLng * 180) / (
        (GCJ02_ELLIPSOID_A / sqrtMagic) * std::cos(radLat) * PI
    );

    return {lat + deltaLat, lng + deltaLng};
}

MapCoordinate gcj02ToWgs84(double lat, double lng) {
    if (!isInChinaBBox(lng, lat)) return {lat, lng};

    double wgsLat = lat;
    double wgsLng = lng;

    for (int i = 0; i < GCJ02_INVERSE_MAX_ITERATIONS; ++i) {
        const MapCoordinate converted = wgs84ToGcj02(wgsLat, wgsLng);
        const double deltaLat = converted.lat - lat;
        const double deltaLng = converted.lng - lng;
        wgsLat -= deltaLat;
        wgsLng -= deltaLng;

        if (std::abs(deltaLat) < GCJ02_INVERSE_THRESHOLD
            && std::abs(deltaLng) < GCJ02_INVERSE_THRESHOLD) break;
    }

    return {wgsLat, wgsLng};
}`;

export const cCoordinateCodeString = String.raw`#include <math.h>
#include <stdbool.h>

typedef struct {
    double lat;
    double lng;
} MapCoordinate;

static const double MIN_LNG = 72.004;
static const double MAX_LNG = 137.8347;
static const double MIN_LAT = 0.8293;
static const double MAX_LAT = 55.8271;
static const double PI = 3.14159265358979323846;
static const double GCJ02_ELLIPSOID_A = 6378245.0;
static const double GCJ02_ECCENTRICITY_SQUARED = 0.006693421622965943;
static const double GCJ02_INVERSE_THRESHOLD = 1e-7;
static const int GCJ02_INVERSE_MAX_ITERATIONS = 10;

static bool is_in_china_bbox(double lng, double lat) {
    return isfinite(lng) && isfinite(lat)
        && lng >= MIN_LNG && lng <= MAX_LNG
        && lat >= MIN_LAT && lat <= MAX_LAT;
}

static double transform_longitude(double lng, double lat) {
    double result = 300 + lng + 2 * lat + 0.1 * lng * lng
        + 0.1 * lng * lat + 0.1 * sqrt(fabs(lng));
    result += ((20 * sin(6 * lng * PI) + 20 * sin(2 * lng * PI)) * 2) / 3;
    result += ((20 * sin(lng * PI) + 40 * sin((lng / 3) * PI)) * 2) / 3;
    result += ((150 * sin((lng / 12) * PI) + 300 * sin((lng / 30) * PI)) * 2) / 3;
    return result;
}

static double transform_latitude(double lng, double lat) {
    double result = -100 + 2 * lng + 3 * lat + 0.2 * lat * lat
        + 0.1 * lng * lat + 0.2 * sqrt(fabs(lng));
    result += ((20 * sin(6 * lng * PI) + 20 * sin(2 * lng * PI)) * 2) / 3;
    result += ((20 * sin(lat * PI) + 40 * sin((lat / 3) * PI)) * 2) / 3;
    result += ((160 * sin((lat / 12) * PI) + 320 * sin((lat * PI) / 30)) * 2) / 3;
    return result;
}

MapCoordinate wgs84_to_gcj02(double lat, double lng) {
    if (!is_in_china_bbox(lng, lat)) return (MapCoordinate){lat, lng};

    const double offset_lng = lng - 105;
    const double offset_lat = lat - 35;
    double delta_lat = transform_latitude(offset_lng, offset_lat);
    double delta_lng = transform_longitude(offset_lng, offset_lat);
    const double rad_lat = (lat / 180) * PI;
    const double sin_lat = sin(rad_lat);
    const double magic = 1 - GCJ02_ECCENTRICITY_SQUARED * sin_lat * sin_lat;
    const double sqrt_magic = sqrt(magic);

    delta_lat = (delta_lat * 180) / (
        ((GCJ02_ELLIPSOID_A * (1 - GCJ02_ECCENTRICITY_SQUARED))
         / (magic * sqrt_magic)) * PI
    );
    delta_lng = (delta_lng * 180) / (
        (GCJ02_ELLIPSOID_A / sqrt_magic) * cos(rad_lat) * PI
    );

    return (MapCoordinate){lat + delta_lat, lng + delta_lng};
}

MapCoordinate gcj02_to_wgs84(double lat, double lng) {
    if (!is_in_china_bbox(lng, lat)) return (MapCoordinate){lat, lng};

    double wgs_lat = lat;
    double wgs_lng = lng;

    for (int i = 0; i < GCJ02_INVERSE_MAX_ITERATIONS; ++i) {
        const MapCoordinate converted = wgs84_to_gcj02(wgs_lat, wgs_lng);
        const double delta_lat = converted.lat - lat;
        const double delta_lng = converted.lng - lng;
        wgs_lat -= delta_lat;
        wgs_lng -= delta_lng;

        if (fabs(delta_lat) < GCJ02_INVERSE_THRESHOLD
            && fabs(delta_lng) < GCJ02_INVERSE_THRESHOLD) break;
    }

    return (MapCoordinate){wgs_lat, wgs_lng};
}`;

export const dartCoordinateCodeString = String.raw`import 'dart:math' as math;

class MapCoordinate {
  final double lat;
  final double lng;

  const MapCoordinate(this.lat, this.lng);
}

const double minLng = 72.004;
const double maxLng = 137.8347;
const double minLat = 0.8293;
const double maxLat = 55.8271;
const double gcj02EllipsoidA = 6378245.0;
const double gcj02EccentricitySquared = 0.006693421622965943;
const double gcj02InverseThreshold = 1e-7;
const int gcj02InverseMaxIterations = 10;

bool _isInChinaBBox(double lng, double lat) {
  return lng.isFinite
      && lat.isFinite
      && lng >= minLng
      && lng <= maxLng
      && lat >= minLat
      && lat <= maxLat;
}

double _transformLongitude(double lng, double lat) {
  var result = 300 + lng + 2 * lat + 0.1 * lng * lng
      + 0.1 * lng * lat + 0.1 * math.sqrt(lng.abs());
  result += ((20 * math.sin(6 * lng * math.pi)
      + 20 * math.sin(2 * lng * math.pi)) * 2) / 3;
  result += ((20 * math.sin(lng * math.pi)
      + 40 * math.sin((lng / 3) * math.pi)) * 2) / 3;
  result += ((150 * math.sin((lng / 12) * math.pi)
      + 300 * math.sin((lng / 30) * math.pi)) * 2) / 3;
  return result;
}

double _transformLatitude(double lng, double lat) {
  var result = -100 + 2 * lng + 3 * lat + 0.2 * lat * lat
      + 0.1 * lng * lat + 0.2 * math.sqrt(lng.abs());
  result += ((20 * math.sin(6 * lng * math.pi)
      + 20 * math.sin(2 * lng * math.pi)) * 2) / 3;
  result += ((20 * math.sin(lat * math.pi)
      + 40 * math.sin((lat / 3) * math.pi)) * 2) / 3;
  result += ((160 * math.sin((lat / 12) * math.pi)
      + 320 * math.sin((lat * math.pi) / 30)) * 2) / 3;
  return result;
}

MapCoordinate wgs84ToGcj02(double lat, double lng) {
  if (!_isInChinaBBox(lng, lat)) return MapCoordinate(lat, lng);

  final offsetLng = lng - 105;
  final offsetLat = lat - 35;
  var deltaLat = _transformLatitude(offsetLng, offsetLat);
  var deltaLng = _transformLongitude(offsetLng, offsetLat);
  final radLat = (lat / 180) * math.pi;
  final sinLat = math.sin(radLat);
  final magic = 1 - gcj02EccentricitySquared * sinLat * sinLat;
  final sqrtMagic = math.sqrt(magic);

  deltaLat = (deltaLat * 180) / (
    ((gcj02EllipsoidA * (1 - gcj02EccentricitySquared))
      / (magic * sqrtMagic)) * math.pi
  );
  deltaLng = (deltaLng * 180) / (
    (gcj02EllipsoidA / sqrtMagic) * math.cos(radLat) * math.pi
  );

  return MapCoordinate(lat + deltaLat, lng + deltaLng);
}

MapCoordinate gcj02ToWgs84(double lat, double lng) {
  if (!_isInChinaBBox(lng, lat)) return MapCoordinate(lat, lng);

  var wgsLat = lat;
  var wgsLng = lng;

  for (var i = 0; i < gcj02InverseMaxIterations; i += 1) {
    final converted = wgs84ToGcj02(wgsLat, wgsLng);
    final deltaLat = converted.lat - lat;
    final deltaLng = converted.lng - lng;
    wgsLat -= deltaLat;
    wgsLng -= deltaLng;

    if (deltaLat.abs() < gcj02InverseThreshold
        && deltaLng.abs() < gcj02InverseThreshold) break;
  }

  return MapCoordinate(wgsLat, wgsLng);
}`;

export const javaCoordinateCodeString = String.raw`public final class CoordinateConverter {
    private static final double MIN_LNG = 72.004;
    private static final double MAX_LNG = 137.8347;
    private static final double MIN_LAT = 0.8293;
    private static final double MAX_LAT = 55.8271;
    private static final double GCJ02_ELLIPSOID_A = 6378245.0;
    private static final double GCJ02_ECCENTRICITY_SQUARED = 0.006693421622965943;
    private static final double GCJ02_INVERSE_THRESHOLD = 1e-7;
    private static final int GCJ02_INVERSE_MAX_ITERATIONS = 10;

    private CoordinateConverter() {}

    public static final class MapCoordinate {
        public final double lat;
        public final double lng;

        public MapCoordinate(double lat, double lng) {
            this.lat = lat;
            this.lng = lng;
        }
    }

    private static boolean isInChinaBBox(double lng, double lat) {
        return Double.isFinite(lng) && Double.isFinite(lat)
            && lng >= MIN_LNG && lng <= MAX_LNG
            && lat >= MIN_LAT && lat <= MAX_LAT;
    }

    private static double transformLongitude(double lng, double lat) {
        double result = 300 + lng + 2 * lat + 0.1 * lng * lng
            + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
        result += ((20 * Math.sin(6 * lng * Math.PI)
            + 20 * Math.sin(2 * lng * Math.PI)) * 2) / 3;
        result += ((20 * Math.sin(lng * Math.PI)
            + 40 * Math.sin((lng / 3) * Math.PI)) * 2) / 3;
        result += ((150 * Math.sin((lng / 12) * Math.PI)
            + 300 * Math.sin((lng / 30) * Math.PI)) * 2) / 3;
        return result;
    }

    private static double transformLatitude(double lng, double lat) {
        double result = -100 + 2 * lng + 3 * lat + 0.2 * lat * lat
            + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
        result += ((20 * Math.sin(6 * lng * Math.PI)
            + 20 * Math.sin(2 * lng * Math.PI)) * 2) / 3;
        result += ((20 * Math.sin(lat * Math.PI)
            + 40 * Math.sin((lat / 3) * Math.PI)) * 2) / 3;
        result += ((160 * Math.sin((lat / 12) * Math.PI)
            + 320 * Math.sin((lat * Math.PI) / 30)) * 2) / 3;
        return result;
    }

    public static MapCoordinate wgs84ToGcj02(double lat, double lng) {
        if (!isInChinaBBox(lng, lat)) return new MapCoordinate(lat, lng);

        double offsetLng = lng - 105;
        double offsetLat = lat - 35;
        double deltaLat = transformLatitude(offsetLng, offsetLat);
        double deltaLng = transformLongitude(offsetLng, offsetLat);
        double radLat = (lat / 180) * Math.PI;
        double sinLat = Math.sin(radLat);
        double magic = 1 - GCJ02_ECCENTRICITY_SQUARED * sinLat * sinLat;
        double sqrtMagic = Math.sqrt(magic);

        deltaLat = (deltaLat * 180) / (
            ((GCJ02_ELLIPSOID_A * (1 - GCJ02_ECCENTRICITY_SQUARED))
                / (magic * sqrtMagic)) * Math.PI
        );
        deltaLng = (deltaLng * 180) / (
            (GCJ02_ELLIPSOID_A / sqrtMagic) * Math.cos(radLat) * Math.PI
        );

        return new MapCoordinate(lat + deltaLat, lng + deltaLng);
    }

    public static MapCoordinate gcj02ToWgs84(double lat, double lng) {
        if (!isInChinaBBox(lng, lat)) return new MapCoordinate(lat, lng);

        double wgsLat = lat;
        double wgsLng = lng;

        for (int i = 0; i < GCJ02_INVERSE_MAX_ITERATIONS; i += 1) {
            MapCoordinate converted = wgs84ToGcj02(wgsLat, wgsLng);
            double deltaLat = converted.lat - lat;
            double deltaLng = converted.lng - lng;
            wgsLat -= deltaLat;
            wgsLng -= deltaLng;

            if (Math.abs(deltaLat) < GCJ02_INVERSE_THRESHOLD
                && Math.abs(deltaLng) < GCJ02_INVERSE_THRESHOLD) break;
        }

        return new MapCoordinate(wgsLat, wgsLng);
    }
}`;

export const coordinateCodeExamples = {
    typescript: {
        label: "TypeScript",
        fileName: "coordinate.ts",
        code: typescriptCoordinateCodeString,
    },
    python: {
        label: "Python",
        fileName: "coordinate.py",
        code: pythonCoordinateCodeString,
    },
    cpp: {
        label: "C++",
        fileName: "coordinate.cpp",
        code: cppCoordinateCodeString,
    },
    c: {
        label: "C",
        fileName: "coordinate.c",
        code: cCoordinateCodeString,
    },
    dart: {
        label: "Dart",
        fileName: "coordinate.dart",
        code: dartCoordinateCodeString,
    },
    java: {
        label: "Java",
        fileName: "CoordinateConverter.java",
        code: javaCoordinateCodeString,
    },
} as const satisfies Record<
    string,
    {
        label: string;
        fileName: string;
        code: string;
    }
>;

export type CoordinateCodeLanguage = keyof typeof coordinateCodeExamples;

const codeLanguages = Object.keys(coordinateCodeExamples) as CoordinateCodeLanguage[];

export function ArticleCodeBlock() {
    const [language, setLanguage] = useState<CoordinateCodeLanguage>("typescript");
    const example = coordinateCodeExamples[language];

    return (
        <CodeBlock>
            <div
                role="tablist"
                aria-label="代码语言"
                className="flex gap-1 overflow-x-auto border-b border-[var(--color-border)] p-1.5"
            >
                {codeLanguages.map((codeLanguage) => {
                    const isActive = codeLanguage === language;
                    const option = coordinateCodeExamples[codeLanguage];

                    return (
                        <button
                            key={codeLanguage}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => setLanguage(codeLanguage)}
                            className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${isActive
                                ? "bg-accent text-accent-foreground"
                                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-background-hover)] hover:text-[var(--color-text)]"
                                }`}
                        >
                            {option.label}
                        </button>
                    );
                })}
            </div>
            <CodeBlockHeader>
                <CodeBlockTitle>{example.fileName}</CodeBlockTitle>
                <CodeBlockActions>
                    <CodeBlockCopyButton value={example.code} />
                </CodeBlockActions>
            </CodeBlockHeader>
            <CodeBlockContent
                key={language}
                className="max-h-[560px]"
                language={language}
                lineNumbers
            >
                {example.code}
            </CodeBlockContent>
        </CodeBlock>
    );
}
