import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const DivideScene = () => {
    const containerRef = useRef();
    const leftSideRef = useRef();
    const rightSideRef = useRef();
    const symbolRef = useRef();

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=2500",
                scrub: 1,
                pin: true,
                anticipatePin: 1
            }
        });

        // 1. Pull the split apart with scale effect
        tl.to(leftSideRef.current, {
            xPercent: -60,
            scale: 1.1,
            rotateY: 10,
            duration: 2,
            ease: "power2.inOut"
        }, 0)
            .to(rightSideRef.current, {
                xPercent: 60,
                scale: 1.1,
                rotateY: -10,
                duration: 2,
                ease: "power2.inOut"
            }, 0);

        // 2. Reveal Content in the center gap
        tl.fromTo(".divide-text",
            { opacity: 0, scale: 0.9, filter: 'blur(15px)' },
            { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.2, stagger: 0.5 },
            0.5
        );

        // SYNC BUTTON with split
        tl.fromTo(".divide-button",
            { opacity: 0, scale: 0.5, filter: 'blur(20px)' },
            { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.5 },
            0
        );

        // 3. Dissolve to symbol (includes button)
        tl.to([".divide-text", ".divide-button"], { opacity: 0, scale: 1.1, filter: 'blur(10px)', duration: 0.8 }, 2);

        tl.to(leftSideRef.current, { xPercent: 0, opacity: 0, scale: 0.5, duration: 1.5 }, 2.5)
            .to(rightSideRef.current, { xPercent: 0, opacity: 0, scale: 0.5, duration: 1.5 }, 2.5)
            .fromTo(symbolRef.current,
                { scale: 0.1, opacity: 0, filter: 'brightness(10) blur(20px)' },
                { scale: 1, opacity: 1, filter: 'brightness(1.5) blur(0px)', duration: 1.5, ease: "expo.out" },
                2.5
            );

        // Final zoom
        tl.to(symbolRef.current, { scale: 1.5, opacity: 0, filter: 'blur(30px)', duration: 1 }, 4);

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="min-h-screen w-full relative bg-black overflow-hidden flex items-center justify-center" style={{ perspective: '1500px' }}>
            {/* LEFT SIDE: REALITY */}
            <div
                ref={leftSideRef}
                className="absolute inset-y-0 left-0 w-1/2 overflow-hidden border-r border-white/10 z-10 origin-right transition-transform duration-500"
            >
                <div
                    className="w-[200%] h-full bg-cover bg-center grayscale brightness-50 contrast-150"
                    style={{ backgroundImage: 'url(/factions/forged.jpg)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black" />
                <div className="absolute top-12 left-12">
                    <span className="text-[9px] text-gray-500 font-mono tracking-[0.5em] uppercase">// PHYSICAL_FABRIC</span>
                </div>
            </div>

            {/* RIGHT SIDE: DIGITAL */}
            <div
                ref={rightSideRef}
                className="absolute inset-y-0 right-0 w-1/2 overflow-hidden border-l border-white/10 z-10 origin-left transition-transform duration-500"
            >
                <div
                    className="w-[200%] h-full translate-x-[-50%] bg-cover bg-center"
                    style={{ backgroundImage: 'url(/vision.png)' }}
                />
                <div className="absolute inset-0 bg-primary/30 backdrop-blur-[4px]" />
                <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-transparent to-black" />
                <div className="absolute top-12 right-12 text-right">
                    <span className="text-[9px] text-accent font-mono tracking-[0.5em] uppercase">// ENERGY_PULSE_99</span>
                </div>
            </div>

            {/* CENTER: THE VOID */}
            <div className="relative z-20 text-center space-y-12 px-6">
                <div className="divide-text">
                    <h2 className="text-4xl md:text-7xl font-oswald uppercase leading-none tracking-tighter">
                        THE BODY WEARS <br />
                        <span className="text-white/10">MATTER.</span>
                    </h2>
                </div>

                <div className="divide-button">
                    <Link
                        to="/collections"
                        className="group relative inline-flex items-center gap-3 sm:gap-6 px-6 py-2.5 sm:px-12 sm:py-5 bg-white/5 backdrop-blur-md border border-white/10 hover:border-primary/50 transition-all duration-700 overflow-hidden"
                    >
                        {/* Interactive Background */}
                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-700" />
                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-primary/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

                        {/* Button Content */}
                        <div className="relative z-10 flex items-center gap-2 sm:gap-4">
                            <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-[0.3em] sm:tracking-[0.6em] text-white/80 group-hover:text-white transition-colors duration-500">
                                EXPLORE_COLLECTIONS
                            </span>
                            <div className="relative w-1.5 h-1.5 sm:w-2 sm:h-2 border border-primary/50 rotate-45 group-hover:bg-primary group-hover:shadow-[0_0_10px_#A855F7] transition-all duration-500" />
                        </div>

                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-1.5 h-1.5 sm:w-2 sm:h-2 border-l border-t border-white/20 group-hover:border-primary transition-colors" />
                        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 sm:w-2 sm:h-2 border-r border-b border-white/20 group-hover:border-primary transition-colors" />
                    </Link>
                </div>

                <div className="divide-text">
                    <h2 className="text-4xl md:text-7xl font-oswald uppercase leading-none tracking-tighter">
                        THE SOUL WEARS <br />
                        <span className="text-primary system-text-glow">DATA.</span>
                    </h2>
                </div>

            </div>

            {/* FINAL SYMBOL */}
            <div ref={symbolRef} className="absolute inset-0 flex items-center justify-center z-50 opacity-0 pointer-events-none">
                <img src="/logo.png" alt="ENDURA" className="h-16 md:h-24 object-contain brightness-200" />
                <div className="absolute inset-0 bg-radial-gradient from-accent/30 via-transparent to-transparent animate-pulse" />
            </div>

            {/* Cinematic Noise */}
            <div className="absolute inset-0 z-40 pointer-events-none film-grain opacity-10" />

        </section>
    );
};

export default DivideScene;
