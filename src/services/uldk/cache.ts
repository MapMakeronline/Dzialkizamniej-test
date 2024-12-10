import { Feature } from 'geojson';

interface CacheEntry {
  feature: Feature;
  timestamp: number;
}

const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, CacheEntry>();

export const uldkCache = {
  get(key: string): Feature | null {
    const entry = cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > CACHE_EXPIRY) {
      cache.delete(key);
      return null;
    }

    return entry.feature;
  },

  set(key: string, feature: Feature): void {
    cache.set(key, {
      feature,
      timestamp: Date.now()
    });

    // Clean up old entries
    for (const [key, entry] of cache.entries()) {
      if (Date.now() - entry.timestamp > CACHE_EXPIRY) {
        cache.delete(key);
      }
    }
  },

  clear(): void {
    cache.clear();
  }
};