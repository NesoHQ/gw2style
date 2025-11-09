import { useState, useEffect } from 'react';
import styles from '../styles/EquipmentDisplay.module.css';

// Rarity color mapping
const RARITY_COLORS = {
  Junk: '#aaa',
  Basic: '#000',
  Fine: '#62a4da',
  Masterwork: '#1a9306',
  Rare: '#fcd00b',
  Exotic: '#ffa405',
  Ascended: '#fb3e8d',
  Legendary: '#4c139d',
};

// Left column - Armor + Backpack
const LEFT_SLOTS = [
  'Helm',
  'Shoulders',
  'Coat',
  'Gloves',
  'Leggings',
  'Boots',
  'Backpack',
];

// Middle column - Weapons + Aquatic (Helm + Weapons)
const MIDDLE_SLOTS = [
  'WeaponA1',
  'WeaponA2',
  'WeaponB1',
  'WeaponB2',
  'HelmAquatic',
  'WeaponAquaticA',
  'WeaponAquaticB',
];

// Right column - Accessories
const RIGHT_SLOTS = [
  'Amulet',
  'Accessory1',
  'Accessory2',
  'Ring1',
  'Ring2',
];

// Cosmetic infusion IDs from GW2 Wiki (https://wiki.guildwars2.com/wiki/Cosmetic_infusion)
// Updated: November 2025
const COSMETIC_INFUSIONS = [
  // Meta Events
  68440,  // Queen Bee Infusion (Preserved Queen Bee)
  76063,  // Liquid Aurillium Infusion
  72021,  // Chak Infusion (Chak Egg Sac)
  84970,  // Festive Confetti Infusion
  88771,  // Crystal Infusion
  92023,  // Heart of the Khan-Ur
  93829,  // Frost Legion Infusion
  94945,  // Jormag Left Eye Infusion (Pristine Dragon's Left Eye)
  94982,  // Jormag Right Eye Infusion (Pristine Dragon's Right Eye)
  98002,  // Echo of the Dragonvoid (Glob of Dragonvoid Aether)
  
  // Mystic Forge
  90966,  // Mystic Infusion
  
  // Wizard's Vault
  101199, // Arcane Flow Infusion (account bound, from Wizard's Vault)
  101538, // Forest Wisp Infusion (extracted from Forest Wisp accessory)
  102887, // Heat Core Infusion (works only with Falling Star spear skin)
  
  // Festivals - Halloween
  89065,  // Ember Infusion
  79674,  // Phospholuminescent Infusion
  89007,  // Polysaturating Reverberating Infusion (Gray)
  89070,  // Polysaturating Reverberating Infusion (Purple)
  89071,  // Polysaturating Reverberating Infusion (Red)
  67375,  // Polyluminescent Undulating Infusion (Black)
  67370,  // Polyluminescent Undulating Infusion (Green)
  67372,  // Polyluminescent Undulating Infusion (Orange)
  79647,  // Polyluminescent Undulating Infusion (Teal)
  
  // Festivals - Super Adventure Box
  // Moto's Unstable Bauble Infusion: Red (account bound)
  // Moto's Unstable Bauble Infusion: Blue (account bound)
  
  // Festivals - Wintersday
  79978,  // Winter's Heart Infusion
  86405,  // Snow Diamond Infusion
  89426,  // Toy-Shell Infusion
  99956,  // Silent Symphony (Enchanted Music Box)
  
  // Fractals of the Mists
  81919,  // Celestial Infusion (Blue)
  // Celestial Infusion (Red) - account bound
  // Abyssal Infusion - account bound
  99890,  // Mote of Darkness (Lingering Darkness)
  
  // Raids
  77310,  // Ghostly Infusion
  91202,  // Peerless Infusion
  104448, // Bloodstone Infusion (Chunk of Pulsing Bloodstone)
  
  // Strike Missions
  98092,  // Imperial Everbloom (Imperial Everbloom Sprout)
  99250,  // Clockwork Infusion (Ever-Spinning Clockwork)
  101144, // Jotun Infusion (Vial of Cosmic Energies)
  100244, // Possession Infusion (Jar of Dangerous Spirits)
  
  // Dragon Response Missions
  94130, // Deldrimor Stoneskin Infusion (from Deldrimor Supply Box)
  
  // World versus World
  99844,  // Mistwalker Infusion (Ball of Charged Mists Essence)
  
  // Special Cases & Other Sources
  101659, // Chatoyant Infusion (allows seeing gigantic cats, from April Fools)
  100389, // Chromatic Bubbles (from Mount Balrior raid)
  97965,  // Ethereal Sea-Life Infusion (extracted from Ethereal Aquarium, from fishing)
  
  // Super Adventure Box (account bound but included for completeness)
  79653,  // Moto's Unstable Bauble Infusion: Red
  79661,  // Moto's Unstable Bauble Infusion: Blue
];

// Helper function to check if slot should hide upgrades (armor, weapons, aquatic)
const shouldHideUpgrades = (slotName) => {
  const hideUpgradeSlots = [
    'Helm', 'Shoulders', 'Coat', 'Gloves', 'Leggings', 'Boots', 'HelmAquatic',
    'WeaponA1', 'WeaponA2', 'WeaponB1', 'WeaponB2', 'WeaponAquaticA', 'WeaponAquaticB'
  ];
  return hideUpgradeSlots.includes(slotName);
};

// Helper function to check if an infusion is cosmetic
const isCosmeticInfusion = (infusionId) => {
  return COSMETIC_INFUSIONS.includes(infusionId);
};

const EquipmentSlot = ({ item, slotName, itemDetails, upgradeDetails, infusionDetails, skinDetails, dyeDetails }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!item) {
    return (
      <div className={styles.equipmentSlot}>
        <div className={styles.emptySlot}></div>
      </div>
    );
  }

  const details = itemDetails[item.id];
  const skin = item.skin ? skinDetails[item.skin] : null;
  const displayIcon = skin?.icon || details?.icon;
  const displayName = skin?.name || details?.name || slotName;
  const rarity = details?.rarity || 'Ascended';
  const borderColor = RARITY_COLORS[rarity] || RARITY_COLORS.Ascended;

  // Generate wiki URL
  const wikiUrl = displayName 
    ? `https://wiki.guildwars2.com/wiki/${encodeURIComponent(displayName.replace(/ /g, '_'))}`
    : null;

  // Generate chat code for skin
  const chatCode = skin?.chat_link || details?.chat_link || null;

  const handleClick = async () => {
    if (chatCode) {
      try {
        await navigator.clipboard.writeText(chatCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <div className={styles.equipmentSlot}>
      <div 
        className={styles.itemIconWrapper}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div 
          className={`${styles.itemIcon} ${chatCode ? styles.clickable : ''}`}
          style={{ borderColor }}
          onClick={handleClick}
        >
          {displayIcon && (
            <img src={displayIcon} alt={displayName} />
          )}
          {copied && (
            <div className={styles.copiedNotification}>Copied!</div>
          )}
        </div>
        
        {showTooltip && (
          <div className={styles.tooltip}>
            <div className={styles.tooltipName} style={{ color: borderColor }}>
              {displayName}
            </div>
            {item.infusions && item.infusions.length > 0 && (
              <div className={styles.tooltipInfusions}>
                <div className={styles.tooltipLabel}>Infusions:</div>
                <div className={styles.tooltipInfusionList}>
                  {item.infusions.map((infusionId, idx) => {
                    const infusion = infusionDetails[infusionId];
                    return (
                      <div key={idx} className={styles.tooltipInfusionItem}>
                        {infusion?.icon && (
                          <img src={infusion.icon} alt={infusion.name} className={styles.tooltipInfusionIcon} />
                        )}
                        <span>{infusion?.name || 'Infusion'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {wikiUrl && (
              <a 
                href={wikiUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.wikiLink}
                onClick={(e) => e.stopPropagation()}
              >
                View on Wiki →
              </a>
            )}
            {chatCode && (
              <div className={styles.tooltipHint}>
                Click to copy chat code
              </div>
            )}
          </div>
        )}
      </div>
      {item.upgrades && item.upgrades.length > 0 && !shouldHideUpgrades(slotName) && (
        <div className={styles.upgrades}>
          {item.upgrades.map((upgradeId, idx) => {
            const upgrade = upgradeDetails[upgradeId];
            return (
              <div 
                key={idx}
                className={styles.upgradeSlot}
                style={{ borderColor: RARITY_COLORS[upgrade?.rarity] || RARITY_COLORS.Exotic }}
                title={upgrade?.name}
              >
                {upgrade?.icon && (
                  <img src={upgrade.icon} alt={upgrade.name} />
                )}
              </div>
            );
          })}
        </div>
      )}

      {item.dyes && item.dyes.length > 0 && (
        <div className={styles.dyes}>
          {item.dyes.filter(dyeId => dyeId !== null).map((dyeId, idx) => {
            const dye = dyeDetails[dyeId];
            const dyeColor = dye?.cloth?.rgb || dye?.base_rgb;
            const rgbColor = dyeColor ? `rgb(${dyeColor[0]}, ${dyeColor[1]}, ${dyeColor[2]})` : '#666';
            return (
              <div 
                key={idx}
                className={styles.dyeSlot}
                title={dye?.name || 'Dye'}
              >
                <div className={styles.dyeColor} style={{ backgroundColor: rgbColor }} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default function EquipmentDisplay({ equipment }) {
  const [itemDetails, setItemDetails] = useState({});
  const [upgradeDetails, setUpgradeDetails] = useState({});
  const [infusionDetails, setInfusionDetails] = useState({});
  const [skinDetails, setSkinDetails] = useState({});
  const [dyeDetails, setDyeDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        // Decode base64 equipment data if it's a string
        let equipmentData = equipment;
        if (typeof equipment === 'string') {
          const decoded = atob(equipment);
          equipmentData = JSON.parse(decoded);
        }

        if (!equipmentData || !equipmentData.equipment) {
          setLoading(false);
          return;
        }

        // Collect all item IDs, upgrade IDs, infusion IDs, skin IDs, and dye IDs
        const itemIds = new Set();
        const upgradeIds = new Set();
        const infusionIds = new Set();
        const skinIds = new Set();
        const dyeIds = new Set();

        equipmentData.equipment.forEach(item => {
          itemIds.add(item.id);
          if (item.skin) {
            skinIds.add(item.skin);
          }
          if (item.upgrades) {
            item.upgrades.forEach(id => upgradeIds.add(id));
          }
          if (item.infusions) {
            item.infusions.forEach(id => infusionIds.add(id));
          }
          if (item.dyes) {
            item.dyes.forEach(id => {
              if (id !== null) dyeIds.add(id);
            });
          }
        });

        // Fetch item details from GW2 API
        const fetchItems = async (ids) => {
          if (ids.size === 0) return {};
          const idsArray = Array.from(ids);
          const response = await fetch(`https://api.guildwars2.com/v2/items?ids=${idsArray.join(',')}`);
          const data = await response.json();
          const map = {};
          data.forEach(item => {
            map[item.id] = item;
          });
          return map;
        };

        // Fetch skin details from GW2 API
        const fetchSkins = async (ids) => {
          if (ids.size === 0) return {};
          const idsArray = Array.from(ids);
          const response = await fetch(`https://api.guildwars2.com/v2/skins?ids=${idsArray.join(',')}`);
          const data = await response.json();
          const map = {};
          data.forEach(skin => {
            map[skin.id] = skin;
          });
          return map;
        };

        // Fetch dye details from GW2 API
        const fetchDyes = async (ids) => {
          if (ids.size === 0) return {};
          const idsArray = Array.from(ids);
          const response = await fetch(`https://api.guildwars2.com/v2/colors?ids=${idsArray.join(',')}`);
          const data = await response.json();
          const map = {};
          data.forEach(dye => {
            map[dye.id] = dye;
          });
          return map;
        };

        const [items, upgrades, infusions, skins, dyes] = await Promise.all([
          fetchItems(itemIds),
          fetchItems(upgradeIds),
          fetchItems(infusionIds),
          fetchSkins(skinIds),
          fetchDyes(dyeIds),
        ]);

        setItemDetails(items);
        setUpgradeDetails(upgrades);
        setInfusionDetails(infusions);
        setSkinDetails(skins);
        setDyeDetails(dyes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching equipment details:', error);
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [equipment]);

  if (loading) {
    return (
      <div className={styles.equipmentContainer}>
        <div className={styles.loading}>Loading equipment...</div>
      </div>
    );
  }

  // Decode equipment data
  let equipmentData = equipment;
  if (typeof equipment === 'string') {
    try {
      const decoded = atob(equipment);
      equipmentData = JSON.parse(decoded);
    } catch (e) {
      return null;
    }
  }

  if (!equipmentData || !equipmentData.equipment) {
    return null;
  }

  // Create a map of equipment by slot
  const equipmentMap = {};
  equipmentData.equipment.forEach(item => {
    equipmentMap[item.slot] = item;
  });

  // Collect all cosmetic infusions from equipment
  const cosmeticInfusions = [];
  equipmentData.equipment.forEach(item => {
    if (item.infusions) {
      item.infusions.forEach(infusionId => {
        if (isCosmeticInfusion(infusionId) && !cosmeticInfusions.includes(infusionId)) {
          cosmeticInfusions.push(infusionId);
        }
      });
    }
  });

  return (
    <div className={styles.equipmentContainer}>
      <div className={styles.equipmentGrid}>
        {/* Left column - Armor + Backpack */}
        <div className={styles.leftColumn}>
          {LEFT_SLOTS.map(slot => (
            <EquipmentSlot 
              key={slot}
              item={equipmentMap[slot]}
              slotName={slot}
              itemDetails={itemDetails}
              upgradeDetails={upgradeDetails}
              infusionDetails={infusionDetails}
              skinDetails={skinDetails}
              dyeDetails={dyeDetails}
            />
          ))}
        </div>

        {/* Middle column - Weapons */}
        <div className={styles.middleColumn}>
          {MIDDLE_SLOTS.map(slot => (
            <EquipmentSlot 
              key={slot}
              item={equipmentMap[slot]}
              slotName={slot}
              itemDetails={itemDetails}
              upgradeDetails={upgradeDetails}
              infusionDetails={infusionDetails}
              skinDetails={skinDetails}
              dyeDetails={dyeDetails}
            />
          ))}
        </div>

        {/* Right column - Accessories + Aquatic */}
        <div className={styles.rightColumn}>
          {RIGHT_SLOTS.map(slot => (
            <EquipmentSlot 
              key={slot}
              item={equipmentMap[slot]}
              slotName={slot}
              itemDetails={itemDetails}
              upgradeDetails={upgradeDetails}
              infusionDetails={infusionDetails}
              skinDetails={skinDetails}
              dyeDetails={dyeDetails}
            />
          ))}
          
          {/* Cosmetic Infusions Showcase - Hidden for now */}
          {/* {cosmeticInfusions.length > 0 && (
            <div className={styles.cosmeticShowcase}>
              <div className={styles.showcaseTitle}>✨ Cosmetic Infusions</div>
              <div className={styles.showcaseItems}>
                {cosmeticInfusions.map(infusionId => {
                  const infusion = infusionDetails[infusionId];
                  return (
                    <div 
                      key={infusionId}
                      className={styles.showcaseItem}
                      title={infusion?.name || 'Cosmetic Infusion'}
                    >
                      {infusion?.icon && (
                        <img src={infusion.icon} alt={infusion.name} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}
