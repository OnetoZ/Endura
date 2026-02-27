import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ImpactStatement = () => {
    const sectionRef = useRef();
    const textRef = useRef();

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play reverse play reverse"
            }
        });

        tl.fromTo(".impact-text",
            { opacity: 0, y: 50, filter: 'blur(10px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: "power3.out" }
        );

        tl.fromTo(".impact-cta",
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.8 },
            "-=0.6"
        );

        // Particle motion
        gsap.to(".impact-particle", {
            y: "-=30",
            opacity: "random(0.1, 0.5)",
            duration: "random(2, 4)",
            repeat: -1,
            yoyo: true,
            stagger: {
                amount: 2,
                from: "random"
            }
        });
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="min-h-[60vh] md:min-h-screen w-full relative bg-black flex flex-col items-center justify-center overflow-hidden px-6 py-20">
            {/* Subtle Particle Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="impact-particle absolute w-1 h-1 bg-primary/30 rounded-full"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
                <div className="absolute inset-0 bg-radial-gradient from-primary/5 via-transparent to-transparent" />
            </div>

            <div className="relative z-10 text-center max-w-5xl">
                <h2 className="impact-text text-5xl md:text-8xl lg:text-9xl font-heading tracking-tighter uppercase text-white mb-12 leading-none">
                    JOIN THE <span className="text-primary system-text-glow">ELITE</span>. <br />
                    OWN THE <span className="text-accent">FUTURE</span>.
                </h2>

                <p className="impact-text text-gray-400 font-mono text-sm md:text-xl tracking-[0.3em] uppercase mb-16 max-w-2xl mx-auto">
                    You don't just wear Endura. You belong to it.
                </p>

                <div className="impact-cta">
                    <button className="group relative px-12 py-5 bg-white text-black font-black uppercase tracking-[0.4em] text-xs hover:bg-primary hover:text-white transition-all duration-500 overflow-hidden">
                        <span className="relative z-10">Secure Access</span>
                        <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 bg-primary transition-transform duration-500" />
                    </button>

                    <div className="mt-8">
                        <span className="text-[10px] text-gray-600 font-mono tracking-widest uppercase animate-pulse">
                            Limited Slots Available // 2026 Batch
                        </span>
                    </div>
                </div>
            </div>

            {/* Cinematic Noise Overlay */}
            <div className="absolute inset-0 pointer-events-none film-grain opacity-10" />
        </section>
    );
};

export default ImpactStatement;
