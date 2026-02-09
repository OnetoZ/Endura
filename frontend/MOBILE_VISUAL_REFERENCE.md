# 📱 MOBILE LAYOUT VISUAL REFERENCE

## Quick Reference: Mobile Screen Layouts

---

## 🎬 HERO SECTION (SystemBootHero)

```
┌─────────────────────────────────┐
│         ◈ ENDURA ◈             │ ← Logo (h-16, top 10%)
│                                 │
│                                 │
│         THE ORDER               │ ← Title (text-6xl, center 40%)
│         ─────────               │
│                                 │
│    Physical Body // Digital     │ ← Subtitle (text-xs, center 50%)
│           Soul                  │
│                                 │
│                                 │
│    ┌─────────────────┐          │
│    │ Initiate_Entrance│          │ ← CTA (bottom 30%)
│    └─────────────────┘          │
│                                 │
└─────────────────────────────────┘
```

**Key Measurements:**
- Screen: 100vh
- Logo: 10vh from top
- Title: 40vh (centered)
- CTA: 30vh from bottom
- Padding: px-6

---

## 🌍 CULT WORLD (CultWorlds - Mobile)

```
┌─────────────────────────────────┐
│                                 │
│         ╔═══════╗               │
│         ║       ║               │
│         ║ CHAR  ║               │ ← Character Image
│         ║ IMAGE ║               │   (h-[65vh], top-aligned)
│         ║       ║               │
│         ║       ║               │
│         ╚═══════╝               │
│                                 │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │ ← Visual/Text Split
│                                 │
│    // FACTION_01                │ ← Label (text-[8px])
│                                 │
│       THE VEIL                  │ ← Name (text-5xl)
│       ─────                     │
│                                 │
│    Keepers of the unseen...     │ ← Bio (text-xs, 1-2 lines)
│                                 │
│                                 │
└─────────────────────────────────┘
```

**Key Measurements:**
- Screen: 100vh (pinned)
- Character: 0-65vh (top)
- Text: bottom-12 (absolute)
- Title: text-5xl
- Bio: max-w-[85%], line-clamp-3

---

## 🎯 FOOTER (CinematicFooter - Mobile)

```
┌─────────────────────────────────┐
│                                 │
│                                 │
│          ENDURA                 │ ← Logo (text-4xl)
│          ─────                  │
│                                 │
│                                 │
│   The Order is not for          │ ← Message (text-xs)
│        everyone.                │
│                                 │
│                                 │
│    ┌──────────────────┐         │
│    │ Enter the Vault  │         │ ← CTA (px-8 py-3)
│    └──────────────────┘         │
│                                 │
│         ─────────               │
│                                 │
│   © 2026 ENDURA — All Rights   │ ← Legal (text-[9px])
│         Reserved                │
│                                 │
└─────────────────────────────────┘
```

**Key Measurements:**
- Screen: min-h-screen
- All content: centered
- Logo margin: mb-12
- Message margin: mb-16
- CTA: px-8 py-3
- No corner elements

---

## 🧭 NAVBAR (Mobile - Minimal)

```
┌─────────────────────────────────┐
│ ◈ ENDURA      [🛒] [@] [≡]     │ ← h-16, transparent bg
└─────────────────────────────────┘
   ↑              ↑    ↑   ↑
   Logo          Cart User Menu
   (h-10)        (icons only)
```

**Scrolled State:**
```
┌─────────────────────────────────┐
│ ◈ ENDURA      [🛒] [@] [≡]     │ ← bg-black/50, blur-sm
└─────────────────────────────────┘
```

**Hidden Elements:**
- ❌ System time/status
- ❌ Navigation links (Home, Collection, Vault)
- ❌ Holographic borders
- ❌ Scan line animation

---

## 📐 RESPONSIVE BREAKPOINT REFERENCE

### Mobile (Default)
```css
/* Typography */
text-xs      → 0.75rem (12px)
text-4xl     → 2.25rem (36px)
text-5xl     → 3rem (48px)

/* Spacing */
px-4         → 1rem (16px)
py-3         → 0.75rem (12px)
mb-12        → 3rem (48px)

/* Sizing */
h-16         → 4rem (64px)
h-[60vh]     → 60% viewport height

/* Tracking */
tracking-[0.2em]  → letter-spacing: 0.2em
tracking-[0.4em]  → letter-spacing: 0.4em
```

### Desktop (md: 768px+)
```css
/* Typography */
md:text-base → 1rem (16px)
md:text-7xl  → 4.5rem (72px)
md:text-[10rem] → 10rem (160px)

/* Spacing */
md:px-6      → 1.5rem (24px)
md:py-4      → 1rem (16px)
md:mb-16     → 4rem (64px)

/* Sizing */
md:h-24      → 6rem (96px)
md:h-[85vh]  → 85% viewport height

/* Tracking */
md:tracking-[0.5em]  → letter-spacing: 0.5em
md:tracking-[0.8em]  → letter-spacing: 0.8em
```

---

## 🎨 COLOR REFERENCE (Mobile)

```
Background Layers:
┌─────────────────────────────────┐
│ bg-black (base)                 │
│   ├─ bg-black/50 (navbar scroll)│
│   ├─ bg-black/60 (overlays)     │
│   └─ bg-transparent (navbar)    │
└─────────────────────────────────┘

Text Colors:
┌─────────────────────────────────┐
│ text-white (headings)           │
│ text-white/70 (body)            │
│ text-white/40 (labels)          │
│ text-white/20 (subtle)          │
│ text-white/10 (ultra-subtle)    │
└─────────────────────────────────┘

Accent Colors:
┌─────────────────────────────────┐
│ text-accent (#d4af37 - gold)    │
│ text-primary (#4b2c91 - purple) │
│ border-accent/30 (subtle gold)  │
│ border-primary/30 (subtle purple)│
└─────────────────────────────────┘
```

---

## 🎬 ANIMATION TIMING (Mobile)

```
Scene Transition Timeline:
0.0s ████ Background fade in
1.0s ████ Visual scale + fade
1.5s ████ Text fade (delayed)
2.0s ████ Name reveal (last)
2.5s ████ Complete

Duration Reference:
- Fast:   1s   (instant reveals)
- Medium: 1.5s (standard fades)
- Slow:   2.5s (cinematic reveals)
- Ultra:  3s+  (footer, hero)
```

---

## 📊 SPACING SYSTEM (Mobile)

```
Vertical Rhythm:
┌─────────────────────────────────┐
│ Element 1                       │
│                                 │ ← mb-6  (24px)
│ Element 2                       │
│                                 │ ← mb-12 (48px)
│ Element 3                       │
│                                 │ ← mb-16 (64px)
│ Element 4                       │
└─────────────────────────────────┘

Horizontal Padding:
┌─────────────────────────────────┐
│← px-4 (16px)                    │
│                                 │
│     Content Area                │
│                                 │
│                    px-4 (16px)→ │
└─────────────────────────────────┘
```

---

## ✅ MOBILE LAYOUT CHECKLIST

### Visual Hierarchy
- [x] One dominant element per screen
- [x] Visual appears before text
- [x] Name appears last
- [x] Clear focal point

### Spacing
- [x] Minimum 16px horizontal padding
- [x] Minimum 48px vertical spacing
- [x] Touch targets ≥48px
- [x] Breathing room around CTAs

### Typography
- [x] Headings: 50-70% of desktop size
- [x] Body: Readable at mobile scale
- [x] Letter-spacing: 50% of desktop
- [x] Line clamping for long text

### Performance
- [x] Blur reduced or removed
- [x] Backdrop blur minimal
- [x] Animations simplified
- [x] Hidden non-essential elements

---

## 🎯 QUICK COMPARISON TABLE

| Element | Desktop | Mobile | Change |
|---------|---------|--------|--------|
| **Navbar Height** | 96px | 64px | -33% |
| **Hero Title** | text-9xl | text-6xl | -33% |
| **World Title** | text-[10rem] | text-5xl | -70% |
| **Character Height** | 85vh | 60-65vh | -25% |
| **Letter Spacing** | 0.8em | 0.4em | -50% |
| **Blur Intensity** | blur-3xl | blur-2xl | -33% |
| **Animation Layers** | 5-7 | 3-4 | -45% |

---

**This visual reference should be used alongside:**
- `MOBILE_STRATEGY.md` - Philosophy
- `MOBILE_SCENE_GUIDE.md` - Implementation details
- `MOBILE_ANIMATION_PLAN.md` - Animation specs
- `MOBILE_SUMMARY.md` - Complete overview

**Last Updated:** 2026-02-09  
**Version:** 1.0 - Mobile Visual Reference
