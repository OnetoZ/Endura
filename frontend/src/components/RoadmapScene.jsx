import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const RoadmapScene = () => {
    const containerRef = useRef();
    const timelineRef = useRef();
    const progressRef = useRef();

    const milestones = [
        {
            year: "PHASE_01",
            title: "THE AWAKENING",
            description: "Establishing the Order. Launch of the Genesis collection and the initial encryption of digital twins.",
            status: "COMPLETE"
        },
        {
            year: "PHASE_02",
            title: "THE BRIDGE",
            description: "Deployment of the Vault Core. Integration with top-tier physical luxury manufacturers for biometric validation.",
            status: "ACTIVE"
        },
        {
            year: "PHASE_03",
            title: "FACTION WARS",
            description: "Digital territory expansion. Faction-specific exclusive drops and decentralized identity governance.",
            status: "LOCKED"
        },
        {
            year: "PHASE_04",
            title: "THE SINGULARITY",
            description: "Full reality-sync. The disappearance of the boundary between IRL texture and URL utility.",
            status: "RESTRICTED"
        }
    ];

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=3000",
                scrub: 1,
                pin: true,
                anticipatePin: 1
            }
        });

        // 1. Progress Bar Animation
        tl.fromTo(progressRef.current,
            { scaleY: 0 },
            { scaleY: 1, duration: milestones.length, ease: "none" },
            0
        );

        // 2. Milestone Animations
        milestones.forEach((_, index) => {
            const milestoneId = `.milestone-${index}`;
            const dotId = `.dot-${index}`;

            // Reveal milestone
            tl.fromTo(milestoneId,
                { opacity: 0, x: -30 },
                { opacity: 1, x: 0, duration: 1 },
                index + 0.2 // Stagger slightly after progress hits
            );

            // Pulse dot when active
            tl.fromTo(dotId,
                { scale: 0.5, boxShadow: "0 0 0px rgba(212,175,55,0)" },
                { scale: 1.2, boxShadow: "0 0 20px rgba(212,175,55,0.6)", duration: 0.5 },
                index
            );
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="h-screen w-full relative bg-black overflow-hidden flex items-center">
            {/* Background Narrative Grid */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
                <div className="h-full w-full bg-[linear-gradient(to_right,#888_1px,transparent_1px),linear-gradient(to_bottom,#888_1px,transparent_1px)] bg-[size:100px_100px]" />
            </div>

            <div className="container mx-auto px-12 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12">
                {/* Horizontal Header for the Scene */}
                <div className="md:col-span-4 flex flex-col justify-center">
                    <span className="restricted-label text-accent tracking-[0.8em] mb-4">
                        // THE_FUTURE_LAYER
                    </span>
                    <h2 className="text-5xl md:text-7xl font-oswald uppercase leading-none tracking-tighter">
                        A Prophecy <br />
                        <span className="text-white/20">In Every Thread.</span>
                    </h2>
                    <p className="mt-8 text-gray-500 font-mono text-[10px] tracking-widest max-w-xs leading-relaxed">
                        The Endura Roadmap is not a sequence of features. It is the timeline of human-digital evolution.
                        Each milestone marks a permanent shift in identity.
                    </p>
                </div>

                {/* Timeline Column */}
                <div className="md:col-span-8 flex relative mt-20 md:mt-0">
                    {/* Central Vertical Line */}
                    <div ref={timelineRef} className="absolute left-0 md:left-20 top-0 bottom-0 w-px bg-white/10">
                        <div ref={progressRef} className="absolute top-0 left-0 w-full bg-accent origin-top shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
                    </div>

                    {/* Milestones */}
                    <div className="ml-12 md:ml-32 space-y-24 md:space-y-0 h-full flex flex-col justify-around py-12">
                        {milestones.map((milestone, idx) => (
                            <div key={idx} className={`milestone-${idx} opacity-0 relative group`}>
                                {/* Connection Dot */}
                                <div className={`dot-${idx} absolute -left-[54px] md:-left-[54px] top-4 w-4 h-4 rounded-full bg-black border border-white/20 transition-colors group-hover:border-accent z-20`}>
                                    <div className="absolute inset-1 rounded-full bg-white/10 group-hover:bg-accent transition-colors" />
                                </div>

                                <div className="space-y-4 max-w-lg">
                                    <div className="flex items-center gap-4">
                                        <span className={`text-[10px] font-mono tracking-widest ${milestone.status === 'COMPLETE' ? 'text-primary-light' : milestone.status === 'ACTIVE' ? 'text-accent' : 'text-gray-600'}`}>
                                            [{milestone.status}]
                                        </span>
                                        <span className="text-[10px] text-gray-500 font-mono tracking-widest">{milestone.year}</span>
                                    </div>
                                    <h3 className="text-2xl md:text-4xl font-oswald tracking-tight uppercase group-hover:text-accent transition-colors duration-500">
                                        {milestone.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm md:text-base font-light italic leading-relaxed border-l border-white/5 pl-6 group-hover:border-accent/20 transition-all">
                                        "{milestone.description}"
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Subtle Foreground Overlay for depth */}
            <div className="absolute inset-0 pointer-events-none z-20 bg-gradient-to-b from-black via-transparent to-black opacity-40" />
        </section>
    );
};

export default RoadmapScene;
