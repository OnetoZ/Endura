
import { ReactLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';
import React, { useEffect, useState } from 'react';

/**
 * SmoothScroll Component
 * 
 * Provides a cinematic, weighted scroll experience using Lenis.
 * Tuned for a "heavy" and "deliberate" feel similar to premium narrative sites.
 * 
 * Features:
 * - Respects prefers-reduced-motion for accessibility
 * - Optimized for React performance
 * - Cinematic easing and physics
 */
const SmoothScroll = ({ children }) => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        // Check for reduced motion preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (e) => {
            setPrefersReducedMotion(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // If user prefers reduced motion, disable smooth scroll
    if (prefersReducedMotion) {
        return <>{children}</>;
    }

    // Lenis options for "Heavy & Intentional" cinematic feel
    const lenisOptions = {
        lerp: 0.05,           // Lower = smoother/heavier (0.1 is default)
        // Range: 0.03 (very heavy) to 0.1 (lighter)

        duration: 1.5,        // Scroll animation duration in seconds
        // Longer = more weighted feel

        smoothWheel: true,    // Enable smooth wheel scrolling

        wheelMultiplier: 0.8, // Reduce scroll speed for control
        // Lower = slower, more deliberate
        // Range: 0.5 (very slow) to 1.2 (faster)

        touchMultiplier: 1.5, // Mobile touch sensitivity
        // Higher = more responsive on mobile

        normalizeWheel: true, // Normalize wheel delta across browsers

        infinite: false,      // Disable infinite scroll

        // Custom easing for cinematic start/stop
        // Exponential ease-out creates a "settling" effect
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    };

    return (
        <ReactLenis root options={lenisOptions}>
            {children}
        </ReactLenis>
    );
};

export default SmoothScroll;
