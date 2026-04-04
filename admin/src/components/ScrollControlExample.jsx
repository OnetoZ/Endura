import React from 'react';
import { useScrollControl } from '../hooks/useScrollControl';

/**
 * ScrollControlExample Component
 * 
 * Demonstrates how to use programmatic scroll control
 * This is a reference implementation - integrate these patterns into your components
 */
const ScrollControlExample = () => {
    const { scrollTo, stop, start } = useScrollControl();

    const handleScrollToTop = () => {
        scrollTo(0, { duration: 2 });
    };

    const handleScrollToSection = (sectionId) => {
        scrollTo(`#${sectionId}`, {
            offset: -80, // Account for fixed navbar
            duration: 1.5
        });
    };

    const handleStopScroll = () => {
        stop();
        console.log('Scroll stopped - useful for modals/overlays');
    };

    const handleStartScroll = () => {
        start();
        console.log('Scroll resumed');
    };

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-2 p-4 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg">
            <p className="text-xs text-gray-400 mb-2">Scroll Controls (Dev Only)</p>

            <button
                onClick={handleScrollToTop}
                className="px-4 py-2 bg-primary text-white text-xs rounded hover:bg-primary-light transition"
            >
                Scroll to Top
            </button>

            <button
                onClick={() => handleScrollToSection('hero')}
                className="px-4 py-2 bg-primary text-white text-xs rounded hover:bg-primary-light transition"
            >
                Scroll to Hero
            </button>

            <button
                onClick={() => handleScrollToSection('vault')}
                className="px-4 py-2 bg-primary text-white text-xs rounded hover:bg-primary-light transition"
            >
                Scroll to Vault
            </button>

            <div className="flex gap-2 mt-2">
                <button
                    onClick={handleStopScroll}
                    className="flex-1 px-3 py-2 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition"
                >
                    Stop
                </button>
                <button
                    onClick={handleStartScroll}
                    className="flex-1 px-3 py-2 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition"
                >
                    Start
                </button>
            </div>
        </div>
    );
};

export default ScrollControlExample;
