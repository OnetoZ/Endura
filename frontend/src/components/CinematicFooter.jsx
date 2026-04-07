import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const CinematicFooter = () => {
    const containerRef = useRef();

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 90%",
                toggleActions: "play none none reverse"
            }
        });

        tl.from(".footer-logo", { 
            scale: 0.8, 
            y: 40, 
            opacity: 0, 
            filter: 'blur(10px)', 
            duration: 1.2, 
            ease: "back.out(1.7)" 
        })
            .from(".footer-brand > div:nth-child(2)", { 
                y: 20, 
                opacity: 0, 
                duration: 0.8, 
                ease: "power3.out" 
            }, "-=0.6")
            .from(".footer-col", { 
                y: 30, 
                opacity: 0, 
                duration: 0.8, 
                stagger: 0.15,
                ease: "power2.out"
            }, "-=0.4")
            .from(".footer-bottom", { 
                opacity: 0, 
                duration: 1,
                ease: "power1.inOut"
            }, "-=0.5");

    }, { scope: containerRef });

    return (
        <footer ref={containerRef} className="bg-black text-white pt-32 pb-12 px-8 border-t border-white/5 relative overflow-hidden">
            {/* Background Ambient Glow */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />

            <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8">
                {/* Brand Column */}
                <div className="footer-brand col-span-1 md:col-span-2 space-y-10">
                    <div className="relative group w-fit">
                        <img 
                            src="/logo.png" 
                            alt="ENDURA" 
                            className="h-12 md:h-16 object-contain footer-logo brightness-150 transition-all duration-500 group-hover:brightness-200"
                        />
                        {/* Corner Brackets */}
                        <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-primary/30 group-hover:border-primary transition-all duration-300" />
                        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-primary/30 group-hover:border-primary transition-all duration-300" />
                    </div>
                    
                    <div className="space-y-4">
                        <span className="font-mono text-[10px] tracking-[1.5em] text-blue-500/40 uppercase block">
                            // DIGITAL_LEGACY_PROTOCOL
                        </span>
                        <p className="max-w-md text-gray-500 font-light tracking-wide leading-relaxed uppercase text-[10px] md:text-sm">
                            The intersection of high-end fashion and digital permanence in India. 
                            Building the infrastructure for the next generation of
                            digital identity and physical luxury.
                        </p>
                    </div>

                    {/* Socials */}
                    <div className="flex gap-4 pt-4">
                        <a
                            href="https://www.instagram.com/enduratheorder?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 border border-white/10 flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-all duration-300 group"
                        >
                            <span className="text-[10px] font-mono uppercase tracking-widest">i</span>
                        </a>
                        <button
                            onClick={() => window.location.href = `mailto:${['enduraclothing', 'team', 'gmail.com'].join('.').replace('.team.', '.team@')}`}
                            className="w-12 h-12 border border-white/10 flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-all duration-300 group"
                        >
                            <span className="text-[10px] font-mono uppercase tracking-widest">@</span>
                        </button>
                    </div>
                </div>

                {/* Dimensions Column */}
                <div className="footer-col space-y-10">
                    <h3 className="font-mono text-[10px] tracking-[0.5em] text-primary uppercase">Dimensions</h3>
                    <ul className="space-y-6">
                        {['All Inventory', 'Digital Skins', 'The Vault', 'Operator Node'].map(link => (
                            <li key={link}>
                                <Link to="#" className="text-xs md:text-sm uppercase tracking-[0.2em] font-bold text-gray-600 hover:text-white transition-colors">
                                    {link}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Protocol Column */}
                <div className="footer-col space-y-10">
                    <h3 className="font-mono text-[10px] tracking-[0.5em] text-primary uppercase">Protocol</h3>
                    <ul className="space-y-6">
                        {['Privacy Encryption', 'Service Terms', 'Logistics', 'System Status'].map(link => (
                            <li key={link}>
                                <Link to="#" className="text-xs md:text-sm uppercase tracking-[0.2em] font-bold text-gray-600 hover:text-white transition-colors">
                                    {link}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Bottom Credits */}
            <div className="footer-bottom mt-32 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <span className="font-mono text-[9px] text-gray-700 tracking-[0.3em] uppercase">
                    © 2026 ENDURA_NETWORK_PROTOCOL // ALL_DATA_SECURED
                </span>
                <div className="flex gap-8">
                    <span className="font-mono text-[9px] text-gray-800 tracking-widest uppercase cursor-help hover:text-primary/40 transition-colors">
                        LATENCY: 14MS
                    </span>
                    <span className="font-mono text-[9px] text-gray-800 tracking-widest uppercase">
                        NODE: [REDACTED]
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default CinematicFooter;
