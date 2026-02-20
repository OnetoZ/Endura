import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import UnlockPanel from '../components/Vault/UI/UnlockPanel';
import VaultLoadingScreen from '../components/Vault/UI/VaultLoadingScreen';
import CollectionHero from '../components/collections/CollectionHero';

// ─── Vault Items: 12 cards, mixed tiers across 3 rows (5-4-3) ───────────────
const buildItems = () => ([
    // — Row 1 —
    { id: 1, name: 'Shadow Cargo', tier: 'Bronze', status: 'locked', unlockCode: 'ENDURA-9021', image: 'https://images.unsplash.com/photo-1517441551224-cca4246835be' },
    { id: 2, name: 'Aureum Bomber', tier: 'Gold', status: 'locked', unlockCode: '4500', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772' },
    { id: 3, name: 'Lunar Walkers', tier: 'Diamond', status: 'locked', unlockCode: 'LUNA-7777', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff' },
    { id: 4, name: 'Vesper Shirt', tier: 'Bronze', status: 'locked', unlockCode: 'OBS-1108', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab' },
    { id: 5, name: 'Royal Tunic', tier: 'Gold', status: 'locked', unlockCode: '4500', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b' },
    // — Row 2 —
    { id: 6, name: 'Starforged Cape', tier: 'Diamond', status: 'locked', unlockCode: 'ENDURA-9021', image: 'https://images.unsplash.com/photo-1605733513597-a8f8d410fe3c' },
    { id: 7, name: 'Obsidian Jacket', tier: 'Gold', status: 'locked', unlockCode: '4500', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5' },
    { id: 8, name: 'Phantom Hoodie', tier: 'Bronze', status: 'locked', unlockCode: 'LUNA-7777', image: 'https://images.unsplash.com/photo-1556314844-31952086e108' },
    { id: 9, name: 'Diamond Flux Coat', tier: 'Diamond', status: 'locked', unlockCode: 'OBS-1108', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea' },
    // — Row 3 —
    { id: 10, name: 'Noir Tactical Vest', tier: 'Bronze', status: 'locked', unlockCode: 'DIAMOND-9999', image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17' },
    { id: 11, name: 'Solar Edge Jacket', tier: 'Gold', status: 'locked', unlockCode: '4500', image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3' },
    { id: 12, name: 'Apex Crystal Coat', tier: 'Diamond', status: 'locked', unlockCode: 'DIAMOND-9999', image: 'https://images.unsplash.com/photo-1520975954732-35dd22299614' },
]);

// ─── LocalStorage Functions ─────────────────────────────────────────────────────
const getUnlockedItems = () => {
    const stored = localStorage.getItem('enduraUnlocked');
    return stored ? JSON.parse(stored) : [];
};

const saveUnlockedItem = (itemId) => {
    const unlocked = getUnlockedItems();
    if (!unlocked.includes(itemId)) {
        unlocked.push(itemId);
        localStorage.setItem('enduraUnlocked', JSON.stringify(unlocked));
    }
};

const isAuthenticated = () => {
    return localStorage.getItem('enduraUser') === 'authenticated';
};

// ─── Hero Images for Collection Animation ───────────────────────────────────
const vaultHeroImages = [
    '/cart page/cartimg1.png',
    '/cart page/cartimg2.png',
    '/cart page/cartimg3.png',
    '/cart page/cartimg4.png',
    '/cart page/img1.png',
    '/cart page/img2.png'
];

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
}) => {
    const cardRef = useRef(null);
    const glowRef = useRef(null);
    const floatTl = useRef(null);
    const accent = tierAccent(item.tier);
    const isLocked = item.status === 'locked';

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
            opacity: isLocked ? 0.08 : 0.2,
            duration: dur * 0.9,
            delay,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
        });

        return () => floatTl.current?.kill();
    }, [vaultReady, entranceDelay, isLocked]);

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
        gsap.to(glowRef.current, { opacity: isLocked ? 0.04 : 0.15, duration: 0.35, ease: 'power2.out' });
    }, [isLocked, onLeave]);

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

    return (
        <div
            className={`relative w-[280px] h-[380px] bg-black border border-white/10 transition-all duration-300 overflow-hidden ${dimmed ? 'opacity-40' : 'opacity-100'} ${hovered ? 'border-accent/60 shadow-[0_0_30px_rgba(212,175,55,0.3)]' : ''}`}
            style={{ perspective: '1200px' }}
        >
            <div
                ref={cardRef}
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
                className="absolute inset-0"
                style={{ opacity: 0 }}
            >
                {/* Tier glow - contained within card */}
                <div
                    ref={glowRef}
                    className="absolute inset-0 opacity-0 pointer-events-none"
                    style={{ background: accent, filter: 'blur(32px)' }}
                />

                {/* Card content */}
                <div className="absolute inset-0 bg-black">
                    {/* Product Image */}
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <img
                            src={item.image + '?auto=format&fit=crop&q=80&w=800'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            style={{
                                filter: isLocked ? 'blur(8px)' : 'none',
                                opacity: isLocked ? 0.6 : 1,
                                transform: isLocked ? 'scale(1.05)' : 'scale(1)'
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    </div>

                    {/* Content Overlay */}
                    <div className="relative z-10 h-full flex flex-col">
                        {/* Top area - empty for image visibility */}
                        <div className="h-[40%]" />
                        
                        {/* Center - Lock icon/button or Unlocked badge */}
                        <div className="h-[30%] flex flex-col items-center justify-center gap-4">
                            {isLocked ? (
                                <>
                                    <Lock className="w-8 h-8 text-white/40" />
                                    <button
                                        onClick={() => onUnlockClick(item)}
                                        className="px-6 py-2 border border-white/20 text-[10px] font-mono tracking-widest uppercase text-white/60 hover:text-white hover:border-white/50 transition-colors"
                                    >
                                        TAP TO UNLOCK
                                    </button>
                                </>
                            ) : (
                                <div className="text-center">
                                    <div className="text-lg font-heading font-black tracking-widest text-white mb-2">UNLOCKED</div>
                                    <div className="text-[9px] font-mono text-white/60 tracking-widest uppercase">{item.tier} TIER</div>
                                </div>
                            )}
                        </div>
                        
                        {/* Bottom - Item name and tier */}
                        <div className="h-[30%] px-4 py-3 flex items-center justify-between border-t border-white/10">
                            <div className={`text-[11px] font-heading font-black tracking-widest uppercase transition-colors duration-200 ${hovered ? 'text-white' : 'text-white/40'}`}>
                                {item.name}
                            </div>
                            <span className="text-[9px] font-mono tracking-widest uppercase" style={{ color: accent }}>
                                {item.tier}
                            </span>
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
    const [unlockCode, setUnlockCode] = useState('');
    const [showUnlockModal, setShowUnlockModal] = useState(false);

    // ── Load unlocked items from localStorage ───────────────────────────────────
    useEffect(() => {
        const unlockedIds = getUnlockedItems();
        setItems(prevItems => 
            prevItems.map(item => ({
                ...item,
                status: unlockedIds.includes(item.id) ? 'unlocked' : 'locked'
            }))
        );
    }, []);

    // ── Handle unlock click ─────────────────────────────────────────────────────
    const handleUnlockClick = useCallback((item) => {
        if (item.status === 'locked') {
            setSelectedItem(item);
            setShowUnlockModal(true);
            setUnlockCode('');
        }
    }, []);

    // ── Verify unlock code ─────────────────────────────────────────────────────
    const handleVerifyCode = useCallback(() => {
        if (!selectedItem || !unlockCode.trim()) return;

        if (unlockCode.trim() === selectedItem.unlockCode) {
            // Unlock successful
            saveUnlockedItem(selectedItem.id);
            setItems(prevItems => 
                prevItems.map(item => 
                    item.id === selectedItem.id 
                        ? { ...item, status: 'unlocked' }
                        : item
                )
            );
            setShowUnlockModal(false);
            setSelectedItem(null);
            setUnlockCode('');
            toast.success('ITEM UNLOCKED');
        } else {
            // Invalid code
            toast.error('INVALID ACCESS CODE');
            // Shake the modal
            const modal = document.getElementById('unlock-modal');
            if (modal) {
                gsap.to(modal, {
                    keyframes: [
                        { x: -10, duration: 0.06 },
                        { x: 10, duration: 0.06 },
                        { x: -8, duration: 0.06 },
                        { x: 8, duration: 0.06 },
                        { x: -4, duration: 0.06 },
                        { x: 0, duration: 0.06 },
                    ],
                    ease: 'none',
                });
            }
        }
    }, [selectedItem, unlockCode]);

    // ── Close modal ─────────────────────────────────────────────────────────────
    const closeModal = useCallback(() => {
        setShowUnlockModal(false);
        setSelectedItem(null);
        setUnlockCode('');
    }, []);

    // ── Handle loading complete ─────────────────────────────────────────────────
    const handleLoadingComplete = useCallback(() => {
        setLoadingDone(true);

        // Fade in the page and heading concurrently
        const tl = gsap.timeline();

        tl.fromTo(pageRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.5, ease: 'power2.out' }
        );

        tl.fromTo(headingRef.current,
            { opacity: 0, y: -10 },
            {
                opacity: 1, y: 0, duration: 0.5, ease: 'power2.out',
                onComplete: () => {
                    // Gold shimmer sweep
                    if (shineRef.current) {
                        gsap.fromTo(
                            shineRef.current,
                            { xPercent: -130, opacity: 0 },
                            { xPercent: 130, opacity: 0.7, duration: 0.8, ease: 'power2.out' }
                        );
                    }
                    // Trigger card stagger
                    setVaultReady(true);
                }
            },
            "-=0.3" // overlap with page fade
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

            {/* ── Collection Animation Section ── */}
            {loadingDone && (
                <CollectionHero images={vaultHeroImages} />
            )}

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
                    <div className="flex flex-col gap-8">
                        {/* Row 1 - 5 columns */}
                        <div className="grid" style={{ gridTemplateColumns: 'repeat(5, 280px)', gap: '2rem', justifyContent: 'center' }}>
                            {vaultRows[0]?.map((item) => (
                                <GridCard
                                    key={item.id}
                                    item={item}
                                    hovered={hoveredId === item.id}
                                    dimmed={hoveredId && hoveredId !== item.id}
                                    onHover={setHoveredId}
                                    onLeave={() => setHoveredId(null)}
                                    onUnlockClick={handleUnlockClick}
                                    entranceDelay={flatIndex[item.id] * 0.06}
                                    vaultReady={vaultReady}
                                />
                            ))}
                        </div>

                        {/* Row 2 - 4 columns */}
                        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 280px)', gap: '2rem', justifyContent: 'center' }}>
                            {vaultRows[1]?.map((item) => (
                                <GridCard
                                    key={item.id}
                                    item={item}
                                    hovered={hoveredId === item.id}
                                    dimmed={hoveredId && hoveredId !== item.id}
                                    onHover={setHoveredId}
                                    onLeave={() => setHoveredId(null)}
                                    onUnlockClick={handleUnlockClick}
                                    entranceDelay={flatIndex[item.id] * 0.06}
                                    vaultReady={vaultReady}
                                />
                            ))}
                        </div>

                        {/* Row 3 - 3 columns */}
                        <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 280px)', gap: '2rem', justifyContent: 'center' }}>
                            {vaultRows[2]?.map((item) => (
                                <GridCard
                                    key={item.id}
                                    item={item}
                                    hovered={hoveredId === item.id}
                                    dimmed={hoveredId && hoveredId !== item.id}
                                    onHover={setHoveredId}
                                    onLeave={() => setHoveredId(null)}
                                    onUnlockClick={handleUnlockClick}
                                    entranceDelay={flatIndex[item.id] * 0.06}
                                    vaultReady={vaultReady}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Unlock Modal */}
                <AnimatePresence>
                    {showUnlockModal && selectedItem && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                            onClick={closeModal}
                        >
                            <motion.div
                                id="unlock-modal"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ type: 'spring', damping: 20 }}
                                className="relative w-full max-w-md mx-4 glass border border-white/20 p-8"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Close button */}
                                <button
                                    onClick={closeModal}
                                    className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                {/* Modal content */}
                                <div className="text-center space-y-6">
                                    <h2 className="text-xl font-heading font-black tracking-widest text-white uppercase">
                                        ENTER ACCESS CODE
                                    </h2>
                                    
                                    <div className="space-y-4">
                                        <div className="text-sm text-white/60 font-mono">
                                            Item: {selectedItem.name}
                                        </div>
                                        
                                        <input
                                            type="text"
                                            value={unlockCode}
                                            onChange={(e) => setUnlockCode(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleVerifyCode()}
                                            placeholder="Enter access code"
                                            className="w-full px-4 py-3 bg-black/60 border border-white/20 text-white placeholder-white/40 font-mono text-sm focus:outline-none focus:border-accent/50 transition-colors"
                                            autoFocus
                                        />
                                    </div>
                                    
                                    <div className="flex gap-4">
                                        <button
                                            onClick={handleVerifyCode}
                                            className="flex-1 px-6 py-3 bg-accent text-black font-mono text-sm font-black tracking-widest uppercase hover:bg-accent/90 transition-colors"
                                        >
                                            Verify
                                        </button>
                                        <button
                                            onClick={closeModal}
                                            className="flex-1 px-6 py-3 border border-white/20 text-white font-mono text-sm tracking-widest uppercase hover:border-white/50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default Vault;
