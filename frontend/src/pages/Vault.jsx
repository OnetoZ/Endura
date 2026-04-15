import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import { useStore } from '../context/StoreContext';
import { assetService, getImageUrl, vaultService } from '../services/api';
import VaultLoadingScreen from '../components/Vault/UI/VaultLoadingScreen';
import CollectionHero from '../components/collections/CollectionHero';
import RewardUnlockOverlay from '../components/Vault/UI/RewardUnlockOverlay';
import '../components/collections/collections.css';
import { useVaultScore } from '../hooks/useVaultScore';
import VaultCongratsOverlay from '../components/Vault/UI/VaultCongratsOverlay';
import SEO from '../components/SEO';

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

const AssetBackground = ({ tier, isHovered }) => {
    return (
        <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden bg-[#050505]"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
        >
            {/* Geometric Grid Pattern */}
            <div className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: 'radial-gradient(circle, #ffffff11 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            />

            {/* Dynamic Radial Glow */}
            <div className="absolute inset-0 opacity-40 bg-radial-gradient from-white/10 via-transparent to-transparent" />

            {/* Tier-Specific Bottom Glow */}
            <motion.div
                animate={{ opacity: isHovered ? 0.6 : 0.3 }}
                className="absolute inset-x-0 bottom-0 h-1/2"
                style={{
                    background: `linear-gradient(to top, ${tierAccent(tier)}33, transparent)`
                }}
            />

            {/* Tier-based Edge Glow */}
            <motion.div
                className="absolute inset-0 z-10 pointer-events-none opacity-100 transition-opacity duration-1000"
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
    vaultReady
}) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const accent = tierAccent(item.tier);

    return (
        <div 
            className="relative w-full max-w-[280px] md:max-w-none mx-auto h-[350px] md:h-[420px] [perspective:1000px] group cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <motion.div
                className="relative w-full h-full duration-1000 [transform-style:preserve-3d]"
                animate={{
                    rotateY: isFlipped ? 180 : 0,
                }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
                {/* ─── FRONT SIDE ─── */}
                <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-2xl bg-black border border-white/10 overflow-hidden">
                    <img 
                        src={getImageUrl(item.image)} 
                        alt={item.name} 
                        className="w-full h-full object-cover p-2 rounded-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-0 right-0 text-center px-4">
                        <p className="text-[10px] font-mono text-accent uppercase tracking-[0.2em]">{item.name}</p>
                    </div>
                </div>

                {/* ─── BACK SIDE ─── */}
                <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl bg-black border border-white/10 overflow-hidden">
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
    const [isHovered, setIsHovered] = useState(true);
    const accent = tierAccent(item.tier);

    return (
        <div
            className="relative w-full h-full bg-black overflow-hidden group/dress border border-white/10 rounded-xl"
            style={{
                boxShadow: `inset 0 0 100px 20px ${accent}33`,
                background: `radial-gradient(circle at center, transparent 30%, ${accent}11 100%)`
            }}
        >


            {/* Central Content */}
            <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
                {/* Always Floating Dress Artwork */}
                <motion.div
                    className="relative z-10 w-full h-full flex items-center justify-center overflow-visible"
                    animate={vaultReady ? {
                        y: [-8, 8, -8],
                    } : {}}
                    transition={{
                        y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                    }}
                >
                    <img
                        src={getImageUrl(item.backImageUrl || item.backImage || item.image || item.frontImage)}
                        alt={item.name}
                        className="w-full h-full object-cover block transition-transform duration-700"
                        style={{
                            transform: isHovered ? 'scale(0.9)' : 'scale(0.5)'
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
    const pageRef = useRef(null);
    const headingRef = useRef(null);
    const navigate = useNavigate();
    const { loginWithToken } = useStore();
    const { collectItem } = useVaultScore();

    const [vaultItems, setDbCards] = useState([]);

    // Server-side State
    const [unlockedIds, setUnlockedIds] = useState([]);
    const [stats, setStats] = useState({ common: 0, rare: 0, epic: 0, legendary: 0 });
    const [credits, setCredits] = useState(0);

    // Update local credits when user synchronizes
    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const parsed = JSON.parse(userInfo);
            setCredits(parsed.credits || 0);
        }
    }, []);

    const updatePersistence = (ids, score, currentStats) => {
        // Mock persistence or sync with store if needed
        console.log("Persistence update:", { ids, score, currentStats });
    };

    useEffect(() => {
        // Vault protocol: Start empty. Items are only revealed via manual protocol synchronization in the current session.
        setDbCards([]);
        setUnlockedIds([]);
    }, []);
    const [ritualId, setRitualId] = useState(null);
    const [collectionFilter, setCollectionFilter] = useState('All');
    const [loadingDone, setLoadingDone] = useState(false);
    const [vaultReady, setVaultReady] = useState(false);
    const [exiting, setExiting] = useState(false);
    const [isVaultActive, setIsVaultActive] = useState(false);
    const [isAccessUnlocked, setIsAccessUnlocked] = useState(true);
    const [bursts, setBursts] = useState([]);

    // Unlock Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [unlockCode, setUnlockCode] = useState('');
    const [targetItem, setTargetItem] = useState(null);
    const [clickPos, setClickPos] = useState({ x: 0, y: 0 });
    const [rewardUnlockItem, setRewardUnlockItem] = useState(null);
    const [previewItem, setPreviewItem] = useState(null);
    const [showCongrats, setShowCongrats] = useState(false);
    const [congratsData, setCongratsData] = useState(null);
    const [showPurchasePopup, setShowPurchasePopup] = useState(false);
    const [showSyncOverlay, setShowSyncOverlay] = useState(false);
    const [syncCode, setSyncCode] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncError, setSyncError] = useState(false);

    const handlePreview = (item) => {
        setPreviewItem(item);
    };

    const handleUnlockRequest = (item, e) => {
        if (e) {
            e.stopPropagation();
            setClickPos({ x: e.clientX, y: e.clientY });
        }
        setTargetItem(item);
        setShowPurchasePopup(true);
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
        const filtered = vaultItems.filter(item => unlockedIds.includes(item.id || item._id));
        for (let i = 0; i < filtered.length; i += 3) {
            rows.push(filtered.slice(i, i + 3));
        }
        return rows;
    }, [vaultItems, unlockedIds]);

    /* 
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
    */

    return (
        <>
            <SEO
                title="official | The Vault - Exclusive Digital Collectibles"
                description="Secure your digital future with ENDURA's Vault. Collect rare digital archives and unlock exclusive luxury streetwear rewards in India."
                canonical="/vault"
            />
            <AnimatePresence>
                {!loadingDone && <VaultLoadingScreen onComplete={handleLoadingComplete} />}
            </AnimatePresence>

            {loadingDone && <CollectionHero images={vaultHeroImages} />}

            <div ref={pageRef} className="min-h-screen bg-black text-white font-body selection:bg-accent/30 opacity-0 relative pt-12">
                <Toaster position="top-right" />

                <div className="fixed inset-0 pointer-events-none bg-gradient-radial from-accent/5 via-transparent to-transparent opacity-10" />

                <header className="relative z-10 pt-16 pb-12">
                    <div className="max-w-[1600px] mx-auto px-12">
                        <div className="flex flex-col items-center justify-center mb-8">
                            <h1 ref={headingRef} className="text-4xl md:text-6xl font-heading font-black tracking-[0.2em] text-white opacity-0 translate-y-4 text-center">
                                THE <span
                                    className={`vault-word-reveal cursor-pointer transition-all ${isVaultActive ? 'active' : ''}`}
                                    onClick={() => setIsVaultActive(!isVaultActive)}
                                >VAULT</span>
                            </h1>
                        </div>

                        {/* ─── ENCRYPTION OVERRIDE HUD (Always Visible) ─── */}
                        <div className="flex items-center justify-center pt-8 pb-12 px-4 reveal">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative w-full max-w-[400px] glass border border-white/10 rounded-[30px] p-8 md:p-10 flex flex-col items-center justify-center text-center overflow-hidden shadow-[0_0_100px_rgba(212,175,55,0.05)]"
                            >
                                {/* Geometric Circles / Radar Effect */}
                                <div className="absolute inset-0 flex justify-center items-center -z-10 opacity-10">
                                    <div className="w-[120%] aspect-square border-2 border-dashed border-white/20 rounded-full animate-[spin_60s_linear_infinite]" />
                                </div>

                                {/* Authorization Pill */}
                                <div className="inline-block px-8 py-2 border border-[#d4af37]/30 rounded-full bg-[#d4af37]/5 mb-10">
                                    <span className="text-[11px] font-mono font-bold tracking-[0.4em] text-[#d4af37] uppercase">
                                        Authorization Required
                                    </span>
                                </div>

                                {/* Heading Group */}
                                <div className="space-y-2 mb-10">
                                    <h2 className="text-4xl md:text-6xl font-oswald font-black text-white leading-tight tracking-[0.1em] uppercase">
                                        Encryption
                                    </h2>
                                    <h2 className="text-4xl md:text-6xl font-oswald font-black text-[#d4af37] leading-tight tracking-[0.1em] uppercase">
                                        Override
                                    </h2>
                                </div>

                                {/* Protocol Description */}
                                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em] leading-relaxed max-w-[320px] mb-8">
                                    Deploy designated decryption protocol to access restricted luxury assets in the archive.
                                </p>

                                {/* Trigger Sync Overlay */}
                                <div className="w-full">
                                    <button 
                                        onClick={() => setShowSyncOverlay(true)}
                                        className="w-full py-4 bg-[#d4af37] text-black font-oswald font-black text-xs uppercase tracking-[0.5em] hover:bg-white transition-all duration-700 shadow-[0_15px_30px_rgba(212,175,55,0.15)]"
                                    >
                                        Initialize Protocol
                                    </button>
                                </div>


                                {/* Edge Anchors */}
                                <div className="absolute top-8 left-8 w-4 h-4 border-t border-l border-white/20" />
                                <div className="absolute top-8 right-8 w-4 h-4 border-t border-r border-white/20" />
                                <div className="absolute bottom-8 left-8 w-4 h-4 border-b border-l border-white/20" />
                                <div className="absolute bottom-8 right-8 w-4 h-4 border-b border-r border-white/20" />
                            </motion.div>
                        </div>
                    </div>
                </header>

                <main className="relative z-10 max-w-[1200px] mx-auto px-6 pt-12 pb-48 transition-all duration-1000">
                    {unlockedIds.length > 0 && (
                        <div className="flex flex-col gap-24">
                            {chunkedItems.map((row, idx) => (
                                <div key={idx} className="vault-row grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
                                    {row.map(item => (
                                        <div
                                            key={item.id}
                                            className="vault-card-reveal"
                                            onClick={() => handlePreview(item)}
                                        >
                                            <VaultCard
                                                item={item}
                                                vaultReady={vaultReady}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </main>

                {bursts.map(b => (
                    <CoinBurst key={b.id} x={b.x} y={b.y} onComplete={() => setBursts(p => p.filter(i => i.id !== b.id))} />
                ))}

                <AnimatePresence>
                    {ritualId && (
                        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-xl">
                            {/* Subway Surfers style reveal: Pop and Glow */}
                            <motion.div
                                initial={{ scale: 0, rotate: -10, opacity: 0 }}
                                animate={{ scale: [0, 1.2, 1], rotate: 0, opacity: 1 }}
                                transition={{
                                    duration: 0.8,
                                    ease: [0.34, 1.56, 0.64, 1], // Custom spring-like easing
                                }}
                                className="w-[320px] relative"
                                onAnimationComplete={() => {
                                    const it = targetItem;
                                    if (!it) return;
                                    const nU = [...unlockedIds, it.id];
                                    const nS = { ...stats, [(it.tier || 'common').toLowerCase()]: (stats[(it.tier || 'common').toLowerCase()] || 0) + 1 };
                                    setUnlockedIds(nU);
                                    setStats(nS);
                                    updatePersistence(nU, credits + 1, nS);

                                    setTimeout(() => {
                                        if (it._source === 'db') {
                                            vaultService.collectVaultCard(it.id)
                                                .then(d => {
                                                    setCongratsData(d);
                                                    setCredits(d.newScore);
                                                    setShowCongrats(true);
                                                    setRitualId(null);
                                                })
                                                .catch(() => {
                                                    setShowCongrats(true);
                                                    setRitualId(null);
                                                });
                                        } else {
                                            setCredits(credits + 1);
                                            setRewardUnlockItem(it);
                                            setRitualId(null);
                                        }
                                    }, 1000);
                                }}
                            >
                                {/* Glow Effect Behind */}
                                <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full animate-pulse" />

                                <VaultCard
                                    item={vaultItems.find(it => it.id === ritualId)}
                                    vaultReady={true}
                                />

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="absolute -bottom-20 left-0 right-0 text-center"
                                >
                                    <h2 className="text-2xl font-heading font-black text-accent tracking-[0.5em] animate-pulse">UNLOCKED</h2>
                                </motion.div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>



                {rewardUnlockItem && (
                    <RewardUnlockOverlay
                        item={rewardUnlockItem}
                        onClose={() => setRewardUnlockItem(null)}
                    />
                )}

                <AnimatePresence>
                    {previewItem && (
                        <div
                            className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 sm:p-8"
                            onClick={() => setPreviewItem(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 1.1, opacity: 0, y: -50 }}
                                className="relative w-full max-w-4xl bg-black/60 border border-white/10 rounded-3xl overflow-hidden glass p-12 flex flex-col items-center justify-center min-h-[60vh]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Close Button */}
                                <button
                                    onClick={() => setPreviewItem(null)}
                                    className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
                                >
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 items-center w-full px-4">
                                    <div className="relative h-[300px] md:h-[600px] flex items-center justify-center">
                                        <div className="absolute inset-0 bg-primary/10 blur-[150px] rounded-full" />
                                        <DressItem
                                            item={{ ...previewItem, image: previewItem.image }}
                                            vaultReady={true}
                                        />
                                    </div>

                                    <div className="space-y-10 text-center md:text-left">
                                        <div className="space-y-4">
                                            <span className="font-mono text-[10px] text-[#d4af37] tracking-[0.5em] uppercase">
                                                ARCHIVE: // {previewItem.tier}
                                            </span>
                                            <h2 className="text-4xl md:text-7xl font-heading font-black tracking-tight uppercase leading-none break-words">
                                                {previewItem.name}
                                            </h2>
                                            <div className="flex items-center justify-center md:justify-start gap-3">
                                                <div className="h-px w-8 bg-[#d4af37]/30" />
                                                <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Protocol Verified</span>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <p className="text-gray-400 font-light tracking-wide leading-relaxed uppercase text-xs md:text-sm max-w-sm mx-auto md:mx-0">
                                                {previewItem.description || "Experimental digital artifact bound to physical luxury. Part of the Endura protocol."}
                                            </p>

                                            <div className="flex flex-wrap gap-4 justify-center md:justify-start font-mono text-[9px] tracking-[0.2em] text-[#d4af37]/60">
                                                <span>PHASE: 01_DECRYPTION</span>
                                                <span className="text-white/10">|</span>
                                                <span>REWARDS: SYNC_READY</span>
                                            </div>
                                        </div>

                                        <div className="pt-10 border-t border-white/5 flex flex-wrap gap-4 justify-center md:justify-start">
                                            <div className="px-5 py-2.5 border border-[#d4af37]/20 bg-[#d4af37]/5 rounded-full text-[9px] font-mono uppercase tracking-widest text-[#d4af37]">
                                                LEGACY STATUS: ACTIVE
                                            </div>
                                            <div className="px-5 py-2.5 border border-white/10 bg-white/5 rounded-full text-[9px] font-mono uppercase tracking-widest text-white/40">
                                                DATA_SECURED
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {showCongrats && (
                        <VaultCongratsOverlay
                            oldScore={congratsData?.oldScore}
                            newScore={congratsData?.newScore}
                            creditDelta={congratsData?.creditDelta}
                            accent={congratsData?.vaultCard?.tier ? tierAccent(congratsData.vaultCard.tier) : (targetItem ? tierAccent(targetItem.tier) : '#d4af37')}
                            serialNumber={`${congratsData?.vaultItem?.serialNumber || targetItem?.serialNumber || '1'} / ${congratsData?.vaultItem?.vaultCard?.codes?.length || 1}`}
                            tier={congratsData?.vaultItem?.vaultCard?.tier || targetItem?.tier || 'COMMON'}
                            onEnterDashboard={() => navigate('/dashboard')}
                            onClose={() => setShowCongrats(false)}
                        >
                            <div className="relative w-full h-full [transform-style:preserve-3d]">
                                {/* Front Face */}
                                <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-2xl bg-[#111] border border-white/10 overflow-hidden">
                                     <img 
                                        src={getImageUrl(congratsData?.vaultItem?.vaultCard?.frontImage || targetItem?.image)} 
                                        className="w-full h-full object-cover scale-[1.3]"
                                        alt="Front"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                                </div>
                                
                                {/* Back Face */}
                                <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl bg-black border border-white/10 overflow-hidden">
                                    <DressItem 
                                        item={congratsData?.vaultItem ? {
                                            ...congratsData.vaultItem,
                                            image: congratsData.vaultItem.vaultCard?.frontImage,
                                            backImageUrl: congratsData.vaultItem.vaultCard?.backImage,
                                            tier: congratsData.vaultItem.vaultCard?.tier
                                        } : { ...targetItem, image: targetItem.image }}
                                        vaultReady={true} 
                                    />
                                </div>
                            </div>
                        </VaultCongratsOverlay>
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {showSyncOverlay && (
                        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="relative w-full max-w-md glass border border-white/10 p-12 overflow-hidden shadow-[0_0_100px_rgba(212,175,55,0.05)]"
                            >
                                {/* Close Button */}
                                <button
                                    onClick={() => {
                                        setShowSyncOverlay(false);
                                        setSyncCode('');
                                        setSyncError(false);
                                    }}
                                    className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-50 p-2"
                                >
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </button>

                                {/* Diagonal scanning line */}
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-accent/20 animate-[scan_3s_linear_infinite]" />
                                
                                <div className="relative z-10 space-y-8">
                                    <div className="text-center space-y-2">
                                        <h3 className="text-2xl font-oswald font-black text-white tracking-[0.2em] uppercase">Manual Override</h3>
                                        <p className="text-[9px] font-mono text-gray-500 tracking-widest uppercase">Enter Decryption Protocol</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="relative">
                                            <input 
                                                type="text"
                                                value={syncCode}
                                                onChange={(e) => {
                                                    setSyncCode(e.target.value.toUpperCase());
                                                    setSyncError(false);
                                                }}
                                                placeholder="PROTOCOL_CODE"
                                                className="w-full bg-white/5 border border-white/10 p-5 font-mono text-center text-accent tracking-[0.5em] outline-none focus:border-accent transition-all uppercase placeholder:text-white/10"
                                            />
                                            {syncError && (
                                                <motion.p 
                                                    initial={{ opacity: 0, y: -5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="absolute -top-6 left-0 right-0 text-center text-red-500 font-mono text-[8px] uppercase tracking-widest"
                                                >
                                                    Error: Invalid Decryption Protocol
                                                </motion.p>
                                            )}
                                        </div>

                                        <button 
                                            disabled={isSyncing || !syncCode}
                                            onClick={async () => {
                                                setIsSyncing(true);
                                                setSyncError(false);
                                                try {
                                                    const result = await vaultService.syncVaultWithCode(syncCode);
                                                    if (result.success) {
                                                        const newProtocol = {
                                                            id: result.vaultItem._id,
                                                            _id: result.vaultItem._id,
                                                            serialNumber: result.vaultItem.serialNumber,
                                                            batchId: result.vaultItem.vaultCard?.batchId || 1,
                                                            name: result.vaultItem.vaultCard?.name || 'Protocol Sync',
                                                            description: result.vaultItem.vaultCard?.description || '',
                                                            image: result.vaultItem.vaultCard?.frontImage,
                                                            backImageUrl: result.vaultItem.vaultCard?.backImage,
                                                            tier: result.vaultItem.vaultCard?.tier || 'rare',
                                                            isUnlocked: true,
                                                            _source: 'protocol'
                                                        };

                                                        setDbCards(prev => [newProtocol, ...prev]);
                                                        setUnlockedIds(prev => [...prev, newProtocol.id]);
                                                        
                                                        const tier = (newProtocol.tier || 'rare').toLowerCase();
                                                        setStats(prev => ({ ...prev, [tier]: (prev[tier] || 0) + 1 }));

                                                        setCongratsData(result);
                                                        setSyncCode('');
                                                        setShowSyncOverlay(false);
                                                        setShowCongrats(true);
                                                    }
                                                } catch (error) {
                                                    console.error("Sync failed:", error);
                                                    setSyncError(true);
                                                } finally {
                                                    setIsSyncing(false);
                                                }
                                            }}
                                            className="w-full py-5 bg-accent text-black font-oswald font-black text-xs uppercase tracking-[0.4em] hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all relative overflow-hidden group"
                                        >
                                            {isSyncing ? (
                                                <div className="flex items-center justify-center gap-3">
                                                    <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" />
                                                    <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:0.2s]" />
                                                    <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:0.4s]" />
                                                </div>
                                            ) : (
                                                'Deploy Sync'
                                            )}
                                        </button>
                                    </div>

                                    <button 
                                        onClick={() => {
                                            setShowSyncOverlay(false);
                                            setSyncCode('');
                                            setSyncError(false);
                                        }}
                                        className="w-full text-center py-2 text-[8px] font-mono text-white/30 hover:text-white uppercase tracking-widest transition-colors"
                                    >
                                        Cancel Uplink
                                    </button>
                                </div>

                                {/* Decorative corner details */}
                                <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-white/20" />
                                <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-white/20" />
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {showPurchasePopup && (
                        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/80">
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                className="glass p-12 max-w-lg w-full border-white/10 text-center relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" />

                                <div className="w-20 h-20 border border-accent/20 rounded-full flex items-center justify-center mx-auto mb-8 bg-accent/5">
                                    <div className="w-2 h-2 bg-accent rounded-full animate-ping" />
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-2xl font-heading font-black tracking-[0.2em] text-white">PURCHASE PROTOCOL</h3>
                                    <p className="text-[11px] font-mono text-white/60 leading-relaxed uppercase tracking-widest">
                                        Purchase an ENDURA product to receive a unique decryption protocol for your digital collectible cards.
                                    </p>
                                    <div className="pt-8 flex flex-col gap-4">
                                        <button
                                            onClick={() => navigate('/collections')}
                                            className="w-full py-4 bg-accent text-black font-heading font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white transition-all shadow-[0_0_30px_rgba(212,175,55,0.1)]"
                                        >
                                            Browse Collections
                                        </button>
                                        <button
                                            onClick={() => setShowPurchasePopup(false)}
                                            className="w-full py-4 border border-white/10 text-white/40 font-mono text-[9px] uppercase tracking-widest hover:text-white hover:border-white transition-all"
                                        >
                                            Close Uplink
                                        </button>
                                    </div>
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
