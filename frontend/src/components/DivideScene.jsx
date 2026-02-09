import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const DivideScene = () => {
    const containerRef = useRef();
    const leftSideRef = useRef();
    const rightSideRef = useRef();
    const centerTextRef = useRef();
    const symbolRef = useRef();

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=3500",
                scrub: 1,
                pin: true,
                anticipatePin: 1
            }
        });

        // 1. Pull the split apart
        tl.to(leftSideRef.current, { xPercent: -50, duration: 2 }, 0)
            .to(rightSideRef.current, { xPercent: 50, duration: 2 }, 0);

        // 2. Reveal Text in the center gap
        tl.fromTo(".divide-text",
            { opacity: 0, scale: 0.8, filter: 'blur(10px)' },
            { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.5, stagger: 0.8 },
            0.5
        );

        // 3. Keep the text visible then fade out to make room for symbol
        tl.to(".divide-text", { opacity: 0, filter: 'blur(15px)', duration: 1 }, 2.5);

        // 4. Collapse split into symbol
        tl.to(leftSideRef.current, { xPercent: 0, opacity: 0, duration: 1.5 }, 3)
            .to(rightSideRef.current, { xPercent: 0, opacity: 0, duration: 1.5 }, 3)
            .fromTo(symbolRef.current,
                { scale: 0.2, opacity: 0, filter: 'brightness(5) blur(10px)' },
                { scale: 1, opacity: 1, filter: 'brightness(1.5) blur(0px)', duration: 1.5, ease: "expo.out" },
                3
            );

        // 5. Final dissolve
        tl.to(symbolRef.current, { opacity: 0, scale: 1.5, filter: 'blur(20px)', duration: 1 }, 4.5);

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="h-screen w-full relative bg-black overflow-hidden flex items-center justify-center">
            {/* LEFT SIDE: REALITY (IRL Fabric / Texture) */}
            <div
                ref={leftSideRef}
                className="absolute inset-y-0 left-0 w-1/2 overflow-hidden border-r border-white/5 z-10"
            >
                <div
                    className="w-[200%] h-full bg-cover bg-center grayscale brightness-75 contrast-125"
                    style={{ backgroundImage: 'url(/factions/forged.jpg)' }}
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 film-grain opacity-20" />
                <div className="absolute top-12 left-12">
                    <span className="text-[10px] text-gray-500 font-mono tracking-[0.4em] uppercase">// REALITY_STITCH</span>
                </div>
            </div>

            {/* RIGHT SIDE: DIGITAL (Glow / Energy) */}
            <div
                ref={rightSideRef}
                className="absolute inset-y-0 right-0 w-1/2 overflow-hidden border-l border-white/5 z-10"
            >
                <div
                    className="w-[200%] h-full translate-x-[-50%] bg-cover bg-center"
                    style={{ backgroundImage: 'url(/vision.png)' }}
                />
                <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]" />
                <div className="absolute inset-0 scanlines opacity-10" />
                <div className="absolute top-12 right-12 text-right">
                    <span className="text-[10px] text-accent font-mono tracking-[0.4em] uppercase">// DIGITAL_PULSE_01</span>
                </div>

                {/* Purple Energy Overlay */}
                <div className="absolute inset-0 bg-gradient-to-l from-primary/30 to-transparent" />
            </div>

            {/* CENTER: THE VOID / NARRATIVE */}
            <div className="relative z-20 text-center space-y-12">
                <div className="divide-text space-y-4">
                    <h3 className="text-accent font-mono text-xs tracking-[1em] uppercase">Identity is dual.</h3>
                    <h2 className="text-5xl md:text-8xl font-oswald uppercase leading-none tracking-tighter">
                        The body wears <br />
                        <span className="text-white/20">Fabric.</span>
                    </h2>
                </div>

                <div className="divide-text mt-24">
                    <h2 className="text-5xl md:text-8xl font-oswald uppercase leading-none tracking-tighter">
                        The avatar wears <br />
                        <span className="text-primary system-text-glow">Energy.</span>
                    </h2>
                </div>
            </div>

            {/* FINAL SYMBOL: THE ENDURA EMBLEM */}
            <div ref={symbolRef} className="absolute inset-0 flex items-center justify-center z-50 opacity-0 pointer-events-none">
                <img src="/logo.png" alt="ENDURA" className="h-24 md:h-40 object-contain brightness-200" />
                <div className="absolute inset-0 bg-radial-gradient from-accent/20 via-transparent to-transparent animate-pulse" />
            </div>

            {/* Cinematic Noise */}
            <div className="absolute inset-0 z-40 pointer-events-none bg-gradient-to-b from-black via-transparent to-black opacity-60" />
        </section>
    );
};

export default DivideScene;
