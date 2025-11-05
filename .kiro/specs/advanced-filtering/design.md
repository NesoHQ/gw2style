# Design Document

## Overview

This design implements an advanced filtering system for the styles browse page, inspired by mirapri.com's filtering interface. The system allows users to filter fashion posts by race, gender, armor weight, source, and dye colors using an intuitive tag-based interface. The design integrates seamlessly with the existing GW2-themed UI, using gold accents, fantasy typography, and ornate styling.

The filtering system will be implemented as a sidebar panel (desktop) or collapsible section (mobile) that displays filter categories with selectable tags. Active filters will be highlighted with gold accents and displayed in a summary bar above the results.

## Architecture

### Component Structure

```
pages/styles.js (Enhanced)
├── FilterPanel Component (New)
│   ├── FilterCategory Component (New)
│   │   └── FilterTag Component (New)
│   └── ActiveFiltersBar Component (New)
└── PostGrid Component (Existing, enhanced)
```

### State Management

The filtering system will use React's `useState` hook to manage:
- Active filters for each category (race, gender, weight, source, colors)
- Loading state during API calls
- Filtered posts array
- Filter panel visibility (mobile)

```javascript
const [filters, setFilters] = useState({
  races: [],
  genders: [],
  weights: [],
  sources: [],
  colors: []
});
const [filteredPosts, setFilteredPosts] = useState([]);
const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
const [loading, setLoading] = useState(false);
```

### URL State Synchronization

Use Next.js router to sync filters with URL query parameters:
```javascript
// Example URL: /styles?races=Human,Norn&weights=Light&colors=Red%20dyes
const router = useRouter();

// Update URL when filters change
useEffect(() => {
  const query = {};
  if (filters.races.length) query.races = filters.races.join(',');
  if (filters.genders.length) query.genders = filters.genders.join(',');
  // ... etc
  
  router.push({ pathname: '/styles', query }, undefined, { shallow: true });
}, [filters]);

// Parse URL on mount
useEffect(() => {
  const { races, genders, weights, sources, colors } = router.query;
  setFilters({
    races: races ? races.split(',') : [],
    genders: genders ? genders.split(',') : [],
    weights: weights ? weights.split(',') : [],
    sources: sources ? sources.split(',') : [],
    colors: colors ? colors.split(',') : []
  });
}, []);
```

## Components and Interfaces

### 1. FilterPanel Component

**Purpose:** Container for all filter categories and the active filters bar

**Layout (Desktop):**
```
┌─────────────────────────────────────┐
│  FILTERS                    [Clear] │
├─────────────────────────────────────┤
│  Active: Human, Light, Red dyes (3) │
├─────────────────────────────────────┤
│  ╔═══════════════════════════════╗  │
│  ║  RACE                         ║  │
│  ║  [Human] [Norn] [Asura]       ║  │
│  ║  [Sylvari] [Charr]            ║  │
│  ╚═══════════════════════════════╝  │
│  ╔═══════════════════════════════╗  │
│  ║  GENDER                       ║  │
│  ║  [Male] [Female]              ║  │
│  ╚═══════════════════════════════╝  │
│  ╔═══════════════════════════════╗  │
│  ║  ARMOR WEIGHT                 ║  │
│  ║  [Light] [Medium] [Heavy]     ║  │
│  ╚═══════════════════════════════╝  │
│  ... (more categories)              │
└─────────────────────────────────────┘
```

**Props:**
```typescript
interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (category: string, value: string) => void;
  onClearAll: () => void;
  isOpen: boolean; // For mobile
  onToggle: () => void; // For mobile
}
```

**Styling:**
```css
.filterPanel {
  background: linear-gradient(135deg, 
    rgba(26, 31, 46, 0.95), 
    rgba(36, 41, 56, 0.95));
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 8px;
  padding: 1.5rem;
  position: sticky;
  top: 100px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}

.filterPanelHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid;
  border-image: linear-gradient(90deg, 
    #d4af37, 
    transparent) 1;
}

.filterPanelTitle {
  font-family: 'Cinzel', serif;
  font-size: 1.5rem;
  color: #d4af37;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.clearAllButton {
  background: transparent;
  border: 2px solid rgba(212, 175, 55, 0.3);
  color: #d4af37;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clearAllButton:hover {
  border-color: #d4af37;
  background: rgba(212, 175, 55, 0.1);
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.2);
}
```

### 2. FilterCategory Component

**Purpose:** Groups related filter tags under a category label

**Props:**
```typescript
interface FilterCategoryProps {
  title: string;
  options: string[];
  activeFilters: string[];
  onToggle: (value: string) => void;
}
```

**Styling:**
```css
.filterCategory {
  margin-bottom: 2rem;
}

.categoryTitle {
  font-family: 'Cinzel', serif;
  font-size: 1rem;
  color: #d4af37;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.categoryTitle::before {
  content: '◆';
  font-size: 0.75rem;
  opacity: 0.6;
}

.filterTags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
```

### 3. FilterTag Component

**Purpose:** Individual selectable filter button

**Props:**
```typescript
interface FilterTagProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}
```

**Styling:**
```css
.filterTag {
  padding: 0.5rem 1rem;
  background: rgba(26, 31, 46, 0.6);
  border: 2px solid rgba(212, 175, 55, 0.2);
  border-radius: 6px;
  color: #a8a29e;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.filterTag:hover {
  border-color: rgba(212, 175, 55, 0.5);
  color: #e8e6e3;
  background: rgba(26, 31, 46, 0.8);
}

.filterTag.active {
  background: linear-gradient(135deg, 
    rgba(212, 175, 55, 0.2), 
    rgba(205, 127, 50, 0.2));
  border-color: #d4af37;
  color: #f4d03f;
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
  font-weight: 600;
}

.filterTag.active::before {
  content: '✓ ';
  margin-right: 0.25rem;
}

/* Touch-friendly sizing for mobile */
@media (max-width: 768px) {
  .filterTag {
    padding: 0.75rem 1.25rem;
    font-size: 1rem;
  }
}
```

### 4. ActiveFiltersBar Component

**Purpose:** Displays summary of active filters with quick removal

**Props:**
```typescript
interface ActiveFiltersBarProps {
  filters: FilterState;
  onRemoveFilter: (category: string, value: string) => void;
  onClearAll: () => void;
}
```

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  Active Filters (3):                                │
│  [Human ×] [Light ×] [Red dyes ×]     [Clear All]  │
└─────────────────────────────────────────────────────┘
```

**Styling:**
```css
.activeFiltersBar {
  background: rgba(26, 31, 46, 0.5);
  border: 2px solid rgba(212, 175, 55, 0.2);
  border-radius: 8px;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.activeFiltersLabel {
  font-family: 'Cinzel', serif;
  color: #d4af37;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  white-space: nowrap;
}

.activeFiltersList {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  flex: 1;
}

.activeFilterChip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background: linear-gradient(135deg, 
    rgba(212, 175, 55, 0.15), 
    rgba(205, 127, 50, 0.15));
  border: 1px solid #d4af37;
  border-radius: 20px;
  color: #f4d03f;
  font-size: 0.875rem;
  font-weight: 500;
}

.removeFilterButton {
  background: none;
  border: none;
  color: #d4af37;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.removeFilterButton:hover {
  background: rgba(212, 175, 55, 0.2);
  color: #f4d03f;
}
```

### 5. Mobile Filter Toggle

**Purpose:** Button to show/hide filter panel on mobile

**Styling:**
```css
.mobileFilterToggle {
  display: none;
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #d4af37, #cd7f32);
  border: 2px solid #f4d03f;
  border-radius: 8px;
  color: #0a0e1a;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .mobileFilterToggle {
    display: flex;
  }
  
  .filterPanel {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    max-height: 100vh;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .filterPanel.open {
    transform: translateX(0);
  }
  
  .filterPanelOverlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(10, 14, 26, 0.8);
    z-index: 999;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
  
  .filterPanelOverlay.visible {
    opacity: 1;
    pointer-events: auto;
  }
}
```

### 6. Page Layout

**Desktop Layout:**
```
┌─────────────────────────────────────────────────────┐
│  Header                                             │
├──────────────┬──────────────────────────────────────┤
│              │  Active Filters Bar                  │
│  Filter      ├──────────────────────────────────────┤
│  Panel       │  ┌────┐ ┌────┐ ┌────┐ ┌────┐        │
│  (Sidebar)   │  │Post│ │Post│ │Post│ │Post│        │
│              │  └────┘ └────┘ └────┘ └────┘        │
│              │  ┌────┐ ┌────┐ ┌────┐ ┌────┐        │
│              │  │Post│ │Post│ │Post│ │Post│        │
│              │  └────┘ └────┘ └────┘ └────┘        │
└──────────────┴──────────────────────────────────────┘
```

**Mobile Layout:**
```
┌─────────────────────────────────────┐
│  Header                             │
├─────────────────────────────────────┤
│  [Show Filters (3)]                 │
├─────────────────────────────────────┤
│  Active: [Human ×] [Light ×]        │
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │         Post                  │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │         Post                  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

**CSS Grid Layout:**
```css
.stylesPageLayout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.filterPanelColumn {
  /* Sticky positioning handled in FilterPanel */
}

.resultsColumn {
  min-width: 0; /* Prevents grid blowout */
}

@media (max-width: 1024px) {
  .stylesPageLayout {
    grid-template-columns: 250px 1fr;
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .stylesPageLayout {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
```

## Data Models

### Filter State Interface

```typescript
interface FilterState {
  races: string[];      // ["Human", "Norn", ...]
  genders: string[];    // ["Male", "Female"]
  weights: string[];    // ["Light", "Medium", "Heavy"]
  sources: string[];    // ["Gem Store"]
  colors: string[];     // ["Red dyes", "Blue dyes", ...]
}
```

### Filter Constants

```javascript
export const FILTER_OPTIONS = {
  races: ["Human", "Norn", "Asura", "Sylvari", "Charr"],
  genders: ["Male", "Female"],
  weights: ["Light", "Medium", "Heavy"],
  sources: ["Gem Store"],
  colors: [
    "Gray dyes",
    "Brown dyes",
    "Red dyes",
    "Orange dyes",
    "Yellow dyes",
    "Green dyes",
    "Blue dyes",
    "Purple dyes"
  ]
};
```

### API Request Format

The frontend will send filter parameters to the backend API:

```javascript
// Example API call
const queryParams = new URLSearchParams();
if (filters.races.length) {
  queryParams.append('races', filters.races.join(','));
}
if (filters.genders.length) {
  queryParams.append('genders', filters.genders.join(','));
}
// ... etc

const response = await fetch(`/api/posts/search?${queryParams.toString()}`);
```

**Expected API Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Elegant Light Armor",
      "thumbnail": "...",
      "author_name": "Player123",
      "likes_count": 42,
      "race": "Human",
      "gender": "Female",
      "weight": "Light",
      "colors": ["Red dyes", "Gold dyes"]
    }
  ],
  "total": 15,
  "filters_applied": {
    "races": ["Human"],
    "weights": ["Light"]
  }
}
```

## Error Handling

### No Results State

```css
.noResults {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(26, 31, 46, 0.5);
  border: 2px dashed rgba(212, 175, 55, 0.3);
  border-radius: 8px;
  margin: 2rem 0;
}

.noResultsIcon {
  font-size: 3rem;
  color: #d4af37;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.noResultsTitle {
  font-family: 'Cinzel', serif;
  font-size: 1.5rem;
  color: #d4af37;
  margin-bottom: 0.5rem;
}

.noResultsMessage {
  color: #a8a29e;
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.noResultsSuggestion {
  color: #6b7280;
  font-size: 0.875rem;
}
```

### Loading State

```css
.loadingOverlay {
  position: relative;
  min-height: 400px;
}

.loadingSpinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border: 4px solid rgba(212, 175, 55, 0.2);
  border-top-color: #d4af37;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}
```

### API Error Handling

```javascript
const fetchFilteredPosts = async (filters) => {
  setLoading(true);
  try {
    const response = await fetch(buildApiUrl(filters));
    
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    
    const data = await response.json();
    setFilteredPosts(data.data || []);
  } catch (error) {
    console.error('Error fetching filtered posts:', error);
    // Show error toast or message
    setError('Failed to load posts. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

## Testing Strategy

### Unit Tests
- Test filter state management (add/remove filters)
- Test URL parameter encoding/decoding
- Test filter tag active state toggling
- Test clear all functionality

### Integration Tests
- Test filter changes trigger API calls
- Test URL updates when filters change
- Test page load with URL parameters
- Test multiple simultaneous filter selections

### Visual Tests
- Verify filter panel styling matches GW2 theme
- Test responsive layout on mobile/tablet/desktop
- Verify active filter highlighting
- Test hover states and animations

### Accessibility Tests
- Keyboard navigation through filter tags
- Screen reader announcements for filter changes
- Focus management when opening/closing mobile panel
- Color contrast for all filter states

### Performance Tests
- Measure filter interaction response time
- Test with large numbers of posts
- Verify smooth animations on mobile
- Check memory usage with many active filters

## Implementation Notes

### Debouncing API Calls

To prevent excessive API calls when users rapidly toggle filters:

```javascript
import { useEffect, useRef } from 'react';

const useDebouncedEffect = (effect, deps, delay) => {
  const timeoutRef = useRef();
  
  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(effect, delay);
    
    return () => clearTimeout(timeoutRef.current);
  }, deps);
};

// Usage
useDebouncedEffect(() => {
  fetchFilteredPosts(filters);
}, [filters], 300);
```

### Scroll Position Management

Maintain scroll position when filters update:

```javascript
const scrollPositionRef = useRef(0);

useEffect(() => {
  // Save scroll position before update
  scrollPositionRef.current = window.scrollY;
}, [filters]);

useEffect(() => {
  // Restore scroll position after posts load
  if (!loading) {
    window.scrollTo(0, scrollPositionRef.current);
  }
}, [loading]);
```

### Accessibility Enhancements

```jsx
<button
  className={`filterTag ${isActive ? 'active' : ''}`}
  onClick={onClick}
  aria-pressed={isActive}
  role="switch"
>
  {label}
</button>

<div
  className="activeFiltersBar"
  role="region"
  aria-label="Active filters"
  aria-live="polite"
>
  {/* Active filters content */}
</div>
```
