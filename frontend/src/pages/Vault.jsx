import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import UnlockPanel from '../components/Vault/UI/UnlockPanel';
import VaultLoadingScreen from '../components/Vault/UI/VaultLoadingScreen';

// ─── Vault Items: 12 cards, mixed tiers across 3 rows (5-4-3) ───────────────
const buildItems = () => ([
    { id: 'b01', name: 'Bronze Skin 01', tier: 'Bronze', locked: true },
    { id: 'b02', name: 'Bronze Skin 02', tier: 'Bronze', locked: true },
    { id: 'g01', name: 'Gold Skin 01', tier: 'Gold', locked: true },
    { id: 'b03', name: 'Bronze Skin 03', tier: 'Bronze', locked: true },
    { id: 'd01', name: 'Diamond Skin 01', tier: 'Diamond', locked: true },
    // — Row 2 —
    { id: 'b04', name: 'Bronze Skin 04', tier: 'Bronze', locked: true },
    { id: 'g02', name: 'Gold Skin 02', tier: 'Gold', locked: true },
    { id: 'b05', name: 'Bronze Skin 05', tier: 'Bronze', locked: true },
    { id: 'd02', name: 'Diamond Skin 02', tier: 'Diamond', locked: true },
    // — Row 3 —
    { id: 'b06', name: 'Bronze Skin 06', tier: 'Bronze', locked: true },
    { id: 'g03', name: 'Gold Skin 03', tier: 'Gold', locked: true },
    { id: 'd03', name: 'Diamond Skin 03', tier: 'Diamond', locked: true },
]);

// ─── Grid Builder: exactly 3 rows — 5 | 4 | 3 ──────────────────────────────
const buildPyramidRows = (items) => {
    const pattern = [5, 4, 3];
    const rows = [];
    let index = 0;
    for (const size of pattern) {
        if (index >= items.length) break;
        rows.push(items.slice(index, index + size));
        index += size;
    }
    return rows;
};

// ─── Tier Accent ────────────────────────────────────────────────────────────
const tierAccent = (tier) => {
    if (tier === 'Bronze') return '#8a6e45';
    if (tier === 'Gold') return '#d4af37';
    if (tier === 'Diamond') return '#b0e0e6';
    if (tier === 'Endura') return '#7c3aed';
    return '#d4af37';
};

// ─── Animated Credit Counter ─────────────────────────────────────────────────
const CreditCounter = ({ value }) => {
    const [displayed, setDisplayed] = useState(value);
    const prevRef = useRef(value);

    useEffect(() => {
        const start = prevRef.current;
        const end = value;
        if (start === end) return;
        prevRef.current = end;

        const duration = 800;
        const startTime = performance.now();
        const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // ease out
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayed(Math.round(start + (end - start) * eased));
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [value]);

    return <span>{displayed}</span>;
};

// ─── Grid Card ──────────────────────────────────────────────────────────────
const GridCard = ({
    item,
    dimmed,
    hovered,
    onHover,
    onLeave,
    onUnlockClick,
    entranceDelay,
    vaultReady,
    justUnlocked,
}) => {
    const cardRef = useRef(null);
    const flipRef = useRef(null);
    const glowRef = useRef(null);
    const shakeRef = useRef(null);
    const floatTl = useRef(null);
    const accent = tierAccent(item.tier);

    // ── Entrance animation (staggered) ──────────────────────────────────────
    useEffect(() => {
        if (!vaultReady) return;
        gsap.fromTo(
            cardRef.current,
            { opacity: 0, y: 28, scale: 0.94 },
            {
                opacity: 1, y: 0, scale: 1,
                duration: 0.65,
                delay: entranceDelay,
                ease: 'power3.out',
            }
        );
    }, [vaultReady, entranceDelay]);

    // ── Idle float loop ──────────────────────────────────────────────────────
    useEffect(() => {
        if (!vaultReady) return;
        const delay = entranceDelay + 0.65 + Math.random() * 1.2;
        const dur = 3.5 + Math.random() * 1.5;

        floatTl.current = gsap.to(cardRef.current, {
            y: -6,
            duration: dur,
            delay,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
        });

        // Glow pulse loop
        gsap.to(glowRef.current, {
            opacity: item.locked ? 0.08 : 0.2,
            duration: dur * 0.9,
            delay,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
        });

        return () => floatTl.current?.kill();
    }, [vaultReady, entranceDelay, item.locked]);

    // ── Unlock flip animation ────────────────────────────────────────────────
    useEffect(() => {
        if (!item.locked && flipRef.current) {
            // Kill float during flip
            floatTl.current?.kill();
            gsap.to(cardRef.current, { y: 0, scale: 1, duration: 0.2 });

            // Gold glow burst
            gsap.fromTo(
                glowRef.current,
                { opacity: 0, scale: 1 },
                {
                    opacity: 0.9, scale: 1.15, duration: 0.35, ease: 'power2.out',
                    onComplete: () => {
                        gsap.to(glowRef.current, { opacity: 0.25, scale: 1, duration: 0.5, ease: 'power2.in' });
                    }
                }
            );

            // 3D flip
            gsap.to(flipRef.current, {
                rotateY: 180,
                duration: 0.75,
                delay: 0.25,
                ease: 'power3.inOut',
            });
        }
    }, [item.locked]);

    // ── Hover: focus zoom ────────────────────────────────────────────────────
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
        gsap.to(glowRef.current, { opacity: item.locked ? 0.04 : 0.15, duration: 0.35, ease: 'power2.out' });
    }, [item.locked, onLeave]);

    // ── Error shake ──────────────────────────────────────────────────────────
    const triggerShake = useCallback(() => {
        gsap.to(cardRef.current, {
            keyframes: [
                { x: -5, duration: 0.06 },
                { x: 5, duration: 0.06 },
                { x: -4, duration: 0.06 },
                { x: 4, duration: 0.06 },
                { x: -2, duration: 0.06 },
                { x: 0, duration: 0.06 },
            ],
            ease: 'none',
        });
    }, []);

    // Expose shake via ref so parent can call it
    useEffect(() => {
        if (shakeRef) shakeRef.current = triggerShake;
    }, [triggerShake]);

    return (
        <div
            className={`relative w-full aspect-[4/5] bg-black border border-white/10 transition-opacity duration-300 ${dimmed ? 'opacity-40' : 'opacity-100'}`}
            style={{ perspective: '1200px' }}
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
                    className="absolute inset-0 opacity-0 pointer-events-none"
                    style={{ background: accent, filter: 'blur(32px)', borderRadius: '2px' }}
                />

                {/* Flip container */}
                <div
                    ref={flipRef}
                    className="absolute inset-0 transform-gpu"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* ── Front face ── */}
                    <div
                        className="absolute inset-0 bg-[#0a0a0a] border border-white/10"
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        <div className="h-[38%] bg-gradient-to-br from-[#1a1a1a] via-black to-[#0a0a0a] border-b border-white/5" />
                        <div className="h-[42%] flex items-center justify-center">
                            <div className="w-[70%] h-[70%] border border-white/10 bg-gradient-to-br from-black via-[#101010] to-black" />
                        </div>
                        <div className="h-[20%] px-4 py-3 flex items-center justify-between border-t border-white/5">
                            <div className={`text-[11px] font-heading font-black tracking-widest uppercase transition-colors duration-200 ${hovered ? 'text-white' : 'text-white/40'}`}>
                                {item.name}
                            </div>
                            <span className="text-[9px] font-mono tracking-widest uppercase" style={{ color: accent }}>
                                {item.tier}
                            </span>
                        </div>

                        {/* Lock overlay */}
                        {item.locked && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                <Lock className="w-6 h-6 text-white/30" />
                                <button
                                    onClick={() => onUnlockClick(item)}
                                    className="px-6 py-2 border border-white/20 text-[10px] font-mono tracking-widest uppercase text-white/60 hover:text-white hover:border-white/50 transition-colors"
                                >
                                    Tap to Unlock
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ── Back face (unlocked) ── */}
                    <div
                        className="absolute inset-0 bg-black border flex items-center justify-center"
                        style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                            borderColor: `${accent}60`,
                            boxShadow: `0 0 40px ${accent}30`,
                        }}
                    >
                        <div className="text-center space-y-3 px-4">
                            <div className="text-[10px] font-mono tracking-[0.5em] uppercase" style={{ color: accent }}>
                                Unlocked
                            </div>
                            <div className="text-lg font-heading font-black tracking-widest text-white">
                                {item.name}
                            </div>
                            <div className="text-[8px] font-mono text-white/30 tracking-widest uppercase">
                                {item.tier} Tier
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Main Vault Page ─────────────────────────────────────────────────────────
const Vault = () => {
    const pageRef = useRef(null);
    const headingRef = useRef(null);
    const shineRef = useRef(null);
    const navigate = useNavigate();

    const [items, setItems] = useState(buildItems());
    const [selectedItem, setSelectedItem] = useState(null);
    const [hoveredId, setHoveredId] = useState(null);
    const [credits, setCredits] = useState(0);
    const [loadingDone, setLoadingDone] = useState(false);
    const [vaultReady, setVaultReady] = useState(false);
    const [exiting, setExiting] = useState(false);

    // ── After loading screen fades out → reveal vault ────────────────────────
    const handleLoadingComplete = useCallback(() => {
        setLoadingDone(true);

        // Fade in the page
        gsap.fromTo(
            pageRef.current,
            { opacity: 0 },
            {
                opacity: 1, duration: 0.7, ease: 'power2.out',
                onComplete: () => {
                    // Heading shimmer
                    if (headingRef.current) {
                        gsap.fromTo(
                            headingRef.current,
                            { opacity: 0, y: -12 },
                            {
                                opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
                                onComplete: () => {
                                    // Gold shimmer sweep
                                    if (shineRef.current) {
                                        gsap.fromTo(
                                            shineRef.current,
                                            { xPercent: -130, opacity: 0 },
                                            { xPercent: 130, opacity: 0.7, duration: 1.1, ease: 'power2.out' }
                                        );
                                    }
                                    // Trigger card stagger
                                    setVaultReady(true);
                                }
                            }
                        );
                    }
                }
            }
        );
    }, []);

    // ── Navigate to Collected with cinematic exit ────────────────────────────
    const handleGoCollected = useCallback(() => {
        setExiting(true);
        gsap.to(pageRef.current, {
            opacity: 0,
            y: -18,
            duration: 0.55,
            ease: 'power2.inOut',
            onComplete: () => navigate('/collected'),
        });
    }, [navigate]);

    // ── Unlock handler ───────────────────────────────────────────────────────
    const handleUnlock = useCallback((itemId) => {
        setItems(prev => prev.map(item =>
            item.id === itemId ? { ...item, locked: false } : item
        ));
        setCredits(prev => prev + 500);
        setSelectedItem(null);
        toast.success('DECRYPTION SUCCESSFUL', {
            icon: '🏆',
            style: {
                background: '#000',
                color: '#d4af37',
                border: '1px solid #d4af37',
                fontFamily: 'Orbitron',
            }
        });
    }, []);

    const unlockedCount = useMemo(() => items.filter(i => !i.locked).length, [items]);
    const vaultRows = useMemo(() => buildPyramidRows(items), [items]);

    // Flat index for stagger delay calculation
    const flatIndex = useMemo(() => {
        const map = {};
        let idx = 0;
        vaultRows.forEach(row => row.forEach(item => { map[item.id] = idx++; }));
        return map;
    }, [vaultRows]);

    return (
        <>
            {/* ── Loading Screen Gate ── */}
            <AnimatePresence>
                {!loadingDone && (
                    <VaultLoadingScreen onComplete={handleLoadingComplete} />
                )}
            </AnimatePresence>

            {/* ── Vault Page ── */}
            <div
                ref={pageRef}
                className="min-h-screen bg-black text-white font-body selection:bg-accent/30"
                style={{ opacity: 0 }}
            >
                <Toaster position="top-right" />

                {/* Ambient background glow */}
                <div
                    className="fixed inset-0 pointer-events-none"
                    style={{
                        background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(124,58,237,0.06) 0%, transparent 70%)',
                        zIndex: 0,
                    }}
                />

                {/* Header */}
                <header className="relative z-10 pt-12 pb-8">
                    <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
                        {/* Left spacer */}
                        <div className="min-w-[160px]" />

                        {/* Title */}
                        <div className="flex-1 text-center">
                            <h1
                                ref={headingRef}
                                className="relative inline-block text-4xl md:text-6xl font-heading font-black tracking-[0.2em] text-white"
                                style={{ opacity: 0 }}
                            >
                                <span className="relative z-10">THE ENDURA VAULT</span>
                                <span
                                    ref={shineRef}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-0 pointer-events-none"
                                    style={{ mixBlendMode: 'screen' }}
                                />
                            </h1>
                            <div className="mt-6 flex items-center justify-center gap-10 text-[10px] font-mono tracking-widest uppercase text-white/40">
                                <span>
                                    <CreditCounter value={credits} /> Credits
                                </span>
                                <span>{unlockedCount} Unlocked</span>
                            </div>
                        </div>

                        {/* Collected Items button */}
                        <div className="min-w-[160px] flex justify-end">
                            <button
                                onClick={handleGoCollected}
                                disabled={exiting}
                                className="px-5 py-2.5 border border-white/20 text-[10px] font-mono tracking-widest uppercase text-white/60 hover:text-white hover:border-white/50 transition-colors"
                            >
                                Collected Items
                            </button>
                        </div>
                    </div>
                </header>

                {/* Vault Grid */}
                <div className="relative z-10 max-w-[1400px] mx-auto px-6 pb-24">
                    <div className="flex flex-col gap-8 md:gap-10">
                        {vaultRows.map((row, rowIndex) => (
                            <div
                                key={`row-${rowIndex}`}
                                className="flex items-center justify-center gap-6 md:gap-8"
                            >
                                {row.map((item) => (
                                    <div key={item.id} className="w-40 sm:w-44 md:w-48 lg:w-52 xl:w-56">
                                        <GridCard
                                            item={item}
                                            hovered={hoveredId === item.id}
                                            dimmed={hoveredId && hoveredId !== item.id}
                                            onHover={setHoveredId}
                                            onLeave={() => setHoveredId(null)}
                                            onUnlockClick={(target) => target.locked && setSelectedItem(target)}
                                            entranceDelay={flatIndex[item.id] * 0.09}
                                            vaultReady={vaultReady}
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Unlock Modal */}
                <AnimatePresence>
                    {selectedItem && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-8"
                        >
                            <UnlockPanel
                                item={selectedItem}
                                onUnlock={handleUnlock}
                                onClose={() => setSelectedItem(null)}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default Vault;
