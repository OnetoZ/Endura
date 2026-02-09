import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

/**
 * SCENE 11 — THE CLOSURE
 * 
 * PURPOSE: Final frame. Archive shutdown. Ritual completion.
 * EMOTION: "This wasn't a website. This was an experience."
 * 
 * VISUAL INTENT:
 * - Deep black void with subtle purple mist
 * - Gold accents (minimal, ceremonial)
 * - Everything centered and deliberate
 * - No traditional footer elements
 * 
 * ANIMATION PHILOSOPHY:
 * - Extremely slow reveals (8-12s cycles)
 * - Fade-in only, no slides
 * - Scroll pins briefly (lingering effect)
 * - User feels they are exiting a secret world
 */

const CinematicFooter = () => {
    const containerRef = useRef();
    const navigate = useNavigate();

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top bottom",
                end: "bottom bottom",
                scrub: 1,
                pin: false,
            }
        });

        // Slow fade-in sequence
        tl.from(".footer-logo", {
            opacity: 0,
            scale: 0.95,
            duration: 3,
            ease: "power1.inOut"
        })
            .from(".closing-line", {
                opacity: 0,
                letterSpacing: "2em",
                duration: 4,
                ease: "power2.out"
            }, "-=2")
            .from(".ritual-cta", {
                opacity: 0,
                duration: 3,
                ease: "power1.inOut"
            }, "-=1.5")
            .from(".system-status", {
                opacity: 0,
                duration: 2
            }, "-=1");

        // Ambient mist movement (extremely slow)
        gsap.to(".ambient-mist", {
            x: "5%",
            y: "-3%",
            duration: 20,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        // Logo pulse (imperceptible, 10s cycle)
        gsap.to(".footer-logo", {
            opacity: 0.7,
            duration: 10,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

    }, { scope: containerRef });

    const handleVaultEntry = () => {
        navigate('/vault');
    };

    return (
        <footer
            ref={containerRef}
            className="relative min-h-screen w-full bg-black flex items-center justify-center overflow-hidden"
        >
            {/* Ambient Background Mist */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="ambient-mist absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-black opacity-30 blur-3xl" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.015] mix-blend-overlay" />
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 flex flex-col items-center justify-center px-6 py-24 max-w-4xl mx-auto text-center">

                {/* ENDURA Logo */}
                <div className="footer-logo mb-12 md:mb-16">
                    <h1 className="text-4xl md:text-7xl font-heading tracking-[0.2em] md:tracking-[0.3em] uppercase text-white">
                        ENDURA
                    </h1>
                    <div className="mt-3 md:mt-4 h-px w-20 md:w-32 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto opacity-40" />
                </div>

                {/* Closing Line */}
                <p className="closing-line text-white/60 font-body font-light text-xs md:text-base tracking-[0.4em] md:tracking-[0.8em] uppercase mb-16 md:mb-20 leading-loose max-w-2xl">
                    The Order is not for everyone.
                </p>

                {/* Ritual CTA */}
                <button
                    onClick={handleVaultEntry}
                    className="ritual-cta group relative px-8 md:px-12 py-3 md:py-4 border border-accent/30 text-accent font-mono text-[10px] md:text-xs tracking-[0.3em] md:tracking-[0.5em] uppercase transition-all duration-700 hover:border-accent/60 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                >
                    <span className="relative z-10">Enter the Vault</span>
                    <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-all duration-700" />
                </button>

                {/* Divider */}
                <div className="my-16 md:my-20 w-full max-w-xs h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

                {/* Legal Minimal */}
                <div className="text-white/20 font-mono text-[9px] md:text-[10px] tracking-widest uppercase">
                    © 2026 ENDURA — All Rights Reserved
                </div>
            </div>

            {/* System Status (Bottom Right Corner) - Hidden on mobile */}
            <div className="system-status hidden md:block absolute bottom-8 right-8 text-right font-mono text-[9px] text-white/10 tracking-[0.3em] uppercase leading-relaxed">
                SESSION TERMINATED<br />
                ARCHIVE SEALED<br />
                IDENTITY SYNC COMPLETE
            </div>

            {/* System Status (Bottom Left Corner) - Hidden on mobile */}
            <div className="system-status hidden md:block absolute bottom-8 left-8 font-mono text-[9px] text-white/10 tracking-[0.3em] uppercase leading-relaxed">
                ENDURA_SYSTEM_v2.0<br />
                CLEARANCE_LEVEL_PUBLIC<br />
                CONNECTION_SECURE
            </div>
        </footer>
    );
};

export default CinematicFooter;
