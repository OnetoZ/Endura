import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * SystemBootHero Component
 * 
 * Cinematic restricted archive entrance for ENDURA.
 * Features:
 * - Low-key cinematic lighting
 * - Faction-shadowed background
 * - Restricted system status
 * - Minimalist luxury typography
 */
const SystemBootHero = () => {
    const [bootStage, setBootStage] = useState(0);

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
    }, []);

    return (
        <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
            {/* Master Cinematic Hero Image */}
            <div className="absolute inset-0 z-0">
                <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-[12000ms] ease-out"
                    style={{
                        backgroundImage: 'url(/hero.png)',
                        transform: bootStage >= 1 ? 'scale(1.05)' : 'scale(1.15)',
                        opacity: bootStage >= 1 ? 0.6 : 0
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Visual Overlays */}
            <div className="absolute inset-0 z-10 pointer-events-none film-grain opacity-20" />
            <div className="absolute inset-0 z-10 pointer-events-none scanlines opacity-5" />

            {/* Top Left: System Status */}
            <div
                className={`absolute top-12 left-12 space-y-2 transition-all duration-1000 ${bootStage >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                    }`}
            >
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                    <span className="restricted-label">ARCHIVE_00.LOCKED</span>
                </div>
                <div className="text-[10px] text-gray-500 font-mono tracking-widest pl-5">
                    LATENCY: 12ms <br />
                    LOCATION: [REDACTED]
                </div>
            </div>

            {/* Top Right: Restricted Warning */}
            <div
                className={`absolute top-12 right-12 transition-all duration-1000 ${bootStage >= 3 ? 'opacity-100' : 'opacity-0'
                    }`}
            >
                <div className="border border-white/5 bg-white/5 backdrop-blur-md px-4 py-2 flex items-center gap-3">
                    <span className="text-accent text-xs">◈</span>
                    <span className="restricted-label text-white/80">IDENTITY_LEVEL: OMEGA</span>
                </div>
            </div>

            {/* Main Content: Central Identity */}
            <div className="relative z-20 text-center flex flex-col items-center">
                {/* Logo Image */}
                <div
                    className={`mb-10 transition-all duration-[3000ms] flex flex-col items-center ${bootStage >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 blur-xl'
                        }`}
                >
                    <img src="/logo.png" alt="ENDURA" className="h-12 md:h-20 object-contain brightness-150" />
                    <div className="mt-8 cinematic-text text-xl md:text-2xl text-white/90 tracking-[0.6em]">
                        The Order
                    </div>
                </div>

                {/* Subtitle */}
                <div
                    className={`space-y-4 transition-all duration-1000 delay-500 ${bootStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}
                >
                    <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto" />
                    <p className="text-gray-400 font-mono text-[10px] tracking-[0.4em] uppercase">
                        Physical Body // Digital Soul
                    </p>

                    {/* Access Call to Action */}
                    <Link
                        to="/auth"
                        className="mt-12 group relative block px-12 py-4 overflow-hidden border border-white/10 hover:border-accent/40 transition-colors duration-500"
                    >
                        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative z-10 text-white/70 group-hover:text-accent font-mono text-[10px] tracking-[0.5em] uppercase transition-colors">
                            Initiate_Entrance
                        </span>
                    </Link>
                </div>
            </div>

            {/* Bottom Status: Sequential Data */}
            <div
                className={`absolute bottom-12 left-12 space-y-1 transition-all duration-1000 ${bootStage >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
            >
                <div className="text-[9px] text-gray-600 font-mono tracking-widest flex items-center gap-2">
                    <span className="w-1 h-1 bg-primary rounded-full" />
                    ENCRYPT_SEQ: READY
                </div>
                <div className="text-[9px] text-gray-600 font-mono tracking-widest flex items-center gap-2">
                    <span className="w-1 h-1 bg-primary rounded-full" />
                    FACTION_PRESENCE: DETECTED (5)
                </div>
            </div>

            {/* Right Status: Scroll Prompt */}
            <div
                className={`absolute bottom-12 right-12 transition-all duration-1000 ${bootStage >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
            >
                <div className="flex items-center gap-4 group cursor-pointer">
                    <span className="text-[9px] text-gray-500 font-mono tracking-widest uppercase group-hover:text-white transition-colors">
                        Uncover_The_Truth
                    </span>
                    <div className="w-px h-8 bg-gradient-to-b from-accent to-transparent" />
                </div>
            </div>
        </section>
    );
};

export default SystemBootHero;

