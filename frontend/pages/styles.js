import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Layout from '@components/Layout';
import FilterPanel from '@components/FilterPanel';
import ActiveFiltersBar from '@components/ActiveFiltersBar';
import MobileFilterToggle from '@components/MobileFilterToggle';
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
    author: '',
    tag: '',
  });
  
  // Filter state management (Task 7.1)
  const [filters, setFilters] = useState({
    races: [],
    genders: [],
    weights: [],
    sources: [],
    colors: []
  });
  
  // Mobile filter panel state (Task 7.1)
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  
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
  const fetchPosts = async (filtersToApply) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      // Add search params
      if (searchParams.query) queryParams.append('q', searchParams.query);
      if (searchParams.author) queryParams.append('author', searchParams.author);
      if (searchParams.tag) queryParams.append('tag', searchParams.tag);
      
      // Add filter params (Task 7.3)
      const filterParams = buildAPIQueryParams(filtersToApply);
      filterParams.forEach((value, key) => {
        queryParams.append(key, value);
      });

      const response = await fetch(
        `/api/posts/search?${queryParams.toString()}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch posts');
      }

      setPosts(data.data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
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

  // Debounced effect for filter changes (Task 7.3)
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      fetchPosts(filters);
    }, 300);
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [filters, searchParams]);

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
    setFilters(prevFilters => toggleFilter(prevFilters, category, value));
  };

  // Handle clear all filters (Task 7.1)
  const handleClearAll = () => {
    setFilters(clearAllFilters());
  };

  // Handle remove individual filter (Task 7.1)
  const handleRemoveFilter = (category, value) => {
    setFilters(prevFilters => removeFilter(prevFilters, category, value));
  };

  // Toggle mobile filter panel (Task 7.1)
  const handleToggleFilterPanel = () => {
    setIsFilterPanelOpen(prev => !prev);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setSearchParams({
      query: formData.get('query') || '',
      author: formData.get('author') || '',
      tag: formData.get('tag') || '',
    });
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
        <section className={styles.searchSection}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchInputs}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="query"
                  placeholder="Search by title or description..."
                  className={styles.searchInput}
                />
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="author"
                  placeholder="Filter by author..."
                  className={styles.searchInput}
                />
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="tag"
                  placeholder="Filter by tag..."
                  className={styles.searchInput}
                />
              </div>
              <button type="submit" className={styles.searchButton}>
                Search
              </button>
            </div>
          </form>
        </section>

        {/* Mobile Filter Toggle */}
        <MobileFilterToggle
          filterCount={totalActiveFilters}
          isOpen={isFilterPanelOpen}
          onClick={handleToggleFilterPanel}
        />

        {/* Filter Panel - Horizontal on top */}
        <section className={styles.filterSection}>
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAll}
            isOpen={isFilterPanelOpen}
            onToggle={handleToggleFilterPanel}
          />
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
              <h3 className={styles.noResultsTitle}>No Styles Found</h3>
              <p className={styles.noResultsMessage}>
                No posts match your current filter selection.
              </p>
              <p className={styles.noResultsSuggestion}>
                Try adjusting your filters or clearing all filters to see more results.
              </p>
            </div>
          )}
        </section>
      </main>
      </div>
    </Layout>
  );
}
