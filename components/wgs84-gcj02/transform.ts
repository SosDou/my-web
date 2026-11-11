const CHINA_BBOX = {
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
}