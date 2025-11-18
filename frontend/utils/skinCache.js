/**
 * Skin Cache Manager
 * 
 * Manages GW2 skin data in localStorage
 * - Fetches on first visit
 * - Validates cache freshness
 * - Auto-refreshes if outdated
 */

const CACHE_KEY = 'gw2_skins_cache';
const CACHE_VERSION_KEY = 'gw2_skins_version';
const CACHE_EXPIRY_DAYS = 30; // Refresh cache after 30 days

/**
 * Check if cache exists and is valid
 */
export function isCacheValid() {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    const cachedVersion = localStorage.getItem(CACHE_VERSION_KEY);
    
    if (!cachedData || !cachedVersion) {
      console.log('⚠️ No cache found in localStorage');
      return false;
    }
    
    // Parse cached data to check timestamp
    const cache = JSON.parse(cachedData);
    const cacheDate = new Date(cache.generated_at);
    const now = new Date();
    const daysSinceCache = (now - cacheDate) / (1000 * 60 * 60 * 24);
    
    console.log(`📊 Cache age: ${daysSinceCache.toFixed(1)} days`);
    
    // Cache is valid if less than CACHE_EXPIRY_DAYS old
    return daysSinceCache < CACHE_EXPIRY_DAYS;
  } catch (error) {
    console.error('Error checking cache validity:', error);
    return false;
  }
}

/**
 * Fetch skins from backend and store in localStorage
 */
export async function fetchAndCacheSkins() {
  try {
    console.log('Fetching skins database...');
    
    // Fetch from public folder
    const response = await fetch('/skin.json');
    
    if (!response.ok) {
      throw new Error('Failed to fetch skins database');
    }
    
    const data = await response.json();
    
    // Store in localStorage
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(CACHE_VERSION_KEY, data.version);
    
    console.log(`✅ Cached ${data.count} skins (version: ${data.version})`);
    
    return data;
  } catch (error) {
    console.error('Error fetching and caching skins:', error);
    throw error;
  }
}

/**
 * Get skins from cache
 */
export function getSkinsFromCache() {
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    
    if (!cachedData) {
      return null;
    }
    
    return JSON.parse(cachedData);
  } catch (error) {
    console.error('Error reading skins from cache:', error);
    return null;
  }
}

/**
 * Initialize skin cache
 * Call this on app load
 */
export async function initializeSkinCache() {
  if (typeof window === 'undefined') {
    console.log('⚠️ Not in browser, skipping cache initialization');
    return null;
  }
  
  console.log('🔍 Checking skin cache...');
  
  // Debug: Check what's in localStorage
  const hasCache = localStorage.getItem(CACHE_KEY);
  const hasVersion = localStorage.getItem(CACHE_VERSION_KEY);
  console.log('📦 localStorage keys:', {
    hasCache: !!hasCache,
    cacheSize: hasCache ? `${(hasCache.length / 1024 / 1024).toFixed(2)} MB` : '0 MB',
    hasVersion: !!hasVersion,
    version: hasVersion
  });
  
  // Check if cache is valid
  if (isCacheValid()) {
    console.log('✅ Skin cache is valid');
    return getSkinsFromCache();
  }
  
  // Cache is invalid or missing, fetch new data
  console.log('⚠️ Skin cache is invalid or missing, fetching...');
  return await fetchAndCacheSkins();
}

/**
 * Search skins by name
 * @param {string} query - Search query
 * @param {string} type - Filter by type (Armor, Weapon, Back)
 * @param {number} limit - Max results
 */
export function searchSkins(query, type = null, limit = 10) {
  const cache = getSkinsFromCache();
  
  if (!cache || !cache.skins) {
    return [];
  }
  
  const lowerQuery = query.toLowerCase();
  
  return cache.skins
    .filter(skin => {
      // Filter by type if specified
      if (type && skin.type !== type) {
        return false;
      }
      
      // Filter by query
      return skin.name.toLowerCase().includes(lowerQuery);
    })
    .slice(0, limit);
}

/**
 * Get all skins of a specific type
 */
export function getSkinsByType(type) {
  const cache = getSkinsFromCache();
  
  if (!cache || !cache.skins) {
    return [];
  }
  
  return cache.skins.filter(skin => skin.type === type);
}

/**
 * Clear cache (for debugging or force refresh)
 */
export function clearSkinCache() {
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(CACHE_VERSION_KEY);
  console.log('🗑️ Skin cache cleared');
}

/**
 * Get cache info
 */
export function getCacheInfo() {
  const cache = getSkinsFromCache();
  const version = localStorage.getItem(CACHE_VERSION_KEY);
  
  if (!cache) {
    return {
      exists: false,
      valid: false
    };
  }
  
  return {
    exists: true,
    valid: isCacheValid(),
    version: version,
    count: cache.count,
    generatedAt: cache.generated_at,
    types: cache.types
  };
}
