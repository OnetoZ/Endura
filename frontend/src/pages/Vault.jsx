import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import { useStore } from '../context/StoreContext';
import { productService } from '../services/api';
import VaultLoadingScreen from '../components/Vault/UI/VaultLoadingScreen';
import CollectionHero from '../components/collections/CollectionHero';
import '../components/collections/collections.css';

// ─── Tier Accent ────────────────────────────────────────────────────────────
const tierAccent = (tier) => {
    const t = tier ? tier.toLowerCase() : '';
    if (t === 'common') return '#c0c0c0'; // Silver
    if (t === 'rare') return '#3b82f6';   // Blue / Diamond
    if (t === 'epic') return '#d4af37';   // Gold
    if (t === 'legendary') return '#a855f7'; // Purple
    return '#c0c0c0';
};

// ─── Coin Burst Animation ──────────────────────────────────────────────────
const CoinBurst = ({ x, y, onComplete }) => {
    const coins = useMemo(() => Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        angle: (i / 8) * Math.PI * 2,
        dist: 40 + Math.random() * 40
    })), []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[100]">
            {coins.map(coin => (
                <motion.div
                    key={coin.id}
                    initial={{ x, y, opacity: 1, scale: 1 }}
                    animate={{
                        x: x + Math.cos(coin.angle) * coin.dist,
                        y: y + Math.sin(coin.angle) * coin.dist - 50,
                        opacity: 0,
                        scale: 0.5,
                        rotate: 360
                    }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    onAnimationComplete={coin.id === 0 ? onComplete : undefined}
                    className="absolute w-4 h-4 rounded-full bg-[#d4af37] border border-black/20 flex items-center justify-center font-black text-[8px] text-black shadow-[0_0_10px_rgba(212,175,55,0.6)]"
                >
                    $
                </motion.div>
            ))}
        </div>
    );
};

const AnimatedDragon = ({ tier, isHovered }) => {
    const imageUrl = "https://i.pinimg.com/736x/4b/73/26/4b732678c000facb5f1bcf0cec096b1e.jpg";

    const getFilter = (tier) => {
        const base = 'contrast(1.2) brightness(1.1) saturate(1.1)';
        const t = tier ? tier.toLowerCase() : '';
        switch (t) {
            case 'common':
                return `${base} grayscale(1) brightness(1.5)`; // Silver
            case 'rare':
                return `${base} hue-rotate(180deg) saturate(1.8) brightness(1.2)`; // Diamond Blue
            case 'legendary':
                return `${base} hue-rotate(270deg) saturate(2) brightness(1.1)`; // Purple
            case 'epic':
            default:
                return `${base} sepia(1) saturate(1.3) brightness(1.2) hue-rotate(-20deg)`; // Gold
        }
    };

    return (
        <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <img
                src={imageUrl}
                alt="Imperial Dragon"
                className="w-full h-full object-cover transition-all duration-1000"
                style={{
                    filter: getFilter(tier),
                    opacity: isHovered ? 1 : 0.8
                }}
            />

            {/* Tier-based Edge Glow */}
            <motion.div
                className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                style={{
                    boxShadow: `inset 0 0 100px 20px ${tierAccent(tier)}33`,
                    background: `radial-gradient(circle at center, transparent 30%, ${tierAccent(tier)}11 100%)`
                }}
            />
        </motion.div>
    );
};

// ─── Collectible Vault Card (Flip Feature) ───────────────────────────────────
const VaultCard = ({
    item,
    isUnlocked,
    onUnlockRequest,
    vaultReady
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const accent = tierAccent(item.tier);

    return (
        <div
            className="relative w-full h-[350px] [perspective:1000px] group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                className="relative w-full h-full duration-700 [transform-style:preserve-3d]"
                animate={{ rotateY: isUnlocked ? 180 : 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
            >
                {/* Front Side: Pure Image Card */}
                <div
                    className="absolute inset-0 w-full h-full [backface-visibility:hidden] flex flex-col items-center justify-center overflow-hidden rounded-xl bg-black"
                >
                    {/* The Dragon Artwork Card Face */}
                    <AnimatedDragon tier={item.tier} isHovered={isHovered} />

                    {/* Scan Animation Overlays */}
                    <AnimatePresence>
                        {isHovered && !isUnlocked && (
                            <>
                                {/* Vertical Scan Beam */}
                                <motion.div
                                    initial={{ top: '-10%' }}
                                    animate={{ top: '110%' }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-x-0 h-[80px] z-20 pointer-events-none opacity-40"
                                    style={{
                                        background: `linear-gradient(to bottom, transparent, ${accent}, transparent)`,
                                        boxShadow: `0 0 30px ${accent}`
                                    }}
                                />

                                {/* Interactive UI Overlay */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-30 flex flex-col items-center justify-between py-12 px-8 pointer-events-none"
                                >
                                    <div className="text-center">
                                        <p className="text-[10px] font-mono tracking-[0.6em] text-white/60 mb-1">{item.name.toUpperCase()}</p>
                                        <div className="h-[1px] w-12 bg-white/20 mx-auto" />
                                    </div>

                                    <div className="bg-black/60 backdrop-blur-md px-6 py-3 border border-white/10 flex flex-col items-center gap-1">
                                        <p className="text-[12px] font-heading font-black tracking-[0.4em] text-[#d4af37]">TAP TO UNLOCK</p>
                                        <p className="text-[8px] font-mono tracking-[0.2em] text-white/40">{item.tier.toUpperCase()} ARCHIVE</p>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    {/* Hidden but functional interaction button */}
                    {!isUnlocked && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onUnlockRequest(item, e); }}
                            className="absolute inset-0 z-40 w-full h-full opacity-0 highlight-none"
                            aria-label="Unlock Card"
                        />
                    )}
                </div>

                {/* Back Side: The Floating Product */}
                <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden rounded-xl">
                    <DressItem item={item} vaultReady={vaultReady} />
                </div>
            </motion.div>
        </div>
    );
};

// ─── Dress Item (floating, reflect, hover corners) ─────────────────────────
const DressItem = ({
    item,
    vaultReady
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const accent = tierAccent(item.tier);

    return (
        <div
            className="relative w-full h-full bg-black overflow-hidden group/dress rounded-xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >


            {/* Central Content */}
            <div className="relative h-full flex flex-col items-center justify-center p-8">
                {/* Always Floating Dress Artwork */}
                <motion.div
                    className="relative z-10"
                    animate={vaultReady ? {
                        y: [-8, 8, -8],
                    } : {}}
                    transition={{
                        y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                    }}
                >
                    <img
                        src={item.image}
                        alt={item.name}
                        className="h-44 object-contain transition-transform duration-700"
                        style={{
                            transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                        }}
                    />
                </motion.div>

                {/* technical Reveal HUD overlay - ONLY ON HOVER */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none"
                        >
                            <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2" style={{ borderColor: accent }} />
                            <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2" style={{ borderColor: accent }} />
                            <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2" style={{ borderColor: accent }} />
                            <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2" style={{ borderColor: accent }} />

                            {/* Scan Line */}
                            <motion.div
                                initial={{ top: '10%' }}
                                animate={{ top: '90%' }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-x-8 h-[1px] opacity-40"
                                style={{ background: accent }}
                            />

                            {/* Item Info Reveal */}
                            <div className="mt-auto mb-16 text-center space-y-2">
                                <motion.h3
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="text-[16px] font-heading font-black tracking-[0.3em] text-white"
                                >
                                    {item.name.toUpperCase()}
                                </motion.h3>
                                <motion.div
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="flex items-center justify-center gap-4 text-[10px] font-mono tracking-widest text-white/40"
                                >
                                    <span style={{ color: accent }}>{item.tier}</span>
                                    <span className="w-1 h-1 bg-white/20 rounded-full" />
                                    <span>ARCHIVE COLLECTED</span>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const Counter = ({ value }) => {
    const [displayValue, setDisplayValue] = useState(value);
    useEffect(() => {
        const duration = 1000;
        const start = displayValue;
        const end = value;
        const startTime = Date.now();
        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (end - start) * progress);
            setDisplayValue(current);
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [value]);
    return <span>{displayValue}</span>;
};

// ─── Hero Images ────────────────────────────────────────────────────────────
const vaultHeroImages = [
    '/cart page/cartimg1.png',
    '/cart page/cartimg2.png',
    '/cart page/cartimg3.png',
    '/cart page/cartimg4.png',
    '/cart page/img1.png',
    '/cart page/img2.png'
];

const Vault = () => {
    const { products } = useStore();
    const pageRef = useRef(null);
    const headingRef = useRef(null);
    const navigate = useNavigate();

    // Admin-created DB cards
    const [vaultItems, setDbCards] = useState([]);
    useEffect(() => {
        productService.getVaultCards()
            .then(cards => setDbCards(cards.map(c => ({
                id: c._id,
                _id: c._id,
                name: c.name,
                description: c.description,
                image: c.frontImage,   // front = what the flip card shows
                backImageUrl: c.backImage,
                tier: c.category,
                _source: 'db'
            }))))
            .catch(() => { }); // silently fail if not logged in
    }, []);

    // Local State
    const [unlockedIds, setUnlockedIds] = useState([]);
    const [credits, setCredits] = useState(0);
    const [stats, setStats] = useState({ common: 0, rare: 0, epic: 0, legendary: 0 });
    const [collectionFilter, setCollectionFilter] = useState('All');
    const [loadingDone, setLoadingDone] = useState(false);
    const [vaultReady, setVaultReady] = useState(false);
    const [exiting, setExiting] = useState(false);
    const [isVaultActive, setIsVaultActive] = useState(false);
    const [bursts, setBursts] = useState([]);

    // Unlock Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [unlockCode, setUnlockCode] = useState('');
    const [targetItem, setTargetItem] = useState(null);
    const [clickPos, setClickPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const savedData = localStorage.getItem('endura_vault_persistence');
        if (savedData) {
            const data = JSON.parse(savedData);
            setUnlockedIds(data.unlockedItems || []);
            setCredits(data.credits || 50);
            setStats({
                common: data.commonCount || 0,
                rare: data.rareCount || 0,
                epic: data.epicCount || 0,
                legendary: data.legendaryCount || 0
            });
        } else {
            setCredits(50);
        }
    }, []);

    const updatePersistence = (newUnlocked, newCredits, newStats) => {
        const payload = {
            unlockedItems: newUnlocked,
            credits: newCredits,
            commonCount: newStats.common,
            rareCount: newStats.rare,
            epicCount: newStats.epic,
            legendaryCount: newStats.legendary
        };
        localStorage.setItem('endura_vault_persistence', JSON.stringify(payload));
    };

    const handleUnlockRequest = (item, e) => {
        setTargetItem(item);
        setClickPos({ x: e.clientX, y: e.clientY });
        setIsModalOpen(true);
        setUnlockCode('');
    };

    const handleVerifyCode = () => {
        const isNumeric = /^\d+$/.test(unlockCode);
        const isSecretCode = unlockCode.toUpperCase() === 'ENDURA-LEVEL1';

        if (isSecretCode || (isNumeric && unlockCode.length > 0)) {
            const nextUnlocked = [...unlockedIds, targetItem.id];
            const nextCredits = credits + 1;
            const safeTier = targetItem.tier ? targetItem.tier.toLowerCase() : 'common';
            const nextStats = { ...stats, [safeTier]: (stats[safeTier] || 0) + 1 };

            setUnlockedIds(nextUnlocked);
            setCredits(nextCredits);
            setStats(nextStats);

            updatePersistence(nextUnlocked, nextCredits, nextStats);

            setBursts(prev => [...prev, { id: Date.now(), x: clickPos.x, y: clickPos.y }]);
            setIsModalOpen(false);

            toast.success('DECRYPTION SUCCESSFUL', {
                style: { background: '#0a0a0a', color: '#d4af37', border: '1px solid #d4af37', fontFamily: 'Orbitron', fontSize: '10px' }
            });
        } else {
            toast.error('ACCESS DENIED', {
                style: { background: '#0a0a0a', color: '#ff4444', border: '1px solid #ff4444', fontFamily: 'Orbitron', fontSize: '10px' }
            });
        }
    };

    const handleLoadingComplete = useCallback(() => {
        setLoadingDone(true);
        setVaultReady(true);
        gsap.to(pageRef.current, { opacity: 1, duration: 0.5 });
        gsap.to(headingRef.current, { opacity: 1, y: 0, duration: 0.5 });
    }, []);

    const handleGoCollected = useCallback(() => {
        setExiting(true);
        gsap.to(pageRef.current, {
            opacity: 0, y: -20, duration: 0.6, ease: 'power2.inOut',
            onComplete: () => navigate('/collected')
        });
    }, [navigate]);

    const handleResetVault = () => {
        if (window.confirm('RESET VAULT PROTOCOL? THIS WILL LOCK ALL ASSETS.')) {
            localStorage.removeItem('endura_vault_persistence');
            setUnlockedIds([]);
            setCredits(50);
            setStats({ common: 0, rare: 0, epic: 0, legendary: 0 });
            toast.success('VAULT PROTOCOL RESET');
        }
    };

    const chunkedItems = useMemo(() => {
        const rows = [];
        const filtered = vaultItems.filter(item => {
            if (collectionFilter === 'Collected') return unlockedIds.includes(item.id);
            if (collectionFilter === 'Not Collected') return !unlockedIds.includes(item.id);
            return true;
        });
        for (let i = 0; i < filtered.length; i += 3) {
            rows.push(filtered.slice(i, i + 3));
        }
        return rows;
    }, [vaultItems, collectionFilter, unlockedIds]);

    useEffect(() => {
        if (!loadingDone) return;

        const ctx = gsap.context(() => {
            gsap.utils.toArray('.vault-row').forEach((row) => {
                gsap.from(row.querySelectorAll('.vault-card-reveal'), {
                    scrollTrigger: {
                        trigger: row,
                        start: "top 85%",
                        toggleActions: "play reverse play reverse"
                    },
                    y: 50,
                    opacity: 0,
                    scale: 0.94,
                    duration: 1.8,
                    stagger: 0.2,
                    ease: "power3.out"
                });
            });
        }, pageRef);

        return () => ctx.revert();
    }, [loadingDone]);

    return (
        <>
            <AnimatePresence>
                {!loadingDone && <VaultLoadingScreen onComplete={handleLoadingComplete} />}
            </AnimatePresence>

            {loadingDone && <CollectionHero images={vaultHeroImages} />}

            <div ref={pageRef} className="min-h-screen bg-black text-white font-body selection:bg-accent/30 opacity-0 relative">
                <Toaster position="top-right" />

                <div className="fixed inset-0 pointer-events-none bg-gradient-radial from-accent/5 via-transparent to-transparent opacity-10" />

                <header className="relative z-10 pt-16 pb-12">
                    <div className="max-w-[1600px] mx-auto px-12">
                        <div className="flex items-center justify-between mb-8">
                            <div className="w-[160px]" />
                            <h1 ref={headingRef} className="text-4xl md:text-6xl font-heading font-black tracking-[0.2em] text-white opacity-0 translate-y-4">
                                THE ENDURA <span
                                    className={`vault-word-reveal cursor-pointer transition-all ${isVaultActive ? 'active' : ''}`}
                                    onClick={() => setIsVaultActive(!isVaultActive)}
                                >VAULT</span>
                            </h1>
                            <div className="w-[160px] flex justify-end">
                                {/* <button onClick={handleGoCollected} disabled={exiting} className="px-6 py-3 border border-white/10 text-[10px] font-mono tracking-widest uppercase text-white/40 hover:text-white hover:border-white/50 transition-all active:scale-95">
                                    Collected Items
                                </button> */}
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-12 text-[10px] font-mono tracking-[0.3em] uppercase text-white/40 border-t border-white/5 pt-8">
                            <div className="flex gap-12">
                                <div className="flex items-center gap-3">
                                    <span className="text-white">Credits:</span>
                                    <span className="text-accent text-[12px]"><Counter value={credits} /></span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-white/20">Silver:</span>
                                    <span><Counter value={stats.common} /></span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-white/20">Gold:</span>
                                    <span><Counter value={stats.rare} /></span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-white/20">Diamond:</span>
                                    <span><Counter value={stats.epic} /></span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-white/20">Legendary:</span>
                                    <span><Counter value={stats.legendary} /></span>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <select
                                    className="bg-black/50 border border-white/10 px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-white outline-none focus:border-[#d4af37]/50 appearance-none cursor-pointer"
                                    value={collectionFilter}
                                    onChange={(e) => setCollectionFilter(e.target.value)}
                                >
                                    <option value="All">View All Archives</option>
                                    <option value="Collected">Decrypted</option>
                                    <option value="Not Collected">Encrypted</option>
                                </select>

                                <div className="pl-6 border-l border-white/5">
                                    <button
                                        onClick={handleResetVault}
                                        className="text-[8px] font-mono text-white/10 hover:text-white/50 transition-colors uppercase tracking-[0.3em] border border-white/5 px-3 py-2"
                                    >
                                        Reset_Vault
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="relative z-10 max-w-[1200px] mx-auto px-6 pb-48">
                    <div className="flex flex-col gap-24">
                        {chunkedItems.map((row, idx) => (
                            <div key={idx} className="vault-row grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
                                {row.map(item => (
                                    <div key={item.id} className="vault-card-reveal">
                                        <VaultCard
                                            item={item}
                                            isUnlocked={unlockedIds.includes(item.id)}
                                            onUnlockRequest={handleUnlockRequest}
                                            vaultReady={vaultReady}
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </main>

                {bursts.map(b => (
                    <CoinBurst key={b.id} x={b.x} y={b.y} onComplete={() => setBursts(p => p.filter(i => i.id !== b.id))} />
                ))}

                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/60">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="glass p-10 max-w-sm w-full border-white/10 text-center space-y-8 rounded-xl"
                            >
                                <div className="space-y-2">
                                    <h3 className="text-xl font-heading font-black tracking-widest text-[#d4af37]">ENTER ACCESS CODE</h3>
                                    <p className="text-[10px] font-mono text-white/40 uppercase">Archived Asset Security clearance required</p>
                                </div>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="ACCESS CODE"
                                    className="w-full bg-black/50 border border-white/10 p-4 text-center font-mono text-sm tracking-widest text-white outline-none focus:border-accent/40"
                                    value={unlockCode}
                                    onChange={(e) => setUnlockCode(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleVerifyCode()}
                                />
                                <div className="flex gap-4">
                                    <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-[10px] font-mono text-white/20 hover:text-white transition-all uppercase tracking-widest">Abort</button>
                                    <button onClick={handleVerifyCode} className="flex-1 py-3 bg-accent text-black font-heading font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)]">Verify</button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default Vault;
