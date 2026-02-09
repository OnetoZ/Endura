import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const DoppelPieceScene = () => {
    const sectionRef = useRef();
    const solidPieceRef = useRef();
    const digitalPieceRef = useRef();

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=3000",
                scrub: 1,
                pin: true,
                anticipatePin: 1
            }
        });

        // First scroll -> IRL piece forms/fades in
        tl.fromTo(solidPieceRef.current,
            { opacity: 0, scale: 0.8, y: 50 },
            { opacity: 1, scale: 1, y: 0, duration: 2 }
        );

        // Text reveal 1
        tl.fromTo(".doppel-text-1", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, "-=1");

        // Second scroll -> Digital Twin emerges (slides to the right-ish)
        tl.to(solidPieceRef.current, { x: -100, duration: 2 });
        tl.fromTo(digitalPieceRef.current,
            { opacity: 0, scale: 0.8, x: -100, filter: 'hue-rotate(90deg) brightness(2)' },
            { opacity: 0.6, scale: 1, x: 100, duration: 2 },
            "-=2"
        );

        // Text reveal 2 & 3
        tl.fromTo(".doppel-text-2", { opacity: 0 }, { opacity: 1, duration: 1 });
        tl.fromTo(".doppel-text-3", { opacity: 0 }, { opacity: 1, duration: 1 });

        // Third scroll -> Both align (merge back)
        tl.to(solidPieceRef.current, { x: 0, duration: 2 });
        tl.to(digitalPieceRef.current, { x: 0, opacity: 0.4, scale: 1.05, filter: 'hue-rotate(0deg) brightness(1.5)', duration: 2 }, "-=2");

        // Final collapse into light
        tl.to([solidPieceRef.current, digitalPieceRef.current, ".doppel-text"], {
            opacity: 0,
            scale: 1.2,
            filter: 'brightness(5) blur(20px)',
            duration: 1.5
        }, "+=0.5");

    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="h-screen w-full relative bg-black overflow-hidden flex flex-col items-center justify-center">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
            </div>

            <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
                <div className="relative w-64 h-96 mb-24 flex items-center justify-center">
                    {/* IRL Piece */}
                    <img
                        ref={solidPieceRef}
                        src="/factions/veil.jpg" // Using veil as a representative piece
                        alt="IRL Piece"
                        className="absolute w-full h-full object-cover border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] grayscale"
                    />

                    {/* Digital Piece Layer */}
                    <img
                        ref={digitalPieceRef}
                        src="/factions/veil.jpg"
                        alt="Digital Twin"
                        className="absolute w-full h-full object-cover mix-blend-screen opacity-0"
                        style={{ filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.4))' }}
                    />

                    {/* Ambient light pulse */}
                    <div className="absolute inset-[-50%] bg-radial-gradient from-primary/10 via-transparent to-transparent animate-pulse pointer-events-none" />
                </div>

                <div className="text-center space-y-6">
                    <p className="doppel-text doppel-text-1 text-gray-500 font-mono text-[10px] tracking-[0.5em] uppercase">
                        Every piece is crafted twice.
                    </p>
                    <h2 className="doppel-text doppel-text-2 text-4xl md:text-6xl font-oswald uppercase tracking-tighter">
                        One for the <span className="text-white/40">flesh.</span>
                    </h2>
                    <h2 className="doppel-text doppel-text-3 text-4xl md:text-6xl font-oswald uppercase tracking-tighter text-primary system-text-glow">
                        One for the digital twin.
                    </h2>
                </div>
            </div>

            <div className="absolute inset-0 pointer-events-none film-grain opacity-10" />
        </section>
    );
};

export default DoppelPieceScene;
