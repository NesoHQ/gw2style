import React from 'react';
import FilterCategory from './FilterCategory';
import styles from '../styles/FilterPanel.module.css';
import { FILTER_OPTIONS, FILTER_CATEGORIES } from '../utils/filterConstants';

/**
 * FilterPanel Component
 * 
 * Container for all filter categories with a header and clear all functionality.
 * Displays filter categories for races, genders, weights, sources, and colors.
 * Supports mobile toggle behavior with slide-in animation.
 * 
 * @param {Object} filters - Current filter state object with arrays for each category
 * @param {function} onFilterChange - Callback when a filter is toggled, receives (category, value)
 * @param {function} onClearAll - Callback to clear all active filters
 * @param {boolean} isOpen - Whether the panel is open (for mobile)
 * @param {function} onToggle - Callback to toggle panel visibility (for mobile)
 */
const FilterPanel = ({ filters, onFilterChange, onClearAll, isOpen, onToggle }) => {
  // Calculate total active filters count
  const totalActiveFilters = Object.values(filters || {}).reduce((total, filterArray) => {
    return total + (Array.isArray(filterArray) ? filterArray.length : 0);
  }, 0);

  return (
    <>
      {/* Overlay backdrop for mobile */}
      <div 
        className={`${styles.filterPanelOverlay} ${isOpen ? styles.visible : ''}`}
        onClick={onToggle}
        aria-hidden="true"
      />
      
      {/* Filter Panel */}
      <div className={`${styles.filterPanel} ${isOpen ? styles.open : ''}`}>
        {/* Panel Header */}
        <div className={styles.filterPanelHeader}>
          <h2 className={styles.filterPanelTitle}>Filters</h2>
          
          {/* Close button for mobile */}
          <button
            className={styles.mobileCloseButton}
            onClick={onToggle}
            aria-label="Close filters"
            type="button"
          >
            ×
          </button>
          
          {/* Clear All button */}
          <button
            className={styles.clearAllButton}
            onClick={onClearAll}
            disabled={totalActiveFilters === 0}
            aria-label="Clear all filters"
            type="button"
          >
            Clear All
          </button>
        </div>

        {/* Filter Categories */}
        <div className={styles.filterCategories}>
          <FilterCategory
            title={FILTER_CATEGORIES.races}
            options={FILTER_OPTIONS.races}
            activeFilters={filters?.races || []}
            onToggle={(value) => onFilterChange('races', value)}
          />

          <FilterCategory
            title={FILTER_CATEGORIES.genders}
            options={FILTER_OPTIONS.genders}
            activeFilters={filters?.genders || []}
            onToggle={(value) => onFilterChange('genders', value)}
          />

          <FilterCategory
            title={FILTER_CATEGORIES.weights}
            options={FILTER_OPTIONS.weights}
            activeFilters={filters?.weights || []}
            onToggle={(value) => onFilterChange('weights', value)}
          />

          <FilterCategory
            title={FILTER_CATEGORIES.sources}
            options={FILTER_OPTIONS.sources}
            activeFilters={filters?.sources || []}
            onToggle={(value) => onFilterChange('sources', value)}
          />

          <FilterCategory
            title={FILTER_CATEGORIES.colors}
            options={FILTER_OPTIONS.colors}
            activeFilters={filters?.colors || []}
            onToggle={(value) => onFilterChange('colors', value)}
          />
        </div>
      </div>
    </>
  );
};

export default FilterPanel;
