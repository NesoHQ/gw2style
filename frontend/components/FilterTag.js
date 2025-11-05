import React from 'react';
import styles from '../styles/FilterTag.module.css';

/**
 * FilterTag Component
 * 
 * A selectable filter button that can be toggled on/off.
 * Used within FilterCategory to represent individual filter options.
 * 
 * @param {string} label - The display text for the filter tag
 * @param {boolean} isActive - Whether the filter is currently active/selected
 * @param {function} onClick - Callback function when the tag is clicked
 */
const FilterTag = ({ label, isActive, onClick }) => {
  return (
    <button
      className={`${styles.filterTag} ${isActive ? styles.active : ''}`}
      onClick={onClick}
      aria-pressed={isActive}
      role="switch"
      type="button"
    >
      {label}
    </button>
  );
};

export default FilterTag;
