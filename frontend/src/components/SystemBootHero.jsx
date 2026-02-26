import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

/**
 * SystemBootHero Component
 * 
 * Ultra-cinematic restricted archive entrance for ENDURA.
 * Features:
 * - Advanced particle system
 * - Glitch text animations
 * - Holographic HUD overlays
 * - Parallax depth effects
 * - Premium luxury typography
 */
const SystemBootHero = () => {
    const [bootStage, setBootStage] = useState(0);
    const [glitchActive, setGlitchActive] = useState(false);
    const { currentUser } = useStore();

    useEffect(() => {
        const stages = [
            { delay: 0, stage: 0 },
            { delay: 800, stage: 1 },   // Ambience
            { delay: 1600, stage: 2 },  // System Status
            { delay: 2400, stage: 3 },  // Restricted Warning
            { delay: 3200, stage: 4 },  // Logo / Identity
            { delay: 4000, stage: 5 },  // Subtitle
            { delay: 4800, stage: 6 },  // Secondary Status
        ];

        stages.forEach(({ delay, stage }) => {
            setTimeout(() => setBootStage(stage), delay);
        });

        // Random glitch effect
        const glitchInterval = setInterval(() => {
            if (Math.random() > 0.7) {
                setGlitchActive(true);
                setTimeout(() => setGlitchActive(false), 150);
            }
        }, 3000);

        return () => clearInterval(glitchInterval);
    }, []);

    return (
        <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
            {/* Master Cinematic Hero Image with Parallax */}
            <div className="absolute inset-0 z-0">
                <div
                    className="w-full h-full bg-cover bg-center transition-all duration-[12000ms] ease-out"
                    style={{
                        backgroundImage: 'url(/hero.png)',
                        transform: bootStage >= 1 ? 'scale(1.05)' : 'scale(1.15)',
                        opacity: bootStage >= 1 ? 0.7 : 0
                    }}
                />
                {/* Multi-layer Gradients for Depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
                <div className="absolute inset-0 bg-black/15" />
            </div>

            {/* Animated Particle Grid */}
            <div className="absolute inset-0 z-5 pointer-events-none opacity-20">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle, rgba(147,112,219,0.3) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px',
                    animation: 'particleFloat 20s linear infinite'
                }} />
            </div>

            {/* Visual Overlays */}
            <div className="absolute inset-0 z-10 pointer-events-none film-grain opacity-20" />
            <div className="absolute inset-0 z-10 pointer-events-none scanlines opacity-5" />

            {/* Holographic Corner Frames */}
            <div className="absolute top-0 left-0 w-64 h-64 border-l-2 border-t-2 border-primary/30 z-15 pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 border-r-2 border-t-2 border-primary/30 z-15 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 border-l-2 border-b-2 border-accent/30 z-15 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-64 h-64 border-r-2 border-b-2 border-accent/30 z-15 pointer-events-none" />

            {/* Top Left: Enhanced System Status */}
            <div
                className={`absolute top-12 left-12 space-y-3 transition-all duration-1000 z-20 ${bootStage >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                    }`}
            >
                <div className="flex items-center gap-3 backdrop-blur-sm bg-black/40 px-4 py-2 border border-accent/20">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-[0_0_12px_rgba(212,175,55,0.8)]" />
                    <span className="restricted-label text-accent">ARCHIVE_00.LOCKED</span>
                </div>
                <div className="text-[10px] text-gray-400 font-mono tracking-widest pl-5 space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-primary">◆</span>
                        <span>LATENCY: <span className="text-accent">12ms</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-primary">◆</span>
                        <span>LOCATION: <span className="text-white/60">[REDACTED]</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-primary">◆</span>
                        <span>STATUS: <span className="text-green-400">ACTIVE</span></span>
                    </div>
                </div>
            </div>

            {/* Top Right: Enhanced Identity Badge */}
            <div
                className={`absolute top-12 right-12 transition-all duration-1000 z-20 ${bootStage >= 3 ? 'opacity-100' : 'opacity-0'
                    }`}
            >
                <div className="relative border border-primary/40 bg-gradient-to-br from-black/60 via-primary/5 to-black/60 backdrop-blur-md px-6 py-3">
                    {/* Animated Corner Accents */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-accent" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-accent" />

                    <div className="flex items-center gap-4">
                        <span className="text-accent text-lg">◈</span>
                        <div>
                            <p className="text-[8px] text-gray-500 tracking-[0.3em] uppercase">Clearance</p>
                            <p className="restricted-label text-white">IDENTITY_LEVEL: OMEGA</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content: Central Identity with Glitch Effect */}
            <div className="relative z-20 text-center flex flex-col items-center px-6">
                {/* Small Logo Above */}
                <div
                    className={`transition-all duration-1000 mb-8 ${bootStage >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                        }`}
                >
                    <img
                        src="/logo.png"
                        alt="ENDURA"
                        className="h-16 md:h-20 object-contain brightness-200 drop-shadow-[0_0_30px_rgba(147,112,219,0.5)]"
                    />
                </div>

                {/* Main Title with Glitch */}
                <div
                    className={`transition-all duration-1000 ${bootStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}
                >
                    <h1 className={`text-6xl md:text-8xl lg:text-9xl font-heading tracking-[0.3em] uppercase text-white mb-6 relative ${glitchActive ? 'glitch-text' : ''}`}>
                        THE ORDER
                    </h1>

                    {/* Animated Divider */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-accent" />
                        <div className="w-2 h-2 bg-accent rotate-45" />
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-accent" />
                    </div>
                </div>

                {/* Subtitle */}
                <div
                    className={`transition-all duration-1000 delay-200 ${bootStage >= 5 ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <p className="text-sm md:text-base text-gray-400 font-light tracking-[0.5em] uppercase mb-4">
                        Physical Body <span className="text-primary mx-2">//</span> Digital Soul
                    </p>
                </div>

                {/* CTA Button */}
                <div
                    className={`transition-all duration-1000 delay-400 ${bootStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}
                >
                    <Link
                        to={currentUser ? "/collections" : "/auth"}
                        className="group relative inline-block mt-8"
                    >
                        {/* Animated Background Layers */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite]" />
                        <div className="absolute inset-0 bg-black/70 group-hover:bg-black/50 transition-all duration-500" />

                        {/* Border Frame */}
                        <div className="absolute inset-0 border-2 border-primary/60 group-hover:border-accent transition-all duration-500" />
                        <div className="absolute inset-0 border border-white/10 group-hover:border-white/30 transition-all duration-500" />

                        {/* Corner Accents */}
                        <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-accent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-accent opacity-0 group-hover:opacity-100 transition-all duration-300" />

                        {/* Content */}
                        <div className="relative z-10 px-12 py-4 flex items-center gap-3">
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white">
                                {currentUser ? "Explore_Collection" : "Login_Entrance"}
                            </span>
                            <svg className="w-4 h-4 text-accent group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Bottom Status Bar */}
            <div
                className={`absolute bottom-12 left-12 right-12 transition-all duration-1000 z-20 ${bootStage >= 6 ? 'opacity-100' : 'opacity-0'
                    }`}
            >
                <div className="flex items-center justify-between backdrop-blur-sm bg-black/40 border border-white/10 px-6 py-3">
                    <div className="flex items-center gap-6">
                        <span className="font-mono text-[9px] text-white/40 tracking-[0.2em]">
                            SYSTEM_BOOT_v2.0
                        </span>
                        <div className="w-px h-4 bg-white/20" />
                        <span className="font-mono text-[9px] text-accent/60 tracking-[0.2em]">
                            ENCRYPTION_ACTIVE
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                    key={i}
                                    className="w-1 h-3 bg-accent/30"
                                    style={{
                                        animation: `pulse ${i * 0.3}s ease-in-out infinite alternate`
                                    }}
                                />
                            ))}
                        </div>
                        <span className="font-mono text-[9px] text-white/40 tracking-[0.2em] ml-2">
                            SIGNAL_STRONG
                        </span>
                    </div>
                </div>
            </div>

            {/* Custom Animations */}
            <style>{`
                @keyframes particleFloat {
                    0% { transform: translateY(0) translateX(0); }
                    100% { transform: translateY(-100px) translateX(50px); }
                }
                @keyframes shimmer {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .glitch-text {
                    animation: glitch 0.3s ease-in-out;
                }
                @keyframes glitch {
                    0%, 100% { transform: translate(0); }
                    20% { transform: translate(-2px, 2px); }
                    40% { transform: translate(2px, -2px); }
                    60% { transform: translate(-2px, -2px); }
                    80% { transform: translate(2px, 2px); }
                }
            `}</style>
        </section>
    );
};

export default SystemBootHero;
