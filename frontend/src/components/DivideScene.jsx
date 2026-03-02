import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

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

        // 2. Reveal Text in the center gap
        tl.fromTo(".divide-text",
            { opacity: 0, scale: 0.9, filter: 'blur(15px)' },
            { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.2, stagger: 0.5 },
            0.5
        );

        // 3. Dissolve to symbol
        tl.to(".divide-text", { opacity: 0, scale: 1.1, filter: 'blur(10px)', duration: 0.8 }, 2);

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
            <div className="relative z-20 text-center space-y-24 px-6">
                <div className="divide-text">
                    <h3 className="text-accent font-mono text-[10px] tracking-[1.5em] uppercase mb-8">Dual Existence</h3>
                    <h2 className="text-6xl md:text-9xl font-oswald uppercase leading-none tracking-tighter">
                        THE BODY WEARS <br />
                        <span className="text-white/10">MATTER.</span>
                    </h2>
                </div>

                <div className="divide-text">
                    <h2 className="text-6xl md:text-9xl font-oswald uppercase leading-none tracking-tighter">
                        THE SOUL WEARS <br />
                        <span className="text-primary system-text-glow">DATA.</span>
                    </h2>
                </div>
            </div>

            {/* FINAL SYMBOL */}
            <div ref={symbolRef} className="absolute inset-0 flex items-center justify-center z-50 opacity-0 pointer-events-none">
                <img src="/logo.png" alt="ENDURA" className="h-32 md:h-52 object-contain brightness-200" />
                <div className="absolute inset-0 bg-radial-gradient from-accent/30 via-transparent to-transparent animate-pulse" />
            </div>

            {/* Cinematic Noise */}
            <div className="absolute inset-0 z-40 pointer-events-none film-grain opacity-10" />

        </section>
    );
};

export default DivideScene;
