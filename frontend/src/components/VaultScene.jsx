import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '../context/StoreContext';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const VaultScene = () => {
    const sectionRef = useRef();
    const bgRef = useRef();
    const doorLeftRef = useRef();
    const doorRightRef = useRef();
    const contentRef = useRef();
    const overlayRef = useRef();

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=3000", // Long descent
                scrub: 1,
                pin: true,
                anticipatePin: 1,
            }
        });

        // 1. Initial State: Doors closed, dark overlay
        // 2. Scroll Beat 1: Doors start to slide open / Frame illusion
        tl.to(doorLeftRef.current, { xPercent: -100, duration: 2 }, 0)
            .to(doorRightRef.current, { xPercent: 100, duration: 2 }, 0)

        // 3. Scroll Beat 2: Background "descends" (slight zoom and Y move)
        tl.to(bgRef.current, {
            scale: 1.1,
            y: -50,
            filter: 'brightness(0.4)',
            duration: 3
        }, 0.5)

        // 4. Scroll Beat 3: Darken local overlay for authority
        tl.to(overlayRef.current, {
            opacity: 0.8,
            backgroundColor: '#000',
            duration: 2
        }, 1)

        // 5. Scroll Beat 4: Reveal Gold Lines & Text
        tl.fromTo(".vault-line",
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 1.5, stagger: 0.5 },
            1.5
        )

        // 6. Final Beat: CTA appears LAST
        tl.fromTo(".vault-cta",
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.5, ease: "power4.out" },
            2.5
        )

    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
            {/* The Vault Interior (using filtered hero image) */}
            <div ref={bgRef} className="absolute inset-0 z-0">
                <div
                    className="w-full h-full bg-cover bg-center grayscale brightness-[0.2]"
                    style={{ backgroundImage: 'url(/hero.png)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
            </div>

            {/* Atmosphere Overlays */}
            <div ref={overlayRef} className="absolute inset-0 z-10 opacity-40 pointer-events-none bg-black" />
            <div className="absolute inset-0 z-20 pointer-events-none film-grain opacity-10" />

            {/* The "Vault Door" Illusion Panels */}
            <div ref={doorLeftRef} className="absolute inset-y-0 left-0 w-1/2 z-30 bg-[#050505] border-r border-white/5 flex items-center justify-end">
                <div className="h-full w-24 bg-gradient-to-l from-black/50 to-transparent" />
            </div>
            <div ref={doorRightRef} className="absolute inset-y-0 right-0 w-1/2 z-30 bg-[#050505] border-l border-white/5 flex items-center justify-start">
                <div className="h-full w-24 bg-gradient-to-r from-black/50 to-transparent" />
            </div>

            {/* Central Narrative & CTA */}
            <div ref={contentRef} className="relative z-40 text-center max-w-4xl px-6">
                <span className="restricted-label block mb-8 tracking-[0.8em] opacity-40 uppercase font-mono">
                    // SECURITY_LAYER_OMEGA_CLEARED
                </span>

                <h2 className="text-7xl md:text-[9rem] font-oswald font-bold uppercase tracking-tighter leading-none mb-12">
                    Enter <br />
                    <span className="text-accent system-text-glow">The Vault</span>
                </h2>

                {/* Gold Reveal Lines */}
                <div className="flex flex-col items-center space-y-4 mb-20">
                    <div className="vault-line h-px w-64 bg-gradient-to-r from-transparent via-accent to-transparent" />
                    <p className="vault-line text-gray-500 font-mono text-[10px] tracking-[0.5em] uppercase">
                        Access granted to authorized seekers only
                    </p>
                    <div className="vault-line h-px w-64 bg-gradient-to-r from-transparent via-accent to-transparent" />
                </div>

                {/* Earned CTA */}
                <div className="vault-cta">
                    <Link
                        to="/auth"
                        className="inline-block px-14 py-5 border border-accent/30 text-accent font-mono uppercase tracking-[0.6em] text-[10px] hover:bg-accent hover:text-black transition-all duration-1000 group relative"
                    >
                        <span className="relative z-10">Initiate_Vault_Core</span>
                        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-accent/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />

                        {/* Subtle glow on hover */}
                        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                </div>
            </div>

            {/* Peripheral Light Streaks */}
            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-accent/10 to-transparent z-10" />
            <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-accent/10 to-transparent z-10" />
        </section>
    );
};

export default VaultScene;
