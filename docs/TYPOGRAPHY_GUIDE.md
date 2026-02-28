# ENDURA Typography System

## Premium Cinematic Font Hierarchy

### 🎯 Font Selection Philosophy
The ENDURA brand requires fonts that convey:
- **Luxury & Premium Quality**
- **Sci-Fi / Futuristic Aesthetic**
- **Technical Precision**
- **Cinematic Impact**

---

## Font Families

### 1. **Orbitron** - Headings & Titles
**Purpose:** Main display font for headlines, logos, and impactful text  
**Characteristics:**
- Geometric, futuristic design
- Strong sci-fi aesthetic
- Excellent readability at large sizes
- Conveys luxury and technology

**Usage:**
```css
font-family: var(--font-heading);
/* or */
className="font-heading"
```

**Applied To:**
- Main page titles (THE ORDER, ENDURA)
- Section headings (h1, h2, h3, h4, h5, h6)
- Logo text
- Call-to-action buttons
- Faction names

**Weights Available:** 400, 500, 600, 700, 800, 900

---

### 2. **Space Grotesk** - Body Text
**Purpose:** Modern, premium body copy and navigation  
**Characteristics:**
- Clean, contemporary sans-serif
- Excellent readability
- Professional and approachable
- Works well at all sizes

**Usage:**
```css
font-family: var(--font-body);
/* or */
className="font-body"
```

**Applied To:**
- Body paragraphs
- Navigation links
- Descriptions
- User interface text
- Form labels

**Weights Available:** 300, 400, 500, 600, 700

---

### 3. **JetBrains Mono** - System & Code Text
**Purpose:** Technical data, system messages, monospace needs  
**Characteristics:**
- Monospaced font designed for developers
- Crystal-clear at small sizes
- Technical, precise aesthetic
- Perfect for system diagnostics

**Usage:**
```css
font-family: var(--font-mono);
/* or */
className="font-mono"
```

**Applied To:**
- System status messages
- Technical data (LATENCY, LOCATION, etc.)
- Code snippets
- Timestamps
- Restricted labels
- Archive IDs

**Weights Available:** 300, 400, 500, 600, 700

---

## CSS Variables

```css
:root {
  --font-heading: 'Orbitron', sans-serif;
  --font-body: 'Space Grotesk', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

---

## Utility Classes

### Font Family Classes
```css
.font-heading  /* Orbitron - for headings */
.font-body     /* Space Grotesk - for body text */
.font-mono     /* JetBrains Mono - for system text */
.font-oswald   /* Legacy support - maps to Orbitron */
```

### Typography Styles
```css
.cinematic-text {
  font-family: var(--font-heading);
  letter-spacing: 0.5em;
  text-transform: uppercase;
  font-weight: 600;
}

.restricted-label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--accent);
  opacity: 0.6;
  letter-spacing: 0.2em;
  font-weight: 500;
}
```

---

## Typography Examples

### Hero Title
```jsx
<h1 className="text-9xl font-heading tracking-[0.3em] uppercase">
  THE ORDER
</h1>
```

### Section Heading
```jsx
<h2 className="text-5xl font-heading tracking-wider">
  Enter the Vault
</h2>
```

### Body Text
```jsx
<p className="text-base font-body font-light tracking-wide">
  Physical from // Digital Soul
</p>
```

### System Status
```jsx
<span className="font-mono text-xs tracking-[0.2em] text-accent">
  ARCHIVE_00.LOCKED
</span>
```

### Navigation Link
```jsx
<a className="font-body text-sm font-black tracking-[0.3em] uppercase">
  Collection
</a>
```

---

## Font Pairing Guidelines

### ✅ DO:
- Use **Orbitron** for all major headings and titles
- Use **Space Grotesk** for readable body content
- Use **JetBrains Mono** for technical/system information
- Maintain consistent letter-spacing for premium feel
- Use uppercase for headings with Orbitron

### ❌ DON'T:
- Mix heading fonts within the same section
- Use Orbitron for long paragraphs (readability issues)
- Use body font for system/technical data
- Forget to set appropriate letter-spacing
- Use too many font weights in one component

---

## Responsive Typography

### Mobile (< 768px)
- Reduce letter-spacing by 30-50%
- Use smaller font weights (400-600)
- Decrease heading sizes proportionally

### Desktop (≥ 768px)
- Full letter-spacing (0.3em - 0.5em)
- Bolder weights for impact (600-900)
- Larger heading sizes for drama

---

## Performance Notes

All fonts are loaded via Google Fonts CDN with:
- `display=swap` for optimal loading
- Multiple weights preloaded
- Subset optimization enabled

**Total Font Load:** ~120KB (compressed)

---

## Migration from Old Fonts

### Old → New Mapping
- `Inter` → `Space Grotesk` (body text)
- `Oswald` → `Orbitron` (headings)
- `monospace` → `JetBrains Mono` (system text)

### Legacy Support
The `.font-oswald` class still works and maps to Orbitron for backward compatibility.

---

## Visual Hierarchy

```
┌─────────────────────────────────────┐
│  ORBITRON (Headings)                │
│  ├─ Hero Titles (9xl, 900 weight)  │
│  ├─ Section Headers (5xl-7xl)      │
│  └─ CTAs (sm-base, 700 weight)     │
├─────────────────────────────────────┤
│  SPACE GROTESK (Body)               │
│  ├─ Paragraphs (base, 400 weight)  │
│  ├─ Navigation (xs-sm, 600 weight) │
│  └─ Descriptions (sm, 300 weight)  │
├─────────────────────────────────────┤
│  JETBRAINS MONO (System)            │
│  ├─ Status Text (xs, 500 weight)   │
│  ├─ Technical Data (2xs, 400)      │
│  └─ Timestamps (xs, 300 weight)    │
└─────────────────────────────────────┘
```

---

## Color Combinations

### Premium Gold on Black
```css
color: var(--accent);      /* #d4af37 */
background: var(--background); /* #000000 */
font-family: var(--font-heading);
```

### Purple Glow Effect
```css
color: var(--primary-light); /* #7c3aed */
text-shadow: 0 0 20px rgba(124, 58, 237, 0.5);
font-family: var(--font-heading);
```

### System Text
```css
color: var(--accent);
opacity: 0.6;
font-family: var(--font-mono);
```

---

**Last Updated:** 2026-02-09  
**Version:** 2.0 - Premium Cinematic Typography
