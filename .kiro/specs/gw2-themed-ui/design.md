# Design Document

## Overview

This design transforms the GW2STYLE frontend into an immersive Guild Wars 2-themed experience by implementing a comprehensive visual overhaul. The design leverages GW2's iconic aesthetic—dark fantasy tones, ornate borders, gold accents, and mystical effects—while maintaining modern web standards for accessibility and performance.

The current implementation already has a solid foundation with dark backgrounds and red accents. This design will enhance it by introducing GW2-specific color palettes (gold, bronze, deep blues), fantasy typography, decorative UI elements, and interactive effects that evoke the in-game interface.

## Architecture

### Design System Structure

The design follows a modular CSS architecture using CSS custom properties (variables) for theming:

```
styles/
├── globals.css          # Core theme variables, base styles, header/footer
├── Home.module.css      # Gallery/grid styling
├── Post.module.css      # Post detail page styling
├── CreatePost.module.css # Form styling
└── User.module.css      # User profile styling
```

### Color Palette

**Primary GW2-Inspired Colors:**
- Background: Deep navy/charcoal (`#0a0e1a`, `#12151f`)
- Surface: Slightly lighter panels (`#1a1f2e`, `#242938`)
- Primary Accent: Gold (`#d4af37`, `#f4d03f`)
- Secondary Accent: Bronze/Copper (`#cd7f32`, `#b87333`)
- Tertiary: Deep blue (`#2c5f8d`, `#4a7ba7`)
- Text: Off-white (`#e8e6e3`)
- Text Secondary: Muted gray (`#a8a29e`)

**Semantic Colors:**
- Success: Emerald green (`#10b981`)
- Warning: Amber (`#f59e0b`)
- Error: Deep red (`#dc2626`)
- Info: Sky blue (`#3b82f6`)

### Typography

**Font Stack:**
- **Headings**: 'Cinzel', 'Trajan Pro', serif (fantasy-appropriate, medieval feel)
- **Body**: 'Lato', 'Inter', sans-serif (clean, readable)
- **Accent/UI**: 'Rajdhani', sans-serif (current, works well for gaming)

**Type Scale:**
- Hero Title: 3rem (48px)
- Page Title: 2.5rem (40px)
- Section Heading: 2rem (32px)
- Card Title: 1.25rem (20px)
- Body: 1rem (16px)
- Small: 0.875rem (14px)

### Visual Effects

**Borders & Frames:**
- Ornate corner decorations using CSS pseudo-elements
- Double-line borders with gold/bronze gradients
- Subtle inner shadows for depth

**Hover Effects:**
- Gold glow on interactive elements
- Smooth scale transforms (1.02-1.05)
- Border color transitions
- Box shadow enhancements

**Animations:**
- Subtle pulse effects on primary CTAs
- Fade-in animations for content loading
- Smooth transitions (0.3s cubic-bezier)

## Components and Interfaces

### 1. Header Component

**Current State:** Dark header with red accents, sticky positioning

**Enhanced Design:**
- Semi-transparent dark background with backdrop blur
- Gold gradient bottom border with animated glow
- Logo with ornate frame and mystical glow effect
- Navigation links with underline animations (gold)
- User profile section with avatar frame styling

**CSS Enhancements:**
```css
.header {
  background: linear-gradient(180deg, 
    rgba(10, 14, 26, 0.95) 0%, 
    rgba(18, 21, 31, 0.95) 100%);
  backdrop-filter: blur(10px);
  border-bottom: 2px solid;
  border-image: linear-gradient(90deg, 
    transparent, 
    #d4af37, 
    transparent) 1;
  box-shadow: 0 4px 20px rgba(212, 175, 55, 0.1);
}

.logo-text {
  font-family: 'Cinzel', serif;
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.5));
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #d4af37, transparent);
  transition: transform 0.3s ease;
}

.nav-link:hover::after {
  transform: translateX(-50%) scaleX(1);
}
```

### 2. Post Card Component

**Current State:** Basic card with image, title, and views

**Enhanced Design:**
- Ornate border frame with corner decorations
- Gold accent on hover with glow effect
- Gradient overlay on image for text readability
- Badge-style view counter with icon
- Smooth lift animation on hover

**CSS Enhancements:**
```css
.card > div {
  position: relative;
  background: linear-gradient(135deg, 
    rgba(26, 31, 46, 0.9), 
    rgba(36, 41, 56, 0.9));
  border: 2px solid rgba(212, 175, 55, 0.2);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card > div::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px solid transparent;
  border-radius: 8px;
  background: linear-gradient(135deg, #d4af37, #cd7f32) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, 
                linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card:hover > div {
  transform: translateY(-8px);
  border-color: rgba(212, 175, 55, 0.6);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3),
              0 0 20px rgba(212, 175, 55, 0.2);
}

.card:hover > div::before {
  opacity: 1;
}

/* Corner decorations */
.card > div::after {
  content: '◆';
  position: absolute;
  top: 8px;
  right: 8px;
  color: #d4af37;
  font-size: 12px;
  opacity: 0.6;
}
```

### 3. Post Detail Page

**Current State:** Basic layout with image gallery and metadata

**Enhanced Design:**
- Hero section with decorative frame
- Tabbed/sectioned content areas with ornate dividers
- Equipment display in styled panels
- Action buttons with fantasy styling
- Breadcrumb navigation with GW2 theme

**Layout Structure:**
```
┌─────────────────────────────────────┐
│  Breadcrumb Navigation              │
├─────────────────────────────────────┤
│  ╔═══════════════════════════════╗  │
│  ║  Hero Image Gallery           ║  │
│  ║  (with ornate frame)          ║  │
│  ╚═══════════════════════════════╝  │
├─────────────────────────────────────┤
│  Title & Metadata                   │
│  (gold accents, decorative line)    │
├─────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  │
│  │ Description │  │  Equipment   │  │
│  │   Panel     │  │    Panel     │  │
│  └─────────────┘  └──────────────┘  │
└─────────────────────────────────────┘
```

**CSS Enhancements:**
```css
.post {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  text-align: center;
  padding: 2rem 0;
  border-bottom: 2px solid;
  border-image: linear-gradient(90deg, 
    transparent, 
    #d4af37, 
    transparent) 1;
  position: relative;
}

.header::after {
  content: '◆◆◆';
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #0a0e1a;
  padding: 0 1rem;
  color: #d4af37;
  font-size: 0.75rem;
  letter-spacing: 0.5rem;
}

.title {
  font-family: 'Cinzel', serif;
  font-size: 2.5rem;
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
}

.imageGallery {
  position: relative;
  padding: 1rem;
  background: linear-gradient(135deg, 
    rgba(26, 31, 46, 0.5), 
    rgba(36, 41, 56, 0.5));
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 8px;
}

.equipment {
  background: linear-gradient(135deg, 
    rgba(26, 31, 46, 0.8), 
    rgba(36, 41, 56, 0.8));
  border: 2px solid rgba(212, 175, 55, 0.2);
  border-radius: 8px;
  padding: 1.5rem;
}

.equipment h2 {
  font-family: 'Cinzel', serif;
  color: #d4af37;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}
```

### 4. Create Post Form

**Current State:** Basic form with standard inputs

**Enhanced Design:**
- Styled input fields with gold focus states
- Ornate form sections with decorative headers
- Fantasy-styled submit button with glow effect
- Character counter with themed styling
- Validation messages with appropriate colors

**CSS Enhancements:**
```css
.formGroup {
  margin-bottom: 1.5rem;
}

.formGroup label {
  display: block;
  font-family: 'Cinzel', serif;
  color: #d4af37;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.formGroup input,
.formGroup textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  background: rgba(26, 31, 46, 0.6);
  border: 2px solid rgba(212, 175, 55, 0.2);
  border-radius: 6px;
  color: #e8e6e3;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.formGroup input:focus,
.formGroup textarea:focus {
  outline: none;
  border-color: #d4af37;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1),
              0 0 15px rgba(212, 175, 55, 0.2);
  background: rgba(26, 31, 46, 0.8);
}

.submitButton {
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #d4af37, #cd7f32);
  border: 2px solid #f4d03f;
  border-radius: 8px;
  color: #0a0e1a;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.submitButton::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.submitButton:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(212, 175, 55, 0.4),
              0 0 30px rgba(212, 175, 55, 0.3);
}

.submitButton:hover::before {
  width: 300px;
  height: 300px;
}

.submitButton:active {
  transform: translateY(0);
}
```

### 5. Footer Component

**Current State:** Multi-column footer with links

**Enhanced Design:**
- Ornate top border with decorative elements
- Section dividers with fantasy styling
- Social links with hover glow effects
- Copyright section with themed styling

**CSS Enhancements:**
```css
.footer {
  background: linear-gradient(180deg, 
    rgba(18, 21, 31, 0.95) 0%, 
    rgba(10, 14, 26, 1) 100%);
  border-top: 2px solid;
  border-image: linear-gradient(90deg, 
    transparent, 
    #d4af37, 
    transparent) 1;
  position: relative;
}

.footer::before {
  content: '◆◆◆◆◆';
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #0a0e1a;
  padding: 0 2rem;
  color: #d4af37;
  font-size: 0.75rem;
  letter-spacing: 1rem;
}

.footerHeading {
  font-family: 'Cinzel', serif;
  color: #d4af37;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 1rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.footerHeading::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, #d4af37, transparent);
}
```

## Data Models

No changes to data models are required. This is purely a visual/CSS enhancement.

## Error Handling

**Visual Error States:**
- Form validation errors displayed with red accent and icon
- Loading states with themed spinners/skeletons
- Empty states with decorative messaging
- 404 pages with GW2-themed illustrations

**Implementation:**
```css
.error {
  background: rgba(220, 38, 38, 0.1);
  border: 2px solid rgba(220, 38, 38, 0.3);
  border-radius: 6px;
  padding: 1rem;
  color: #fca5a5;
  margin-bottom: 1rem;
}

.loading {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 3px solid rgba(212, 175, 55, 0.2);
  border-top-color: #d4af37;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

## Testing Strategy

### Visual Regression Testing
- Screenshot comparison of key pages before/after
- Test across different viewport sizes (mobile, tablet, desktop)
- Verify in multiple browsers (Chrome, Firefox, Safari)

### Accessibility Testing
- Color contrast validation (WCAG 2.1 AA minimum)
- Keyboard navigation testing
- Screen reader compatibility
- Focus state visibility

### Performance Testing
- Measure CSS bundle size impact
- Test animation performance (60fps target)
- Verify no layout shifts (CLS)
- Check font loading strategy

### Cross-Browser Testing
- Chrome/Edge (Chromium)
- Firefox
- Safari (macOS/iOS)
- Mobile browsers

### Test Checklist
- [ ] All text meets contrast requirements
- [ ] Hover states work on all interactive elements
- [ ] Animations are smooth and performant
- [ ] Mobile responsive breakpoints work correctly
- [ ] Forms are fully functional with new styling
- [ ] Images load properly with themed placeholders
- [ ] Navigation is keyboard accessible
- [ ] Focus indicators are visible
- [ ] No console errors or warnings
- [ ] Page load times remain acceptable

## Implementation Notes

### Font Loading Strategy
Use `font-display: swap` to prevent FOIT (Flash of Invisible Text):
```css
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Lato:wght@300;400;700&display=swap');
```

### CSS Custom Properties Organization
Define all theme variables in `:root` for easy maintenance and potential theme switching:
```css
:root {
  /* Colors */
  --color-bg-primary: #0a0e1a;
  --color-bg-secondary: #12151f;
  --color-surface: #1a1f2e;
  --color-gold: #d4af37;
  --color-bronze: #cd7f32;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-base: 0.3s ease;
  --transition-slow: 0.5s ease;
}
```

### Progressive Enhancement
- Base styles work without JavaScript
- Animations respect `prefers-reduced-motion`
- Fallback fonts for custom typography
- Graceful degradation for older browsers

### Mobile Considerations
- Touch targets minimum 44x44px
- Simplified decorative elements on small screens
- Optimized animations for mobile performance
- Reduced motion by default on mobile
