import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const CallScene = () => {
    const sectionRef = useRef();
    const logoRef = useRef();

    useGSAP(() => {
        // Breathing logo effect
        gsap.to(logoRef.current, {
            scale: 1.05,
            opacity: 0.9,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        // Entrance animation
        gsap.fromTo(".call-text-fade",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1.5, delay: 0.5, stagger: 0.3 }
        );

    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="h-screen w-full relative bg-black flex flex-col items-center justify-center">
            {/* Minimal background atmosphere */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/3 rounded-full blur-[200px]" />
                <div className="absolute inset-0 bg-black/80" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
                {/* Breathing Logo */}
                <div ref={logoRef} className="mb-24 opacity-80">
                    <img src="/logo.png" alt="ENDURA" className="h-12 md:h-16 object-contain" />
                </div>

                <div className="space-y-12 mb-24">
                    <h2 className="call-text-fade text-5xl md:text-8xl font-oswald uppercase tracking-tighter leading-none">
                        The Order awaits.
                    </h2>
                    <p className="call-text-fade text-gray-500 font-mono text-sm tracking-[0.8em] uppercase">
                        Proceed when ready.
                    </p>
                </div>

                {/* Final CTA */}
                <div className="call-text-fade">
                    <Link
                        to="/auth"
                        className="group relative inline-flex flex-col items-center"
                    >
                        <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center group-hover:border-accent transition-all duration-700 bg-black/50 overflow-hidden">
                            <span className="text-xl text-white/50 group-hover:text-accent font-mono translate-x-1 group-hover:translate-x-2 transition-transform duration-500">→</span>
                            <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-colors" />
                        </div>
                        <span className="mt-8 cinematic-text text-sm tracking-[0.8em] group-hover:text-accent transition-colors duration-500">
                            Enter ENDURA
                        </span>
                    </Link>
                </div>
            </div>

            {/* Subtle footer credit */}
            <div className="absolute bottom-12 w-full px-12 flex justify-between items-center text-[8px] font-mono tracking-widest text-white/10 uppercase">
                <span>©2024_ENDURA_ORDER</span>
                <span>AUTHENTICATION_REQUIRED</span>
            </div>
        </section>
    );
};

export default CallScene;
