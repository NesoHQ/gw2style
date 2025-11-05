import styles from '../styles/ActiveFiltersBar.module.css';

export default function ActiveFiltersBar({ filters, onRemoveFilter, onClearAll }) {
  // Flatten filters object to display all active filters
  const activeFilters = [];
  
  if (filters) {
    Object.entries(filters).forEach(([category, values]) => {
      if (Array.isArray(values) && values.length > 0) {
        values.forEach(value => {
          activeFilters.push({ category, value });
        });
      }
    });
  }

  // Don't render if no active filters
  if (activeFilters.length === 0) {
    return null;
  }

  const totalCount = activeFilters.length;

  return (
    <div 
      className={styles.activeFiltersBar}
      role="region"
      aria-label="Active filters"
      aria-live="polite"
    >
      <span className={styles.activeFiltersLabel}>
        Active Filters ({totalCount}):
      </span>
      
      <div className={styles.activeFiltersList}>
        {activeFilters.map(({ category, value }, index) => (
          <div key={`${category}-${value}-${index}`} className={styles.activeFilterChip}>
            <span>{value}</span>
            <button
              className={styles.removeFilterButton}
              onClick={() => onRemoveFilter(category, value)}
              aria-label={`Remove ${value} filter`}
              type="button"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        className={styles.clearAllButton}
        onClick={onClearAll}
        aria-label="Clear all filters"
        type="button"
      >
        Clear All
      </button>
    </div>
  );
}
