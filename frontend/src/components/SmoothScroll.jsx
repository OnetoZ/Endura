import { ReactLenis, useLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';
import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * SmoothScroll Component
 *
 * Provides a cinematic, weighted scroll experience using Lenis.
 * Lenis is connected to GSAP ScrollTrigger so they work together.
 */

// Inner connector: must live inside ReactLenis so useLenis() works
const LenisScrollTriggerConnector = () => {
    const lenis = useLenis();

    useEffect(() => {
        if (!lenis) return;

        // Tell ScrollTrigger to use Lenis's scroll position
        ScrollTrigger.scrollerProxy(document.documentElement, {
            scrollTop(value) {
                if (arguments.length) {
                    lenis.scrollTo(value, { immediate: true });
                }
                return lenis.scroll;
            },
            getBoundingClientRect() {
                return {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight,
                };
            },
        });

        // On every Lenis scroll tick, tell ScrollTrigger to update
        const unsubscribe = lenis.on('scroll', ScrollTrigger.update);

        // Keep ScrollTrigger in sync via GSAP ticker too
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        return () => {
            unsubscribe();
            ScrollTrigger.scrollerProxy(document.documentElement, null);
        };
    }, [lenis]);

    return null;
};

const SmoothScroll = ({ children }) => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);
        const handleChange = (e) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    if (prefersReducedMotion) {
        return <>{children}</>;
    }

    const lenisOptions = {
        lerp: 0.05,
        duration: 1.5,
        smoothWheel: true,
        wheelMultiplier: 0.8,
        touchMultiplier: 1.5,
        normalizeWheel: true,
        infinite: false,
        autoRaf: false,   // We drive RAF manually via gsap.ticker
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    };

    return (
        <ReactLenis root options={lenisOptions}>
            <LenisScrollTriggerConnector />
            {children}
        </ReactLenis>
    );
};

export default SmoothScroll;
