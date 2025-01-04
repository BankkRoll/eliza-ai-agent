import {
  CacheManager,
  DbCacheAdapter,
  FsCacheAdapter,
  IDatabaseCacheAdapter,
} from "@ai16z/eliza";

import type { Character } from "@ai16z/eliza";
import path from "path";

/**
 * Initializes a file system-based cache for a character
 */
export function intializeFsCache(baseDir: string, character: Character) {
  // Resolve the cache directory path
  const cacheDir = path.resolve(baseDir, character.id, "cache");

  // Create and return a new CacheManager with a file system adapter
  const cache = new CacheManager(new FsCacheAdapter(cacheDir));
  return cache;
}

/**
 * Initializes a database-based cache for a character
 */
export function intializeDbCache(
  character: Character,
  db: IDatabaseCacheAdapter,
) {
  // Create and return a new CacheManager with a database adapter
  const cache = new CacheManager(new DbCacheAdapter(db, character.id));
  return cache;
}