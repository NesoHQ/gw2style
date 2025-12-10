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

const POSTS_PER_PAGE = 25;

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
  
  // Pagination state for infinite scroll
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);
  const previousPostCount = useRef(0);
  const [initialLoad, setInitialLoad] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Store current search params for pagination
  const currentSearchRef = useRef({ filters: {}, skinTags: [], searchParams: {} });
  
  // Masonry grid refs
  const gridRef = useRef(null);
  const masonryRef = useRef(null);

  // Parse URL parameters on mount (Task 7.2)
  useEffect(() => {
    if (router.isReady) {
      const urlFilters = decodeFiltersFromURL(router.query);
      setFilters(urlFilters);
      setInitialLoad(false);
    }
  }, [router.isReady]);

  // Update URL when filters change (Task 7.2)
  useEffect(() => {
    if (router.isReady && !initialLoad) {
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

  // Fetch posts with filters and pagination
  const fetchPosts = async (filtersToApply, skinTagsToApply = [], searchParamsToApply = {}, pageNum = 1, append = false) => {
    if (loadingRef.current) return;
    
    loadingRef.current = true;
    setLoading(true);
    
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination params
      queryParams.append('page', pageNum.toString());
      queryParams.append('limit', POSTS_PER_PAGE.toString());
      
      // Add search params
      if (searchParamsToApply.query) queryParams.append('q', searchParamsToApply.query);
      if (searchParamsToApply.author) queryParams.append('author', searchParamsToApply.author);
      
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
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

      const newPosts = data.data || [];
      
      if (append) {
        setPosts(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const uniqueNewPosts = newPosts.filter(p => !existingIds.has(p.id));
          return [...prev, ...uniqueNewPosts];
        });
      } else {
        setPosts(newPosts);
        previousPostCount.current = newPosts.length;
      }
      
      // Check if there are more posts to load
      const pagination = data.pagination;
      if (pagination) {
        setHasMore(pagination.page < pagination.total_pages);
      } else {
        setHasMore(newPosts.length === POSTS_PER_PAGE);
      }
      
      setPage(pageNum);
      setHasSearched(true);
      
    } catch (error) {
      console.error('Error fetching posts:', error);
      if (!append) {
        setPosts([]);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  // Initialize Masonry once posts are loaded
  useEffect(() => {
    const initMasonry = async () => {
      if (
        typeof window !== 'undefined' &&
        gridRef.current &&
        posts.length > 0 &&
        !masonryRef.current
      ) {
        try {
          const Masonry = (await import('masonry-layout')).default;
          const imagesLoaded = (await import('imagesloaded')).default;

          imagesLoaded(gridRef.current, () => {
            masonryRef.current = new Masonry(gridRef.current, {
              itemSelector: `.${homeStyles.card}`,
              columnWidth: `.${homeStyles.gridSizer}`,
              percentPosition: true,
              transitionDuration: '0.3s',
              fitWidth: true,
            });
          });
        } catch (error) {
          console.log('Masonry not available, using CSS Grid fallback');
        }
      }
    };

    if (hasSearched && posts.length > 0) {
      const timer = setTimeout(initMasonry, 100);
      return () => clearTimeout(timer);
    }

    return () => {
      if (masonryRef.current) {
        masonryRef.current.destroy();
        masonryRef.current = null;
      }
    };
  }, [posts, hasSearched]);

  // Append new items to Masonry when posts change (for infinite scroll)
  useEffect(() => {
    const appendToMasonry = async () => {
      if (
        masonryRef.current &&
        gridRef.current &&
        posts.length > previousPostCount.current
      ) {
        try {
          const imagesLoaded = (await import('imagesloaded')).default;

          // Get all card elements
          const allCards = Array.from(gridRef.current.querySelectorAll(`.${homeStyles.card}`));
          // Get only the new ones
          const newCards = allCards.slice(previousPostCount.current);

          if (newCards.length > 0) {
            imagesLoaded(newCards, () => {
              masonryRef.current.appended(newCards);
              masonryRef.current.layout();

              // Fade in new cards after layout
              newCards.forEach(card => {
                card.style.transition = 'opacity 0.3s ease-in';
                card.style.opacity = '1';
              });
            });
          }

          previousPostCount.current = posts.length;
        } catch (error) {
          console.log('Error appending to masonry:', error);
        }
      }
    };

    appendToMasonry();
  }, [posts]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = async () => {
      if (loadingRef.current || !hasMore || !hasSearched) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 1500) {
        const nextPage = page + 1;
        const { filters: savedFilters, skinTags: savedSkinTags, searchParams: savedSearchParams } = currentSearchRef.current;
        await fetchPosts(savedFilters, savedSkinTags, savedSearchParams, nextPage, true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, page, hasSearched]);

  // Handle filter change (Task 7.1)
  const handleFilterChange = (category, value) => {
    // Single-select categories: races, genders, classes
    const singleSelectCategories = ['races', 'genders', 'classes'];
    const isSingleSelect = singleSelectCategories.includes(category);
    
    const newFilters = toggleFilter(filters, category, value, isSingleSelect);
    setFilters(newFilters);
  };

  // Handle clear all filters (Task 7.1)
  const handleClearAll = () => {
    const clearedFilters = clearAllFilters();
    setFilters(clearedFilters);
    setSearchParams({ query: '', author: '' });
    setSkinTags([]);
    setClearDeepSearch(prev => prev + 1);
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setHasSearched(false);
    previousPostCount.current = 0;
    
    // Destroy masonry instance
    if (masonryRef.current) {
      masonryRef.current.destroy();
      masonryRef.current = null;
    }
  };

  // Handle remove individual filter (Task 7.1)
  const handleRemoveFilter = (category, value) => {
    const newFilters = removeFilter(filters, category, value);
    setFilters(newFilters);
  };

  // Toggle mobile filter panel (Task 7.1)
  const handleToggleFilterPanel = () => {
    setIsFilterPanelOpen(prev => !prev);
  };

  const handleSearch = () => {
    // Reset pagination state for new search
    setPage(1);
    setHasMore(true);
    previousPostCount.current = 0;
    
    // Destroy existing masonry instance for fresh start
    if (masonryRef.current) {
      masonryRef.current.destroy();
      masonryRef.current = null;
    }
    
    // Store current search params for pagination
    currentSearchRef.current = {
      filters: { ...filters },
      skinTags: [...skinTags],
      searchParams: { ...searchParams }
    };
    
    // Trigger fetch with all current filters, search params, and skin tags
    fetchPosts(filters, skinTags, searchParams, 1, false);
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
          {!hasSearched ? (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>⚔</div>
              <h3 className={styles.noResultsTitle}>Select Filters to Search</h3>
              <p className={styles.noResultsMessage}>
                Use the filters above to find Guild Wars 2 fashion styles.
              </p>
              <p className={styles.noResultsSuggestion}>
                Select race, gender, armor weight, class, or other filters to get started.
              </p>
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
                {posts.map((post, index) => (
                  <PostCard 
                    key={post.id} 
                    post={post}
                    style={{
                      opacity: index >= previousPostCount.current && previousPostCount.current > 0 ? 0 : 1
                    }}
                  />
                ))}
              </div>
              {loading && (
                <div className={styles.loadingMore}>
                  Loading more posts...
                </div>
              )}
              {!hasMore && posts.length > 0 && (
                <div className={styles.endOfResults}>
                  No more posts to load
                </div>
              )}
            </>
          ) : loading ? (
            <div className={styles.loading}>
              <div className={styles.loadingSpinner}></div>
              <div className={styles.loadingText}>Loading Styles...</div>
            </div>
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
