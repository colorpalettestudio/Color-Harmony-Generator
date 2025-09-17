# Color Palette Generator - Design Guidelines

## Design Approach
**Selected Approach:** Reference-Based (Creative Tools Category)
Drawing inspiration from professional design tools like Adobe Color, Coolors, and Figma's color picker interfaces. This utility-focused creative tool requires precision, clarity, and professional aesthetics that inspire confidence in graphic designers.

**Design Principles:**
- Professional precision with creative flair
- Clean, distraction-free workspace
- Intuitive color manipulation
- Immediate visual feedback

## Core Design Elements

### Color Palette
**Light Mode:**
- Primary: 240 8% 15% (Deep charcoal for precision)
- Secondary: 240 6% 85% (Light gray backgrounds)  
- Accent: 260 85% 65% (Professional purple for interactive elements)
- Success: 142 76% 36% (Vibrant green for confirmations)

**Dark Mode:**
- Primary: 240 8% 85% (Light text)
- Secondary: 240 8% 12% (Dark backgrounds)
- Accent: 260 85% 70% (Brighter purple for dark mode)
- Surface: 240 6% 8% (Card backgrounds)

### Typography
**Fonts:** Inter (primary), JetBrains Mono (color codes)
- Headings: Inter 600, sizes 24px-32px
- Body: Inter 400, 14px-16px
- Color codes: JetBrains Mono 500, 12px-14px

### Layout System
**Spacing:** Tailwind units of 2, 4, 6, 8, and 12
- Micro spacing: 2 (8px) for tight elements
- Standard: 4 (16px) for component padding
- Section: 8 (32px) for major separations
- Large: 12 (48px) for page-level spacing

### Component Library

**Core Interface:**
- **Color Wheel:** Large, central interactive wheel (400px minimum) with smooth drag handles
- **Harmony Selector:** Elegant pill-shaped buttons with active states
- **Color Input Panel:** Clean form with format tabs (HEX/RGB/HSL)
- **Palette Display:** Card-based layout with copy-on-click functionality
- **Eyedropper Tool:** Floating action button with cursor change feedback

**Navigation & Actions:**
- Minimal top bar with app title and theme toggle
- Floating eyedropper button positioned bottom-right
- Harmony rule selector as horizontal pill navigation
- Export/save palette options in subtle secondary actions

**Data Display:**
- Color swatches: Rounded rectangles (8px radius) with hover lift effects
- Color codes: Monospace font with one-click copy
- Real-time preview: Immediate updates without loading states

**Forms:**
- Input fields with subtle borders and focus states
- Format switcher tabs with smooth transitions
- Validation feedback using color-coded borders

**Layout Structure:**
- Left panel: Color wheel and base color controls (40% width)
- Right panel: Generated palettes and harmony results (60% width)
- Top section: Harmony rule selector and tools
- Responsive: Stack vertically on mobile with wheel remaining prominent

**Visual Enhancements:**
- Subtle drop shadows on interactive elements
- Smooth color transitions (200ms ease-in-out)
- Hover states with slight scale transforms (1.02x)
- Professional card elevations for palette sections

**Interaction Feedback:**
- Dragging: Smooth cursor tracking with visual feedback
- Color selection: Immediate palette regeneration
- Copy actions: Brief success indicators
- Invalid inputs: Gentle error states without disruption

This design creates a professional, precision-focused tool that graphic designers will find both powerful and aesthetically pleasing, emphasizing clarity and immediate visual feedback over decorative elements.