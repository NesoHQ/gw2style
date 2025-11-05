import React from 'react';
import FilterTag from './FilterTag';
import styles from '../styles/FilterCategory.module.css';

/**
 * FilterCategory Component
 * 
 * Groups related filter tags under a category label.
 * Renders a collection of FilterTag components for a specific filter type.
 * 
 * @param {string} title - The category title (e.g., "Race", "Gender", "Armor Weight")
 * @param {string[]} options - Array of filter option values to display
 * @param {string[]} activeFilters - Array of currently active filter values
 * @param {function} onToggle - Callback function when a filter tag is toggled, receives the value
 */
const FilterCategory = ({ title, options, activeFilters, onToggle }) => {
  return (
    <div className={styles.filterCategory}>
      <h3 className={styles.categoryTitle}>{title}</h3>
      <div className={styles.filterTags}>
        {options.map((option) => (
          <FilterTag
            key={option}
            label={option}
            isActive={activeFilters.includes(option)}
            onClick={() => onToggle(option)}
          />
        ))}
      </div>
    </div>
  );
};

export default FilterCategory;
