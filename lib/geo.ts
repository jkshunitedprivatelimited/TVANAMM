import type { Outlet, OutletWithDistance } from '@/types/outlet';

/**
 * Haversine formula — calculates the great-circle distance between two
 * points on Earth given their latitude and longitude in decimal degrees.
 *
 * @returns Distance in kilometres
 */
export function getDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Sort outlets by distance from a given coordinate, nearest first.
 */
export function sortOutletsByDistance(
  outlets: Outlet[],
  userLat: number,
  userLng: number
): OutletWithDistance[] {
  return outlets
    .map((outlet) => ({
      ...outlet,
      distanceKm: getDistanceKm(
        userLat,
        userLng,
        outlet.location.lat,
        outlet.location.lng
      ),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

/**
 * Get the N nearest outlets from a list.
 */
export function getNearestOutlets(
  outlets: Outlet[],
  userLat: number,
  userLng: number,
  count: number = 3
): OutletWithDistance[] {
  return sortOutletsByDistance(outlets, userLat, userLng).slice(0, count);
}

/**
 * Format distance for display.
 * < 1 km → "800 m"
 * 1–100 km → "12.3 km"
 * > 100 km → "125 km"
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  if (km < 100) {
    return `${km.toFixed(1)} km`;
  }
  return `${Math.round(km)} km`;
}

/**
 * Platform deep-link URLs.
 * These search URLs auto-detect the user's nearest T VANAMM outlet
 * based on their delivery address set in the respective app.
 */
export const PLATFORM_LINKS = {
  swiggy: 'https://www.swiggy.com/search?query=T+VANAMM',
  zomato: 'https://www.zomato.com/search?q=T+VANAMM',
} as const;
