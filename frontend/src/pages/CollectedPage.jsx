import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { X, Calendar, Layers, FileText } from 'lucide-react';

// ─── Dummy Collected Items ──────────────────────────────────────────────────
const COLLECTED_ITEMS = [
    {
        id: 'col-1',
        name: 'Obsidian Jacket',
        tier: 'Gold',
        description: 'Tactical midnight streetwear piece.',
        unlockedAt: 'Feb 10, 2026',
        image: null,
    },
    {
        id: 'col-2',
        name: 'Phantom Hoodie',
        tier: 'Bronze',
        description: 'Lightweight stealth urban hoodie.',
        unlockedAt: 'Feb 12, 2026',
        image: null,
    },
    {
        id: 'col-3',
        name: 'Diamond Flux Coat',
        tier: 'Diamond',
        description: 'High-tier reflective digital coat.',
        unlockedAt: 'Feb 14, 2026',
        image: null,
    },
    {
        id: 'col-4',
        name: 'Void Runner Vest',
        tier: 'Gold',
        description: 'Aerodynamic urban combat vest.',
        unlockedAt: 'Feb 15, 2026',
        image: null,
    },
    {
        id: 'col-5',
        name: 'Eclipse Joggers',
        tier: 'Bronze',
        description: 'Matte-finish tactical jogger pants.',
        unlockedAt: 'Feb 16, 2026',
        image: null,
    },
    {
        id: 'col-6',
        name: 'Prism Trench',
        tier: 'Diamond',
        description: 'Iridescent long-form trench coat.',
        unlockedAt: 'Feb 17, 2026',
        image: null,
    },
    {
        id: 'col-7',
        name: 'Carbon Shell Tee',
        tier: 'Bronze',
        description: 'Minimalist carbon-weave base layer.',
        unlockedAt: 'Feb 18, 2026',
        image: null,
    },
    {
        id: 'col-8',
        name: 'Aurum Strike Jacket',
        tier: 'Gold',
        description: 'Gold-threaded combat jacket, limited run.',
        unlockedAt: 'Feb 18, 2026',
        image: null,
    },
];

// ─── Tier Accent Colors ─────────────────────────────────────────────────────
const tierAccent = (tier) => {
    if (tier === 'Bronze') return '#8a6e45';
    if (tier === 'Gold') return '#d4af37';
    if (tier === 'Diamond') return '#b0e0e6';
    if (tier === 'Endura') return '#7c3aed';
    return '#d4af37';
};

// ─── Build 5-4-3 Pyramid Rows ───────────────────────────────────────────────
const buildPyramidRows = (items) => {
    const pattern = [5, 4, 3];
    const rows = [];
    let index = 0;
    while (index < items.length) {
        for (const size of pattern) {
            if (index >= items.length) break;
            rows.push(items.slice(index, index + size));
            index += size;
        }
    }
    return rows;
};

// ─── Collected Card ─────────────────────────────────────────────────────────
const CollectedCard = ({ item, dimmed, hovered, onHover, onLeave, onClick, entranceDelay, cardsReady }) => {
    const cardRef = useRef(null);
    const glowRef = useRef(null);
    const floatTl = useRef(null);
    const accent = tierAccent(item.tier);

    // ── Staggered entrance ───────────────────────────────────────────────────
    useEffect(() => {
        if (!cardsReady) return;
        gsap.fromTo(
            cardRef.current,
            { opacity: 0, y: 24, scale: 0.95 },
            {
                opacity: 1, y: 0, scale: 1,
                duration: 0.6,
                delay: entranceDelay,
                ease: 'power3.out',
            }
        );
    }, [cardsReady, entranceDelay]);

    // ── Idle float ───────────────────────────────────────────────────────────
    useEffect(() => {
        if (!cardsReady) return;
        const delay = entranceDelay + 0.6 + Math.random() * 1.0;
        const dur = 3.5 + Math.random() * 1.5;

        floatTl.current = gsap.to(cardRef.current, {
            y: -5,
            duration: dur,
            delay,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
        });

        gsap.to(glowRef.current, {
            opacity: 0.18,
            duration: dur * 0.9,
            delay,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
        });

        return () => floatTl.current?.kill();
    }, [cardsReady, entranceDelay]);

    const handleEnter = useCallback(() => {
        onHover(item.id);
        floatTl.current?.pause();
        gsap.to(cardRef.current, { y: -10, scale: 1.035, duration: 0.3, ease: 'power2.out' });
        gsap.to(glowRef.current, { opacity: 0.45, duration: 0.3, ease: 'power2.out' });
    }, [item.id, onHover]);

    const handleLeave = useCallback(() => {
        onLeave();
        floatTl.current?.resume();
        gsap.to(cardRef.current, { y: 0, scale: 1, duration: 0.35, ease: 'power2.out' });
        gsap.to(glowRef.current, { opacity: 0.12, duration: 0.35, ease: 'power2.out' });
    }, [onLeave]);

    return (
        <div
            className={`relative w-full aspect-[4/5] bg-black border border-white/10 cursor-pointer transition-opacity duration-300 ${dimmed ? 'opacity-40' : 'opacity-100'}`}
            onClick={() => onClick(item)}
        >
            <div
                ref={cardRef}
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
                className="absolute inset-0"
                style={{ opacity: 0 }}
            >
                {/* Tier glow */}
                <div
                    ref={glowRef}
                    className="absolute inset-0 opacity-[0.12] pointer-events-none"
                    style={{ background: accent, filter: 'blur(28px)' }}
                />

                {/* Card face */}
                <div className="absolute inset-0 bg-[#0a0a0a] border border-white/10 flex flex-col">
                    {/* Image area */}
                    <div
                        className="flex-1 border-b border-white/5 relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #111 0%, #0a0a0a 50%, #111 100%)' }}
                    >
                        {/* Tier accent line */}
                        <div
                            className="absolute top-0 left-0 right-0 h-[2px]"
                            style={{ background: accent, opacity: 0.7 }}
                        />
                        {/* Decorative inner box */}
                        <div className="absolute inset-4 border border-white/5 flex items-center justify-center">
                            <div
                                className="w-12 h-12 border border-white/10"
                                style={{ boxShadow: `0 0 20px ${accent}40` }}
                            />
                        </div>
                        {/* Unlocked badge */}
                        <div
                            className="absolute top-3 right-3 px-2 py-1 text-[8px] font-mono tracking-widest uppercase"
                            style={{ color: accent, border: `1px solid ${accent}60` }}
                        >
                            Unlocked
                        </div>
                    </div>

                    {/* Info area */}
                    <div className="px-3 py-3 space-y-1">
                        <div
                            className={`text-[10px] font-heading font-black tracking-widest uppercase truncate transition-colors ${hovered ? 'text-white' : 'text-white/60'}`}
                        >
                            {item.name}
                        </div>
                        <div className="text-[9px] font-mono text-white/30 truncate leading-tight">
                            {item.description}
                        </div>
                        <div className="flex items-center justify-between pt-1">
                            <span className="text-[8px] font-mono tracking-widest uppercase" style={{ color: accent }}>
                                {item.tier}
                            </span>
                            <span className="text-[8px] font-mono text-white/20">{item.unlockedAt}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Detail Modal ───────────────────────────────────────────────────────────
const DetailModal = ({ item, onClose }) => {
    const accent = tierAccent(item.tier);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-2xl flex items-center justify-center p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 20 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative w-full max-w-2xl bg-black border border-white/10 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Tier accent top bar */}
                <div className="h-[2px] w-full" style={{ background: accent }} />

                {/* Glow */}
                <div
                    className="absolute top-0 right-0 w-72 h-72 opacity-10 pointer-events-none"
                    style={{ background: accent, filter: 'blur(80px)' }}
                />

                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 text-white/20 hover:text-white transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col md:flex-row gap-0">
                    {/* Image panel */}
                    <div
                        className="w-full md:w-56 aspect-[4/5] md:aspect-auto md:min-h-[340px] relative border-b md:border-b-0 md:border-r border-white/10 flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #111 0%, #0a0a0a 60%, #111 100%)' }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div
                                className="w-20 h-20 border border-white/10"
                                style={{ boxShadow: `0 0 40px ${accent}50` }}
                            />
                        </div>
                        <div
                            className="absolute bottom-0 left-0 right-0 h-1/3"
                            style={{ background: 'linear-gradient(to top, #000, transparent)' }}
                        />
                        <div
                            className="absolute top-4 left-4 px-2 py-1 text-[8px] font-mono tracking-widest uppercase"
                            style={{ color: accent, border: `1px solid ${accent}60` }}
                        >
                            Unlocked
                        </div>
                    </div>

                    {/* Info panel */}
                    <div className="flex-1 p-8 space-y-6">
                        <div className="space-y-1">
                            <span
                                className="text-[9px] font-mono tracking-[0.5em] uppercase"
                                style={{ color: accent }}
                            >
                                Archive Entry
                            </span>
                            <h2 className="text-2xl md:text-3xl font-heading font-black tracking-widest text-white uppercase">
                                {item.name}
                            </h2>
                        </div>

                        <div className="space-y-4 border-t border-white/5 pt-6">
                            <div className="flex items-start gap-3">
                                <FileText className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" />
                                <div>
                                    <div className="text-[9px] font-mono text-white/30 tracking-widest uppercase mb-1">Description</div>
                                    <div className="text-sm font-body text-white/70 leading-relaxed">{item.description}</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Calendar className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" />
                                <div>
                                    <div className="text-[9px] font-mono text-white/30 tracking-widest uppercase mb-1">Unlock Date</div>
                                    <div className="text-sm font-mono text-white/70">{item.unlockedAt}</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Layers className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" />
                                <div>
                                    <div className="text-[9px] font-mono text-white/30 tracking-widest uppercase mb-1">Tier</div>
                                    <div
                                        className="text-sm font-mono tracking-widest uppercase font-bold"
                                        style={{ color: accent }}
                                    >
                                        {item.tier}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <span className="text-[8px] font-mono text-white/20 tracking-[0.3em] uppercase">
                                Archive_Ref: {item.id}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─── Main Page ──────────────────────────────────────────────────────────────
const CollectedPage = () => {
    const pageRef = useRef(null);
    const headingRef = useRef(null);
    const shineRef = useRef(null);
    const navigate = useNavigate();

    const [hoveredId, setHoveredId] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [cardsReady, setCardsReady] = useState(false);
    const [exiting, setExiting] = useState(false);

    const rows = useMemo(() => buildPyramidRows(COLLECTED_ITEMS), []);

    // Flat index for stagger delay
    const flatIndex = useMemo(() => {
        const map = {};
        let idx = 0;
        rows.forEach(row => row.forEach(item => { map[item.id] = idx++; }));
        return map;
    }, [rows]);

    // ── Cinematic crossfade entrance ─────────────────────────────────────────
    useEffect(() => {
        const tl = gsap.timeline();

        // Page fades in with slight upward motion
        tl.fromTo(
            pageRef.current,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }
        );

        // Heading fades in
        tl.fromTo(
            headingRef.current,
            { opacity: 0, y: -10 },
            { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' },
            0.3
        );

        // Gold shimmer sweep
        tl.fromTo(
            shineRef.current,
            { xPercent: -130, opacity: 0 },
            { xPercent: 130, opacity: 0.65, duration: 1.1, ease: 'power2.out' },
            0.7
        );

        // Trigger card stagger
        tl.call(() => setCardsReady(true), [], 0.85);

        return () => tl.kill();
    }, []);

    // ── Back to vault with cinematic exit ────────────────────────────────────
    const handleBackToVault = useCallback(() => {
        setExiting(true);
        gsap.to(pageRef.current, {
            opacity: 0,
            y: 18,
            duration: 0.5,
            ease: 'power2.inOut',
            onComplete: () => navigate('/vault'),
        });
    }, [navigate]);

    return (
        <div
            ref={pageRef}
            className="min-h-screen bg-black text-white font-body selection:bg-accent/30"
            style={{ opacity: 0 }}
        >
            {/* Ambient background glow */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(212,175,55,0.04) 0%, transparent 70%)',
                    zIndex: 0,
                }}
            />

            {/* Header */}
            <header className="relative z-10 pt-12 pb-8">
                <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
                    {/* Back to Vault */}
                    <div className="min-w-[120px]">
                        <button
                            onClick={handleBackToVault}
                            disabled={exiting}
                            className="px-4 py-2 border border-white/20 text-[10px] font-mono tracking-widest uppercase text-white/60 hover:text-white hover:border-white/50 transition-colors"
                        >
                            ← Vault
                        </button>
                    </div>

                    {/* Title */}
                    <div className="flex-1 text-center">
                        <h1
                            ref={headingRef}
                            className="relative inline-block text-4xl md:text-6xl font-heading font-black tracking-[0.2em] text-white"
                            style={{ opacity: 0 }}
                        >
                            <span className="relative z-10">COLLECTED ARCHIVE</span>
                            <span
                                ref={shineRef}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 pointer-events-none"
                                style={{ mixBlendMode: 'screen' }}
                            />
                        </h1>
                        <div className="mt-4 text-[10px] font-mono tracking-widest uppercase text-white/30">
                            {COLLECTED_ITEMS.length} Items Unlocked
                        </div>
                    </div>

                    {/* Spacer */}
                    <div className="min-w-[120px]" />
                </div>
            </header>

            {/* Grid */}
            <div className="relative z-10 max-w-[1400px] mx-auto px-6 pb-24">
                <div className="flex flex-col gap-8 md:gap-10">
                    {rows.map((row, rowIndex) => (
                        <div
                            key={`row-${rowIndex}`}
                            className="flex items-center justify-center gap-6 md:gap-8"
                        >
                            {row.map((item) => (
                                <div key={item.id} className="w-40 sm:w-44 md:w-48 lg:w-52 xl:w-56">
                                    <CollectedCard
                                        item={item}
                                        hovered={hoveredId === item.id}
                                        dimmed={hoveredId && hoveredId !== item.id}
                                        onHover={setHoveredId}
                                        onLeave={() => setHoveredId(null)}
                                        onClick={setSelectedItem}
                                        entranceDelay={flatIndex[item.id] * 0.09}
                                        cardsReady={cardsReady}
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default CollectedPage;
