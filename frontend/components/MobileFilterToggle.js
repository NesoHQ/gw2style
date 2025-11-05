import React from 'react';
import styles from '../styles/MobileFilterToggle.module.css';

const MobileFilterToggle = ({ filterCount, isOpen, onClick }) => {
  return (
    <button
      className={styles.mobileFilterToggle}
      onClick={onClick}
      aria-label={`${isOpen ? 'Hide' : 'Show'} filters`}
      aria-expanded={isOpen}
    >
      <span className={styles.toggleIcon}>
        {isOpen ? '✕' : '☰'}
      </span>
      <span className={styles.toggleText}>
        {isOpen ? 'Close Filters' : 'Show Filters'}
      </span>
      {filterCount > 0 && (
        <span className={styles.filterBadge} aria-label={`${filterCount} active filters`}>
          {filterCount}
        </span>
      )}
    </button>
  );
};

export default MobileFilterToggle;
