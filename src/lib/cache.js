import { config } from '../config.js';

const cache = new Map();
let hits = 0;
let misses = 0;

export function getCacheValue(key) {
  const entry = cache.get(key);

  if (entry && Date.now() < entry.expiresAt) {
    hits++;
    return entry.value;
  }

  cache.delete(key);
  misses++;
  return undefined;
}

export function setCacheValue(key, value) {
  cache.set(key, {
    value,
    expiresAt: Date.now() + config.cacheTtlSeconds * 1000
  });
}

export function getCacheStats() {
  const now = Date.now();
  let entries = 0;

  for (const [key, entry] of cache) {
    if (now < entry.expiresAt) {
      entries++;
    } else {
      cache.delete(key);
    }
  }

  return {
    entries,
    hits,
    misses,
    ttlSeconds: config.cacheTtlSeconds
  };
}