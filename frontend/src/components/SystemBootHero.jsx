import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import heroCampaignImg from '../assets/hero-campaign.jpg';
import heroCampaignMobileImg from '../assets/hero-campaign-mobile.jpg';

gsap.registerPlugin(ScrollTrigger);

/**
 * SystemBootHero Component
 * 
 * Cinematic Luxury Campaign Hero:
 * - Clean photoshoot background without baked-in text
 * - Dynamic HTML/CSS typography matching the exact editorial font styling:
 *     Left: "WE EXIST" (Luxury all-caps Serif) + "Twice" (Flowing Calligraphic Cursive)
 *     Right: "NEW GEN" "STREETWEAR" (Spaced High-Fashion Serif)
 * - Cinematic GSAP entrance, ambient floating, and scroll parallax animations
 */
const SystemBootHero = () => {
    const containerRef = useRef();
    const bgRef = useRef();
    const leftTextRef = useRef();
    const weExistRef = useRef();
    const twiceRef = useRef();
    const rightTextRef = useRef();
    const hintRef = useRef();

    useGSAP(() => {
        // =============================================================
        // 1. ENTRANCE TIMELINE (Cinematic Staggered Reveal on Load)
        // =============================================================
        const entranceTl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // Left "WE EXIST" reveal
        entranceTl.fromTo(weExistRef.current, 
            { opacity: 0, y: 25, letterSpacing: '0.35em' },
            { opacity: 1, y: 0, letterSpacing: '0.28em', duration: 1.2, clearProps: "all" },
            0.15
        );

        // Left cursive "Twice" signature reveal (flows in with scale & sheen)
        entranceTl.fromTo(twiceRef.current,
            { opacity: 0, y: 20, scale: 0.94 },
            { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: "power2.out", clearProps: "opacity" },
            0.4
        );

        // Right "NEW GEN STREETWEAR" reveal (stays 100% visible)
        entranceTl.fromTo(rightTextRef.current,
            { opacity: 0, x: 25 },
            { opacity: 1, x: 0, duration: 1.2, clearProps: "opacity" },
            0.6
        );

        // Bottom "Shop now" button fade in
        entranceTl.fromTo(hintRef.current,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 1.0, clearProps: "opacity" },
            0.8
        );

        // =============================================================
        // 2. AMBIENT LUXURY BREATHING (Floating Cursive)
        // =============================================================
        gsap.to(twiceRef.current, {
            y: -6,
            duration: 3.6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 1.8
        });

        // =============================================================
        // 3. SCROLL PARALLAX - ALWAYS 100% VISIBLE (NO FADE TO OPACITY 0)
        // =============================================================
        // Background parallax drift (pure Y-translation, no scale downsampling)
        gsap.to(bgRef.current, {
            y: 50,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });

        // Left text gentle parallax on scroll - stays 100% visible and razor sharp
        gsap.to(leftTextRef.current, {
            y: -40,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });

        // Right text gentle parallax on scroll - stays 100% visible and razor sharp
        gsap.to(rightTextRef.current, {
            y: -40,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });

        // Bottom "Shop now" parallax drift on scroll (stays visible with section)
        gsap.to(hintRef.current, {
            y: -30,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
    }, { scope: containerRef });

    return (
        <section 
            ref={containerRef} 
            id="hero" 
            className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black select-none"
        >
            {/* Screen Reader / SEO H1 */}
            <h1 className="sr-only">ENDURA official | Luxury Streetwear & Digital Collectibles India</h1>

            {/* Clickable Area linking directly to Collections */}
            <Link 
                to="/collections" 
                className="absolute inset-0 z-10 block cursor-pointer"
                aria-label="Explore Genesis Collection"
            >
                {/* Master Clean Cinematic Photoshoot Background (Desktop & Mobile Responsive) */}
                <div ref={bgRef} className="absolute inset-0 z-0 overflow-hidden">
                    {/* Desktop Hero Image */}
                    <img
                        src={heroCampaignImg}
                        alt="ENDURA Genesis Campaign"
                        className="hidden md:block w-full h-full object-cover object-center pointer-events-none select-none will-change-transform"
                        loading="eager"
                        decoding="sync"
                        style={{
                            imageRendering: '-webkit-optimize-contrast',
                        }}
                    />
                    {/* Ambient atmosphere blur backdrop for mobile so edges blend smoothly into black */}
                    <div 
                        className="block md:hidden absolute inset-0 bg-cover bg-center opacity-25 blur-3xl scale-125 pointer-events-none"
                        style={{ backgroundImage: `url(${heroCampaignMobileImg})` }}
                    />
                    {/* Mobile Hero Image (Full Image Visible with Zero Cropping) */}
                    <img
                        src={heroCampaignMobileImg}
                        alt="ENDURA Genesis Campaign Mobile"
                        className="block md:hidden w-full h-full object-contain object-center pointer-events-none select-none will-change-transform py-14 sm:py-0"
                        loading="eager"
                        decoding="sync"
                        style={{
                            imageRendering: '-webkit-optimize-contrast',
                        }}
                    />
                </div>

                {/* ========================================================= */}
                {/* LEFT EDITORIAL TYPOGRAPHY: "WE EXIST Twice" */}
                {/* ========================================================= */}
                <div 
                    ref={leftTextRef}
                    className="absolute top-[24%] sm:top-[28%] md:top-[32%] lg:top-[34%] left-6 sm:left-10 md:left-16 lg:left-24 xl:left-32 z-20 pointer-events-none flex flex-col will-change-transform"
                >
                    {/* Line 1: WE EXIST (All-caps Roman Serif) */}
                    <div 
                        ref={weExistRef}
                        className="font-cinzel text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium text-white uppercase tracking-[0.28em] leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]"
                        style={{ textShadow: '0 4px 24px rgba(0,0,0,0.95), 0 0 12px rgba(0,0,0,0.8)' }}
                    >
                        WE EXIST
                    </div>

                    {/* Line 2: Twice (Flowing Luxury Script / Cursive) */}
                    <div 
                        ref={twiceRef}
                        className="font-script text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] text-white/95 lowercase first-letter:uppercase -mt-2 sm:-mt-3 md:-mt-4 ml-8 sm:ml-12 md:ml-16 lg:ml-20 tracking-normal will-change-transform"
                        style={{
                            textShadow: '0 4px 30px rgba(255,255,255,0.5), 0 2px 20px rgba(0,0,0,0.95)',
                            transform: 'rotate(-2deg)'
                        }}
                    >
                        Twice
                    </div>
                </div>

                {/* ========================================================= */}
                {/* RIGHT EDITORIAL TYPOGRAPHY: "NEW GEN STREETWEAR" */}
                {/* ========================================================= */}
                <div 
                    ref={rightTextRef}
                    className="absolute top-[48%] sm:top-[44%] md:top-[42%] lg:top-[42%] right-6 sm:right-10 md:right-14 lg:right-20 xl:right-28 z-20 pointer-events-none text-left will-change-transform"
                >
                    <div 
                        className="font-cinzel text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-normal text-white uppercase tracking-[0.3em] leading-snug drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]"
                        style={{ textShadow: '0 2px 20px rgba(0,0,0,0.95), 0 0 12px rgba(0,0,0,0.8)' }}
                    >
                        <div className="block">NEW GEN</div>
                        <div className="block mt-0.5 sm:mt-1 md:mt-1.5">STREETWEAR</div>
                    </div>
                </div>
            </Link>

            {/* Luxury Editorial "Shop now" Button with Illuminated White Underline */}
            <div 
                ref={hintRef}
                className="absolute bottom-24 sm:bottom-9 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center will-change-transform"
            >
                <Link
                    to="/collections"
                    className="group relative inline-flex flex-col items-center gap-1.5 px-6 py-2 cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
                    aria-label="Shop now - Explore Genesis Collection"
                >
                    <span className="font-cinzel text-xs sm:text-sm md:text-base font-medium tracking-[0.3em] uppercase text-white transition-all duration-300 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] group-hover:drop-shadow-[0_0_16px_rgba(255,255,255,0.95)]">
                        Shop now
                    </span>
                    
                    {/* Refined Glowing White Underline with Interactive Hover Expansion */}
                    <div className="relative w-full flex items-center justify-center">
                        <span className="h-[1.5px] w-12 sm:w-16 bg-white transition-all duration-500 ease-out group-hover:w-full group-hover:h-[2px] shadow-[0_0_10px_rgba(255,255,255,0.85)] group-hover:shadow-[0_0_16px_rgba(255,255,255,1)]" />
                    </div>
                </Link>
            </div>
        </section>
    );
};

export default SystemBootHero;
