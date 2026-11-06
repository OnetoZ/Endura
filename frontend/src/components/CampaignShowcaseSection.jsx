import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import campaignHeroImg from '../assets/hero-campaign.jpg';

gsap.registerPlugin(ScrollTrigger);

const CampaignShowcaseSection = () => {
    const containerRef = useRef();
    const frameRef = useRef();
    const imageRef = useRef();
    const badgeRef = useRef();
    const titleRef = useRef();
    const descRef = useRef();

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: frameRef.current,
                start: "top 78%",
                end: "bottom 20%",
                toggleActions: "play reverse play reverse",
            }
        });

        tl.fromTo(badgeRef.current,
            { opacity: 0, y: -20, filter: 'blur(8px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: "power2.out" }
        )
        .fromTo(titleRef.current,
            { opacity: 0, y: 30, filter: 'blur(10px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: "power3.out" },
            "-=0.5"
        )
        .fromTo(descRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
            "-=0.6"
        );

        // Continuous subtle scroll parallax for the background photoshoot image
        gsap.to(imageRef.current, {
            yPercent: 3,
            scale: 1.03,
            ease: "none",
            scrollTrigger: {
                trigger: frameRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5,
            }
        });
    }, { scope: containerRef });

    return (
        <section
            ref={containerRef}
            className="relative z-10 w-full py-10 sm:py-16 md:py-24 bg-black flex justify-center items-center px-3 sm:px-6 md:px-12 select-none overflow-hidden"
        >
            <div className="w-full max-w-[1920px] mx-auto">
                <Link
                    to="/collections"
                    ref={frameRef}
                    className="group relative block w-full aspect-[16/9] rounded-xl sm:rounded-2xl md:rounded-3xl border border-white/10 overflow-hidden shadow-[0_25px_90px_rgba(0,0,0,0.95)] bg-[#050505] cursor-pointer"
                >
                    {/* The 2nd Image: Ambassador Campaign Photoshoot */}
                    <img
                        ref={imageRef}
                        src={campaignHeroImg}
                        alt="Endura Royal Ambassador Campaign"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out will-change-transform"
                        onLoad={() => ScrollTrigger.refresh()}
                    />

                    {/* Subtle Cinematic Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 pointer-events-none" />

                    {/* Top Editorial Metadata Badge */}
                    <div
                        ref={badgeRef}
                        className="absolute top-5 sm:top-8 md:top-10 left-5 sm:left-8 md:left-12 flex items-center gap-2 sm:gap-3 z-20 pointer-events-none"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(212,175,55,1)]" />
                        <span className="font-mono text-[9px] sm:text-xs tracking-[0.3em] uppercase text-accent font-medium">
                            EDITORIAL CAMPAIGN // CHAPTER 01
                        </span>
                    </div>

                    {/* Bottom Editorial Caption */}
                    <div className="absolute bottom-5 sm:bottom-8 md:bottom-12 inset-x-5 sm:inset-x-8 md:inset-x-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4 z-20 pointer-events-none">
                        <div>
                            <h2
                                ref={titleRef}
                                className="font-cinzel text-xl sm:text-3xl md:text-5xl font-normal tracking-[0.2em] md:tracking-[0.28em] uppercase text-white drop-shadow-[0_4px_25px_rgba(0,0,0,0.95)]"
                            >
                                THE ROYAL ORDER
                            </h2>
                            <p
                                ref={descRef}
                                className="font-serif italic text-xs sm:text-sm md:text-lg text-gray-300 tracking-[0.08em] md:tracking-[0.12em] mt-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
                            >
                                Power Collapses. Myth Remains.
                            </p>
                        </div>

                        {/* CTA Indicator */}
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-black/60 border border-white/20 backdrop-blur-md text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-white group-hover:border-accent/60 group-hover:text-accent transition-all duration-300 shadow-lg">
                            <span>DISCOVER PIECES</span>
                            <span className="text-accent group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </div>

                    {/* Corner Tactical Accents */}
                    <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-white/30 pointer-events-none" />
                    <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-white/30 pointer-events-none" />
                    <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-white/30 pointer-events-none" />
                    <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-white/30 pointer-events-none" />

                    {/* Border Ring Hover Glow */}
                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl md:rounded-3xl ring-1 ring-inset ring-white/10 group-hover:ring-accent/40 transition-all duration-700 pointer-events-none" />
                </Link>
            </div>
        </section>
    );
};

export default CampaignShowcaseSection;

