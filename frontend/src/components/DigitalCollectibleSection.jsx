import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DigitalCollectibleSection = () => {
    const containerRef = useRef();
    const vaultRef = useRef();

    useGSAP(() => {
        gsap.to(vaultRef.current, {
            y: -30,
            rotateY: 5,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        });

        gsap.from(".digital-text", {
            x: -100,
            opacity: 0,
            stagger: 0.3,
            duration: 1.5,
            ease: "power4.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 70%",
            }
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative py-32 px-6 bg-black overflow-hidden border-t border-white/5">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-center gap-16">
                
                {/* Vault Visual */}
                <div className="w-full md:w-1/2 relative flex justify-center perspective-1000">
                    <div ref={vaultRef} className="relative w-full max-w-md aspect-square border border-accent/20 rounded-lg p-4 bg-black/40 backdrop-blur-xl shadow-[0_0_50px_rgba(212,175,55,0.1)]">
                        <img 
                            src="/digital-vault.png" 
                            alt="Digital Vault Collectible" 
                            className="w-full h-full object-cover rounded shadow-2xl"
                        />
                        
                        {/* Holographic overlays */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 border border-primary/20 rounded-full animate-pulse-slow" />
                        <div className="absolute top-1/4 -left-8 bg-black/80 border border-accent/30 p-4 backdrop-blur-md shadow-lg">
                            <span className="text-[10px] font-mono text-accent block uppercase mb-1">Authenticity_Verified</span>
                            <span className="text-xl font-heading text-white">ERC-1155</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="w-full md:w-1/2 space-y-8">
                    <div className="digital-text space-y-4">
                        <h3 className="text-primary font-mono text-xs tracking-[0.5em] uppercase">The Digital Twin</h3>
                        <h2 className="text-4xl md:text-6xl font-heading text-white leading-tight">
                            WE EXIST <br /> <span className="text-gold italic">TWICE.</span>
                        </h2>
                    </div>

                    <p className="digital-text text-gray-400 text-lg max-w-lg">
                        Every physical ENDURA piece is paired with a unique digital collectible. Authenticate your apparel, unlock exclusive access to the Vault, and secure your place in the legacy.
                    </p>

                    <div className="digital-text grid grid-cols-2 gap-6 pt-4">
                        <div className="p-6 bg-white/5 border border-white/10 rounded-sm">
                            <h4 className="text-white font-heading text-xs tracking-widest uppercase mb-2">Immutable</h4>
                            <p className="text-gray-500 text-[11px] leading-relaxed">Secured by Ethereum and NFC-linked hardware.</p>
                        </div>
                        <div className="p-6 bg-accent/5 border border-accent/10 rounded-sm">
                            <h4 className="text-accent font-heading text-xs tracking-widest uppercase mb-2">Elite Utility</h4>
                            <p className="text-gray-500 text-[11px] leading-relaxed">Unlock future drops and physical-digital transformations.</p>
                        </div>
                    </div>

                    <div className="digital-text pt-6">
                        <Link to="/vault" className="group flex items-center gap-4 text-white font-heading text-xs tracking-[0.4em] uppercase transition-all hover:text-accent">
                            Enter the Vault 
                            <span className="w-12 h-[1px] bg-accent transform origin-left transition-transform duration-500 group-hover:scale-x-150" />
                        </Link>
                    </div>
                </div>
            </div>
            
            <style>{`
                .perspective-1000 { perspective: 1000px; }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.1; transform: scale(1); }
                    50% { opacity: 0.3; transform: scale(1.1); }
                }
                .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
            `}</style>
        </section>
    );
};

export default DigitalCollectibleSection;
