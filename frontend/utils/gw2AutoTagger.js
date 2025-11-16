/**
 * GW2 Auto-Tagger Utility
 * 
 * Automatically generates tags from GW2 API data
 * All processing happens in the browser
 */

// Dye color mapping - maps GW2 dye hues to our color categories
const DYE_COLOR_MAPPING = {
  'Gray': ['Gray dyes'],
  'Brown': ['Brown dyes'],
  'Red': ['Red dyes'],
  'Orange': ['Orange dyes'],
  'Yellow': ['Yellow dyes'],
  'Green': ['Green dyes'],
  'Blue': ['Blue dyes'],
  'Purple': ['Purple dyes'],
  'Violet': ['Purple dyes'],
  'Pink': ['Red dyes'],
  'Beige': ['Brown dyes'],
  'Tan': ['Brown dyes'],
  'White': ['Gray dyes'],
  'Black': ['Gray dyes'],
  'Silver': ['Gray dyes'],
  'Gold': ['Yellow dyes'],
  'Teal': ['Blue dyes'],
  'Cyan': ['Blue dyes'],
  'Lime': ['Green dyes'],
  'Olive': ['Green dyes'],
  'Maroon': ['Red dyes'],
  'Navy': ['Blue dyes'],
};

// Source mapping based on skin flags
const SOURCE_MAPPING = {
  'Gemstore': 'Gems Store',
  'Achievement': 'Loot',
  'Crafting': 'Loot',
  'Drop': 'Loot',
  'Vendor': 'Trading Post',
  'Festival': null, // Will be mapped to specific festivals
};

// Festival/Event mapping
const FESTIVAL_KEYWORDS = {
  'Lunar': 'Lunar New Year',
  'SAB': 'Super Adventure Box',
  'Dragon Bash': 'Dragon Bash',
  'Zephyr': 'Four Winds',
  'Halloween': 'Halloween',
  'Wintersday': 'Loot', // Not in our list, default to Loot
};

/**
 * Fetch character details from GW2 API
 */
export async function fetchCharacterDetails(characterName, apiKey) {
  try {
    const encodedName = encodeURIComponent(characterName);
    const response = await fetch(
      `https://api.guildwars2.com/v2/characters/${encodedName}?access_token=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch character details');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching character details:', error);
    throw error;
  }
}

/**
 * Fetch equipment tab details
 */
export async function fetchEquipmentTab(characterName, tabName, apiKey) {
  try {
    const encodedName = encodeURIComponent(characterName);
    const response = await fetch(
      `https://api.guildwars2.com/v2/characters/${encodedName}/equipmenttabs?tabs=all&access_token=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch equipment tabs');
    }
    
    const tabs = await response.json();
    return tabs.find(tab => tab.name === tabName);
  } catch (error) {
    console.error('Error fetching equipment tab:', error);
    throw error;
  }
}

/**
 * Fetch item details from GW2 API
 */
async function fetchItemDetails(itemIds) {
  try {
    const ids = itemIds.filter(Boolean).join(',');
    if (!ids) return [];
    
    const response = await fetch(
      `https://api.guildwars2.com/v2/items?ids=${ids}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch item details');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching item details:', error);
    return [];
  }
}

/**
 * Fetch skin details from GW2 API
 */
async function fetchSkinDetails(skinIds) {
  try {
    const ids = skinIds.filter(Boolean).join(',');
    if (!ids) return [];
    
    const response = await fetch(
      `https://api.guildwars2.com/v2/skins?ids=${ids}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch skin details');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching skin details:', error);
    return [];
  }
}

/**
 * Fetch dye details from GW2 API
 */
async function fetchDyeDetails(dyeIds) {
  try {
    const ids = dyeIds.filter(Boolean).join(',');
    if (!ids) return [];
    
    const response = await fetch(
      `https://api.guildwars2.com/v2/colors?ids=${ids}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch dye details');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching dye details:', error);
    return [];
  }
}

/**
 * Map dye name to our color category
 */
function mapDyeToColorCategory(dyeName) {
  for (const [keyword, category] of Object.entries(DYE_COLOR_MAPPING)) {
    if (dyeName.toLowerCase().includes(keyword.toLowerCase())) {
      return category[0];
    }
  }
  return null;
}

/**
 * Extract source from skin flags or name
 */
function extractSource(skin) {
  // Check flags first
  if (skin.flags) {
    for (const flag of skin.flags) {
      if (SOURCE_MAPPING[flag]) {
        return SOURCE_MAPPING[flag];
      }
    }
  }
  
  // Check name for festival keywords
  if (skin.name) {
    for (const [keyword, source] of Object.entries(FESTIVAL_KEYWORDS)) {
      if (skin.name.includes(keyword)) {
        return source;
      }
    }
  }
  
  return null;
}

/**
 * Main function: Generate tags from character and equipment data
 */
export async function generateTagsFromEquipment(characterName, equipmentTabName, apiKey) {
  const tags = new Set();
  
  try {
    // 1. Fetch character details for race, gender, profession
    console.log('Fetching character details...');
    const character = await fetchCharacterDetails(characterName, apiKey);
    
    // Add race, gender, profession
    if (character.race) tags.add(character.race);
    if (character.gender) tags.add(character.gender);
    if (character.profession) tags.add(character.profession);
    
    // 2. Fetch equipment tab
    console.log('Fetching equipment tab...');
    const equipmentTab = await fetchEquipmentTab(characterName, equipmentTabName, apiKey);
    
    if (!equipmentTab || !equipmentTab.equipment) {
      console.warn('No equipment found');
      return Array.from(tags);
    }
    
    // 3. Extract skin IDs directly from equipment (not item IDs)
    const skinIds = new Set();
    const dyeIds = new Set();
    
    equipmentTab.equipment.forEach(item => {
      // Get skin ID directly from equipment
      if (item.skin) {
        skinIds.add(item.skin);
      }
      
      // Extract dyes from armor pieces
      if (item.dyes) {
        item.dyes.forEach(dyeId => {
          if (dyeId) dyeIds.add(dyeId);
        });
      }
    });
    
    // 4. Fetch skin details directly
    console.log('Fetching skin details...');
    const skins = await fetchSkinDetails(Array.from(skinIds));
    
    // Add skin names as tags
    skins.forEach(skin => {
      if (skin.name) {
        tags.add(skin.name);
      }
      
      // Extract source from skin
      const source = extractSource(skin);
      if (source) {
        tags.add(source);
      }
    });
    
    // 5. Fetch dye details
    console.log('Fetching dye details...');
    const dyes = await fetchDyeDetails(Array.from(dyeIds));
    
    // Map dyes to color categories
    const colorCategories = new Set();
    dyes.forEach(dye => {
      if (dye.name) {
        const colorCategory = mapDyeToColorCategory(dye.name);
        if (colorCategory) {
          colorCategories.add(colorCategory);
        }
      }
    });
    
    // Add color categories to tags
    colorCategories.forEach(category => tags.add(category));
    
    console.log('Generated tags:', Array.from(tags));
    return Array.from(tags);
    
  } catch (error) {
    console.error('Error generating tags:', error);
    throw error;
  }
}

/**
 * Preview tags before submission
 */
export function categorizeTags(tags) {
  const races = ['Human', 'Asura', 'Norn', 'Charr', 'Sylvari'];
  const genders = ['Male', 'Female'];
  const classes = ['Guardian', 'Warrior', 'Engineer', 'Ranger', 'Thief', 'Elementalist', 'Mesmer', 'Necromancer', 'Revenant'];
  const colors = ['Gray dyes', 'Brown dyes', 'Red dyes', 'Orange dyes', 'Yellow dyes', 'Green dyes', 'Blue dyes', 'Purple dyes'];
  const sources = ['Lunar New Year', 'Super Adventure Box', 'Dragon Bash', 'Four Winds', 'Halloween', 'Loot', 'Gems Store', 'Trading Post'];
  
  return {
    race: tags.find(tag => races.includes(tag)) || null,
    gender: tags.find(tag => genders.includes(tag)) || null,
    class: tags.find(tag => classes.includes(tag)) || null,
    colors: tags.filter(tag => colors.includes(tag)),
    sources: tags.filter(tag => sources.includes(tag)),
    skins: tags.filter(tag => 
      !races.includes(tag) && 
      !genders.includes(tag) && 
      !classes.includes(tag) && 
      !colors.includes(tag) && 
      !sources.includes(tag)
    )
  };
}
