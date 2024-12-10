import { Feature } from 'geojson';
import { ULDK_CONFIG } from './config';
import { makeULDKRequest } from './api';
import { parseULDKResponse, transformToFeature } from './parser';
import { wgs84ToPUWG1992, isWithinPolandBounds } from '../../utils/coordinates/coordinateTransform';
import { ULDKRequestType, ULDKSearchOptions } from './types';
import { useNotificationStore } from '../../store/notificationStore';
import { uldkCache } from './cache';

async function tryCoordinates(
  lat: number,
  lng: number,
  options: ULDKSearchOptions = {}
): Promise<Feature | null> {
  const cacheKey = `${lat},${lng}`;
  const cachedFeature = uldkCache.get(cacheKey);
  if (cachedFeature) return cachedFeature;

  try {
    if (!isFinite(lat) || !isFinite(lng)) {
      throw new Error('Invalid coordinates');
    }

    const requestType = options.requestType || 'GetParcelByXY';
    const converted = wgs84ToPUWG1992(lat, lng);

    const params = {
      request: requestType,
      xy: `${converted.x},${converted.y}`,
      result: options.result || ULDK_CONFIG.RESULT_FIELDS[requestType],
      srid: options.srid || ULDK_CONFIG.DEFAULT_SRID
    };

    const data = await makeULDKRequest(params);
    if (!data || data === '0') return null;

    const response = parseULDKResponse(data);
    const feature = transformToFeature(response, requestType);
    
    uldkCache.set(cacheKey, feature);
    return feature;
  } catch (error) {
    return null;
  }
}

export async function searchParcelByCoordinates(lat: number, lng: number): Promise<Feature | null> {
  const { addNotification } = useNotificationStore.getState();

  try {
    if (!isFinite(lat) || !isFinite(lng) ||
        Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      throw new Error('Invalid coordinates');
    }

    if (!isWithinPolandBounds(lat, lng)) {
      throw new Error('Coordinates outside Poland bounds');
    }

    const feature = await tryCoordinates(lat, lng);
    if (!feature) {
      addNotification({
        type: 'info',
        message: 'No parcel found at this location',
        timeout: 3000
      });
    }
    return feature;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error searching for parcel';
    addNotification({
      type: 'error',
      message: errorMessage,
      timeout: 5000
    });
    return null;
  }
}