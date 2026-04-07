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

        // 1. IRL piece forms - FASTER
        tl.fromTo(solidPieceRef.current,
            { opacity: 0, scale: 0.9, y: 30 },
            { opacity: 1, scale: 1, y: 0, duration: 1.5, ease: "power2.out" }
        );

        tl.fromTo(".doppel-text-1", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.8");

        // 2. Digital Twin emerges - SHARPER
        tl.to(solidPieceRef.current, { x: -80, filter: 'contrast(1.1)', duration: 1.5 });
        tl.fromTo(digitalPieceRef.current,
            { opacity: 0, scale: 0.9, x: -80, filter: 'brightness(1.5)' },
            { opacity: 1, scale: 1, x: 80, duration: 1.5 },
            "-=1.5"
        );

        // Glow intensity pulse at midpoint
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
        <section ref={sectionRef} className="min-h-screen w-full relative bg-black overflow-hidden flex flex-col items-center justify-center">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
            </div>

            <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
                <div className="relative w-48 h-72 mb-12 flex items-center justify-center">
                    {/* Glow Pulse */}
                    <div ref={glowRef} className="absolute inset-[-40%] bg-radial-gradient from-primary/30 via-transparent to-transparent opacity-0 pointer-events-none" />

                    {/* IRL Piece */}
                    <img
                        ref={solidPieceRef}
                        src="/plain_shirt_model.png"
                        alt="IRL Piece"
                        className="absolute w-full h-full object-cover border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.9)] rounded-md"
                    />

                    {/* Digital Piece Layer (Wrapper for image + logo) */}
                    <div
                        ref={digitalPieceRef}
                        className="absolute w-full h-full opacity-0 rounded-md overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.4)]"
                    >
                        <img
                            src="/plain_shirt_model.png"
                            alt="Digital Twin"
                            className="w-full h-full object-cover"
                        />
                        {/* The Overlay ENDURA Logo */}
                        <div className="absolute top-[38%] left-[50%] -translate-x-[50%] flex items-center justify-center pointer-events-none mix-blend-multiply opacity-95">
                            <span 
                                className="font-oswald text-3xl md:text-4xl font-black tracking-widest text-[#a81cff] drop-shadow-[0_0_15px_rgba(168,28,255,0.7)]"
                                style={{
                                    background: "linear-gradient(to right, #e21ced, #6e02d6)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent"
                                }}
                            >
                                EN
                            </span>
                            <span 
                                className="font-oswald text-3xl md:text-4xl font-black tracking-widest text-[#a81cff] drop-shadow-[0_0_15px_rgba(168,28,255,0.7)] relative flex items-center justify-center"
                                style={{
                                    background: "linear-gradient(to right, #cf16db, #7500d1)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    marginLeft: '-2px',
                                    marginRight: '-5px'
                                }}
                            >
                                D
                                <div className="absolute h-[140%] w-[2px] bg-gradient-to-b from-[#e21ced] to-[#6e02d6] drop-shadow-md z-10" />
                            </span>
                            <span 
                                className="font-oswald text-3xl md:text-4xl font-black tracking-widest text-[#a81cff] drop-shadow-[0_0_15px_rgba(168,28,255,0.7)]"
                                style={{
                                    background: "linear-gradient(to right, #7500d1, #a81cff)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent"
                                }}
                            >
                                URA
                            </span>
                        </div>
                    </div>
                </div>

                <div className="text-center space-y-8 max-w-3xl px-6">
                    <div className="space-y-4">
                        <span className="doppel-text doppel-text-1 text-[#d4af37] font-mono text-[10px] tracking-[0.4em] uppercase block">
                            THE ORDER
                        </span>
                        
                        <div className="space-y-2">
                            <h2 className="doppel-text doppel-text-2 text-3xl md:text-5xl font-light text-white tracking-tight leading-tight">
                                Every piece carries two forms.
                            </h2>
                            <h2 className="doppel-text doppel-text-3 text-2xl md:text-4xl font-light text-white/40 tracking-tight leading-tight">
                                One worn. One eternal.
                            </h2>
                        </div>
                    </div>

                    <div className="space-y-10">
                        <p className="doppel-text doppel-text-4 text-white/60 font-light tracking-wide text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                            ENDURA is not a brand — it is an Order. Each physical garment is bound to a Digital Twin: a unique collectible that lives beyond fabric. Your identity exists in both realms.
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
