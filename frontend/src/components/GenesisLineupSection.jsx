import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import genesisLineupImg from '../assets/genesis-lineup-hd.jpg';

gsap.registerPlugin(ScrollTrigger);

const GenesisLineupSection = () => {
    const sectionRef = useRef();
    const bgRef = useRef();

    // Animated text layer references
    const topCenterRef = useRef();
    const topLeftRef = useRef();
    const topRightRef = useRef();
    const bottomLeftRef = useRef();
    const bottomRightRef = useRef();
    const lineLeftRef = useRef();
    const lineRightRef = useRef();

    useGSAP(() => {
        // =============================================================
        // PIN AT TOP:
        // - First you arrive and see ONLY the clean crisp image.
        // - When you scroll again, the razor-sharp text animates in!
        // - Then scrolling continues down to the next section.
        // =============================================================
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=1200",
                scrub: 1,
                pin: true,
                anticipatePin: 1
            }
        });

        // Crisp, zero-blur text animations
        tl.to(topCenterRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out"
        }, 0.2);

        tl.to(topLeftRef.current, {
            x: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out"
        }, 0.25);

        tl.to(lineLeftRef.current, {
            scaleX: 1,
            duration: 0.5,
            ease: "power2.out"
        }, 0.45);

        tl.to(topRightRef.current, {
            x: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out"
        }, 0.25);

        tl.to(lineRightRef.current, {
            scaleX: 1,
            duration: 0.5,
            ease: "power2.out"
        }, 0.45);

        tl.to(bottomLeftRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out"
        }, 0.35);

        tl.to(bottomRightRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out"
        }, 0.35);

        // Subtle parallax depth on the background image while scrolling
        tl.to(bgRef.current, {
            scale: 1.03,
            duration: 1,
            ease: "none"
        }, 0);

        // Explore badge reveal
        tl.to(".explore-pill", {
            opacity: 1,
            y: 0,
            duration: 0.4
        }, 0.65);

    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            className="group relative h-screen w-full flex items-center justify-center overflow-hidden bg-black select-none"
        >
            <Link
                to="/collections"
                className="absolute inset-0 w-full h-full cursor-pointer block"
            >
                {/* 1. MASTER CLEAN IMAGE: Bright, clear, reduced dark overlay opacity */}
                <div className="absolute inset-0 z-0 bg-black">
                    <div
                        ref={bgRef}
                        className="w-full h-full bg-cover bg-center will-change-transform"
                        style={{
                            backgroundImage: `url(${genesisLineupImg})`,
                            filter: 'contrast(1.06) brightness(1.04) saturate(1.05)',
                            imageRendering: '-webkit-optimize-contrast',
                        }}
                    />
                    {/* Significantly reduced dark overlay opacity for crystal clear visibility */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35 opacity-60 pointer-events-none" />
                </div>

                {/* Center Holographic Light Accent */}
                <div className="center-beam absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-36 md:h-52 bg-gradient-to-b from-primary/70 via-primary/15 to-transparent z-15 pointer-events-none opacity-80" />

                {/* Holographic Corner Frames */}
                <div className="corner-frame absolute top-0 left-0 w-24 h-24 md:w-48 md:h-48 border-l-2 border-t-2 border-primary/30 z-15 pointer-events-none" />
                <div className="corner-frame absolute top-0 right-0 w-24 h-24 md:w-48 md:h-48 border-r-2 border-t-2 border-primary/30 z-15 pointer-events-none" />
                <div className="corner-frame absolute bottom-0 left-0 w-24 h-24 md:w-48 md:h-48 border-l-2 border-b-2 border-accent/30 z-15 pointer-events-none" />
                <div className="corner-frame absolute bottom-0 right-0 w-24 h-24 md:w-48 md:h-48 border-r-2 border-b-2 border-accent/30 z-15 pointer-events-none" />

                {/* ========================================================= */}
                {/* 2. TEXT OVERLAYS: Clean, zero-blur, razor-sharp           */}
                {/* ========================================================= */}

                {/* TOP CENTER: GENESIS EDITION / One Worn and One Eternal */}
                <div
                    ref={topCenterRef}
                    className="absolute top-12 sm:top-16 md:top-20 lg:top-24 left-1/2 -translate-x-1/2 text-center pointer-events-none z-20 w-full px-4 opacity-0 -translate-y-6 will-change-transform"
                >
                    <h2 className="font-cinzel text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-light tracking-[0.25em] md:tracking-[0.35em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-stone-100 to-stone-300 drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)]">
                        GENESIS EDITION
                    </h2>
                    <p className="font-serif italic font-light tracking-widest text-xs sm:text-sm md:text-base lg:text-lg text-stone-200 mt-1 sm:mt-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                        One Worn and One Eternal
                    </p>
                </div>

                {/* TOP LEFT: PHYSICAL REALITY / Crafted to wear */}
                <div
                    ref={topLeftRef}
                    className="absolute top-20 sm:top-28 md:top-36 lg:top-40 left-6 sm:left-10 md:left-16 lg:left-20 pointer-events-none z-20 opacity-0 -translate-x-8 will-change-transform"
                >
                    <span className="block font-cinzel text-xs sm:text-sm md:text-lg lg:text-xl font-medium tracking-[0.2em] sm:tracking-[0.25em] text-stone-100 uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                        PHYSICAL REALITY
                    </span>
                    <span className="block font-serif italic text-xs sm:text-sm md:text-base text-stone-300 mt-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                        Crafted to wear
                    </span>
                    <div
                        ref={lineLeftRef}
                        className="h-[1px] w-14 sm:w-24 bg-gradient-to-r from-stone-300/90 via-stone-400/40 to-transparent mt-2 scale-x-0 origin-left"
                    />
                </div>

                {/* TOP RIGHT: DIGITAL ETERNITY / Crafted to last */}
                <div
                    ref={topRightRef}
                    className="absolute top-20 sm:top-28 md:top-36 lg:top-40 right-6 sm:right-10 md:right-16 lg:right-20 text-right pointer-events-none z-20 opacity-0 translate-x-8 will-change-transform"
                >
                    <span className="block font-cinzel text-xs sm:text-sm md:text-lg lg:text-xl font-medium tracking-[0.2em] sm:tracking-[0.25em] text-stone-100 uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                        DIGITAL ETERNITY
                    </span>
                    <span className="block font-serif italic text-xs sm:text-sm md:text-base text-stone-300 mt-1 text-right drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                        Crafted to last
                    </span>
                    <div
                        ref={lineRightRef}
                        className="h-[1px] w-14 sm:w-24 bg-gradient-to-l from-stone-300/90 via-stone-400/40 to-transparent mt-2 ml-auto scale-x-0 origin-right"
                    />
                </div>

                {/* BOTTOM LEFT: More than a clothing , / A higher existence */}
                <div
                    ref={bottomLeftRef}
                    className="absolute bottom-10 sm:bottom-14 md:bottom-16 lg:bottom-20 left-6 sm:left-10 md:left-16 lg:left-20 pointer-events-none z-20 opacity-0 translate-y-6 will-change-transform"
                >
                    <p className="font-serif text-sm sm:text-base md:text-lg lg:text-xl text-stone-100 font-normal leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.98)]">
                        More than a clothing ,
                    </p>
                    <p className="font-serif text-sm sm:text-base md:text-lg lg:text-xl text-stone-200 font-light leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.98)]">
                        A higher existence
                    </p>
                </div>

                {/* BOTTOM RIGHT: Physical meets Digital / A new generation of ownership */}
                <div
                    ref={bottomRightRef}
                    className="absolute bottom-10 sm:bottom-14 md:bottom-16 lg:bottom-20 right-6 sm:right-10 md:right-16 lg:right-20 text-right pointer-events-none z-20 opacity-0 translate-y-6 will-change-transform"
                >
                    <p className="font-serif text-sm sm:text-base md:text-lg lg:text-xl text-stone-100 font-normal leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.98)]">
                        Physical meets Digital
                    </p>
                    <p className="font-serif text-sm sm:text-base md:text-lg lg:text-xl text-stone-200 font-light leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.98)]">
                        A new generation of ownership
                    </p>
                </div>

                {/* Subtle Hover / Revealed Pill: "EXPLORE ARCHIVE →" */}
                <div className="explore-pill absolute bottom-6 sm:bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 z-30 pointer-events-none">
                    <span className="px-5 py-2 rounded-full text-[11px] tracking-[0.25em] uppercase font-mono bg-stone-950/80 border border-primary/40 text-primary-light shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                        EXPLORE ARCHIVE →
                    </span>
                </div>
            </Link>
        </section>
    );
};

export default GenesisLineupSection;