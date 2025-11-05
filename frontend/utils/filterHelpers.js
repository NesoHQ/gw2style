/**
 * Encodes filter state into URL query parameters
 * @param {Object} filters - Filter state object with arrays for each category
 * @returns {Object} URL query parameters object
 */
export const encodeFiltersToURL = (filters) => {
  const query = {};
  
  Object.keys(filters).forEach(category => {
    if (filters[category] && filters[category].length > 0) {
      query[category] = filters[category].join(',');
    }
  });
  
  return query;
};

/**
 * Decodes URL query parameters into filter state
 * @param {Object} query - URL query parameters object
 * @returns {Object} Filter state object
 */
export const decodeFiltersFromURL = (query) => {
  const filters = {
    races: [],
    genders: [],
    weights: [],
    sources: [],
    colors: []
  };
  
  Object.keys(filters).forEach(category => {
    if (query[category]) {
      filters[category] = query[category].split(',').filter(Boolean);
    }
  });
  
  return filters;
};

/**
 * Builds API query parameters from filter state
 * @param {Object} filters - Filter state object
 * @returns {URLSearchParams} URL search params ready for API call
 */
export const buildAPIQueryParams = (filters) => {
  const params = new URLSearchParams();
  
  Object.keys(filters).forEach(category => {
    if (filters[category] && filters[category].length > 0) {
      params.append(category, filters[category].join(','));
    }
  });
  
  return params;
};

/**
 * Counts total number of active filters across all categories
 * @param {Object} filters - Filter state object
 * @returns {number} Total count of active filters
 */
export const countActiveFilters = (filters) => {
  return Object.values(filters).reduce((total, categoryFilters) => {
    return total + (categoryFilters ? categoryFilters.length : 0);
  }, 0);
};

/**
 * Checks if a specific filter is active in a category
 * @param {Object} filters - Filter state object
 * @param {string} category - Filter category name
 * @param {string} value - Filter value to check
 * @returns {boolean} True if filter is active
 */
export const isFilterActive = (filters, category, value) => {
  return filters[category] && filters[category].includes(value);
};

/**
 * Toggles a filter on or off
 * @param {Object} filters - Current filter state
 * @param {string} category - Filter category name
 * @param {string} value - Filter value to toggle
 * @returns {Object} New filter state
 */
export const toggleFilter = (filters, category, value) => {
  const newFilters = { ...filters };
  const categoryFilters = [...(newFilters[category] || [])];
  
  const index = categoryFilters.indexOf(value);
  if (index > -1) {
    // Remove filter
    categoryFilters.splice(index, 1);
  } else {
    // Add filter
    categoryFilters.push(value);
  }
  
  newFilters[category] = categoryFilters;
  return newFilters;
};

/**
 * Clears all filters
 * @returns {Object} Empty filter state
 */
export const clearAllFilters = () => {
  return {
    races: [],
    genders: [],
    weights: [],
    sources: [],
    colors: []
  };
};

/**
 * Removes a specific filter from a category
 * @param {Object} filters - Current filter state
 * @param {string} category - Filter category name
 * @param {string} value - Filter value to remove
 * @returns {Object} New filter state
 */
export const removeFilter = (filters, category, value) => {
  const newFilters = { ...filters };
  newFilters[category] = (newFilters[category] || []).filter(v => v !== value);
  return newFilters;
};
