import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import { useStore } from '../context/StoreContext';
import { productService, getImageUrl } from '../services/api';
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
            className="relative w-full max-w-[280px] md:max-w-none mx-auto h-[300px] md:h-[350px] [perspective:1000px] group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                className="relative w-full h-full duration-700 [transform-style:preserve-3d]"
                animate={{ 
                    rotateY: isUnlocked ? 180 : 0,
                    scale: isHovered ? 1.05 : 1
                }}
                transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            >
                {/* Front Side: Pure Image Card */}
                <div
                    className="absolute inset-0 w-full h-full [backface-visibility:hidden] flex flex-col items-center justify-center overflow-hidden rounded-xl bg-black"
                >
                    {/* The Dragon Artwork Card Face */}
                    <motion.div
                        initial={false}
                        animate={{ opacity: isHovered && !isUnlocked ? 0.15 : 1 }}
                        className="absolute inset-0 z-0"
                    >
                        <AnimatedDragon tier={item.tier} isHovered={isHovered} />
                    </motion.div>

                    {/* Pre-Unlock Reveal Image (Hover Only) */}
                    <AnimatePresence>
                        {isHovered && !isUnlocked && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 0.6, scale: 0.95 }}
                                exit={{ opacity: 0, scale: 1.1 }}
                                className="absolute inset-0 z-10 flex items-center justify-center p-12"
                            >
                                <img 
                                    src={getImageUrl(item.image)} 
                                    alt="Encrypted Preview" 
                                    className="w-full h-full object-contain filter grayscale brightness-150 contrast-125 saturate-150"
                                    style={{
                                        filter: `drop-shadow(0 0 20px ${accent}44) grayscale(0.5) contrast(1.2)`
                                    }}
                                />
                                {/* Add a 'PROJECTED' label */}
                                <div className="absolute bottom-16 left-0 right-0 text-center">
                                    <span className="text-[6px] font-mono tracking-[0.4em] text-white/30 uppercase animate-pulse">Signature Detected</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

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
            className="relative w-full h-full bg-black overflow-hidden group/dress border border-white/10 rounded-xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                boxShadow: `inset 0 0 100px 20px ${accent}33`,
                background: `radial-gradient(circle at center, transparent 30%, ${accent}11 100%)`
            }}
        >


            {/* Central Content */}
            <div className="relative w-full h-full flex flex-col items-center justify-center p-8 overflow-visible">
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
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="w-full h-full object-contain block transition-transform duration-700"
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
                                    className="flex flex-col items-center justify-center gap-1 text-[10px] font-mono tracking-widest"
                                >
                                    <div className="flex items-center gap-4 text-white/40">
                                        <span style={{ color: accent }}>{item.tier.toUpperCase()}</span>
                                        <span className="w-1 h-1 bg-white/20 rounded-full" />
                                        <span>ARCHIVE COLLECTED</span>
                                    </div>
                                    {item.serialNumber && (
                                        <div className="text-[12px] font-black text-[#d4af37] tracking-[0.2em] mt-1">
                                            SERIAL: {item.serialNumber} / 100
                                        </div>
                                    )}
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
    const pageRef = useRef(null);
    const headingRef = useRef(null);
    const navigate = useNavigate();
    const { loginWithToken } = useStore();
    const { collectItem } = useVaultScore();

    const [vaultItems, setDbCards] = useState([]);
    
    // Server-side State
    const [unlockedIds, setUnlockedIds] = useState([]);
    const [stats, setStats] = useState({ common: 0, rare: 0, epic: 0, legendary: 0 });

    useEffect(() => {
        const loadVaultData = async () => {
            try {
                // 1. Fetch all available Archive Templates
                const cards = await productService.getVaultCards();
                setDbCards(cards.map(c => ({
                    id: c._id,
                    _id: c._id,
                    serialNumber: c.serialNumber || 0,
                    batchId: c.batchId || 1,
                    name: c.name,
                    description: c.description,
                    image: c.frontImage,   
                    backImageUrl: c.backImage,
                    tier: c.category,
                    _source: 'db'
                })));

                // 2. Fetch User-specific Owned Assets
                const userAssets = await vaultService.getUserVault();
                if (userAssets && userAssets.protocols) {
                    const ownedIds = userAssets.protocols.map(p => p._id);
                    setUnlockedIds(ownedIds);
                    
                    // Update stats based on owned protocols
                    const newStats = { common: 0, rare: 0, epic: 0, legendary: 0 };
                    userAssets.protocols.forEach(p => {
                        const tier = (p.category || 'rare').toLowerCase();
                        if (newStats[tier] !== undefined) newStats[tier]++;
                    });
                    setStats(newStats);

                    // Add owned protocols to the grid as distinct items
                    const ownedProtocols = userAssets.protocols.map(p => ({
                        id: p._id,
                        _id: p._id,
                        serialNumber: p.serialNumber,
                        batchId: p.batchId,
                        name: p.name,
                        image: p.frontImage,
                        backImageUrl: p.frontImage,
                        tier: p.category,
                        isUnlocked: true,
                        _source: 'protocol'
                    }));
                    
                    // Prepend owned items to the grid
                    setDbCards(prev => [...ownedProtocols, ...prev]);
                }
            } catch (error) {
                console.error("Failed to synchronize vault archive:", error);
            }
        };

        loadVaultData();
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

    const handlePreview = (item) => {
        setPreviewItem(item);
    };



    const handleUnlockRequest = (item, e) => {
        setTargetItem(item);
        setClickPos({ x: e.clientX, y: e.clientY });
        setIsModalOpen(true);
        setUnlockCode('');
    };

    const handleVerifyCode = async () => {
        if (!unlockCode.trim()) return;

        try {
            const response = await vaultService.redeemCode(unlockCode);
            
            if (response.success && response.protocol) {
                const { serialNumber, batchId } = response.protocol;
                
                // Find matching card in our loaded vault items
                const matchedItem = vaultItems.find(it => 
                    it.serialNumber === serialNumber && it.batchId === batchId
                );

                if (matchedItem) {
                    setTargetItem(matchedItem);
                    setRitualId(matchedItem.id);
                    setIsModalOpen(false);
                    setUnlockCode('');
                    setUnlockedIds(prev => [...prev, matchedItem.id]);
                    toast.success('DECRYPTION SUCCESSFUL', { 
                        style: { background: '#0a0a0a', color: '#d4af37', border: '1px solid #d4af37', fontFamily: 'Orbitron', fontSize: '10px' } 
                    });
                } else {
                    toast.error('ASSET NOT INITIALIZED IN ARCHIVE', {
                        style: { background: '#0a0a0a', color: '#ff4444', border: '1px solid #ff4444', fontFamily: 'Orbitron', fontSize: '10px' }
                    });
                }
            }
        } catch (error) {
            const errMsg = error.response?.data?.message || 'ACCESS DENIED: INVALID PROTOCOL';
            toast.error(errMsg.toUpperCase(), {
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

            <div ref={pageRef} className="min-h-screen bg-black text-white font-body selection:bg-accent/30 opacity-0 relative">
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

                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 text-[8px] md:text-[10px] font-mono tracking-[0.2em] md:tracking-[0.3em] uppercase text-white/40 border-t border-white/5 pt-8">
                            <div className="flex items-center justify-center md:justify-start gap-3 md:gap-12 flex-nowrap w-full md:w-auto">
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
                                <button
                                    onClick={handleResetVault}
                                    className="px-4 py-2 border border-red-500/30 text-red-500/50 hover:text-red-500 hover:border-red-500 text-[8px] font-mono uppercase tracking-[0.2em] transition-all bg-red-500/5"
                                >
                                    Reset Protocol
                                </button>
                                <select
                                    className="bg-black/50 border border-white/10 px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-white outline-none focus:border-[#d4af37]/50 appearance-none cursor-pointer"
                                    value={collectionFilter}
                                    onChange={(e) => setCollectionFilter(e.target.value)}
                                >
                                    <option value="All">View All Archives</option>
                                    <option value="Collected">Decrypted</option>
                                    <option value="Not Collected">Encrypted</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col items-center mt-44 mb-16 relative">
                            {/* Decorative HUD Scan Line */}
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[400px] h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent overflow-hidden">
                                <motion.div 
                                    animate={{ left: ['-100%', '100%'] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                />
                            </div>
                            

                            <div className="relative group p-8">
                                {/* Rotating Scanner Rings */}
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 border border-dashed border-[#d4af37]/20 rounded-full scale-[1.15] pointer-events-none"
                                />
                                <motion.div 
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 border border-dotted border-white/5 rounded-full scale-[1.3] pointer-events-none"
                                />

                                {/* Corner Accents (Enhanced) */}
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#d4af37]/50 transition-all group-hover:scale-110 group-hover:border-[#d4af37]" />
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#d4af37]/50 transition-all group-hover:scale-110 group-hover:border-[#d4af37]" />
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#d4af37]/50 transition-all group-hover:scale-110 group-hover:border-[#d4af37]" />
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#d4af37]/50 transition-all group-hover:scale-110 group-hover:border-[#d4af37]" />

                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    onClick={() => {
                                        setTargetItem(null);
                                        setIsModalOpen(true);
                                        setUnlockCode('');
                                    }}
                                    className="relative z-10 px-14 py-6 bg-[#d4af37] text-black font-heading font-black text-xs uppercase tracking-[0.6em] hover:bg-white hover:scale-105 transition-all shadow-[0_0_70px_rgba(212,175,55,0.25)] active:scale-95"
                                >
                                    ENTER PROTOCOL CODE
                                </motion.button>
                            </div>

                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="mt-12 space-y-2 text-center"
                            >
                                <div className="text-[7px] font-mono text-white/30 tracking-[0.4em] uppercase">Biometric Authorization Required</div>
                                <div className="text-[6px] font-mono text-white/10 tracking-[0.2em] uppercase max-w-xs leading-relaxed mx-auto italic">
                                    Archive synchronization complete. Verification modules ready. 
                                    Input designated decryption protocol to access secured luxury assets.
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </header>


                <main className="relative z-10 max-w-[1200px] mx-auto px-6 pt-24 pb-48 transition-all duration-1000">
                        <div className="flex flex-col gap-24">
                            {chunkedItems.map((row, idx) => (
                                <div key={idx} className="vault-row grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
                                    {row.map(item => (
                                        <div 
                                            key={item.id} 
                                            className="vault-card-reveal"
                                            onClick={() => unlockedIds.includes(item.id) && handlePreview(item)}
                                        >
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
                                            productService.collectVaultCard(it.id)
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
                                    isUnlocked={true} 
                                    onUnlockRequest={() => { }} 
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
                            accent={targetItem ? tierAccent(targetItem.tier) : '#C9A227'}
                            onEnterDashboard={() => navigate('/dashboard')}
                            onClose={() => setShowCongrats(false)}
                        >
                            {targetItem && (
                                <DressItem
                                    item={{ ...targetItem, image: targetItem.image }}
                                    vaultReady={true}
                                />
                            )}
                        </VaultCongratsOverlay>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default Vault;
