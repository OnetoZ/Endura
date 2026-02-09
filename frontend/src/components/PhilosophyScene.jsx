import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const PhilosophyScene = () => {
    const containerRef = useRef();
    const text1Ref = useRef();
    const text2Ref = useRef();
    const text3Ref = useRef();

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=3000", // Length of the scroll timeline
                scrub: 1,      // Smooth scrubbing
                pin: true,     // Pin the scene
                anticipatePin: 1,
            }
        });

        // Scene Logic: Slowly uncovered truth
        // 1. First scroll -> subtitle fades in (The Anomaly)
        tl.to(text1Ref.current, { opacity: 1, y: 0, duration: 1 })
            .to(text1Ref.current, { opacity: 0.1, duration: 0.5 }); // Cinematic fade-out partial

        // 2. Second scroll -> main line slides upward slightly (Something here is different)
        tl.to(text2Ref.current, { opacity: 1, y: 0, duration: 1 })
            .to(text2Ref.current, { opacity: 0.1, duration: 0.5 }); // Cinematic fade-out partial

        // 3. Third scroll -> description types / fades in (The Philosophy)
        tl.to(text3Ref.current, { opacity: 1, y: 0, duration: 1.5 });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="h-screen w-full relative bg-black overflow-hidden flex items-center justify-center">
            {/* Dark Void Background with subtle atmospheric depth */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-50" />
                <div className="absolute inset-0 film-grain opacity-10" />
            </div>

            <div className="max-w-5xl px-12 text-center relative z-10">
                {/* Scene 1: The Intro */}
                <div ref={text1Ref} className="opacity-0 translate-y-4 mb-2">
                    <span className="restricted-label text-accent tracking-[0.5em]">
                        // ARCHIVE_FILE_01
                    </span>
                    <h3 className="text-xl font-mono text-gray-500 uppercase tracking-widest mt-2">
                        The Anomaly
                    </h3>
                </div>

                {/* Scene 2: The Hook */}
                <h2 ref={text2Ref} className="text-5xl md:text-8xl font-oswald uppercase tracking-tighter text-white opacity-0 translate-y-8 leading-none mt-12 mb-12">
                    Something here is <br />
                    <span className="text-accent underline decoration-[2px] underline-offset-[16px]">different.</span>
                </h2>

                {/* Scene 3: The Revelation */}
                <div ref={text3Ref} className="opacity-0 translate-y-4 max-w-2xl mx-auto border-t border-white/5 pt-12">
                    <p className="text-gray-400 text-lg md:text-2xl font-light italic leading-relaxed">
                        "We don’t just make clothes; we design digital identities. In a world of fleeting physical trends, Endura provides timeless digital assets tied to every thread."
                    </p>
                    <div className="mt-8 flex justify-center items-center gap-4">
                        <div className="h-px w-12 bg-primary-light/30" />
                        <span className="text-[10px] text-gray-600 font-mono tracking-[0.4em]">INITIATING_SEQUENCE</span>
                        <div className="h-px w-12 bg-primary-light/30" />
                    </div>
                </div>
            </div>

            {/* Cinematic Noise/Scanlines */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent z-20" />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black to-transparent z-20" />
        </section>
    );
};

export default PhilosophyScene;
