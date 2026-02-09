import { useLenis } from 'lenis/react';

/**
 * Custom hook for programmatic scroll control
 * 
 * Provides utilities to control Lenis scroll behavior programmatically
 * 
 * @example
 * const { scrollTo, stop, start, isScrolling } = useScrollControl();
 * 
 * // Scroll to element
 * scrollTo('#section-id', { duration: 2 });
 * 
 * // Stop scroll (e.g., when modal opens)
 * stop();
 * 
 * // Resume scroll
 * start();
 */
export const useScrollControl = () => {
    const lenis = useLenis();

    const scrollTo = (target, options = {}) => {
        if (!lenis) return;

        const defaultOptions = {
            offset: 0,
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            ...options
        };

        lenis.scrollTo(target, defaultOptions);
    };

    const stop = () => {
        if (!lenis) return;
        lenis.stop();
    };

    const start = () => {
        if (!lenis) return;
        lenis.start();
    };

    return {
        scrollTo,
        stop,
        start,
        lenis
    };
};

export default useScrollControl;
