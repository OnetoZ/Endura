import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FactionSection from '../components/CultFactions/FactionSection';
// import CinematicFooter from '../components/CinematicFooter';

gsap.registerPlugin(ScrollTrigger);

const CultPage = () => {
    const pageRef = useRef();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div ref={pageRef} className="bg-black text-white min-h-screen">
            {/* HERO HEADER */}
            <section className="h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,112,219,0.12)_0%,transparent_70%)]" />
                {/* grid lines */}
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(147,112,219,0.4) 1px, transparent 1px), linear-gradient(to right, rgba(147,112,219,0.4) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

                <div className="relative z-10 space-y-8">
                    <span className="font-mono text-[10px] tracking-[1.5em] text-primary uppercase animate-pulse">
                        // IDENTITY_SELECTION_PROTOCOL
                    </span>
                    <h1 className="text-7xl md:text-[11rem] font-heading tracking-tight uppercase leading-none">
                        THE FIVE<br />
                        <span className="text-white/15">FACTIONS</span>
                    </h1>
                    <p className="text-gray-500 font-light tracking-[0.4em] uppercase text-xs max-w-md mx-auto border-t border-white/10 pt-8">
                        Choose your alignment. Your digital legacy begins with a single choice.
                    </p>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
                    <span className="font-mono text-[8px] tracking-widest text-white/25 uppercase">Scroll to Explore</span>
                    <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
                </div>
            </section>

            {/* FACTION 01 — THE VEIL */}
            <FactionSection
                id="veil"
                factionName="THE VEIL"
                factionNumber="FACTION_01"
                description="The first of the high order. A sheer curtain between the mundane and the infinite. Masters of shadow luxury, they wear the secrets of the network as their secondary skin."
                image="/factions/the_veil_faction.png"
                bgImage="/factions/veil.jpg"
                themeColor="#A855F7"
                isLeft={true}
                grayscaleBg={true}
            />

            {/* FACTION 04 — THE FORGED */}
            <FactionSection
                id="forged"
                factionName="THE FORGED"
                factionNumber="FACTION_04"
                description="Born in industrial pressure and golden aesthetics. Structural integrity meeting royal armory. The Forged represent the indestructible weight of digital legacy."
                image="/factions/the_forged.png"
                bgImage="/factions/forged.jpg"
                themeColor="#D4AF37"
                isLeft={false}
                grayscaleBg={false}
            />

            {/* FACTION 05 — TRANSCENDENT (Galaxy BG, clean character on black) */}
            <FactionSection
                id="transcendent"
                factionName="TRANSCENDENT"
                factionNumber="FACTION_05"
                description="The apex of consciousness. A celestial sage floating beyond linear time, holding the ancient ledger of the starlight. Perfection through divine digital evolution."
                image="/factions/transcendent_faction.png"
                bgImage="/factions/ascend.jpg"
                themeColor="#9370DB"
                isLeft={true}
                grayscaleBg={false}
            />

            {/* FACTION 02 — THE DEFIANT */}
            <FactionSection
                id="defiant"
                factionName="THE DEFIANT"
                factionNumber="FACTION_02"
                description="Rebels against the central order. High-energy disruption and unpredictable kinetics. Chaos as a tool for liberation."
                image="/factions/the crownless.png"
                bgImage="/factions/crownless.jpg"
                themeColor="#EF4444"
                isLeft={false}
                grayscaleBg={true}
            />

            {/* FACTION 03 — THE HOLLOW */}
            <FactionSection
                id="hollow"
                factionName="THE HOLLOW"
                factionNumber="FACTION_03"
                description="Light within the void. A whisper in the silence. The Hollow do not fill space; they define it. Reaching out with a hand of stars to touch the infinite."
                image="/factions/hollow_faction.png"
                bgImage="/factions/hollow.jpg"
                themeColor="#FFFFFF"
                isLeft={true}
                grayscaleBg={false}
            />

            {/* FOOTER */}
            {/* <CinematicFooter /> */}
        </div>
    );
};

export default CultPage;
