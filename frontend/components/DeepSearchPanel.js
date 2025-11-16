import React, { useState } from 'react';
import styles from '../styles/DeepSearchPanel.module.css';

/**
 * DeepSearchPanel Component
 * 
 * Advanced search panel for finding posts by specific equipment skins.
 * Users can search for armor pieces, weapons, backpack, and accessories.
 * Skin names are stored as tags in the database.
 */
const DeepSearchPanel = ({ onSearch, isOpen, onToggle }) => {
  const [skinSearches, setSkinSearches] = useState({
    head: '',
    shoulders: '',
    chest: '',
    gloves: '',
    legs: '',
    boots: '',
    mainHand: '',
    offHand: '',
    backpack: '',
    accessories: ''
  });

  const handleInputChange = (slot, value) => {
    setSkinSearches(prev => ({
      ...prev,
      [slot]: value
    }));
  };

  const handleSearch = () => {
    // Filter out empty values and create array of skin names
    const selectedSkins = Object.values(skinSearches).filter(skin => skin.trim() !== '');
    onSearch(selectedSkins);
  };

  const handleClear = () => {
    setSkinSearches({
      head: '',
      shoulders: '',
      chest: '',
      gloves: '',
      legs: '',
      boots: '',
      mainHand: '',
      offHand: '',
      backpack: '',
      accessories: ''
    });
    onSearch([]);
  };

  const hasAnySelection = Object.values(skinSearches).some(skin => skin.trim() !== '');

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
            <div className={styles.grid}>
              <div className={styles.inputGroup}>
                <label htmlFor="head">Head</label>
                <input
                  id="head"
                  type="text"
                  placeholder="e.g., Carapace Helm"
                  value={skinSearches.head}
                  onChange={(e) => handleInputChange('head', e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="shoulders">Shoulders</label>
                <input
                  id="shoulders"
                  type="text"
                  placeholder="e.g., Bladed Shoulders"
                  value={skinSearches.shoulders}
                  onChange={(e) => handleInputChange('shoulders', e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="chest">Chest</label>
                <input
                  id="chest"
                  type="text"
                  placeholder="e.g., Ascalonian Coat"
                  value={skinSearches.chest}
                  onChange={(e) => handleInputChange('chest', e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="gloves">Gloves</label>
                <input
                  id="gloves"
                  type="text"
                  placeholder="e.g., Flame Legion Gloves"
                  value={skinSearches.gloves}
                  onChange={(e) => handleInputChange('gloves', e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="legs">Legs</label>
                <input
                  id="legs"
                  type="text"
                  placeholder="e.g., Vigil Leggings"
                  value={skinSearches.legs}
                  onChange={(e) => handleInputChange('legs', e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="boots">Boots</label>
                <input
                  id="boots"
                  type="text"
                  placeholder="e.g., Aetherblade Boots"
                  value={skinSearches.boots}
                  onChange={(e) => handleInputChange('boots', e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Weapons Section */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Weapons</h4>
            <div className={styles.grid}>
              <div className={styles.inputGroup}>
                <label htmlFor="mainHand">Main Hand</label>
                <input
                  id="mainHand"
                  type="text"
                  placeholder="e.g., Eternity"
                  value={skinSearches.mainHand}
                  onChange={(e) => handleInputChange('mainHand', e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="offHand">Off Hand</label>
                <input
                  id="offHand"
                  type="text"
                  placeholder="e.g., The Bifrost"
                  value={skinSearches.offHand}
                  onChange={(e) => handleInputChange('offHand', e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Other Equipment Section */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Other Equipment</h4>
            <div className={styles.grid}>
              <div className={styles.inputGroup}>
                <label htmlFor="backpack">Backpack</label>
                <input
                  id="backpack"
                  type="text"
                  placeholder="e.g., Ad Infinitum"
                  value={skinSearches.backpack}
                  onChange={(e) => handleInputChange('backpack', e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="accessories">Accessories</label>
                <input
                  id="accessories"
                  type="text"
                  placeholder="e.g., Aurora"
                  value={skinSearches.accessories}
                  onChange={(e) => handleInputChange('accessories', e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            <button
              className={styles.searchButton}
              onClick={handleSearch}
              disabled={!hasAnySelection}
            >
              Search by Skins
            </button>
            <button
              className={styles.clearButton}
              onClick={handleClear}
              disabled={!hasAnySelection}
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeepSearchPanel;
