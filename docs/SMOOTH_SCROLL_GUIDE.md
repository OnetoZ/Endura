# Cinematic Smooth Scroll Implementation Guide

## Overview
This guide documents the implementation of **heavy, intentional, cinematic scrolling** for the Endura website, inspired by premium narrative experiences like the GTA 6 website.

---

## Implementation Details

### 1. **Library Choice: Lenis**
We're using **Lenis** (via `@studio-freight/react-lenis`) for smooth scrolling because:
- ✅ Lightweight and performant
- ✅ Native React integration
- ✅ Highly customizable scroll physics
- ✅ Works seamlessly with React Router
- ✅ No impact on React's virtual DOM performance

### 2. **Key Configuration Parameters**

```javascript
{
  lerp: 0.05,           // Lower = smoother/heavier (default: 0.1)
  duration: 1.5,        // Scroll animation duration in seconds
  smoothWheel: true,    // Enable smooth wheel scrolling
  wheelMultiplier: 0.8, // Reduce scroll speed (0.8 = 20% slower)
  touchMultiplier: 1.5, // Mobile touch sensitivity
  normalizeWheel: true, // Normalize wheel delta across browsers
  infinite: false,      // Disable infinite scroll
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) // Custom easing
}
```

#### **Parameter Tuning Guide:**

| Parameter | Effect | Recommended Range | Current Value |
|-----------|--------|-------------------|---------------|
| `lerp` | Lower = heavier/smoother | 0.03 - 0.1 | **0.05** |
| `duration` | Scroll animation length | 1.0 - 2.0s | **1.5s** |
| `wheelMultiplier` | Scroll speed control | 0.5 - 1.2 | **0.8** |
| `touchMultiplier` | Mobile scroll sensitivity | 1.0 - 2.0 | **1.5** |

---

## Best Practices

### ✅ **DO's**

1. **Wrap at the App Level**
   - Place `<SmoothScroll>` as high as possible in the component tree
   - Wrap around Router for consistent behavior across routes

2. **Use `data-lenis-prevent` for Specific Elements**
   ```jsx
   <div data-lenis-prevent>
     {/* This section won't have smooth scroll */}
   </div>
   ```
   Use for: modals, dropdowns, horizontal scrollers, carousels

3. **Optimize Heavy Animations**
   - Use `will-change: transform` sparingly
   - Prefer `transform` and `opacity` for animations
   - Use `IntersectionObserver` for scroll-triggered animations (already implemented)

4. **Test on Multiple Devices**
   - Desktop: Mouse wheel, trackpad
   - Mobile: Touch scroll, momentum scroll
   - Tablet: Hybrid interactions

### ❌ **DON'Ts**

1. **Don't Nest Multiple Smooth Scroll Instances**
   - Only one `<SmoothScroll>` wrapper per app
   - Use `data-lenis-prevent` for exceptions

2. **Don't Use `scroll-behavior: smooth` in CSS**
   - Conflicts with Lenis
   - Already handled in `index.css` with `.lenis.lenis-smooth`

3. **Don't Overuse Heavy Scroll Effects**
   - Keep `lerp` above 0.03 (too low = laggy feel)
   - Avoid excessive `wheelMultiplier` reduction

4. **Don't Block Scroll Events**
   - Avoid `overflow: hidden` on body (unless intentional)
   - Use `data-lenis-prevent` instead

---

## Performance Optimization

### 1. **React Performance**
```javascript
// ✅ Good: Lenis runs outside React render cycle
<SmoothScroll>
  <YourApp />
</SmoothScroll>

// ❌ Bad: Don't recreate Lenis on every render
const [lenis, setLenis] = useState(new Lenis()) // Anti-pattern
```

### 2. **Animation Performance**
```css
/* ✅ Use GPU-accelerated properties */
.reveal {
  transform: translateY(30px); /* GPU accelerated */
  opacity: 0;
}

/* ❌ Avoid layout-triggering properties */
.reveal {
  margin-top: 30px; /* Triggers layout reflow */
}
```

### 3. **Image Optimization**
- Use lazy loading for images below the fold
- Implement progressive image loading
- Use modern formats (WebP, AVIF)

---

## Advanced Customization

### Custom Easing Functions

```javascript
// Current: Exponential ease-out (cinematic feel)
easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))

// Alternative: Cubic ease-out (smoother)
easing: (t) => 1 - Math.pow(1 - t, 3)

// Alternative: Sine ease-in-out (balanced)
easing: (t) => -(Math.cos(Math.PI * t) - 1) / 2
```

### Programmatic Scroll Control

```javascript
import { useLenis } from '@studio-freight/react-lenis'

function MyComponent() {
  const lenis = useLenis()
  
  const scrollToSection = () => {
    lenis?.scrollTo('#section-id', {
      offset: 0,
      duration: 2,
      easing: (t) => t
    })
  }
  
  return <button onClick={scrollToSection}>Scroll</button>
}
```

### Disable Scroll Temporarily

```javascript
const lenis = useLenis()

// Disable (e.g., when modal opens)
lenis?.stop()

// Re-enable
lenis?.start()
```

---

## Troubleshooting

### Issue: Scroll feels too slow
**Solution:** Increase `wheelMultiplier` (try 1.0 or 1.2)

### Issue: Scroll feels too fast/jerky
**Solution:** Decrease `lerp` (try 0.03) or increase `duration` (try 2.0)

### Issue: Mobile scroll not working
**Solution:** Check for `touch-action: none` in CSS, adjust `touchMultiplier`

### Issue: Fixed navbar jumps
**Solution:** Use `position: fixed` with `data-lenis-prevent` on navbar

### Issue: Horizontal scroll conflicts
**Solution:** Add `data-lenis-prevent` to horizontal scroll containers

---

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 90+ | ✅ Full | Recommended |
| Firefox 88+ | ✅ Full | |
| Safari 14+ | ✅ Full | May need `-webkit-` prefixes |
| Edge 90+ | ✅ Full | |
| Mobile Safari | ✅ Full | Test momentum scroll |
| Chrome Mobile | ✅ Full | |

---

## Testing Checklist

- [ ] Desktop mouse wheel scrolling
- [ ] Desktop trackpad scrolling (two-finger)
- [ ] Mobile touch scrolling
- [ ] Mobile momentum scrolling
- [ ] Scroll to anchor links (`#section-id`)
- [ ] Browser back/forward navigation
- [ ] Route transitions
- [ ] Modal/overlay interactions
- [ ] Horizontal scroll sections
- [ ] Performance (60fps maintained)

---

## References

- [Lenis Documentation](https://github.com/studio-freight/lenis)
- [React Lenis](https://github.com/studio-freight/lenis/tree/main/packages/react)
- [GTA 6 Website](https://www.rockstargames.com/gta-vi) - Inspiration
- [Web Performance Best Practices](https://web.dev/performance/)

---

## Future Enhancements

1. **Scroll-linked Animations**
   - Parallax effects
   - Progress indicators
   - Scroll-triggered reveals

2. **Advanced Physics**
   - Velocity-based animations
   - Spring physics for sections
   - Magnetic scroll snapping

3. **Accessibility**
   - Respect `prefers-reduced-motion`
   - Keyboard navigation support
   - Screen reader compatibility

---

**Last Updated:** 2026-02-08  
**Version:** 1.0.0
