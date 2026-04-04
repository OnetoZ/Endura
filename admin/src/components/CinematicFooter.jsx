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
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });

        tl.from(".footer-brand", { y: 50, opacity: 0, duration: 1, ease: "power3.out" })
            .from(".footer-col", { y: 30, opacity: 0, duration: 0.8, stagger: 0.2 }, "-=0.5")
            .from(".footer-bottom", { opacity: 0, duration: 1 }, "-=0.5");

    }, { scope: containerRef });

    return (
        <footer ref={containerRef} className="bg-black text-white pt-32 pb-12 px-8 border-t border-white/5 relative overflow-hidden">
            {/* Background Ambient Glow */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />

            <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8">
                {/* Brand Column */}
                <div className="footer-brand col-span-1 md:col-span-2 space-y-8">
                    <h2 className="text-7xl md:text-9xl font-heading tracking-tight uppercase leading-none hover:text-primary transition-colors duration-500 cursor-default">
                        ENDURA<span className="text-primary">.</span>
                    </h2>
                    <p className="max-w-md text-gray-500 font-light tracking-wide leading-relaxed uppercase text-xs md:text-sm">
                        The intersection of high-end fashion and digital permanence.
                        Building the infrastructure for the next generation of
                        digital identity and physical luxury.
                    </p>
                    {/* Socials */}
                    <div className="flex gap-4 pt-4">
                        {['instagram', 'twitter', 'discord'].map((social) => (
                            <a
                                key={social}
                                href="#"
                                className="w-12 h-12 border border-white/10 flex items-center justify-center hover:border-primary hover:text-primary transition-all duration-300 group"
                            >
                                <span className="text-[10px] font-mono uppercase tracking-widest">{social[0]}</span>
                                {/* In a real app, replace with actual icons */}
                            </a>
                        ))}
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
