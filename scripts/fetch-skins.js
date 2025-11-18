/**
 * GW2 Skins Fetcher
 * 
 * Fetches all Armor, Back, and Weapon skins from GW2 API
 * and saves them to backend/cache/skin.json
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const API_BASE = 'https://api.guildwars2.com/v2';
const BATCH_SIZE = 200; // GW2 API allows max 200 IDs per request
const OUTPUT_FILE = path.join(__dirname, '../cache/skin.json');

// Allowed skin types
const ALLOWED_TYPES = ['Armor', 'Back', 'Weapon'];

/**
 * Make HTTPS GET request
 */
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(new Error(`Failed to parse JSON: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Fetch all skin IDs
 */
async function fetchAllSkinIds() {
  console.log('Fetching all skin IDs...');
  const ids = await httpsGet(`${API_BASE}/skins`);
  console.log(`Found ${ids.length} total skins`);
  return ids;
}

/**
 * Fetch skin details in batches
 */
async function fetchSkinDetails(ids) {
  const allSkins = [];
  const batches = [];
  
  // Split IDs into batches of 200
  for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    batches.push(ids.slice(i, i + BATCH_SIZE));
  }
  
  console.log(`Fetching ${batches.length} batches of skin details...`);
  
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const batchIds = batch.join(',');
    
    try {
      console.log(`Fetching batch ${i + 1}/${batches.length} (${batch.length} skins)...`);
      const skins = await httpsGet(`${API_BASE}/skins?ids=${batchIds}`);
      allSkins.push(...skins);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Error fetching batch ${i + 1}:`, error.message);
      // Continue with next batch
    }
  }
  
  return allSkins;
}

/**
 * Filter and format skins
 */
function filterAndFormatSkins(skins) {
  console.log('Filtering and formatting skins...');
  
  const filtered = skins
    .filter(skin => ALLOWED_TYPES.includes(skin.type))
    .filter(skin => skin.name && skin.name.trim() !== '') // Filter out empty names
    .map(skin => ({
      id: skin.id,
      name: skin.name,
      type: skin.type,
      // Optional: include subtype for more specific filtering
      subtype: skin.details?.type || null
    }))
    .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
  
  console.log(`Filtered to ${filtered.length} skins (Armor, Back, Weapon with names)`);
  
  // Count by type
  const counts = filtered.reduce((acc, skin) => {
    acc[skin.type] = (acc[skin.type] || 0) + 1;
    return acc;
  }, {});
  
  console.log('Counts by type:', counts);
  
  return filtered;
}

/**
 * Save skins to JSON file
 */
function saveSkins(skins) {
  const data = {
    version: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    generated_at: new Date().toISOString(),
    count: skins.length,
    types: ['Armor', 'Back', 'Weapon'],
    skins: skins
  };
  
  // Ensure cache directory exists
  const cacheDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
  
  // Write to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
  
  const fileSizeKB = (fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2);
  console.log(`\n✅ Saved ${skins.length} skins to ${OUTPUT_FILE}`);
  console.log(`📦 File size: ${fileSizeKB} KB`);
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting GW2 Skins Fetcher...\n');
  
  try {
    // Step 1: Fetch all skin IDs
    const allIds = await fetchAllSkinIds();
    
    // Step 2: Fetch skin details in batches
    const allSkins = await fetchSkinDetails(allIds);
    
    // Step 3: Filter and format
    const filteredSkins = filterAndFormatSkins(allSkins);
    
    // Step 4: Save to file
    saveSkins(filteredSkins);
    
    console.log('\n✨ Done!');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
