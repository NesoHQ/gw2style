import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/DeepSearchPanel.module.css';
import { getSkinsFromCache } from '../utils/skinCache';

/**
 * DeepSearchPanel Component
 * 
 * Advanced search panel for finding posts by specific equipment skins.
 * Users can search for armor pieces, weapons, backpack, and accessories.
 * Skin names are stored as tags in the database.
 */
const DeepSearchPanel = ({ onSearch, isOpen, onToggle, clearTrigger }) => {
  const [skinSearches, setSkinSearches] = useState({
    head: '',
    shoulders: '',
    chest: '',
    gloves: '',
    legs: '',
    boots: '',
    set1MainHand: '',
    set1OffHand: '',
    set2MainHand: '',
    set2OffHand: '',
    backpack: ''
  });

  // Clear all fields when clearTrigger changes
  useEffect(() => {
    if (clearTrigger) {
      setSkinSearches({
        head: '',
        shoulders: '',
        chest: '',
        gloves: '',
        legs: '',
        boots: '',
        set1MainHand: '',
        set1OffHand: '',
        set2MainHand: '',
        set2OffHand: '',
        backpack: ''
      });
    }
  }, [clearTrigger]);

  const [suggestions, setSuggestions] = useState({});
  const [activeSuggestionSlot, setActiveSuggestionSlot] = useState(null);
  const [allSkins, setAllSkins] = useState([]);
  const suggestionRefs = useRef({});

  // Mapping of slots to armor subtypes
  const slotToSubtype = {
    head: 'Helm',
    shoulders: 'Shoulders',
    chest: 'Coat',
    gloves: 'Gloves',
    legs: 'Leggings',
    boots: 'Boots'
  };

  // Two-handed weapon types
  const twoHandedWeapons = ['Greatsword', 'Hammer', 'Longbow', 'Rifle', 'Shortbow', 'Staff'];
  
  // Off-hand only weapon types
  const offHandOnlyWeapons = ['Focus', 'Shield', 'Torch', 'Warhorn'];

  // Check if a weapon is two-handed
  const isTwoHandedWeapon = (weaponName) => {
    if (!weaponName) return false;
    const weapon = allSkins.find(skin => skin.name === weaponName && skin.type === 'Weapon');
    return weapon && twoHandedWeapons.includes(weapon.subtype);
  };

  // Check if off-hand should be disabled for a weapon set
  const isOffHandDisabled = (setNumber) => {
    const mainHandSlot = `set${setNumber}MainHand`;
    return isTwoHandedWeapon(skinSearches[mainHandSlot]);
  };

  // Load skins from cache on mount
  useEffect(() => {
    const cache = getSkinsFromCache();
    if (cache && cache.skins) {
      setAllSkins(cache.skins);
    }
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeSuggestionSlot && suggestionRefs.current[activeSuggestionSlot]) {
        if (!suggestionRefs.current[activeSuggestionSlot].contains(event.target)) {
          setActiveSuggestionSlot(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeSuggestionSlot]);

  const handleInputChange = (slot, value) => {
    setSkinSearches(prev => {
      const newState = {
        ...prev,
        [slot]: value
      };
      
      // If main hand changes to two-handed weapon, clear off-hand
      if (slot.includes('MainHand')) {
        const setNumber = slot.includes('set1') ? 1 : 2;
        const offHandSlot = `set${setNumber}OffHand`;
        const weapon = allSkins.find(skin => skin.name === value && skin.type === 'Weapon');
        if (weapon && twoHandedWeapons.includes(weapon.subtype)) {
          newState[offHandSlot] = '';
        }
      }
      
      return newState;
    });

    // Generate suggestions based on input
    if (value.trim().length >= 2) {
      const filtered = filterSkinsBySlot(slot, value);
      setSuggestions(prev => ({
        ...prev,
        [slot]: filtered.slice(0, 10) // Limit to 10 suggestions
      }));
      setActiveSuggestionSlot(slot);
    } else {
      setSuggestions(prev => ({
        ...prev,
        [slot]: []
      }));
      setActiveSuggestionSlot(null);
    }
  };

  const filterSkinsBySlot = (slot, query) => {
    const lowerQuery = query.toLowerCase();
    
    // For armor slots, filter by subtype
    if (slotToSubtype[slot]) {
      return allSkins.filter(skin => 
        skin.type === 'Armor' &&
        skin.subtype === slotToSubtype[slot] &&
        skin.name.toLowerCase().includes(lowerQuery)
      );
    }
    
    // For backpack
    if (slot === 'backpack') {
      return allSkins.filter(skin => 
        skin.type === 'Back' &&
        skin.name.toLowerCase().includes(lowerQuery)
      );
    }
    
    // For main hand weapons (exclude off-hand only weapons)
    if (slot.includes('MainHand')) {
      return allSkins.filter(skin => 
        skin.type === 'Weapon' &&
        !offHandOnlyWeapons.includes(skin.subtype) &&
        skin.name.toLowerCase().includes(lowerQuery)
      );
    }
    
    // For off hand weapons (exclude two-handed weapons and main-hand-only like Scepter)
    if (slot.includes('OffHand')) {
      return allSkins.filter(skin => 
        skin.type === 'Weapon' &&
        !twoHandedWeapons.includes(skin.subtype) &&
        skin.subtype !== 'Scepter' && // Scepter is main-hand only
        skin.name.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Default: return empty
    return [];
  };

  const handleSuggestionClick = (slot, skinName) => {
    setSkinSearches(prev => ({
      ...prev,
      [slot]: skinName
    }));
    setSuggestions(prev => ({
      ...prev,
      [slot]: []
    }));
    setActiveSuggestionSlot(null);
  };

  // Update parent component whenever skin searches change
  useEffect(() => {
    const selectedSkins = Object.values(skinSearches).filter(skin => skin.trim() !== '');
    onSearch(selectedSkins);
  }, [skinSearches]);

  return (
    <div className={`${styles.deepSearchPanel} ${isOpen ? styles.open : ''}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>🔍 Deep Search - Equipment Skins</h3>
        <button
          className={styles.toggleButton}
          onClick={onToggle}
          aria-label={isOpen ? 'Collapse deep search' : 'Expand deep search'}
        >
          {isOpen ? '▲' : '▼'}
        </button>
      </div>

      {isOpen && (
        <div className={styles.content}>
          <p className={styles.description}>
            Search for posts by specific armor or weapon skin names. Leave fields empty to ignore them.
          </p>

          {/* Armor Section */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Armor Pieces</h4>
            <div className={styles.weaponSetGrid}>
              <div className={styles.inputGroup} ref={el => suggestionRefs.current['head'] = el}>
                <label htmlFor="head">Head</label>
                <input
                  id="head"
                  type="text"
                  placeholder="e.g., Carapace Helm"
                  value={skinSearches.head}
                  onChange={(e) => handleInputChange('head', e.target.value)}
                  className={styles.input}
                  autoComplete="off"
                />
                {activeSuggestionSlot === 'head' && suggestions.head && suggestions.head.length > 0 && (
                  <ul className={styles.suggestions}>
                    {suggestions.head.map((skin, idx) => (
                      <li
                        key={idx}
                        onClick={() => handleSuggestionClick('head', skin.name)}
                        className={styles.suggestionItem}
                      >
                        {skin.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className={styles.inputGroup} ref={el => suggestionRefs.current['shoulders'] = el}>
                <label htmlFor="shoulders">Shoulders</label>
                <input
                  id="shoulders"
                  type="text"
                  placeholder="e.g., Bladed Shoulders"
                  value={skinSearches.shoulders}
                  onChange={(e) => handleInputChange('shoulders', e.target.value)}
                  className={styles.input}
                  autoComplete="off"
                />
                {activeSuggestionSlot === 'shoulders' && suggestions.shoulders && suggestions.shoulders.length > 0 && (
                  <ul className={styles.suggestions}>
                    {suggestions.shoulders.map((skin, idx) => (
                      <li
                        key={idx}
                        onClick={() => handleSuggestionClick('shoulders', skin.name)}
                        className={styles.suggestionItem}
                      >
                        {skin.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className={styles.inputGroup} ref={el => suggestionRefs.current['chest'] = el}>
                <label htmlFor="chest">Chest</label>
                <input
                  id="chest"
                  type="text"
                  placeholder="e.g., Ascalonian Coat"
                  value={skinSearches.chest}
                  onChange={(e) => handleInputChange('chest', e.target.value)}
                  className={styles.input}
                  autoComplete="off"
                />
                {activeSuggestionSlot === 'chest' && suggestions.chest && suggestions.chest.length > 0 && (
                  <ul className={styles.suggestions}>
                    {suggestions.chest.map((skin, idx) => (
                      <li
                        key={idx}
                        onClick={() => handleSuggestionClick('chest', skin.name)}
                        className={styles.suggestionItem}
                      >
                        {skin.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className={styles.inputGroup} ref={el => suggestionRefs.current['gloves'] = el}>
                <label htmlFor="gloves">Gloves</label>
                <input
                  id="gloves"
                  type="text"
                  placeholder="e.g., Flame Legion Gloves"
                  value={skinSearches.gloves}
                  onChange={(e) => handleInputChange('gloves', e.target.value)}
                  className={styles.input}
                  autoComplete="off"
                />
                {activeSuggestionSlot === 'gloves' && suggestions.gloves && suggestions.gloves.length > 0 && (
                  <ul className={styles.suggestions}>
                    {suggestions.gloves.map((skin, idx) => (
                      <li
                        key={idx}
                        onClick={() => handleSuggestionClick('gloves', skin.name)}
                        className={styles.suggestionItem}
                      >
                        {skin.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className={styles.inputGroup} ref={el => suggestionRefs.current['legs'] = el}>
                <label htmlFor="legs">Legs</label>
                <input
                  id="legs"
                  type="text"
                  placeholder="e.g., Vigil Leggings"
                  value={skinSearches.legs}
                  onChange={(e) => handleInputChange('legs', e.target.value)}
                  className={styles.input}
                  autoComplete="off"
                />
                {activeSuggestionSlot === 'legs' && suggestions.legs && suggestions.legs.length > 0 && (
                  <ul className={styles.suggestions}>
                    {suggestions.legs.map((skin, idx) => (
                      <li
                        key={idx}
                        onClick={() => handleSuggestionClick('legs', skin.name)}
                        className={styles.suggestionItem}
                      >
                        {skin.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className={styles.inputGroup} ref={el => suggestionRefs.current['boots'] = el}>
                <label htmlFor="boots">Boots</label>
                <input
                  id="boots"
                  type="text"
                  placeholder="e.g., Aetherblade Boots"
                  value={skinSearches.boots}
                  onChange={(e) => handleInputChange('boots', e.target.value)}
                  className={styles.input}
                  autoComplete="off"
                />
                {activeSuggestionSlot === 'boots' && suggestions.boots && suggestions.boots.length > 0 && (
                  <ul className={styles.suggestions}>
                    {suggestions.boots.map((skin, idx) => (
                      <li
                        key={idx}
                        onClick={() => handleSuggestionClick('boots', skin.name)}
                        className={styles.suggestionItem}
                      >
                        {skin.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Weapons Section */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Weapon Set 1</h4>
            <div className={styles.weaponSetGrid}>
              <div className={styles.inputGroup} ref={el => suggestionRefs.current['set1MainHand'] = el}>
                <label htmlFor="set1MainHand">Main Hand</label>
                <input
                  id="set1MainHand"
                  type="text"
                  placeholder="e.g., Eternity"
                  value={skinSearches.set1MainHand}
                  onChange={(e) => handleInputChange('set1MainHand', e.target.value)}
                  className={styles.input}
                  autoComplete="off"
                />
                {activeSuggestionSlot === 'set1MainHand' && suggestions.set1MainHand && suggestions.set1MainHand.length > 0 && (
                  <ul className={styles.suggestions}>
                    {suggestions.set1MainHand.map((skin, idx) => (
                      <li
                        key={idx}
                        onClick={() => handleSuggestionClick('set1MainHand', skin.name)}
                        className={styles.suggestionItem}
                      >
                        {skin.name} <span className={styles.weaponType}>({skin.subtype})</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className={styles.inputGroup} ref={el => suggestionRefs.current['set1OffHand'] = el}>
                <label htmlFor="set1OffHand">
                  Off Hand {isOffHandDisabled(1) && <span className={styles.disabledNote}>(Two-handed weapon)</span>}
                </label>
                <input
                  id="set1OffHand"
                  type="text"
                  placeholder="e.g., Incinerator"
                  value={skinSearches.set1OffHand}
                  onChange={(e) => handleInputChange('set1OffHand', e.target.value)}
                  className={`${styles.input} ${isOffHandDisabled(1) ? styles.disabled : ''}`}
                  autoComplete="off"
                  disabled={isOffHandDisabled(1)}
                />
                {activeSuggestionSlot === 'set1OffHand' && suggestions.set1OffHand && suggestions.set1OffHand.length > 0 && (
                  <ul className={styles.suggestions}>
                    {suggestions.set1OffHand.map((skin, idx) => (
                      <li
                        key={idx}
                        onClick={() => handleSuggestionClick('set1OffHand', skin.name)}
                        className={styles.suggestionItem}
                      >
                        {skin.name} <span className={styles.weaponType}>({skin.subtype})</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Weapon Set 2</h4>
            <div className={styles.weaponSetGrid}>
              <div className={styles.inputGroup} ref={el => suggestionRefs.current['set2MainHand'] = el}>
                <label htmlFor="set2MainHand">Main Hand</label>
                <input
                  id="set2MainHand"
                  type="text"
                  placeholder="e.g., Bolt"
                  value={skinSearches.set2MainHand}
                  onChange={(e) => handleInputChange('set2MainHand', e.target.value)}
                  className={styles.input}
                  autoComplete="off"
                />
                {activeSuggestionSlot === 'set2MainHand' && suggestions.set2MainHand && suggestions.set2MainHand.length > 0 && (
                  <ul className={styles.suggestions}>
                    {suggestions.set2MainHand.map((skin, idx) => (
                      <li
                        key={idx}
                        onClick={() => handleSuggestionClick('set2MainHand', skin.name)}
                        className={styles.suggestionItem}
                      >
                        {skin.name} <span className={styles.weaponType}>({skin.subtype})</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className={styles.inputGroup} ref={el => suggestionRefs.current['set2OffHand'] = el}>
                <label htmlFor="set2OffHand">
                  Off Hand {isOffHandDisabled(2) && <span className={styles.disabledNote}>(Two-handed weapon)</span>}
                </label>
                <input
                  id="set2OffHand"
                  type="text"
                  placeholder="e.g., The Moot"
                  value={skinSearches.set2OffHand}
                  onChange={(e) => handleInputChange('set2OffHand', e.target.value)}
                  className={`${styles.input} ${isOffHandDisabled(2) ? styles.disabled : ''}`}
                  autoComplete="off"
                  disabled={isOffHandDisabled(2)}
                />
                {activeSuggestionSlot === 'set2OffHand' && suggestions.set2OffHand && suggestions.set2OffHand.length > 0 && (
                  <ul className={styles.suggestions}>
                    {suggestions.set2OffHand.map((skin, idx) => (
                      <li
                        key={idx}
                        onClick={() => handleSuggestionClick('set2OffHand', skin.name)}
                        className={styles.suggestionItem}
                      >
                        {skin.name} <span className={styles.weaponType}>({skin.subtype})</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Backpack Section */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Backpack</h4>
            <div className={styles.grid}>
              <div className={styles.inputGroup} ref={el => suggestionRefs.current['backpack'] = el}>
                <label htmlFor="backpack">Backpack</label>
                <input
                  id="backpack"
                  type="text"
                  placeholder="e.g., Ad Infinitum"
                  value={skinSearches.backpack}
                  onChange={(e) => handleInputChange('backpack', e.target.value)}
                  className={styles.input}
                  autoComplete="off"
                />
                {activeSuggestionSlot === 'backpack' && suggestions.backpack && suggestions.backpack.length > 0 && (
                  <ul className={styles.suggestions}>
                    {suggestions.backpack.map((skin, idx) => (
                      <li
                        key={idx}
                        onClick={() => handleSuggestionClick('backpack', skin.name)}
                        className={styles.suggestionItem}
                      >
                        {skin.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>


        </div>
      )}
    </div>
  );
};

export default DeepSearchPanel;
