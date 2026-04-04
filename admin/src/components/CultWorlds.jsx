import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const CultWorlds = () => {
    const containerRef = useRef();

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=5000", // 1000px per world
                scrub: true,
                pin: true,
                anticipatePin: 1
            }
        });

        // ANIMATION STRATEGY:
        // Use opacity + scale for a cinematic "breathing" effect
        // Avoid large x/y movements on mobile to prevent jitter

        // WORLD 1 — THE VEIL
        tl.to(".veil", { opacity: 1, duration: 1 })
            .to(".world-progress-1", { scaleX: 1, duration: 1 }, "<")
            .from(".veil .character-img", { scale: 1.15, opacity: 0, duration: 2, ease: "power2.out" }, "<")
            .from(".veil .world-content", { y: 20, opacity: 0, duration: 1.5 }, "-=0.5") // Text delayed
            .from(".veil .fog", { opacity: 0 }, "<")
            .to(".veil", { opacity: 0, duration: 1 });

        // WORLD 2 — THE FORGED
        tl.to(".forged", { opacity: 1, duration: 1 })
            .to(".world-progress-2", { scaleX: 1, duration: 1 }, "<")
            .from(".forged .character-img", { scale: 0.9, opacity: 0, duration: 2, ease: "power2.out" }, "<")
            .from(".forged .world-content", { y: 20, opacity: 0, duration: 1.5 }, "-=0.5")
            .from(".forged .sparks", { opacity: 0, y: 50 }, "<")
            .to(".forged", { opacity: 0, duration: 1 });

        // WORLD 3 — THE ASCENDED
        tl.to(".ascended", { opacity: 1, duration: 1 })
            .to(".world-progress-3", { scaleX: 1, duration: 1 }, "<")
            .from(".ascended .character-img", { scale: 1.1, opacity: 0, duration: 2, ease: "power2.out" }, "<")
            .from(".ascended .light-beam", { height: 0, opacity: 0, stagger: 0.1 }, "-=1")
            .from(".ascended .world-content", { letterSpacing: "1em", opacity: 0, duration: 1.5 }, "-=0.5")
            .to(".ascended", { opacity: 0, duration: 1 });

        // WORLD 4 — THE CROWNLESS (LOCKED)
        tl.to(".crownless", { opacity: 1, duration: 1 })
            .to(".world-progress-4", { scaleX: 1, duration: 1 }, "<")
            .from(".crownless", { filter: "blur(20px) brightness(0.2)" }, "<") // Reduced blur for performance
            .from(".crownless .locked-status", { opacity: 0, scale: 1.2 }, "<")
            .to(".crownless", { opacity: 0, duration: 0.5 });

        // WORLD 5 — THE HOLLOW (CLASSIFIED)
        tl.to(".hollow", { opacity: 1, duration: 1 })
            .to(".world-progress-5", { scaleX: 1, duration: 1 }, "<")
            .from(".hollow .character-img", { scale: 1.3, opacity: 0, duration: 3, ease: "power2.out" }, "<")
            .from(".hollow .pulsing-symbol", { scale: 0.8, opacity: 0 }, "-=1.5")
            .to({}, { duration: 1 }); // Pause

    }, { scope: containerRef });

    return (
        <section id="cult-worlds" ref={containerRef} className="h-screen w-full relative bg-black overflow-hidden pointer-events-none">
            {/* Global Background Layer */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-radial-gradient from-black/20 to-black/90" />
            </div>

            {/* WORLD 1: THE VEIL */}
            <div className="world veil absolute inset-0 opacity-0 bg-black flex flex-col items-center justify-start md:justify-center overflow-hidden">
                <div className="fog absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-30 blur-2xl animate-pulse" />

                {/* Visual: Top/Center */}
                <div className="absolute top-0 md:inset-0 w-full h-[65vh] md:h-full flex items-end md:items-center justify-center">
                    <img
                        src="/factions/the veil.png"
                        alt="The Veil"
                        className="character-img h-full md:h-[85vh] w-auto object-contain md:object-cover opacity-70 mix-blend-screen"
                    />
                </div>

                {/* Content: Bottom */}
                <div className="world-content absolute bottom-12 md:relative md:bottom-auto z-10 text-center px-6 w-full max-w-4xl flex flex-col items-center">
                    <span className="restricted-label block mb-4 md:mb-6 text-white/40 tracking-[0.5em] md:tracking-[1em] text-[8px] md:text-[10px] order-1 md:order-1">// FACTION_01</span>
                    <h2 className="text-5xl md:text-[10rem] font-heading tracking-[0.1em] md:tracking-[0.2em] uppercase text-white leading-none order-2 md:order-2">The Veil</h2>
                    <div className="mt-6 md:mt-12 h-px w-12 md:w-24 bg-white/20 mx-auto order-3 md:order-3" />
                    <p className="mt-6 md:mt-12 text-gray-400 font-body font-light text-xs md:text-base tracking-[0.1em] md:tracking-[0.3em] uppercase max-w-[85%] md:max-w-2xl mx-auto leading-relaxed order-4 md:order-4 line-clamp-3 md:line-clamp-none">
                        Keepers of the unseen truth. Operating in shadows where silence is the only language.
                    </p>
                </div>
            </div>

            {/* WORLD 2: THE FORGED */}
            <div className="world forged absolute inset-0 opacity-0 bg-cover bg-center flex flex-col items-center justify-start md:justify-center" style={{ backgroundImage: 'url(/factions/forged.jpg)' }}>
                <div className="absolute inset-0 bg-black/60 md:bg-black/70 backdrop-blur-[2px] md:backdrop-blur-sm" />

                <div className="absolute top-0 md:inset-0 w-full h-[60vh] md:h-full flex items-end md:items-center justify-center">
                    <img
                        src="/factions/the forged.png"
                        alt="The Forged"
                        className="character-img h-full md:h-[80vh] w-auto object-contain brightness-90"
                    />
                </div>

                <div className="sparks absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-accent/10 to-transparent blur-xl" />

                <div className="world-content absolute bottom-12 md:relative md:bottom-auto z-10 text-center px-6 w-full max-w-4xl flex flex-col items-center">
                    <span className="restricted-label block mb-4 md:mb-6 tracking-[0.5em] md:tracking-[1em] text-[8px] md:text-[10px] order-1" style={{ color: 'var(--accent)' }}>// FACTION_04</span>
                    <h2 className="text-5xl md:text-[10rem] font-heading tracking-[0.1em] uppercase text-white leading-none order-2">The Forged</h2>
                    <div className="mt-6 md:mt-12 h-px w-12 md:w-24 bg-accent/30 mx-auto order-3" />
                    <p className="mt-6 md:mt-12 text-white/70 font-body font-light text-xs md:text-base tracking-[0.1em] md:tracking-[0.3em] uppercase max-w-[85%] md:max-w-2xl mx-auto leading-relaxed order-4">
                        Born in industrial pressure. Structural integrity and raw power. Cold steel and unyielding will.
                    </p>
                </div>
            </div>

            {/* WORLD 3: THE ASCENDED */}
            <div className="world ascended absolute inset-0 opacity-0 bg-cover bg-center flex flex-col items-center justify-start md:justify-center" style={{ backgroundImage: 'url(/factions/ascend.jpg)' }}>
                <div className="absolute inset-0 bg-black/50 md:bg-black/60" />

                <div className="absolute top-0 md:inset-0 w-full h-[65vh] md:h-full flex items-end md:items-center justify-center">
                    <img
                        src="/factions/the ascended.png"
                        alt="The Ascended"
                        className="character-img h-full md:h-[85vh] w-auto object-contain brightness-100"
                    />
                </div>

                <div className="absolute inset-0 flex justify-around pointer-events-none overflow-hidden mix-blend-overlay">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="light-beam w-px h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
                    ))}
                </div>

                <div className="world-content absolute bottom-12 md:relative md:bottom-auto z-10 text-center px-6 w-full max-w-4xl flex flex-col items-center">
                    <span className="restricted-label block mb-4 md:mb-6 tracking-[0.5em] md:tracking-[1em] text-[8px] md:text-[10px] order-1" style={{ color: 'var(--primary-light)' }}>// FACTION_05</span>
                    <h2 className="text-4xl md:text-[8rem] font-heading uppercase text-white leading-none order-2">The Ascended</h2>
                    <div className="mt-6 md:mt-12 h-px w-12 md:w-24 bg-primary/30 mx-auto order-3" />
                    <p className="mt-6 md:mt-12 text-primary-light/80 font-body font-light text-xs md:text-base tracking-[0.1em] md:tracking-[0.3em] uppercase max-w-[85%] md:max-w-2xl mx-auto leading-relaxed order-4">
                        Beyond linear time. Perfection through digital evolution. A beam through mortality.
                    </p>
                </div>
            </div>

            {/* WORLD 4: THE CROWNLESS (LOCKED) */}
            <div className="world crownless absolute inset-0 opacity-0 bg-cover bg-center flex flex-col items-center justify-center" style={{ backgroundImage: 'url(/factions/crownless.jpg)' }}>
                <div className="absolute inset-0 bg-black/70 md:bg-black/80 backdrop-blur-sm md:backdrop-blur-md" />

                <div className="absolute inset-0 flex items-center justify-center opacity-30 grayscale blur-lg md:blur-xl">
                    <img
                        src="/factions/the crownless.png"
                        alt="The Crownless"
                        className="h-[60vh] md:h-[80vh] w-auto object-contain"
                    />
                </div>

                <div className="locked-status relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 md:w-24 md:h-24 mb-8 md:mb-12 border border-white/10 flex items-center justify-center text-white/20">
                        <span className="font-mono text-2xl md:text-4xl">?</span>
                    </div>
                    <h2 className="text-4xl md:text-7xl font-heading tracking-[0.3em] md:tracking-[0.5em] uppercase text-white opacity-20">The Crownless</h2>
                    <p className="mt-6 md:mt-8 text-white/20 font-body font-light text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.4em] uppercase max-w-[250px] md:max-w-sm text-center">
                        Rebels of the order. Access strictly forbidden.
                    </p>
                    <span className="mt-8 md:mt-12 px-6 md:px-8 py-2 border border-red-500/30 text-red-500/50 font-mono text-[8px] md:text-[10px] tracking-[0.5em] md:tracking-[1em] uppercase">
                        [ ACCESS_DENIED ]
                    </span>
                </div>
            </div>

            {/* WORLD 5: THE HOLLOW (CLASSIFIED) */}
            <div className="world hollow absolute inset-0 opacity-0 flex flex-col items-center justify-center bg-black overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <img src="/factions/hollow.jpg" className="w-full h-full object-cover grayscale" />
                </div>

                <div className="absolute top-0 md:inset-0 w-full h-[60vh] md:h-full flex items-end md:items-center justify-center">
                    <img
                        src="/factions/the hollow.png"
                        alt="The Hollow"
                        className="character-img h-full md:h-[80vh] w-auto object-contain brightness-50 mix-blend-overlay"
                    />
                </div>

                <div className="world-content absolute bottom-12 md:relative md:bottom-auto z-10 text-center px-6 w-full max-w-4xl flex flex-col items-center">
                    <div className="pulsing-symbol mb-8 md:mb-16 inline-block order-1">
                        <div className="w-20 h-20 md:w-32 md:h-32 border-[0.5px] border-white/20 relative animate-[spin_15s_linear_infinite]">
                            <div className="absolute inset-2 border-[0.5px] border-white/10 rotate-45" />
                        </div>
                    </div>
                    <h2 className="text-5xl md:text-[12rem] font-heading tracking-[0.2em] md:tracking-[0.4em] uppercase text-white/10 leading-none order-2">Hollow</h2>
                    <div className="mt-6 md:mt-12 h-px w-12 md:w-24 bg-white/5 mx-auto order-3" />
                    <p className="mt-6 md:mt-12 text-white/10 font-body font-light text-[10px] md:text-base tracking-[0.3em] md:tracking-[0.6em] uppercase max-w-[80%] md:max-w-2xl mx-auto leading-relaxed order-4">
                        Form meets void. Absence as the highest form of presence.
                    </p>
                </div>
            </div>

            {/* Progress indicator - Adjusted for mobile */}
            <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 z-20 flex gap-2 md:gap-4">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="w-4 md:w-8 h-[2px] bg-white/5 overflow-hidden">
                        <div className={`world-progress-${i} w-full h-full bg-accent origin-left scale-x-0`} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CultWorlds;
