# MOBILE ADAPTATION STRATEGY: The Vertical Reel

## Core Philosophy
We are not compressing the desktop site. We are translating the ENDURA experience into a **vertical cinematic reel**. The mobile user experience will feel like scrolling through a high-end digital lookbook or a film strip.

## 1. Global Mobile Principles
- **One Focus Point**: Every screen (100vh) has exactly one dominant visual or message.
- **Vertical Flow**: All horizontal movements are removed. Navigation and discovery happen strictly via vertical scrolling.
- **Touch-First**: Buttons and interactables are positioned for thumb reach, but kept minimal to avoid UI clutter.
- **Cinematic Pacing**: Animations are slower and rely on fade/scale rather than complex motion paths which jitter on mobile.

## 2. Navigation Strategy (Mobile)
- **Status**: Hidden by default or reduced to a minimal "System Status" line.
- **Behavior**: No sticky navbar that obscures content.
- **Interaction**: A simple top-right or bottom-center "Menu" trigger (or just the Logo) that opens a full-screen overlay if needed.
- **Visual**: "System Status" indicators (like battery, connection) replace traditional nav links to maintain the "HUD" feel.

## 3. Scene-by-Scene Adaptation

### System Boot (Hero)
- **Desktop**: Wide cinematic overlay, floating elements.
- **Mobile**:
  - **Background**: Full-screen portrait crop of the hero image.
  - **Typography**: Stacked vertically. "THE ORDER" takes up 50% of screen height.
  - **Glitch**: Intensified for smaller screens to add texture.
  - **CTA**: Positioned at the bottom third for easy reach.

### Cult Worlds (The "Reel")
- **Interaction**:
  - **Desktop**: Pin + Scrub (Time-based transition).
  - **Mobile**: Snap-scrolling or Stacking. Each world is a full `100vh` card.
- **Layout Rule**:
  1. **Background**: Dominant color/texture.
  2. **Visual**: Character image centered, cropped from waist up for detail.
  3. **Text**: Animate IN after settlement. Name appears LAST.
- **Typography**:
  - Bios shortened to 2 lines max.
  - "The Veil", "The Forged" etc. become massive vertical text or overlaid outlines.

### Footer (The Closure)
- **Layout**: Center-aligned signal stack.
- **Elements**: 
  1. Logo (Pulse).
  2. "The Order is not for everyone" (Fade in).
  3. Single "Enter Vault" button.
- **Removal**: No sitemap, no social links, no copyright text that clutters.

## 4. Animation Simplification Plan ("Lite-Mode")
- **Disable**: Large blur filters (performance heavy on mobile), complex parallax.
- **Enable**: Opacity transitions, strict scale (zoom in/out), CSS-based gradients.
- **Frame Rate**: Target 60fps by reducing layout thrashing.

## 5. Typography Adjustments
- **Headings**: `font-heading`, reduced size but increased `letter-spacing` (0.2em).
- **Body**: `font-body`, strictly limited width (max 80% of screen).
- **System**: `font-mono`, used for "decorative" borders and status lines.
