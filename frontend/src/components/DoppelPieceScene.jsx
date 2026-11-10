import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import portalGateImg from '../assets/portal-split-gate.jpg';
import genesisLineupImg from '../assets/genesis-lineup-hd.jpg';

gsap.registerPlugin(ScrollTrigger);

const DoppelPieceScene = () => {
    const sectionRef = useRef();

    // Portal door split & heading references
    const portalHeadingRef = useRef();
    const leftDoorRef = useRef();
    const rightDoorRef = useRef();
    const doorHintRef = useRef();

    // Inside Content: Reduced-size Genesis Edition Lineup references
    const genesisContainerRef = useRef();
    const bgRef = useRef();
    const topCenterRef = useRef();
    const topLeftRef = useRef();
    const topRightRef = useRef();
    const bottomLeftRef = useRef();
    const bottomRightRef = useRef();
    const lineLeftRef = useRef();
    const lineRightRef = useRef();

    useGSAP(() => {
        // Master pinned scroll timeline
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=2600",
                scrub: 1.2,
                pin: true,
                anticipatePin: 1
            }
        });

        // =============================================================
        // STEP 1: PORTAL TEXT & HINT DISSOLVE
        // =============================================================
        tl.to(portalHeadingRef.current, {
            y: -30,
            opacity: 0,
            filter: 'blur(12px)',
            duration: 0.5,
            ease: "power2.inOut"
        }, 0);

        tl.to(doorHintRef.current, {
            opacity: 0,
            y: 10,
            duration: 0.35
        }, 0);

        // =============================================================
        // STEP 2: DOORS SPLIT OPEN CLEANLY (LEFT & RIGHT)
        // =============================================================
        tl.to(leftDoorRef.current, {
            xPercent: -105,
            scale: 1.02,
            duration: 1.5,
            ease: "power2.inOut"
        }, 0.5);

        tl.to(rightDoorRef.current, {
            xPercent: 105,
            scale: 1.02,
            duration: 1.5,
            ease: "power2.inOut"
        }, 0.5);

        // =============================================================
        // STEP 3: INSIDE CONTENT (REDUCED-SIZE GENESIS LINEUP) EMERGES
        // =============================================================
        tl.fromTo(genesisContainerRef.current,
            { opacity: 0, scale: 0.90 },
            { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" },
            0.6
        );

        // =============================================================
        // STEP 4: GENESIS EDITION TYPOGRAPHY (RAZOR-SHARP, ZERO BLUR)
        // =============================================================
        tl.to(topCenterRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out"
        }, 1.0);

        tl.to(topLeftRef.current, {
            x: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out"
        }, 1.1);

        tl.to(lineLeftRef.current, {
            scaleX: 1,
            duration: 0.5,
            ease: "power2.out"
        }, 1.3);

        tl.to(topRightRef.current, {
            x: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out"
        }, 1.1);

        tl.to(lineRightRef.current, {
            scaleX: 1,
            duration: 0.5,
            ease: "power2.out"
        }, 1.3);

        tl.to(bottomLeftRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out"
        }, 1.2);

        tl.to(bottomRightRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out"
        }, 1.2);

        tl.to(".explore-pill", {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out"
        }, 1.4);

    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            className="h-screen w-full relative bg-black overflow-hidden flex items-center justify-center select-none"
        >
            {/* Pure Deep Space Black Canvas */}
            <div className="absolute inset-0 z-0 bg-black pointer-events-none" />

            {/* ========================================================= */}
            {/* INSIDE CONTENT: REDUCED-SIZE GENESIS LINEUP SHOWCASE      */}
            {/* ========================================================= */}
            <div
                ref={genesisContainerRef}
                className="relative z-10 w-[94vw] h-[78vh] sm:w-[90vw] sm:h-[84vh] md:w-[86vw] md:h-[82vh] lg:w-[82vw] lg:h-[80vh] max-w-6xl flex items-center justify-center rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.95)] bg-black/90 opacity-0"
            >
                <Link
                    to="/collections"
                    className="absolute inset-0 w-full h-full cursor-pointer block"
                >
                    {/* Master Clean HD Lineup Artwork */}
                    <div className="absolute inset-0 z-0 bg-black">
                        <div
                            ref={bgRef}
                            className="w-full h-full bg-contain sm:bg-cover bg-center bg-no-repeat will-change-transform"
                            style={{
                                backgroundImage: `url(${genesisLineupImg})`,
                                filter: 'contrast(1.06) brightness(1.04) saturate(1.05)',
                                imageRendering: '-webkit-optimize-contrast',
                            }}
                        />
                        {/* Soft ambient dark overlay for crystal-clear readability */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35 opacity-60 pointer-events-none" />
                    </div>

                    {/* Center Holographic Light Accent */}
                    <div className="center-beam absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-20 sm:h-36 md:h-44 bg-gradient-to-b from-primary/70 via-primary/15 to-transparent z-15 pointer-events-none opacity-80" />

                    {/* Holographic Corner Frames */}
                    <div className="corner-frame absolute top-0 left-0 w-12 h-12 sm:w-24 sm:h-24 md:w-36 md:h-36 border-l-2 border-t-2 border-primary/30 z-15 pointer-events-none" />
                    <div className="corner-frame absolute top-0 right-0 w-12 h-12 sm:w-24 sm:h-24 md:w-36 md:h-36 border-r-2 border-t-2 border-primary/30 z-15 pointer-events-none" />
                    <div className="corner-frame absolute bottom-0 left-0 w-12 h-12 sm:w-24 sm:h-24 md:w-36 md:h-36 border-l-2 border-b-2 border-accent/30 z-15 pointer-events-none" />
                    <div className="corner-frame absolute bottom-0 right-0 w-12 h-12 sm:w-24 sm:h-24 md:w-36 md:h-36 border-r-2 border-b-2 border-accent/30 z-15 pointer-events-none" />

                    {/* ========================================================= */}
                    {/* TEXT OVERLAYS: Clean, zero-blur, razor-sharp               */}
                    {/* ========================================================= */}

                    {/* TOP CENTER: GENESIS EDITION / One Worn and One Eternal */}
                    <div
                        ref={topCenterRef}
                        className="absolute top-4 sm:top-6 md:top-8 lg:top-10 left-1/2 -translate-x-1/2 text-center pointer-events-none z-20 w-full px-4 opacity-0 -translate-y-4 will-change-transform"
                    >
                        <h2 className="font-cinzel text-sm sm:text-2xl md:text-4xl lg:text-5xl font-light tracking-[0.24em] sm:tracking-[0.32em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-stone-100 to-stone-300 drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)]">
                            GENESIS EDITION
                        </h2>
                        <p className="font-serif italic font-light tracking-widest text-[9.5px] sm:text-xs md:text-sm lg:text-base text-stone-200 mt-0.5 sm:mt-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                            One Worn and One Eternal
                        </p>
                    </div>

                    {/* TOP LEFT: PHYSICAL REALITY / Crafted to wear */}
                    <div
                        ref={topLeftRef}
                        className="absolute top-14 sm:top-16 md:top-20 lg:top-24 left-3 sm:left-6 md:left-10 lg:left-12 pointer-events-none z-20 opacity-0 -translate-x-6 will-change-transform"
                    >
                        <span className="block font-cinzel text-[9.5px] sm:text-sm md:text-base lg:text-lg font-medium tracking-[0.16em] sm:tracking-[0.22em] text-stone-100 uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                            PHYSICAL REALITY
                        </span>
                        <span className="block font-serif italic text-[8.5px] sm:text-xs md:text-sm text-stone-300 mt-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                            Crafted to wear
                        </span>
                        <div
                            ref={lineLeftRef}
                            className="h-[1px] w-6 sm:w-16 md:w-20 bg-gradient-to-r from-stone-300/90 via-stone-400/40 to-transparent mt-1 scale-x-0 origin-left"
                        />
                    </div>

                    {/* TOP RIGHT: DIGITAL ETERNITY / Crafted to last */}
                    <div
                        ref={topRightRef}
                        className="absolute top-14 sm:top-16 md:top-20 lg:top-24 right-3 sm:right-6 md:right-10 lg:right-12 text-right pointer-events-none z-20 opacity-0 translate-x-6 will-change-transform"
                    >
                        <span className="block font-cinzel text-[9.5px] sm:text-sm md:text-base lg:text-lg font-medium tracking-[0.16em] sm:tracking-[0.22em] text-stone-100 uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                            DIGITAL ETERNITY
                        </span>
                        <span className="block font-serif italic text-[8.5px] sm:text-xs md:text-sm text-stone-300 mt-0.5 text-right drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                            Crafted to last
                        </span>
                        <div
                            ref={lineRightRef}
                            className="h-[1px] w-6 sm:w-16 md:w-20 bg-gradient-to-l from-stone-300/90 via-stone-400/40 to-transparent mt-1 ml-auto scale-x-0 origin-right"
                        />
                    </div>

                    {/* BOTTOM LEFT: More than a clothing , / A higher existence */}
                    <div
                        ref={bottomLeftRef}
                        className="absolute bottom-3 sm:bottom-8 md:bottom-10 lg:bottom-12 left-3 sm:left-6 md:left-10 lg:left-12 pointer-events-none z-20 opacity-0 translate-y-4 will-change-transform"
                    >
                        <p className="font-serif text-[9.5px] sm:text-sm md:text-base lg:text-lg text-stone-100 font-normal leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.98)]">
                            More than a clothing ,
                        </p>
                        <p className="font-serif text-[9.5px] sm:text-sm md:text-base lg:text-lg text-stone-200 font-light leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.98)]">
                            A higher existence
                        </p>
                    </div>

                    {/* BOTTOM RIGHT: Physical meets Digital / A new generation of ownership */}
                    <div
                        ref={bottomRightRef}
                        className="absolute bottom-3 sm:bottom-8 md:bottom-10 lg:bottom-12 right-3 sm:right-6 md:right-10 lg:right-12 text-right pointer-events-none z-20 opacity-0 translate-y-4 will-change-transform"
                    >
                        <p className="font-serif text-[9.5px] sm:text-sm md:text-base lg:text-lg text-stone-100 font-normal leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.98)]">
                            Physical meets Digital
                        </p>
                        <p className="font-serif text-[9.5px] sm:text-sm md:text-base lg:text-lg text-stone-200 font-light leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.98)]">
                            A new generation of ownership
                        </p>
                    </div>

                    {/* Subtle Hover / Revealed Pill: "EXPLORE ARCHIVE →" */}
                    <div className="explore-pill absolute bottom-2 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 opacity-0 transition-all duration-500 translate-y-2 z-30 pointer-events-none">
                        <span className="px-3 sm:px-5 py-1 sm:py-2 rounded-full text-[8.5px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.25em] uppercase font-mono bg-stone-950/85 border border-primary/40 text-primary-light shadow-[0_0_20px_rgba(212,175,55,0.35)]">
                            EXPLORE ARCHIVE →
                        </span>
                    </div>
                </Link>
            </div>

            {/* Subtle Film Grain Overlay */}
            <div className="absolute inset-0 pointer-events-none film-grain opacity-10 z-15" />

            {/* ========================================================= */}
            {/* FRONT LAYER: PORTAL GATE SPLIT DOORS (Clean Dark Cut)    */}
            {/* ========================================================= */}

            {/* LEFT DOOR: Red Warrior + Left Half of Circle (0% to 50%) */}
            <div
                ref={leftDoorRef}
                className="absolute inset-0 w-full h-full z-20 pointer-events-none will-change-transform bg-black"
                style={{
                    clipPath: 'polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)',
                }}
            >
                <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${portalGateImg})`,
                        filter: 'contrast(1.08) brightness(1.02) saturate(1.06)',
                        imageRendering: '-webkit-optimize-contrast',
                    }}
                />
            </div>

            {/* RIGHT DOOR: Gold Warrior + Right Half of Circle (50% to 100%) */}
            <div
                ref={rightDoorRef}
                className="absolute inset-0 w-full h-full z-20 pointer-events-none will-change-transform bg-black"
                style={{
                    clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)',
                }}
            >
                <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${portalGateImg})`,
                        filter: 'contrast(1.08) brightness(1.02) saturate(1.06)',
                        imageRendering: '-webkit-optimize-contrast',
                    }}
                />
            </div>

            {/* ========================================================= */}
            {/* PORTAL OVERLAY TEXT: ONE EXISTENCE / TWO FORMS            */}
            {/* ========================================================= */}
            <div
                ref={portalHeadingRef}
                className="absolute top-[6%] sm:top-[7.5%] md:top-[9%] left-1/2 -translate-x-1/2 text-center pointer-events-none z-30 w-full px-4"
            >
                <span className="block font-cinzel text-xs sm:text-sm md:text-base lg:text-lg font-light tracking-[0.28em] md:tracking-[0.38em] uppercase text-stone-200/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                    ONE EXISTENCE
                </span>
                <h2 className="font-cinzel text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-[0.18em] md:tracking-[0.25em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-purple-500 drop-shadow-[0_0_30px_rgba(168,85,247,0.9)] mt-0.5 sm:mt-1">
                    TWO FORMS
                </h2>
            </div>

            {/* Initial Scroll Prompt Hint */}
            <div
                ref={doorHintRef}
                className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-25 pointer-events-none text-center"
            >
                <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-black/70 border border-primary/30 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                    <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-stone-300">
                        SCROLL TO ENTER THE SANCTUM
                    </span>
                </div>
            </div>
        </section>
    );
};

export default DoppelPieceScene;
