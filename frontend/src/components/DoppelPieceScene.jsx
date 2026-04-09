import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const DoppelPieceScene = () => {
    const sectionRef = useRef();
    const solidPieceRef = useRef();
    const digitalPieceRef = useRef();
    const glowRef = useRef();

    useGSAP(() => {
        // Dynamic offsets based on screen width
        const isMobile = window.innerWidth < 768;
        const xOffset = isMobile ? 40 : 80;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=2000",
                scrub: 1,
                pin: true,
                anticipatePin: 1
            }
        });

        // 1. IRL piece forms
        tl.fromTo(solidPieceRef.current,
            { opacity: 0, scale: 0.9, y: 30 },
            { opacity: 1, scale: 1, y: 0, duration: 1.5, ease: "power2.out" }
        );

        tl.fromTo(".doppel-text-1", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.8");

        // 2. Digital Twin emerges
        tl.to(solidPieceRef.current, { x: -xOffset, filter: 'contrast(1.1)', duration: 1.5 });
        tl.fromTo(digitalPieceRef.current,
            { opacity: 0, scale: 0.9, x: -xOffset, filter: 'brightness(1.5)' },
            { opacity: 1, scale: 1, x: xOffset, duration: 1.5 },
            "-=1.5"
        );

        // Glow intensity pulse
        tl.to(glowRef.current, { opacity: 0.8, scale: 1.5, duration: 0.5 }, "-=0.5")
            .to(glowRef.current, { opacity: 0.2, scale: 1, duration: 0.5 });

        tl.fromTo(".doppel-text-2", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 });
        tl.fromTo(".doppel-text-3", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, "-=0.6");
        tl.fromTo(".doppel-text-4", { opacity: 0 }, { opacity: 1, duration: 0.8 }, "-=0.4");
        tl.fromTo(".divider-reveal", { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 1 }, "-=0.5");

        // 3. Both align and merge
        tl.to(solidPieceRef.current, { x: 0, duration: 1.5 });
        tl.to(digitalPieceRef.current, { x: 0, opacity: 0.9, scale: 1.05, filter: 'brightness(1.2)', duration: 1.5 }, "-=1.5");

        // Final collapse
        tl.to([solidPieceRef.current, digitalPieceRef.current, ".doppel-text"], {
            opacity: 0,
            scale: 1.1,
            filter: 'brightness(4) blur(15px)',
            duration: 1
        }, "+=0.3");

    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="min-h-screen w-full relative bg-black overflow-hidden flex flex-col items-center pt-24 md:justify-center">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
            </div>

            <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
                <div className="relative w-40 h-56 md:w-56 md:h-80 mb-6 md:mb-8 flex items-center justify-center">
                    {/* Glow Pulse */}
                    <div ref={glowRef} className="absolute inset-[-40%] bg-radial-gradient from-primary/30 via-transparent to-transparent opacity-0 pointer-events-none" />

                    {/* IRL Piece */}
                    <img
                        ref={solidPieceRef}
                        src="/pic .jpeg"
                        alt="IRL Piece"
                        className="absolute w-full h-full object-contain border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.9)] rounded-md"
                    />

                    {/* Digital Piece Layer (Wrapper for image + logo) */}
                    <div
                        ref={digitalPieceRef}
                        className="absolute w-full h-full opacity-0 rounded-md overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.4)]"
                    >
                        <img
                            src="/pic 1.jpeg"
                            alt="Digital Twin"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                <div className="text-center space-y-6 md:space-y-10 max-w-5xl px-6">
                    <div className="space-y-3 md:space-y-4">
                        <span className="doppel-text doppel-text-1 text-[#d4af37] font-mono text-[9px] md:text-[11px] tracking-[0.6em] uppercase block">
                            THE ORDER
                        </span>

                        <div className="space-y-2 md:space-y-4 px-2">
                            <h2 className="doppel-text doppel-text-2 text-2xl md:text-6xl font-light text-white tracking-tight leading-tight">
                                Every piece carries two forms.
                            </h2>
                            <h2 className="doppel-text doppel-text-3 text-xl md:text-5xl font-light text-white/40 tracking-tight leading-tight">
                                One worn. One eternal.
                            </h2>
                        </div>
                    </div>

                    <div className="space-y-6 md:space-y-10">
                        <p className="doppel-text doppel-text-4 text-white/60 font-light tracking-wide text-xs md:text-base leading-relaxed max-w-2xl mx-auto px-4">
                            ENDURA is not a brand — it is an Order. Each physical garment is bound to a Digital Twin. Your identity exists in both realms.
                        </p>

                        {/* Diamond Divider */}
                        <div className="flex items-center justify-center gap-4 divider-reveal">
                            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-white/10" />
                            <div className="w-2 h-2 border border-[#d4af37] rotate-45" />
                            <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-white/10" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute inset-0 pointer-events-none film-grain opacity-10" />
        </section>
    );
};

export default DoppelPieceScene;
