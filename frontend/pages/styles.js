import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Layout from '@components/Layout';
import FilterPanel from '@components/FilterPanel';
import ActiveFiltersBar from '@components/ActiveFiltersBar';
import MobileFilterToggle from '@components/MobileFilterToggle';
import DeepSearchPanel from '@components/DeepSearchPanel';
import PostCard from '@components/PostCard';
import styles from '../styles/Styles.module.css';
import homeStyles from '../styles/Home.module.css';
import {
  encodeFiltersToURL,
  decodeFiltersFromURL,
  buildAPIQueryParams,
  countActiveFilters,
  toggleFilter,
  clearAllFilters,
  removeFilter
} from '../utils/filterHelpers';

export default function StylesPage() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    query: '',
    author: ''
  });
  
  // Filter state management (Task 7.1)
  const [filters, setFilters] = useState({
    races: [],
    genders: [],
    classes: [],
    colors: []
  });
  
  // Mobile filter panel state (Task 7.1)
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  
  // Deep search panel state
  const [isDeepSearchOpen, setIsDeepSearchOpen] = useState(false);
  const [skinTags, setSkinTags] = useState([]);
  const [clearDeepSearch, setClearDeepSearch] = useState(0);
  
  // Debounce timer ref (Task 7.3)
  const debounceTimerRef = useRef(null);
  
  // Scroll position management (Task 8.3)
  const scrollPositionRef = useRef(0);
  
  // Masonry grid refs
  const gridRef = useRef(null);
  const masonryRef = useRef(null);

  // Parse URL parameters on mount (Task 7.2)
  useEffect(() => {
    if (router.isReady) {
      const urlFilters = decodeFiltersFromURL(router.query);
      setFilters(urlFilters);
    }
  }, [router.isReady]);

  // Update URL when filters change (Task 7.2)
  useEffect(() => {
    if (router.isReady) {
      const query = encodeFiltersToURL(filters);
      router.push(
        {
          pathname: '/styles',
          query
        },
        undefined,
        { shallow: true }
      );
    }
  }, [filters]);

  // Fetch posts with filters - debounced (Task 7.3)
  const fetchPosts = async (filtersToApply, skinTagsToApply = []) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      // Add search params
      if (searchParams.query) queryParams.append('q', searchParams.query);
      if (searchParams.author) queryParams.append('author', searchParams.author);
      
      // Add filter params - combines all filters into 'tags' parameter
      const filterParams = buildAPIQueryParams(filtersToApply);
      filterParams.forEach((value, key) => {
        queryParams.append(key, value);
      });

      // Add skin tags to the tags parameter
      if (skinTagsToApply.length > 0) {
        const existingTags = queryParams.get('tags');
        const allTags = existingTags 
          ? `${existingTags},${skinTagsToApply.join(',')}` 
          : skinTagsToApply.join(',');
        queryParams.set('tags', allTags);
      }

      // Call backend API directly
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(
        `${apiUrl}/api/v1/posts/search?${queryParams.toString()}`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch posts');
      }

      setPosts(data.data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Save scroll position before filter changes (Task 8.3)
  useEffect(() => {
    scrollPositionRef.current = window.scrollY;
  }, [filters]);

  // Restore scroll position after results load (Task 8.3)
  useEffect(() => {
    if (!loading && scrollPositionRef.current > 0) {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        window.scrollTo({
          top: scrollPositionRef.current,
          behavior: 'auto' // Instant scroll to prevent jarring jumps
        });
      });
    }
  }, [loading, posts]);

  // Manual search trigger - only fetch when user clicks search or applies filters
  const handleApplyFilters = () => {
    fetchPosts(filters);
  };

  // Initialize Masonry layout
  useEffect(() => {
    const initMasonry = async () => {
      if (
        typeof window !== 'undefined' &&
        gridRef.current &&
        posts &&
        posts.length > 0
      ) {
        try {
          const Masonry = (await import('masonry-layout')).default;
          const imagesLoaded = (await import('imagesloaded')).default;

          if (masonryRef.current) {
            masonryRef.current.destroy();
          }

          imagesLoaded(gridRef.current, () => {
            masonryRef.current = new Masonry(gridRef.current, {
              itemSelector: `.${homeStyles.card}`,
              columnWidth: `.${homeStyles.gridSizer}`,
              percentPosition: true,
              transitionDuration: '0.3s',
              fitWidth: false,
            });
          });
        } catch (error) {
          console.log('Masonry not available, using CSS Grid fallback');
        }
      }
    };

    const timer = setTimeout(initMasonry, 100);

    return () => {
      clearTimeout(timer);
      if (masonryRef.current) {
        masonryRef.current.destroy();
      }
    };
  }, [posts]);

  // Handle filter change (Task 7.1)
  const handleFilterChange = (category, value) => {
    // Single-select categories: races, genders, classes
    const singleSelectCategories = ['races', 'genders', 'classes'];
    const isSingleSelect = singleSelectCategories.includes(category);
    
    const newFilters = toggleFilter(filters, category, value, isSingleSelect);
    setFilters(newFilters);
    // Don't trigger fetch immediately - wait for user to click search button
  };

  // Handle clear all filters (Task 7.1)
  const handleClearAll = () => {
    const clearedFilters = clearAllFilters();
    setFilters(clearedFilters);
    setSearchParams({ query: '', author: '' });
    setSkinTags([]);
    setClearDeepSearch(prev => prev + 1); // Trigger deep search clear
    setPosts([]); // Clear results when clearing filters
  };

  // Handle remove individual filter (Task 7.1)
  const handleRemoveFilter = (category, value) => {
    const newFilters = removeFilter(filters, category, value);
    setFilters(newFilters);
    // Don't trigger fetch immediately - wait for user to click search button
  };

  // Toggle mobile filter panel (Task 7.1)
  const handleToggleFilterPanel = () => {
    setIsFilterPanelOpen(prev => !prev);
  };

  const handleSearch = () => {
    // Trigger fetch with all current filters, search params, and skin tags
    fetchPosts(filters, skinTags);
  };

  const handleSearchInputChange = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle deep search by skins
  const handleDeepSearch = (selectedSkins) => {
    setSkinTags(selectedSkins);
    // Don't trigger fetch immediately - wait for user to click search button
  };

  // Toggle deep search panel
  const handleToggleDeepSearch = () => {
    setIsDeepSearchOpen(prev => !prev);
  };

  // Calculate total active filters for mobile toggle
  const totalActiveFilters = countActiveFilters(filters);

  return (
    <Layout
      fullWidth
      title="Styles"
      description="Browse and search Guild Wars 2 fashion styles"
    >
      <div className={styles.container}>
        <div className="page-header">
          <h1 className="page-title">Browse Styles</h1>
          <p className="page-description">
            Discover amazing fashion styles created by the Guild Wars 2 community
          </p>
        </div>

        <main className={styles.main}>
        {/* Unified Search Panel */}
        <section className={styles.unifiedSearchPanel}>
          {/* Search Inputs */}
          <div className={styles.searchInputsSection}>
            <div className={styles.searchInputs}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  value={searchParams.query}
                  onChange={(e) => handleSearchInputChange('query', e.target.value)}
                  placeholder="Search by title..."
                  className={styles.searchInput}
                />
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  value={searchParams.author}
                  onChange={(e) => handleSearchInputChange('author', e.target.value)}
                  placeholder="Filter by author..."
                  className={styles.searchInput}
                />
              </div>
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <MobileFilterToggle
            filterCount={totalActiveFilters}
            isOpen={isFilterPanelOpen}
            onClick={handleToggleFilterPanel}
          />

          {/* Filter Panel */}
          <div className={styles.filterPanelWrapper}>
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearAll}
              isOpen={isFilterPanelOpen}
              onToggle={handleToggleFilterPanel}
            />
          </div>

          {/* Deep Search Panel */}
          <div className={styles.deepSearchWrapper}>
            <DeepSearchPanel
              onSearch={handleDeepSearch}
              isOpen={isDeepSearchOpen}
              onToggle={handleToggleDeepSearch}
              clearTrigger={clearDeepSearch}
            />
          </div>

          {/* Search Button */}
          <div className={styles.searchButtonSection}>
            <button 
              onClick={handleSearch}
              className={styles.unifiedSearchButton}
            >
              🔍 Search & Apply Filters
            </button>
            <button
              onClick={handleClearAll}
              className={styles.clearAllButton}
            >
              Clear All
            </button>
          </div>
        </section>

        {/* Active Filters Bar */}
        <ActiveFiltersBar
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAll}
        />

        {/* Results Section */}
        <section className={styles.resultsSection}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.loadingSpinner}></div>
              <div className={styles.loadingText}>Loading Styles...</div>
            </div>
          ) : posts.length > 0 ? (
            <>
              {/* Results Count Display */}
              <div className={styles.resultsCount}>
                <span className={styles.resultsCountText}>
                  Showing {posts.length} {posts.length === 1 ? 'result' : 'results'}
                </span>
              </div>
              <div ref={gridRef} className={homeStyles.grid}>
                <div className={homeStyles.gridSizer}></div>
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </>
          ) : (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>⚔</div>
              <h3 className={styles.noResultsTitle}>
                {countActiveFilters(filters) > 0 || searchParams.query || searchParams.author
                  ? 'No Styles Found'
                  : 'Select Filters to Search'}
              </h3>
              <p className={styles.noResultsMessage}>
                {countActiveFilters(filters) > 0 || searchParams.query || searchParams.author
                  ? 'No posts match your current filter selection.'
                  : 'Use the filters above to find Guild Wars 2 fashion styles.'}
              </p>
              <p className={styles.noResultsSuggestion}>
                {countActiveFilters(filters) > 0 || searchParams.query || searchParams.author
                  ? 'Try adjusting your filters or clearing all filters to see more results.'
                  : 'Select race, gender, armor weight, class, or other filters to get started.'}
              </p>
            </div>
          )}
        </section>
      </main>
      </div>
    </Layout>
  );
}
