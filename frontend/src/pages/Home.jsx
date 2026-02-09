import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import SystemBootHero from '../components/SystemBootHero';
import PhilosophyScene from '../components/PhilosophyScene';
import VisionScene from '../components/VisionScene';
import VaultScene from '../components/VaultScene';
import RoadmapScene from '../components/RoadmapScene';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Home = () => {
    const mainRef = useRef();

    useGSAP(() => {
        // Global Scene Management can be added here
    }, { scope: mainRef });

    const factions = [
        {
            id: 'veil',
            title: 'THE VEIL',
            subtitle: 'Faction_01',
            description: 'Power that doesn’t need to be loud. The Veil represents those who move with intent rather than noise. Strategists and observers who act only when it matters.',
            image: '/factions/veil.jpg',
            accent: 'var(--primary-light)'
        },
        {
            id: 'crownless',
            title: 'CROWNLESS',
            subtitle: 'Faction_02',
            description: 'Lead without permission. Reject titles and hierarchies. The Crownless believe respect is earned through action, building their own systems rather than following existing ones.',
            image: '/factions/crownless.jpg',
            accent: 'var(--accent)'
        },
        {
            id: 'hollow',
            title: 'HOLLOW',
            subtitle: 'Faction_03',
            description: 'Feel deeply, act freely. An order of creators and empaths guided by instinct. They turn vulnerability into a unique form of power and artistic truth.',
            image: '/factions/hollow.jpg',
            accent: 'white'
        },
        {
            id: 'forged',
            title: 'FORGED',
            subtitle: 'Faction_04',
            description: 'Shaped by challenge and discipline. Relentless survivors who use every obstacle as fuel for endurance. Defiant, resilient, and focused forward.',
            image: '/factions/forged.jpg',
            accent: 'var(--accent-dark)'
        },
        {
            id: 'ascend',
            title: 'ASCEND',
            subtitle: 'Faction_05',
            description: 'Exist ahead of time. Digital innovators looking beyond the physical horizon. Seeking evolution and transformation in the pursuit of what hasn’t been seen yet.',
            image: '/factions/ascend.jpg',
            accent: 'var(--primary)'
        }
    ];

    return (
        <div ref={mainRef} className="relative bg-black text-white selection:bg-accent/30 overflow-x-hidden">
            {/* SCENE 1 & 2: System Boot / Hero Identity */}
            <SystemBootHero />

            {/* SCENE 3: PHILOSOPHY (The Anomaly) */}
            <PhilosophyScene />

            {/* SCENE 4: VISION (Strength & Soul) */}
            <VisionScene />

            {/* SCENE 4: FACTION ARCHIVES */}
            <div className="space-y-0 relative z-10">
                {factions.map((faction, idx) => (
                    <section
                        key={faction.id}
                        className="min-h-screen flex items-center relative overflow-hidden py-32 border-b border-white/5 bg-[#020202]"
                    >
                        {/* Background Atmosphere */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <div
                                className="absolute inset-0 bg-cover bg-center grayscale scale-110 blur-3xl transition-transform duration-[3000ms]"
                                style={{ backgroundImage: `url(${faction.image})` }}
                            />
                        </div>

                        <div className="container mx-auto px-12 relative z-10">
                            <div className={`grid grid-cols-1 md:grid-cols-2 gap-24 items-center ${idx % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                                <div className={`${idx % 2 !== 0 ? 'md:order-2' : ''}`}>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="h-[1px] w-12 bg-accent/40" />
                                        <span className="restricted-label">{faction.subtitle}</span>
                                    </div>
                                    <h2 className="text-6xl md:text-[5rem] font-oswald font-bold uppercase mb-10 tracking-[0.02em] leading-tight">
                                        {faction.title}
                                    </h2>
                                    <p className="text-gray-400 text-xl font-light leading-relaxed mb-12 border-l-[1px] border-white/10 pl-8 italic">
                                        "{faction.description}"
                                    </p>
                                    <Link
                                        to="/auth"
                                        className="inline-flex items-center gap-8 group"
                                    >
                                        <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:border-accent transition-all duration-500">
                                            <span className="text-xs text-white/50 group-hover:text-accent font-mono transition-colors">→</span>
                                        </div>
                                        <span className="cinematic-text text-sm tracking-[0.5em] group-hover:text-accent transition-colors">
                                            Access_Faction_File
                                        </span>
                                    </Link>
                                </div>

                                <div className={`${idx % 2 !== 0 ? 'md:order-1' : ''} relative`}>
                                    <div className="aspect-[4/5] md:aspect-square relative group">
                                        {/* Cinematic Frame */}
                                        <div className="absolute -inset-6 border border-white/5 pointer-events-none group-hover:border-accent/10 transition-colors duration-1000" />

                                        <div className="w-full h-full overflow-hidden bg-neutral-950 border border-white/5">
                                            <img
                                                src={faction.image}
                                                alt={faction.title}
                                                className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-[2000ms] ease-out shadow-2xl"
                                            />
                                        </div>

                                        {/* Metadata Overlay */}
                                        <div className="absolute bottom-8 right-8 font-mono text-[9px] text-white/20 tracking-widest uppercase text-right leading-relaxed">
                                            FILE_SIZE: 4.2MB <br />
                                            ENCR_TYPE: AES-256 <br />
                                            STATUS: RESTRICTED
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                ))}
            </div>

            {/* SCENE 5: THE VAULT (Entrance) */}
            <VaultScene />

            {/* SCENE 6: ROADMAP (The Future Layer) */}
            <RoadmapScene />
        </div>
    );
};

export default Home;
