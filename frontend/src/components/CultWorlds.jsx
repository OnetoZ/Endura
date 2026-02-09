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

        // WORLD 1 — THE VEIL
        tl.to(".veil", { opacity: 1, duration: 1 })
            .to(".world-progress-1", { scaleX: 1, duration: 1 }, "<")
            .from(".veil .character-img", { scale: 1.2, opacity: 0, duration: 2 }, "<")
            .from(".veil .world-content", { y: 40, opacity: 0 }, "-=1.5")
            .from(".veil .fog", { opacity: 0 }, "<")
            .to(".veil", { opacity: 0, duration: 1 });

        // WORLD 2 — THE FORGED
        tl.to(".forged", { opacity: 1, duration: 1 })
            .to(".world-progress-2", { scaleX: 1, duration: 1 }, "<")
            .from(".forged .character-img", { scale: 0.8, opacity: 0, duration: 2 }, "<")
            .from(".forged .world-content", { y: 40, opacity: 0 }, "-=1.5")
            .from(".forged .sparks", { opacity: 0, y: 100 }, "<")
            .to(".forged", { opacity: 0, duration: 1 });

        // WORLD 3 — THE ASCENDED
        tl.to(".ascended", { opacity: 1, duration: 1 })
            .to(".world-progress-3", { scaleX: 1, duration: 1 }, "<")
            .from(".ascended .character-img", { scale: 1.1, opacity: 0, duration: 2 }, "<")
            .from(".ascended .light-beam", { y: 200, opacity: 0, stagger: 0.2 }, "-=1.5")
            .from(".ascended .world-content", { letterSpacing: "1em", opacity: 0 }, "<")
            .to(".ascended", { opacity: 0, duration: 1 });

        // WORLD 4 — THE CROWNLESS (LOCKED)
        tl.to(".crownless", { opacity: 1, duration: 1 })
            .to(".world-progress-4", { scaleX: 1, duration: 1 }, "<")
            .from(".crownless", { filter: "blur(40px) brightness(0.2)" }, "<")
            .from(".crownless .locked-status", { opacity: 0, scale: 1.5 }, "<")
            .to(".crownless", { opacity: 0, duration: 0.5 });

        // WORLD 5 — THE HOLLOW (CLASSIFIED)
        tl.to(".hollow", { opacity: 1, duration: 1 })
            .to(".world-progress-5", { scaleX: 1, duration: 1 }, "<")
            .from(".hollow .character-img", { scale: 1.5, opacity: 0, duration: 3 }, "<")
            .from(".hollow .pulsing-symbol", { scale: 0.9, opacity: 0 }, "-=2")
            .to({}, { duration: 1 }); // Let it breathe at the end

    }, { scope: containerRef });

    return (
        <section id="cult-worlds" ref={containerRef} className="h-screen w-full relative bg-black overflow-hidden">
            {/* Base Layer for all worlds */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-radial-gradient from-black/20 to-black/80" />
            </div>

            {/* WORLD 1: THE VEIL */}
            <div className="world veil absolute inset-0 opacity-0 bg-black flex items-center justify-center overflow-hidden">
                {/* Background FX */}
                <div className="fog absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-40 blur-3xl animate-pulse" />

                {/* Character Image */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <img
                        src="/factions/the veil.png"
                        alt="The Veil"
                        className="character-img h-[85vh] w-auto object-contain opacity-60 mix-blend-screen transition-transform duration-700 hover:scale-105"
                    />
                </div>

                <div className="world-content relative z-10 text-center px-6 max-w-4xl">
                    <span className="restricted-label block mb-6 text-white/40 tracking-[1em] text-[10px]">// FACTION_01</span>
                    <h2 className="text-7xl md:text-[10rem] font-oswald tracking-[0.2em] uppercase text-white leading-none">The Veil</h2>
                    <div className="mt-12 h-px w-24 bg-white/20 mx-auto" />
                    <p className="mt-12 text-gray-400 font-light text-sm md:text-base tracking-[0.3em] uppercase max-w-2xl mx-auto leading-relaxed">
                        Keepers of the unseen truth. They operate in the shadows, where silence is the only language that matters. Their garments are woven from the mist of forgotten realms.
                    </p>
                    <p className="mt-8 text-white/20 font-mono text-[10px] tracking-[0.5em] uppercase italic">Silence is the ultimate weapon.</p>
                </div>
            </div>

            {/* WORLD 2: THE FORGED */}
            <div className="world forged absolute inset-0 opacity-0 bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: 'url(/factions/forged.jpg)' }}>
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

                {/* Character Image */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <img
                        src="/factions/the forged.png"
                        alt="The Forged"
                        className="character-img h-[80vh] w-auto object-contain brightness-75 transition-transform duration-700 hover:scale-105"
                    />
                </div>

                <div className="sparks absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-accent/20 to-transparent blur-2xl" />

                <div className="world-content relative z-10 text-center px-6 max-w-4xl">
                    <span className="restricted-label block mb-6 tracking-[1em] text-[10px]" style={{ color: 'var(--accent)' }}>// FACTION_04</span>
                    <h2 className="text-7xl md:text-[10rem] font-oswald tracking-[0.1em] uppercase text-white leading-none">The Forged</h2>
                    <div className="mt-12 h-px w-24 bg-accent/30 mx-auto" />
                    <p className="mt-12 text-white/60 font-light text-sm md:text-base tracking-[0.3em] uppercase max-w-2xl mx-auto leading-relaxed">
                        Born in the heart of industrial pressure. They value structural integrity and raw power. Their aesthetic is one of cold steel, sharp edges, and unyielding will.
                    </p>
                    <p className="mt-8 text-accent font-mono text-xs tracking-[0.5em] uppercase">Strength through absolute pressure.</p>
                </div>
            </div>

            {/* WORLD 3: THE ASCENDED */}
            <div className="world ascended absolute inset-0 opacity-0 bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: 'url(/factions/ascend.jpg)' }}>
                <div className="absolute inset-0 bg-black/60" />

                {/* Character Image */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <img
                        src="/factions/the ascended.png"
                        alt="The Ascended"
                        className="character-img h-[85vh] w-auto object-contain brightness-90 transition-transform duration-700 hover:scale-105"
                    />
                </div>

                <div className="absolute inset-0 flex justify-around pointer-events-none overflow-hidden">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="light-beam w-px h-full bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
                    ))}
                </div>

                <div className="world-content relative z-10 text-center px-6 max-w-4xl">
                    <span className="restricted-label block mb-6 tracking-[1em] text-[10px]" style={{ color: 'var(--primary-light)' }}>// FACTION_05</span>
                    <h2 className="text-7xl md:text-[8rem] font-oswald uppercase text-white leading-none">The Ascended</h2>
                    <div className="mt-12 h-px w-24 bg-primary/30 mx-auto" />
                    <p className="mt-12 text-primary-light/70 font-light text-sm md:text-base tracking-[0.3em] uppercase max-w-2xl mx-auto leading-relaxed">
                        Existing beyond the linear flow of time. They seek perfection through digital evolution. Their presence is a light beam through the fog of mortality.
                    </p>
                    <p className="mt-8 text-primary-light font-mono text-xs tracking-[0.5em] uppercase italic leading-loose">Exist ahead of time.</p>
                </div>
            </div>

            {/* WORLD 4: THE CROWNLESS (LOCKED) */}
            <div className="world crownless absolute inset-0 opacity-0 bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: 'url(/factions/crownless.jpg)' }}>
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

                {/* Character Image (Blurred) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30 grayscale blur-xl">
                    <img
                        src="/factions/the crownless.png"
                        alt="The Crownless"
                        className="h-[80vh] w-auto object-contain"
                    />
                </div>

                <div className="locked-status relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 mb-12 border border-white/10 flex items-center justify-center text-white/20">
                        <span className="font-mono text-4xl">?</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-oswald tracking-[0.5em] uppercase text-white opacity-20">The Crownless</h2>
                    <p className="mt-8 text-white/20 font-light text-xs tracking-[0.4em] uppercase max-w-sm text-center">
                        The rebels of the order. They rejected the hierarchy to find their own truth in the blur of existence. Access to their domain is strictly forbidden.
                    </p>
                    <span className="mt-12 px-8 py-2 border border-red-500/30 text-red-500/50 font-mono text-[10px] tracking-[1em] uppercase">
                        [ ACCESS_DENIED ]
                    </span>
                </div>
            </div>

            {/* WORLD 5: THE HOLLOW (CLASSIFIED) */}
            <div className="world hollow absolute inset-0 opacity-0 flex items-center justify-center bg-black overflow-hidden">
                {/* Background Image (Subtle) */}
                <div className="absolute inset-0 opacity-10">
                    <img src="/factions/hollow.jpg" className="w-full h-full object-cover grayscale" />
                </div>

                {/* Character Image */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <img
                        src="/factions/the hollow.png"
                        alt="The Hollow"
                        className="character-img h-[80vh] w-auto object-contain brightness-50 mix-blend-overlay transition-transform duration-700 hover:scale-105"
                    />
                </div>

                <div className="world-content relative z-10 text-center px-6 max-w-4xl">
                    <div className="pulsing-symbol mb-16 inline-block">
                        <div className="w-32 h-32 border-[0.5px] border-white/20 relative animate-[spin_15s_linear_infinite]">
                            <div className="absolute inset-2 border-[0.5px] border-white/10 rotate-45" />
                        </div>
                    </div>
                    <h2 className="text-6xl md:text-[12rem] font-oswald tracking-[0.4em] uppercase text-white/10 leading-none">Hollow</h2>
                    <div className="mt-12 h-px w-24 bg-white/5 mx-auto" />
                    <p className="mt-12 text-white/10 font-light text-sm md:text-base tracking-[0.6em] uppercase max-w-2xl mx-auto leading-relaxed">
                        The final state of existence. Where form meets void. They represent the ultimate minimalism—absence as the highest form of presence.
                    </p>
                    <p className="mt-8 text-white/5 font-mono text-[10px] tracking-[0.8em] uppercase italic">Absence is the purest form of presence.</p>
                </div>
                <div className="absolute bottom-12 right-12 font-mono text-[8px] text-white/5 tracking-widest uppercase text-right leading-relaxed">
                    CLASSIFIED_ENTITY_FACTION_03 <br />
                    LEVEL_9_CLEARANCE_REQUIRED
                </div>
            </div>

            {/* Progress indicator */}
            <div className="absolute bottom-12 left-12 z-20 flex gap-4">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="w-8 h-[2px] bg-white/5 overflow-hidden">
                        <div className={`world-progress-${i} w-full h-full bg-accent origin-left scale-x-0`} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CultWorlds;
