import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const VisionScene = () => {
    const sectionRef = useRef();
    const imageRef = useRef();
    const textGroupRef = useRef();
    const labelRef = useRef();
    const titleRef = useRef();
    const descRef = useRef();

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=2000", // Scroll length
                scrub: 1.5,     // Smooth scrubbing
                pin: true,      // Pin the scene
                anticipatePin: 1,
            }
        });


        // 1. Image Animation: Scale down from a "zoomed" state
        tl.fromTo(imageRef.current,
            { scale: 1.4, filter: 'brightness(0.3) blur(10px)' },
            { scale: 1, filter: 'brightness(1) blur(0px)', duration: 2, ease: "power2.out" },
            0
        );

        // 2. Text Animations: Slide in and stagger
        tl.fromTo(labelRef.current,
            { x: -50, opacity: 0 },
            { x: 0, opacity: 1, duration: 1 },
            0.5
        );

        tl.fromTo(titleRef.current,
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, duration: 1.5, ease: "power3.out" },
            0.8
        );

        tl.fromTo(descRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2 },
            1.2
        );

        // 3. Subtle background atmosphere pulse linked to scroll
        tl.to(sectionRef.current, {
            backgroundColor: "#050010",
            duration: 1
        }, 1);

    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="relative h-screen flex items-center overflow-hidden bg-black">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
            </div>

            <div className="container mx-auto px-12 grid grid-cols-1 md:grid-cols-2 gap-20 items-center relative z-10">
                {/* Left: Cinematic Image (The Body) */}
                <div className="order-2 md:order-1 relative group">
                    <div className="absolute -inset-8 border border-white/5 pointer-events-none" />
                    <div className="relative overflow-hidden aspect-square md:aspect-[4/5] bg-neutral-900 border border-white/10 shadow-2xl">
                        <img
                            ref={imageRef}
                            src="/vision.png"
                            alt="The Vision"
                            className="w-full h-full object-cover"
                        />
                        {/* Overlay scanlines */}
                        <div className="absolute inset-0 pointer-events-none opacity-20 scanlines" />
                    </div>
                    {/* Perspective lines */}
                    <div className="absolute -bottom-10 -left-10 w-20 h-px bg-accent/30" />
                    <div className="absolute -bottom-10 -left-10 h-20 w-px bg-accent/30" />
                </div>

                {/* Right: Narrative (The Soul) */}
                <div ref={textGroupRef} className="order-1 md:order-2 space-y-8">
                    <div ref={labelRef} className="flex items-center gap-4">
                        <span className="restricted-label text-primary-light tracking-[0.5em] uppercase">
                            // VISION_LOG_04
                        </span>
                        <div className="h-px flex-grow bg-white/5" />
                    </div>

                    <h2 ref={titleRef} className="text-6xl md:text-8xl font-oswald uppercase tracking-tighter leading-tight">
                        Physical <span className="text-white/20">Strength.</span> <br />
                        <span className="text-primary-light system-text-glow">Digital Soul.</span>
                    </h2>

                    <div ref={descRef} className="space-y-6">
                        <p className="text-gray-400 text-xl font-light italic leading-relaxed border-l-[1px] border-primary-light/40 pl-8">
                            "The thread is the portal. We use the highest-density physical textures to anchor your presence in the digital twin universe. You are the bridge."
                        </p>

                        <div className="flex items-center gap-6 pt-4">
                            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                                <div className="w-2 h-2 bg-primary-light rounded-full animate-pulse" />
                            </div>
                            <span className="text-[10px] text-gray-500 font-mono tracking-[0.4em] uppercase">
                                Syncing_Identity_Matrix
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cinematic Framing */}
            <div className="absolute inset-0 z-20 pointer-events-none film-grain opacity-5" />
        </section>
    );
};

export default VisionScene;
