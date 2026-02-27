import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

/**
 * SystemBootHero Component
 * 
 * Ultra-cinematic restricted archive entrance for ENDURA.
 */
const SystemBootHero = () => {
    const [bootStage, setBootStage] = useState(0);
    const [glitchActive, setGlitchActive] = useState(false);
    const { currentUser } = useStore();
    const containerRef = useRef();
    const bgRef = useRef();
    const contentRef = useRef();

    useEffect(() => {
        const stages = [
            { delay: 0, stage: 0 },
            { delay: 400, stage: 1 },   // Ambience - FASTER
            { delay: 800, stage: 2 },   // System Status
            { delay: 1200, stage: 3 },  // Restricted Warning
            { delay: 1600, stage: 4 },  // Logo / Identity
            { delay: 2000, stage: 5 },  // Subtitle
            { delay: 2400, stage: 6 },  // Secondary Status
        ];

        stages.forEach(({ delay, stage }) => {
            setTimeout(() => setBootStage(stage), delay);
        });

        const glitchInterval = setInterval(() => {
            if (Math.random() > 0.7) {
                setGlitchActive(true);
                setTimeout(() => setGlitchActive(false), 150);
            }
        }, 3000);

        return () => clearInterval(glitchInterval);
    }, []);

    useGSAP(() => {
        // Parallax and Fade on Scroll
        gsap.to(bgRef.current, {
            y: 100,
            scale: 1.1,
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });

        gsap.to(contentRef.current, {
            opacity: 0,
            y: -50,
            filter: "blur(10px)",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "20% top",
                end: "80% top",
                scrub: true
            }
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} id="hero" className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
            {/* Master Cinematic Hero Image with Parallax */}
            <div className="absolute inset-0 z-0">
                <div
                    ref={bgRef}
                    className="w-full h-full bg-cover bg-center transition-all duration-[8000ms] ease-out"
                    style={{
                        backgroundImage: 'url(/hero.png)',
                        transform: bootStage >= 1 ? 'scale(1.02)' : 'scale(1.1)',
                        opacity: bootStage >= 1 ? 0.7 : 0
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-70" />
                <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Animated Particle Grid */}
            <div className="absolute inset-0 z-5 pointer-events-none opacity-20">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle, rgba(147,112,219,0.3) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px',
                    animation: 'particleFloat 20s linear infinite'
                }} />
            </div>

            {/* Holographic Scanner Wipe */}
            <div className={`absolute inset-0 z-15 pointer-events-none transition-opacity duration-1000 ${bootStage > 0 && bootStage < 5 ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/40 shadow-[0_0_20px_rgba(147,112,219,0.8)] animate-scanner-wipe" />
                <div className="absolute inset-0 bg-primary/5 animate-scanner-flicker" />
            </div>

            {/* Visual Overlays */}
            <div className="absolute inset-0 z-10 pointer-events-none film-grain opacity-20" />
            <div className="absolute inset-0 z-10 pointer-events-none scanlines opacity-5" />

            {/* Holographic Corner Frames */}
            <div className="absolute top-0 left-0 w-32 h-32 md:w-64 md:h-64 border-l-2 border-t-2 border-primary/30 z-15 pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 border-r-2 border-t-2 border-primary/30 z-15 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 md:w-64 md:h-64 border-l-2 border-b-2 border-accent/30 z-15 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-32 h-32 md:w-64 md:h-64 border-r-2 border-b-2 border-accent/30 z-15 pointer-events-none" />

            {/* Status indicators */}
            <div className={`absolute top-12 left-12 space-y-3 transition-all duration-1000 z-20 ${bootStage >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                <div className="flex items-center gap-3 bg-black/40 px-3 py-1.5 border border-accent/20 backdrop-blur-sm">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                    <span className="text-[9px] font-mono tracking-widest text-accent uppercase">ARCHIVE_00.LOCKED</span>
                </div>
            </div>

            <div className={`absolute top-12 right-12 transition-all duration-1000 z-20 ${bootStage >= 3 ? 'opacity-100' : 'opacity-0'}`}>
                <div className="relative border border-primary/40 bg-black/60 backdrop-blur-md px-4 py-2">
                    <div className="flex items-center gap-3">
                        <span className="text-accent text-sm">◈</span>
                        <p className="text-[9px] font-mono tracking-widest text-white uppercase">IDENTITY_LEVEL: OMEGA</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div ref={contentRef} className="relative z-20 text-center flex flex-col items-center px-6">
                <div className={`transition-all duration-1000 mb-6 ${bootStage >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                    <img src="/logo.png" alt="ENDURA" className="h-12 md:h-20 object-contain brightness-200 drop-shadow-[0_0_30px_rgba(147,112,219,0.5)]" />
                </div>

                <div className={`transition-all duration-1000 ${bootStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <h1 className={`text-6xl md:text-[12rem] font-heading tracking-[0.1em] md:tracking-[0.2em] uppercase text-white mb-4 relative leading-none ${glitchActive ? 'glitch-text' : ''}`}>
                        ENDURA
                    </h1>
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="h-[2px] w-24 md:w-48 bg-gradient-to-r from-transparent via-accent to-transparent" />
                        <div className="w-2 h-2 bg-accent rotate-45 animate-pulse shadow-[0_0_15px_rgba(212,175,55,1)]" />
                        <div className="h-[2px] w-24 md:w-48 bg-gradient-to-l from-transparent via-accent to-transparent" />
                    </div>
                </div>

                <div className={`transition-all duration-1000 delay-200 ${bootStage >= 5 ? 'opacity-100' : 'opacity-0'}`}>
                    <h2 className="text-lg md:text-3xl font-oswald uppercase tracking-[0.4em] text-white mb-6">
                        ASCEND TO <span className="text-primary system-text-glow">PERFECTION.</span>
                    </h2>
                    <p className="text-[10px] md:text-xs text-gray-400 font-light tracking-[0.6em] uppercase mb-12">
                        Physical Body <span className="text-primary mx-2">//</span> Digital Soul
                    </p>
                </div>

                <div className={`transition-all duration-1000 delay-400 ${bootStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <Link to={currentUser ? "/collections" : "/auth"} className="group relative inline-block">
                        <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/40 transition-all duration-500" />
                        <div className="absolute inset-0 border border-primary/60 group-hover:border-accent transition-all duration-500" />
                        <div className="relative z-10 px-10 py-4 flex items-center gap-3 overflow-hidden">
                            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-0 bg-primary/10 transition-transform duration-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white">
                                {currentUser ? "Explore_Archive" : "Initialize_Login"}
                            </span>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Bottom Status Bar */}
            <div className={`absolute bottom-12 left-12 right-12 transition-all duration-1000 z-20 ${bootStage >= 6 ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex items-center justify-between backdrop-blur-sm bg-black/40 border border-white/10 px-6 py-3">
                    <div className="hidden md:flex items-center gap-6">
                        <span className="font-mono text-[8px] text-white/40 tracking-[0.2em]">SYSTEM_BOOT_v2.5</span>
                        <div className="w-px h-3 bg-white/20" />
                        <span className="font-mono text-[8px] text-accent/60 tracking-[0.2em]">ENCRYPTION_ACTIVE</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="w-1 h-3 bg-accent/30" style={{ animation: `pulse ${i * 0.3}s ease-in-out infinite alternate` }} />
                            ))}
                        </div>
                        <span className="font-mono text-[8px] text-white/40 tracking-[0.2em] ml-2">SIGNAL_ESTABLISHED</span>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes particleFloat {
                    0% { transform: translateY(0) translateX(0); }
                    100% { transform: translateY(-100px) translateX(50px); }
                }
                .glitch-text { animation: glitch 0.3s ease-in-out; }
                @keyframes glitch {
                    0%, 100% { transform: translate(0); }
                    20% { transform: translate(-2px, 2px); }
                    40% { transform: translate(2px, -2px); }
                    60% { transform: translate(-2px, -2px); }
                    80% { transform: translate(2px, 2px); }
                }
                @keyframes pulse {
                    0% { opacity: 0.3; transform: scaleY(0.8); }
                    100% { opacity: 1; transform: scaleY(1.2); }
                }
                @keyframes scanner-wipe {
                    0% { transform: translateY(0); }
                    50% { transform: translateY(100vh); }
                    100% { transform: translateY(0); }
                }
                .animate-scanner-wipe { animation: scanner-wipe 4s ease-in-out infinite; }
                @keyframes scanner-flicker {
                    0%, 100% { opacity: 0.1; }
                    50% { opacity: 0.3; }
                    55% { opacity: 0.05; }
                }
                .animate-scanner-flicker { animation: scanner-flicker 0.1s infinite; }
            `}</style>
        </section>
    );
};

export default SystemBootHero;
