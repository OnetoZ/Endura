import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const FACTIONS = [
    {
        id: 'veil',
        title: 'THE VEIL',
        subtitle: 'Power without noise.',
        description: 'Observers and strategists who understand that true presence doesn’t require attention. Their strength is built on awareness rather than display.',
        color: '#8b5cf6',
        image: '/cinema_pic/cult_character_silent-removebg.png',
        worldColor: 'rgba(50, 10, 100, 0.4)'
    },
    {
        id: 'crownless',
        title: 'THE CROWNLESS',
        subtitle: 'Leaders without permission.',
        description: 'Rebels against hierarchy who believe respect is earned through action. They don’t follow systems — they build their own path.',
        color: '#f59e0b',
        image: '/cinema_pic/cult_character_strength-removebg.png',
        worldColor: 'rgba(100, 50, 0, 0.4)'
    },
    {
        id: 'hollow',
        title: 'THE HOLLOW',
        subtitle: 'Emotion as a weapon.',
        description: 'Artists and empaths who feel everything. They turn vulnerability into identity, moving through the world guided by raw instinct.',
        color: '#d946ef',
        image: '/cinema_pic/cult_character_transcendent-removebg.png',
        worldColor: 'rgba(70, 0, 100, 0.4)'
    },
    {
        id: 'forged',
        title: 'THE FORGED',
        subtitle: 'Pressure creates power.',
        description: 'Shaped by adversity and discipline. Survivors who treat obstacles as fuel, proving that fire is the ultimate builder of character.',
        color: '#ef4444',
        image: '/cinema_pic/cult_character_defiant-removebg.png',
        worldColor: 'rgba(100, 0, 0, 0.4)'
    },
    {
        id: 'ascended',
        title: 'THE ASCENDED',
        subtitle: 'Built for what’s next.',
        description: 'Visionaries who glimpse the future ahead of time. Constantly evolving, they represent the absolute edge of progress and transformation.',
        color: '#ffffff',
        image: '/cinema_pic/cult_character-removebg.png',
        worldColor: 'rgba(80, 80, 80, 0.4)'
    }
];

const CrystalStone = ({ color, index, className }) => {
    const paths = [
        "M50 5 L95 40 L85 90 L50 125 L15 90 L5 40 Z",
        "M45 0 L100 35 L80 100 L50 130 L10 100 L0 40 Z",
        "M55 10 L90 50 L100 110 L60 125 L10 100 L20 20 Z",
        "M50 0 L100 50 L75 120 L40 130 L0 80 L15 15 Z",
        "M60 5 L100 60 L85 110 L45 130 L5 95 L20 15 Z"
    ];

    return (
        <div className={`stone-${index} ${className} absolute w-24 h-32 flex items-center justify-center transition-all duration-75`}>
            <div className="absolute inset-[-50px] pointer-events-none">
                <div className="absolute inset-0 bg-radial-gradient animate-aura-slow opacity-30 blur-[40px]"
                    style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }} />
                <div className="absolute inset-0 bg-radial-gradient animate-pulse-fast opacity-50 blur-[20px]"
                    style={{ background: `radial-gradient(circle, ${color} 0%, transparent 60%)` }} />
            </div>

            <svg viewBox="0 0 100 135" className="w-full h-full drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] filter">
                <defs>
                    <linearGradient id={`grad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: 'rgba(10,10,10,0.98)', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: `${color}33`, stopOpacity: 1 }} />
                    </linearGradient>
                </defs>
                <path
                    d={paths[index % paths.length]}
                    fill={`url(#grad-${index})`}
                    stroke={`${color}77`}
                    strokeWidth="0.8"
                />
                <text
                    x="50"
                    y="75"
                    textAnchor="middle"
                    fill={color}
                    className="font-heading text-3xl select-none pointer-events-none opacity-80"
                >
                    {['◈', '⚡', '♾', '✧', '⚛'][index]}
                </text>
            </svg>
        </div>
    );
};

const IntroCinema = ({ onComplete }) => {
    const containerRef = useRef(null);
    const mainWrapperRef = useRef(null);

    useGSAP(() => {
        const q = gsap.utils.selector(mainWrapperRef);
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: '+=1600%',
                scrub: 1,
                pin: true,
                onLeave: onComplete,
            }
        });

        // 01. INTRO
        tl.fromTo(q('.hero-layer'),
            { scale: 0.8, opacity: 0, filter: 'brightness(0) blur(20px)' },
            { scale: 1, opacity: 1, filter: 'brightness(1) blur(0px)', duration: 4 },
            0
        );

        // 02. ORBIT START
        tl.fromTo(q('.stones-layer'),
            { opacity: 0, y: 200 },
            { opacity: 1, y: 0, duration: 4 },
            2
        );

        const orbitState = { progress: 0 };
        tl.to(orbitState, {
            progress: 1,
            duration: 100,
            ease: 'none',
            onUpdate: () => {
                const p = orbitState.progress;
                FACTIONS.forEach((_, i) => {
                    const stone = q(`.stone-${i}`)[0];
                    if (!stone) return;
                    const angle = (p * Math.PI * 2.2) + (i * ((Math.PI * 2) / 5));
                    const x = Math.sin(angle) * 400;
                    const z = Math.cos(angle);
                    const y = Math.sin(angle * 2) * 40;
                    const scale = 0.6 + (z + 1) * 0.4;
                    const opacity = 0.2 + (z + 1) * 0.8;
                    stone.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
                    stone.style.opacity = opacity;
                    stone.style.zIndex = z > 0 ? 30 : 10;
                });
            }
        }, 4);

        // 03. SEQUENTIAL WORLDS
        FACTIONS.forEach((f, i) => {
            const start = 12 + (i * 16);

            // World Shift
            tl.to(q('.bg-world-shift'), { backgroundColor: f.worldColor, opacity: 1, duration: 3 }, start);

            // MORE AGGRESSIVE DOLLY - Push character further from HUD
            const dollyX = i % 2 === 0 ? 250 : -250;
            tl.to(q('.dolly-system'), { x: dollyX, duration: 4, ease: 'power2.inOut' }, start);

            // Portal Reveal (Step 1)
            tl.fromTo(q(`.portal-${f.id}`),
                { opacity: 0, scale: 0.85, x: 0, display: 'none' },
                { opacity: 1, scale: 1, display: 'flex', duration: 3 },
                start + 1
            );

            // HUD Reveal (Step 2 - Pushed further to edges)
            const hudStart = start + 6;
            tl.fromTo(q(`.hud-${f.id}`),
                { opacity: 0, x: i % 2 === 0 ? -100 : 100, display: 'none' },
                { opacity: 1, x: 0, display: 'flex', duration: 3 },
                hudStart
            );

            // EXIT Transitions
            if (i < FACTIONS.length - 1) {
                const exit = start + 13;
                tl.to(q(`.portal-${f.id}`), { opacity: 0, scale: 1.1, display: 'none', duration: 2 }, exit);
                tl.to(q(`.hud-${f.id}`), { opacity: 0, display: 'none', duration: 2 }, exit);
                tl.to(q('.bg-world-shift'), { opacity: 0, duration: 2 }, exit);
            }
        });

        // 04. CLIMAX - Seamless drop onto landing
        const climax = 92;
        tl.to(q('.dolly-system'), { x: 0, scale: 1.5, duration: 4 }, climax);
        tl.to(q('.hero-layer'), { scale: 5, filter: 'brightness(50) blur(80px)', rotate: 5, duration: 6, ease: 'power4.in' }, climax + 1);
        tl.to(q('.final-flash-layer'), { opacity: 1, duration: 2 }, climax + 6);
        // Explicit trigger for scroll-through end
        tl.add(() => {
            // This ensures that when the timeline reaches the very end, it triggers the callback
            if (onComplete) onComplete();
        }, 100);

    }, { scope: mainWrapperRef });

    return (
        <div ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden font-body select-none">
            <div ref={mainWrapperRef} className="relative w-full h-full">

                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <img src="/cinema_pic/hero_background.png" className="w-full h-full object-cover grayscale brightness-[0.08]" alt="" />
                    <div className="bg-world-shift absolute inset-0 mix-blend-color opacity-0 transition-opacity duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
                </div>

                <div className="dolly-system relative w-full h-full">

                    <div className="hero-layer absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                        <img
                            src="/cinema_pic/hero_character-removebg.png"
                            className="h-[95vh] object-contain brightness-[1.3] contrast-[1.1] drop-shadow-[0_0_120px_black]"
                            alt="The Prophet"
                        />
                    </div>

                    <div className="stones-layer absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                        {FACTIONS.map((f, i) => (
                            <CrystalStone key={f.id} index={i} color={f.color} />
                        ))}
                    </div>

                    <div className="portals-layer absolute inset-0 z-40 pointer-events-none">
                        {FACTIONS.map((f) => (
                            <div key={f.id} className={`portal-${f.id} absolute inset-0 flex items-center justify-center opacity-0`}>
                                <img src={f.image} className="h-[105vh] object-contain drop-shadow-[0_0_200px_black] brightness-125 transition-all duration-1000" alt={f.title} />
                            </div>
                        ))}
                    </div>

                    <div className="hud-layer absolute inset-0 z-50 pointer-events-none">
                        {FACTIONS.map((f, i) => (
                            <div
                                key={f.id}
                                className={`hud-${f.id} absolute inset-0 flex items-center ${i % 2 === 0 ? 'justify-start pl-[5%]' : 'justify-end pr-[5%]'} opacity-0`}
                            >
                                <div className={`max-w-md bg-black/60 backdrop-blur-2xl border-${i % 2 === 0 ? 'l' : 'r'}-2 p-8 relative`}
                                    style={{ borderColor: f.color }}>

                                    <div className="flex flex-col gap-4">
                                        <span className="text-[10px] font-mono tracking-[0.5em] opacity-40 uppercase" style={{ color: f.color }}>
                                            PROTOCOL // {f.id}
                                        </span>
                                        <h2 className="font-heading text-6xl font-black text-white tracking-tighter uppercase leading-[0.85] filter drop-shadow-xl">
                                            {f.title}
                                        </h2>
                                        <div className="w-10 h-[2px]" style={{ backgroundColor: f.color }} />
                                        <p className="text-xl italic font-light text-white/90">"{f.subtitle}"</p>
                                        <p className="text-sm text-white/40 leading-relaxed font-light">
                                            {f.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="final-flash-layer absolute inset-0 bg-white opacity-0 z-[100] pointer-events-none" />
            </div>

            <style>{`
        .animate-aura-slow { animation: aura-slow 12s infinite linear alternate; }
        .animate-pulse-fast { animation: pulse-fast 2.5s infinite ease-in-out; }
        @keyframes aura-slow { from { transform: scale(1) rotate(0deg); opacity: 0.3; } to { transform: scale(1.5) rotate(180deg); opacity: 0.6; } }
        @keyframes pulse-fast { 0%, 100% { opacity: 0.4; filter: blur(30px); } 50% { opacity: 0.8; filter: blur(45px); } }
      `}</style>
        </div>
    );
};

export default IntroCinema;
