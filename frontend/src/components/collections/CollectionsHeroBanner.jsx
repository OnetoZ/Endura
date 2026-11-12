import React from 'react';
import { motion } from 'framer-motion';
import collectionsHeroImg from '../../assets/collections-hero.jpg';
import collectionsHeroMobileImg from '../../assets/collections-hero-mobile.jpg';

/**
 * CollectionsHeroBanner Component
 * 
 * Full-bleed Cinematic Editorial Campaign Hero:
 * - Completely fits screen (edge-to-edge, full viewport height)
 * - Seamless transparent navbar overlay at top
 * - High-resolution photoshoot (Desktop & Mobile Responsive)
 * - Upper Center:
 *     "GENESIS EDITION" (Cinzel Roman serif tracking)
 *     "An Experience beyond Clothing" (Elegant italic serif subtitle)
 * - Bottom Center:
 *     "COLLECTIONS" (Centered all-caps luxury serif with smooth scroll to products)
 */
const CollectionsHeroBanner = () => {
    const handleScrollToGrid = () => {
        const target = document.getElementById('products-archive');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <section className="relative w-full h-screen min-h-[640px] max-h-[1080px] bg-black select-none overflow-hidden">
            {/* Master Native Hardware-Accelerated Image - Responsive Desktop & Mobile */}
            <div className="absolute inset-0 z-0">
                {/* Desktop Collection Hero Image */}
                <img
                    src={collectionsHeroImg}
                    alt="ENDURA Genesis Edition — An Experience beyond Clothing"
                    className="hidden md:block w-full h-full object-cover object-[center_35%] pointer-events-none select-none"
                    loading="eager"
                    decoding="sync"
                    style={{
                        imageRendering: '-webkit-optimize-contrast',
                    }}
                />
                {/* Mobile Collection Hero Image (Only on Mobile Viewports) */}
                <img
                    src={collectionsHeroMobileImg}
                    alt="ENDURA Genesis Edition — An Experience beyond Clothing Mobile"
                    className="block md:hidden w-full h-full object-cover object-[center_20%] pointer-events-none select-none"
                    loading="eager"
                    decoding="sync"
                    style={{
                        imageRendering: '-webkit-optimize-contrast',
                    }}
                />
            </div>

            {/* Film Grain Noise Texture (Ultra subtle) */}
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.02] pointer-events-none mix-blend-overlay z-10" />

            {/* Seamless minimal bottom blend to dark section below (keeping purple carpet vibrant) */}
            <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-10" />

            {/* ========================================================= */}
            {/* UPPER CENTER EDITORIAL TYPOGRAPHY - BALANCED ON MOBILE & DESKTOP */}
            {/* ========================================================= */}
            <motion.div 
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-[12%] sm:top-[16%] md:top-[21%] inset-x-0 flex flex-col items-center text-center px-4 z-20 pointer-events-none"
            >
                {/* Line 1: GENESIS EDITION */}
                <h1 
                    className="font-cinzel text-[14px] sm:text-[15px] md:text-[17px] lg:text-[19px] xl:text-[21px] font-normal text-white uppercase tracking-[0.28em] sm:tracking-[0.36em] leading-tight"
                    style={{ textShadow: '0 2px 14px rgba(0,0,0,0.85), 0 0 8px rgba(0,0,0,0.6)' }}
                >
                    GENESIS EDITION
                </h1>

                {/* Line 2: An Experience beyond Clothing (Refined Editorial Italic Subtitle) */}
                <p 
                    className="font-editorial italic text-[12.5px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px] font-light text-white/95 tracking-[0.1em] sm:tracking-[0.15em] mt-1.5 sm:mt-1.5"
                    style={{ textShadow: '0 2px 12px rgba(0,0,0,0.85)' }}
                >
                    An Experience beyond Clothing
                </p>
            </motion.div>

            {/* ========================================================= */}
            {/* BOTTOM CENTER TYPOGRAPHY: "COLLECTIONS" - CRISP & READABLE */}
            {/* ========================================================= */}
            <motion.div 
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-24 sm:bottom-8 md:bottom-10 lg:bottom-12 inset-x-0 flex flex-col items-center justify-center z-20 pointer-events-auto"
            >
                <button
                    type="button"
                    onClick={handleScrollToGrid}
                    className="group/btn relative cursor-pointer inline-flex flex-col items-center gap-1.5 sm:gap-2 px-6 py-2 transition-transform duration-300 hover:scale-105 active:scale-95"
                    aria-label="Scroll down to Explore Collections"
                >
                    <span 
                        className="font-cinzel text-[12px] sm:text-[13px] md:text-[15px] lg:text-[16px] xl:text-[18px] font-normal text-white uppercase tracking-[0.44em] sm:tracking-[0.5em] transition-all duration-300 group-hover/btn:drop-shadow-[0_0_20px_rgba(255,255,255,0.95)]"
                        style={{ textShadow: '0 2px 16px rgba(0,0,0,0.9), 0 0 6px rgba(0,0,0,0.7)' }}
                    >
                        COLLECTIONS
                    </span>

                    {/* Illuminated Animated White Underline matching Landing Page */}
                    <div className="relative w-full flex items-center justify-center">
                        <span className="h-[1.5px] w-14 sm:w-20 bg-white transition-all duration-500 ease-out group-hover/btn:w-full group-hover/btn:h-[2px] shadow-[0_0_10px_rgba(255,255,255,0.85)] group-hover/btn:shadow-[0_0_18px_rgba(255,255,255,1)]" />
                    </div>
                </button>
            </motion.div>
        </section>
    );
};

export default CollectionsHeroBanner;
