import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import { useStore } from '../context/StoreContext';
import { getImageUrl, vaultService, assetService } from '../services/api';
import VaultLoadingScreen from '../components/Vault/UI/VaultLoadingScreen';
import RewardUnlockOverlay from '../components/Vault/UI/RewardUnlockOverlay';
import VaultCongratsOverlay from '../components/Vault/UI/VaultCongratsOverlay';
import SEO from '../components/SEO';
import {
    Lock,
    Unlock,
    Shield,
    Crown,
    Gem,
    Box,
    Sparkles,
    X,
    ArrowRight,
    AlertCircle,
    CheckCircle2,
    RefreshCw,
    ExternalLink
} from 'lucide-react';

// ─── Tier Accent Color Mapping ───────────────────────────────────────────────
const tierAccent = (tier) => {
    const t = tier ? tier.toLowerCase() : '';
    if (t === 'legendary') return '#D4AF37'; // Gold
    if (t === 'rare') return '#a855f7';     // Deep Electric Purple
    if (t === 'epic') return '#f59e0b';     // Amber/Gold
    if (t === 'common') return '#9ca3af';   // Understated Charcoal/Silver
    return '#9ca3af';
};

// ─── Gothic Keyhole Arch (Top Center Hero Icon) ──────────────────────────────
const GothicKeyholeArch = () => (
    <div className="relative flex items-center justify-center mb-4">
        {/* Ambient violet glow backdrop */}
        <div className="absolute inset-0 bg-[#a855f7]/25 blur-xl rounded-full scale-150 pointer-events-none" />
        <svg
            width="46"
            height="54"
            viewBox="0 0 44 52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10 drop-shadow-[0_0_16px_rgba(168,85,247,0.75)]"
        >
            {/* Outer Pointed Gothic Arch */}
            <path
                d="M22 2 C31 10, 40 21, 40 34 C40 46, 38 50, 38 50 L6 50 C6 50, 4 46, 4 34 C4 21, 13 10, 22 2 Z"
                stroke="#a855f7"
                strokeWidth="1.8"
                fill="rgba(168,85,247,0.08)"
            />
            {/* Inner Arch Accent */}
            <path
                d="M22 7 C29 14, 35 23, 35 34 C35 44, 33 46, 33 46 L11 46 C11 46, 9 44, 9 34 C9 23, 15 14, 22 7 Z"
                stroke="#c084fc"
                strokeWidth="1"
                strokeDasharray="2 2"
                fill="none"
                opacity="0.6"
            />
            {/* Keyhole Head */}
            <circle cx="22" cy="27" r="4" stroke="#f3e8ff" strokeWidth="1.5" fill="#a855f7" fillOpacity="0.4" />
            {/* Keyhole Shaft */}
            <path d="M20.2 29 L19 37 L25 37 L23.8 29 Z" stroke="#f3e8ff" strokeWidth="1.2" fill="#a855f7" fillOpacity="0.4" />
        </svg>
    </div>
);

// ─── Isometric 3D Cube Icon (Card Footer) ────────────────────────────────────
const IsometricCubeIcon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        className="text-white/40 group-hover:text-white/80 transition-colors"
    >
        <path d="M12 2L3 7L12 12L21 7L12 2Z" strokeLinejoin="round" />
        <path d="M3 7V17L12 22V12L3 7Z" strokeLinejoin="round" />
        <path d="M21 7V17L12 22V12L21 7Z" strokeLinejoin="round" />
    </svg>
);

// ─── Geometric Occult Emblem (Side Banners) ──────────────────────────────────
const SideBannerEmblem = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/25 mt-2">
        <circle cx="12" cy="12" r="10" strokeDasharray="3 3" />
        <polygon points="12,2 22,18 2,18" opacity="0.4" />
        <circle cx="12" cy="12" r="3.5" />
    </svg>
);

// ─── 3D Garment Inspector for Preview Modal ───────────────────────────────────
const DressItem = ({ item, vaultReady = true }) => {
    const [isHovered, setIsHovered] = useState(false);
    const accent = tierAccent(item.tier);

    return (
        <div
            className="relative w-full h-full bg-black/90 overflow-hidden group/dress border border-white/20 rounded-2xl flex items-center justify-center"
            style={{
                boxShadow: `inset 0 0 100px 20px ${accent}22`,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                className="relative z-10 w-full h-full flex items-center justify-center p-6"
                animate={vaultReady ? { y: [-6, 6, -6] } : {}}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
                <img
                    src={getImageUrl(item.backImageUrl || item.backImage || item.image || item.frontImageUrl || item.frontImage)}
                    alt={item.name}
                    className="w-full h-full object-contain block transition-transform duration-700"
                    style={{ transform: isHovered ? 'scale(1.08)' : 'scale(1)' }}
                />
            </motion.div>

            {/* Subtle HUD corner marks */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t border-l" style={{ borderColor: accent }} />
            <div className="absolute top-4 right-4 w-4 h-4 border-t border-r" style={{ borderColor: accent }} />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l" style={{ borderColor: accent }} />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r" style={{ borderColor: accent }} />
        </div>
    );
};

// ─── Main Vault Page Component ───────────────────────────────────────────────
const Vault = () => {
    const pageRef = useRef(null);
    const headingRef = useRef(null);
    const navigate = useNavigate();
    const { currentUser } = useStore();

    // Data State
    const [ownedAssets, setOwnedAssets] = useState([]);
    const [globalGallery, setGlobalGallery] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    // Active View Mode: 'owned' (default) vs 'all'
    const [viewMode, setViewMode] = useState('owned');

    // UI & Loading States
    const [loadingDone, setLoadingDone] = useState(false);
    const [vaultReady, setVaultReady] = useState(false);
    const [credits, setCredits] = useState(currentUser?.credits || 0);

    // Redemption Form State
    const [syncCode, setSyncCode] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncError, setSyncError] = useState(null);

    // Overlays & Inspection
    const [previewItem, setPreviewItem] = useState(null);
    const [showCongrats, setShowCongrats] = useState(false);
    const [congratsData, setCongratsData] = useState(null);
    const [rewardUnlockItem, setRewardUnlockItem] = useState(null);
    const [showPurchasePopup, setShowPurchasePopup] = useState(false);

    // ─── Load Vault Data (User Owned + Global Registry) ──────────────────────
    const loadVaultData = useCallback(async () => {
        setIsLoadingData(true);
        try {
            // 1. Fetch user-specific owned vault items
            let userOwned = [];
            try {
                const userVaultRes = await vaultService.getUserVault();
                if (userVaultRes && Array.isArray(userVaultRes.protocols)) {
                    userOwned = userVaultRes.protocols.map((p, idx) => ({
                        id: p._id,
                        _id: p._id,
                        serialNumber: p.serialNumber || (idx + 1),
                        totalCodes: p.vaultCard?.codes?.length || 10,
                        name: p.vaultCard?.name === '1/10' ? `SHADOW PROTOCOL HOODIE` : (p.vaultCard?.name || p.assetName || 'Synchronized Protocol'),
                        description: p.vaultCard?.description || '',
                        image: p.vaultCard?.backImage || p.vaultCard?.frontImage || p.assetImage,
                        frontImageUrl: p.vaultCard?.frontImage || p.assetImage,
                        backImageUrl: p.vaultCard?.backImage || p.vaultCard?.frontImage,
                        tier: (p.vaultCard?.tier || 'rare').toLowerCase(),
                        syncCode: p.syncCode || '',
                        isOwned: true,
                        isUnlocked: true,
                        _source: 'protocol'
                    }));
                }
            } catch (err) {
                console.error("Failed to fetch user vault items:", err);
            }

            // 2. Fetch global gallery
            let gallery = [];
            try {
                const galleryRes = await vaultService.getGlobalVaultItems();
                if (Array.isArray(galleryRes)) {
                    gallery = galleryRes.map((item, idx) => ({
                        id: item.id || item._id,
                        _id: item.id || item._id,
                        userName: item.userName || 'Anonymous Agent',
                        userAvatar: item.userAvatar,
                        name: item.cardName === '1/10' ? `SHADOW ARCHIVE 1/10` : (item.cardName || 'Archive Protocol'),
                        tier: (item.cardTier || 'rare').toLowerCase(),
                        image: item.frontImage,
                        frontImageUrl: item.frontImage,
                        backImageUrl: item.backImage,
                        serialNumber: item.serialNumber || (idx + 1),
                        totalCodes: item.totalCodes || 10,
                        vaultCardId: item.vaultCardId,
                        isCollected: true,
                        _source: 'global'
                    }));
                }
            } catch (err) {
                console.error("Failed to fetch global gallery:", err);
            }

            setOwnedAssets(userOwned);
            setGlobalGallery(gallery);

            // Update user credits from storage or profile
            const userInfoRaw = localStorage.getItem('userInfo');
            if (userInfoRaw) {
                const parsed = JSON.parse(userInfoRaw);
                setCredits(parsed.credits || 0);
            }
        } catch (error) {
            console.error("Vault data sync error:", error);
        } finally {
            setIsLoadingData(false);
        }
    }, []);

    useEffect(() => {
        loadVaultData();
    }, [loadVaultData]);

    const handleLoadingComplete = useCallback(() => {
        setLoadingDone(true);
        setVaultReady(true);
        gsap.to(pageRef.current, { opacity: 1, duration: 0.6 });
        gsap.to(headingRef.current, { opacity: 1, y: 0, duration: 0.6 });
    }, []);

    // ─── Redemption Submission Handler ───────────────────────────────────────
    const handleRedeem = async (e) => {
        if (e) e.preventDefault();
        const codeToSync = syncCode.trim().toUpperCase();
        if (!codeToSync || isSyncing) return;

        setIsSyncing(true);
        setSyncError(null);

        try {
            const result = await vaultService.syncVaultWithCode(codeToSync);
            if (result && (result.success || result.vaultItem)) {
                toast.success('DECRYPTION PROTOCOL VERIFIED & SYNCHRONIZED');
                setCongratsData(result);
                setSyncCode('');
                setShowCongrats(true);
                // Refresh data to immediately show newly redeemed card in Owned Assets
                await loadVaultData();
            } else {
                setSyncError('Invalid Decryption Protocol');
                toast.error('Invalid Decryption Protocol');
            }
        } catch (error) {
            console.error("Sync failed:", error);
            const msg = error.response?.data?.message || 'Invalid Decryption Protocol';
            setSyncError(msg);
            toast.error(msg);
        } finally {
            setIsSyncing(false);
        }
    };

    // ─── Derived Real Data Metrics ───────────────────────────────────────────
    const ownedCount = ownedAssets.length;
    const totalPossible = Math.max(15, globalGallery.length || 15);
    const progressPercent = Math.min(100, Math.round((ownedCount / totalPossible) * 100));

    // Dynamic Tier Counts derived from real application data
    // (If owned count is 0, we can also display pool stats for reference)
    const legendaryCount = ownedAssets.filter(item => item.tier === 'legendary').length;
    const rareCount = ownedAssets.filter(item => item.tier === 'rare' || item.tier === 'epic').length;
    const commonCount = ownedAssets.filter(item => item.tier === 'common').length;

    // Active displayed cards based on viewMode
    const displayAssets = useMemo(() => {
        if (viewMode === 'owned') {
            return ownedAssets;
        }
        // 'all' mode: show global archive items
        if (globalGallery.length > 0) return globalGallery;
        return ownedAssets;
    }, [viewMode, ownedAssets, globalGallery]);

    // Format asset identifier matching reference image (L-001, R-042, C-117)
    const getAssetIdentifier = (item, index) => {
        const tier = (item.tier || 'common').toLowerCase();
        const num = item.serialNumber || (index + 1);
        if (tier === 'legendary') return `L-${String(num).padStart(3, '0')}`;
        if (tier === 'rare' || tier === 'epic') return `R-${String(num).padStart(3, '0')}`;
        return `C-${String(num).padStart(3, '0')}`;
    };

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

            <div
                ref={pageRef}
                className="min-h-screen bg-[#050505] text-white font-body selection:bg-accent/30 opacity-0 relative overflow-x-hidden pt-16 md:pt-20"
            >
                <Toaster position="top-right" />

                {/* ─── BACKGROUND ARCHITECTURAL ATMOSPHERE & PURPLE UPLIGHTS ─── */}
                <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                    {/* Deep charcoal background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#09080d] via-[#050505] to-[#040404]" />

                    {/* Twin Left & Right Colonnade Purple Spotlight Glows */}
                    <div className="absolute top-1/4 -left-20 w-[450px] h-[700px] bg-[#a855f7]/15 blur-[140px] rounded-full" />
                    <div className="absolute top-1/4 -right-20 w-[450px] h-[700px] bg-[#a855f7]/15 blur-[140px] rounded-full" />

                    {/* Central Sanctuary Uplight */}
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[550px] bg-gradient-to-b from-[#a855f7]/18 via-[#7e22ce]/8 to-transparent blur-[120px] rounded-full" />

                    {/* Subtle Floor Reflection Glow */}
                    <div className="absolute top-[580px] left-1/2 -translate-x-1/2 w-[600px] h-[180px] bg-[#a855f7]/12 blur-[80px] rounded-full" />

                    {/* Subtle Architectural Grid Lines */}
                    <div
                        className="absolute inset-0 opacity-[0.035]"
                        style={{
                            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
                            backgroundSize: '80px 80px'
                        }}
                    />
                </div>

                {/* ─── FLOATING SIDE ARCHIVAL BANNERS (Framing like Reference Image) ─── */}
                <div className="hidden xl:flex fixed left-8 top-36 z-20 flex-col items-center gap-4 pointer-events-none">
                    <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-white/10" />
                    <div className="px-3 py-6 rounded-md bg-black/60 border border-white/5 backdrop-blur-md flex flex-col items-center text-center shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                        <span className="text-[9px] font-mono tracking-[0.35em] text-white/40 uppercase leading-loose font-bold [writing-mode:vertical-rl] rotate-180">
                            WE EXIST TWICE
                        </span>
                        <SideBannerEmblem />
                    </div>
                </div>

                <div className="hidden xl:flex fixed right-8 top-36 z-20 flex-col items-center gap-4 pointer-events-none">
                    <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-white/10" />
                    <div className="px-3 py-6 rounded-md bg-black/60 border border-white/5 backdrop-blur-md flex flex-col items-center text-center shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                        <span className="text-[9px] font-mono tracking-[0.35em] text-white/40 uppercase leading-loose font-bold [writing-mode:vertical-rl] rotate-180">
                            PHYSICAL X DIGITAL
                        </span>
                        <SideBannerEmblem />
                    </div>
                </div>

                {/* ─── HERO ARCHIVE ACCESS & REDEMPTION SECTION ─── */}
                <header className="relative z-10 pt-10 pb-8 px-4 sm:px-6">
                    <div className="max-w-[1400px] mx-auto flex flex-col items-center text-center">
                        {/* 1. Gothic Arch Keyhole Icon */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <GothicKeyholeArch />
                        </motion.div>

                        {/* 2. Eyebrow: THE */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-[#D4AF37] font-cinzel text-xs md:text-sm font-semibold tracking-[0.55em] uppercase mb-1 drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                        >
                            THE
                        </motion.div>

                        {/* 3. Main Heading: VAULT (Oversized Serif Display Font) */}
                        <motion.h1
                            ref={headingRef}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-cinzel font-normal tracking-[0.12em] uppercase leading-none select-none bg-gradient-to-b from-white via-[#f5f3ff] to-[#c084fc] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(168,85,247,0.35)]"
                        >
                            VAULT
                        </motion.h1>

                        {/* 4. Subtitle: — PRIVATE ARCHIVE ACCESS — */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.35 }}
                            className="flex items-center justify-center gap-3 md:gap-4 mt-3 mb-6"
                        >
                            <div className="w-8 md:w-16 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/70" />
                            <span className="text-[#D4AF37] text-[10px] sm:text-xs md:text-sm font-mono font-medium tracking-[0.4em] uppercase">
                                PRIVATE ARCHIVE ACCESS
                            </span>
                            <div className="w-8 md:w-16 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/70" />
                        </motion.div>

                        {/* 5. Supporting Mission Text */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.45 }}
                            className="space-y-1 text-center max-w-lg mb-10"
                        >
                            <p className="text-white/60 text-xs sm:text-sm font-body tracking-[0.08em]">
                                Your access. Your legacy.
                            </p>
                            <p className="text-white/40 text-[11px] sm:text-xs font-body tracking-[0.06em]">
                                Every physical piece leaves a{' '}
                                <span className="text-[#c084fc] drop-shadow-[0_0_8px_rgba(168,85,247,0.7)] font-semibold">
                                    digital echo.
                                </span>
                            </p>
                        </motion.div>

                        {/* 6. Centered Redemption Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.55 }}
                            className="relative w-full max-w-[460px] mx-auto"
                        >
                            {/* Purple puddle reflection on the floor underneath panel */}
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-16 bg-[#a855f7]/25 blur-2xl rounded-full pointer-events-none" />

                            <div className="relative bg-[#09090d]/95 backdrop-blur-2xl border border-white/10 hover:border-white/20 rounded-2xl p-6 sm:p-8 text-center shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(168,85,247,0.12)] transition-all duration-300">
                                {/* Top Badge: AUTHORIZATION REQUIRED */}
                                <div className="flex items-center justify-center gap-2 mb-3">
                                    <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                                    <span className="text-[9px] font-mono tracking-[0.25em] text-[#D4AF37] font-bold uppercase">
                                        AUTHORIZATION REQUIRED
                                    </span>
                                </div>

                                {/* Heading: ENTER REDEMPTION CODE */}
                                <h3 className="text-white text-xs sm:text-sm font-heading font-black tracking-[0.25em] uppercase mb-6">
                                    ENTER REDEMPTION CODE
                                </h3>

                                {/* Form & Input */}
                                <form onSubmit={handleRedeem} className="space-y-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={syncCode}
                                            onChange={(e) => {
                                                setSyncCode(e.target.value.toUpperCase());
                                                if (syncError) setSyncError(null);
                                            }}
                                            placeholder="ENTER CODE"
                                            disabled={isSyncing}
                                            className="w-full bg-[#050507] border border-white/10 rounded-lg py-3.5 px-4 font-mono text-center text-xs sm:text-sm text-[#D4AF37] tracking-[0.35em] placeholder:text-white/20 placeholder:tracking-[0.25em] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 transition-all uppercase disabled:opacity-50"
                                        />

                                        {syncError && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -4 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex items-center justify-center gap-1.5 mt-2 text-red-400 font-mono text-[9px] tracking-widest uppercase"
                                            >
                                                <AlertCircle className="w-3 h-3" />
                                                <span>{syncError}</span>
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Wide Gold Redeem Button */}
                                    <button
                                        type="submit"
                                        disabled={isSyncing || !syncCode.trim()}
                                        className="w-full py-3.5 px-6 rounded-lg bg-gradient-to-r from-[#D4AF37] via-[#e5c158] to-[#c59d2a] hover:from-white hover:to-white text-black font-heading font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_8px_25px_rgba(212,175,55,0.2)] disabled:opacity-50 disabled:cursor-not-allowed group active:scale-[0.99]"
                                    >
                                        {isSyncing ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
                                                <span>AUTHENTICATING...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <span>REDEEM ASSET</span>
                                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                            </>
                                        )}
                                    </button>
                                </form>

                                {/* Bottom Security Footer */}
                                <div className="flex items-center justify-center gap-2 mt-5 text-[8px] sm:text-[9px] font-mono tracking-[0.25em] text-white/30 uppercase">
                                    <Shield className="w-3.5 h-3.5 text-white/30" />
                                    <span>AUTHORIZED HOLDERS ONLY</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </header>

                {/* ─── MAIN ASSET GRID & BOTTOM ARCHIVE SUMMARY ─── */}
                <main className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-32">
                    {/* Section Header: OWNED ASSETS & VIEW ALL ASSETS */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#a855f7] shadow-[0_0_10px_#a855f7] animate-pulse" />
                            <h2 className="text-xs sm:text-sm md:text-base font-mono font-bold tracking-[0.25em] text-white uppercase">
                                {viewMode === 'owned' ? 'OWNED ASSETS' : 'GLOBAL ARCHIVE ASSETS'}
                            </h2>
                            <span className="text-[10px] font-mono text-white/40">
                                ({displayAssets.length})
                            </span>
                        </div>

                        {/* Right-side Toggle / Action */}
                        <button
                            onClick={() => {
                                if (viewMode === 'owned') {
                                    if (globalGallery.length > 0) {
                                        setViewMode('all');
                                    } else {
                                        navigate('/collections');
                                    }
                                } else {
                                    setViewMode('owned');
                                }
                            }}
                            className="flex items-center gap-2 text-[10px] sm:text-xs font-mono tracking-[0.2em] text-white/50 hover:text-[#D4AF37] uppercase transition-colors group cursor-pointer"
                        >
                            <span>
                                {viewMode === 'owned' ? 'VIEW ALL ASSETS' : 'VIEW OWNED ONLY'}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>

                    {/* Asset Cards Grid */}
                    {displayAssets.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
                            {displayAssets.map((item, index) => {
                                const tier = (item.tier || 'rare').toLowerCase();
                                const isLegendary = tier === 'legendary';
                                const isRare = tier === 'rare' || tier === 'epic';
                                const assetId = getAssetIdentifier(item, index);

                                return (
                                    <motion.div
                                        key={item.id || item._id || index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                                        onClick={() => setPreviewItem(item)}
                                        className={`group relative rounded-2xl bg-[#08080c] overflow-hidden transition-all duration-500 cursor-pointer border flex flex-col justify-between ${
                                            isLegendary
                                                ? 'border-[#D4AF37]/40 hover:border-[#D4AF37]/80 shadow-[0_0_30px_rgba(212,175,55,0.08)] hover:shadow-[0_0_45px_rgba(212,175,55,0.2)]'
                                                : isRare
                                                ? 'border-[#a855f7]/40 hover:border-[#a855f7]/80 shadow-[0_0_30px_rgba(168,85,247,0.12)] hover:shadow-[0_0_45px_rgba(168,85,247,0.25)]'
                                                : 'border-white/10 hover:border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.03)]'
                                        }`}
                                    >
                                        {/* Top Meta Bar */}
                                        <div className="p-4 sm:p-5 flex items-center justify-between z-10">
                                            {/* Rarity Pill Badge */}
                                            <span
                                                className={`text-[8px] sm:text-[9px] font-mono font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded-sm ${
                                                    isLegendary
                                                        ? 'border border-[#D4AF37]/50 text-[#D4AF37] bg-[#D4AF37]/10'
                                                        : isRare
                                                        ? 'border border-[#a855f7]/50 text-[#c084fc] bg-[#a855f7]/10'
                                                        : 'border border-white/20 text-white/70 bg-white/5'
                                                }`}
                                            >
                                                {tier.toUpperCase()}
                                            </span>

                                            {/* Asset Serial Identifier */}
                                            <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-white/40 font-semibold">
                                                {assetId}
                                            </span>
                                        </div>

                                        {/* Central Product Image */}
                                        <div className="relative aspect-[3/4] w-full flex items-center justify-center overflow-hidden px-4">
                                            {/* Ambient backdrop glow for image */}
                                            <div
                                                className={`absolute inset-0 opacity-20 transition-opacity duration-700 group-hover:opacity-40 ${
                                                    isLegendary
                                                        ? 'bg-radial-gradient from-[#D4AF37]/30 to-transparent'
                                                        : isRare
                                                        ? 'bg-radial-gradient from-[#a855f7]/30 to-transparent'
                                                        : 'bg-radial-gradient from-white/10 to-transparent'
                                                }`}
                                            />

                                            <img
                                                src={getImageUrl(item.image || item.frontImageUrl || item.frontImage || item.backImageUrl)}
                                                alt={item.name}
                                                className="w-full h-full object-contain p-2 rounded-lg transition-transform duration-700 ease-out group-hover:scale-105"
                                            />

                                            {/* Subtle bottom gradient to blend image into card footer */}
                                            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#08080c] to-transparent pointer-events-none" />
                                        </div>

                                        {/* Bottom Information Row */}
                                        <div className="p-4 sm:p-5 z-10 relative">
                                            <div className="flex items-end justify-between gap-4">
                                                <div>
                                                    <h3 className="text-xs sm:text-sm font-heading font-black text-white uppercase tracking-wider mb-1 line-clamp-1 group-hover:text-[#D4AF37] transition-colors">
                                                        {item.name}
                                                    </h3>
                                                    <div className="text-[8px] font-mono tracking-[0.2em] text-white/40 uppercase space-y-0.5">
                                                        <p>PHYSICAL ASSET</p>
                                                        <p>DIGITAL ECHO</p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end">
                                                    <IsometricCubeIcon />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Centered Bottom Border Emblem (Crown for Legendary, Gem for Rare, Cube for Common) */}
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20">
                                            <div
                                                className={`w-7 h-7 rounded-full bg-[#08080c] border flex items-center justify-center shadow-lg ${
                                                    isLegendary
                                                        ? 'border-[#D4AF37] text-[#D4AF37]'
                                                        : isRare
                                                        ? 'border-[#a855f7] text-[#c084fc]'
                                                        : 'border-white/20 text-white/50'
                                                }`}
                                            >
                                                {isLegendary ? (
                                                    <Crown className="w-3.5 h-3.5 fill-[#D4AF37]/20" />
                                                ) : isRare ? (
                                                    <Gem className="w-3.5 h-3.5 fill-[#a855f7]/20" />
                                                ) : (
                                                    <Box className="w-3.5 h-3.5" />
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        /* Empty State when User has no Owned Assets */
                        <div className="rounded-2xl bg-[#09090d]/80 border border-white/10 p-12 text-center max-w-xl mx-auto my-12 backdrop-blur-xl">
                            <div className="w-16 h-16 rounded-full bg-[#a855f7]/10 border border-[#a855f7]/30 flex items-center justify-center mx-auto mb-6 text-[#c084fc]">
                                <Lock className="w-6 h-6" />
                            </div>
                            <h3 className="text-white font-heading font-black text-base sm:text-lg tracking-[0.2em] uppercase mb-2">
                                NO ASSETS CURRENTLY IN ARCHIVE
                            </h3>
                            <p className="text-white/40 text-xs font-mono uppercase tracking-widest leading-relaxed mb-6">
                                Enter a redemption protocol code above to decrypt your exclusive pieces, or explore the global registry.
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                {globalGallery.length > 0 && (
                                    <button
                                        onClick={() => setViewMode('all')}
                                        className="px-6 py-3 bg-[#D4AF37] text-black font-heading font-black text-[10px] uppercase tracking-[0.25em] hover:bg-white transition-all rounded-md"
                                    >
                                        EXPLORE GLOBAL ARCHIVE ({globalGallery.length})
                                    </button>
                                )}
                                <button
                                    onClick={() => navigate('/collections')}
                                    className="px-6 py-3 border border-white/20 text-white/70 hover:text-white hover:border-white font-mono text-[10px] uppercase tracking-[0.2em] transition-all rounded-md"
                                >
                                    BROWSE COLLECTIONS
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ─── COLLECTION PROGRESS & RARITY SUMMARY PANEL ─── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="rounded-2xl bg-[#08080c] border border-white/10 p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
                    >
                        {/* 1. Circular Progress Donut */}
                        <div className="flex items-center gap-5 w-full lg:w-auto justify-center lg:justify-start">
                            <div className="relative w-14 h-14 flex items-center justify-center">
                                <svg className="w-14 h-14 -rotate-90">
                                    <circle
                                        cx="28"
                                        cy="28"
                                        r="24"
                                        stroke="rgba(255,255,255,0.08)"
                                        strokeWidth="4"
                                        fill="transparent"
                                    />
                                    <circle
                                        cx="28"
                                        cy="28"
                                        r="24"
                                        stroke="#a855f7"
                                        strokeWidth="4"
                                        strokeDasharray={2 * Math.PI * 24}
                                        strokeDashoffset={(2 * Math.PI * 24) * (1 - progressPercent / 100)}
                                        strokeLinecap="round"
                                        fill="transparent"
                                        className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]"
                                    />
                                </svg>
                            </div>

                            <div>
                                <div className="text-[8px] sm:text-[9px] font-mono tracking-[0.25em] text-white/40 uppercase mb-0.5">
                                    COLLECTION PROGRESS
                                </div>
                                <div className="text-xl sm:text-2xl font-heading font-black text-white tracking-wider flex items-baseline gap-1.5">
                                    <span>{String(ownedCount).padStart(2, '0')}</span>
                                    <span className="text-white/40 font-normal text-base sm:text-lg">/</span>
                                    <span className="text-white/40 font-normal text-base sm:text-lg">
                                        {String(totalPossible).padStart(2, '0')}
                                    </span>
                                </div>
                                <div className="text-[8px] font-mono tracking-[0.25em] text-white/40 uppercase">
                                    ASSETS OWNED
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="hidden lg:block w-px h-12 bg-white/10" />

                        {/* 2. Legendary Count */}
                        <div className="flex flex-col items-center text-center">
                            <Crown className="w-4 h-4 text-[#D4AF37] mb-1 drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]" />
                            <div className="text-xl sm:text-2xl font-heading font-black text-white tracking-wide">
                                {legendaryCount}
                            </div>
                            <div className="text-[8px] sm:text-[9px] font-mono tracking-[0.25em] text-[#D4AF37] font-bold uppercase">
                                LEGENDARY
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="hidden lg:block w-px h-12 bg-white/10" />

                        {/* 3. Rare Count */}
                        <div className="flex flex-col items-center text-center">
                            <Gem className="w-4 h-4 text-[#a855f7] mb-1 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
                            <div className="text-xl sm:text-2xl font-heading font-black text-white tracking-wide">
                                {rareCount}
                            </div>
                            <div className="text-[8px] sm:text-[9px] font-mono tracking-[0.25em] text-[#c084fc] font-bold uppercase">
                                RARE
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="hidden lg:block w-px h-12 bg-white/10" />

                        {/* 4. Common Count */}
                        <div className="flex flex-col items-center text-center">
                            <Box className="w-4 h-4 text-white/40 mb-1" />
                            <div className="text-xl sm:text-2xl font-heading font-black text-white tracking-wide">
                                {commonCount}
                            </div>
                            <div className="text-[8px] sm:text-[9px] font-mono tracking-[0.25em] text-white/40 font-bold uppercase">
                                COMMON
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="hidden lg:block w-px h-12 bg-white/10" />

                        {/* 5. Lock Icon & Mission Slogan */}
                        <div className="flex items-center gap-4 w-full lg:w-auto justify-center lg:justify-start">
                            <div className="w-12 h-12 rounded-xl bg-[#a855f7]/10 border border-[#a855f7]/30 flex items-center justify-center text-[#c084fc] shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                                <Lock className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <div className="text-[#a855f7] font-mono font-bold text-[9px] sm:text-[10px] tracking-[0.25em] uppercase mb-0.5">
                                    HOLD. REDEEM. OWN.
                                </div>
                                <div className="text-white/40 font-mono text-[8px] sm:text-[9px] tracking-[0.15em] leading-tight">
                                    Your access.
                                    <br />
                                    Your legacy.
                                    <br />
                                    Stored forever.
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </main>

                {/* ─── CARD INSPECTION & DETAILS MODAL (Preserved Feature) ─── */}
                <AnimatePresence>
                    {previewItem && (
                        <div
                            className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 sm:p-8"
                            onClick={() => setPreviewItem(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                                className="relative w-full max-w-4xl bg-[#09090d] border border-white/20 shadow-[0_0_80px_rgba(168,85,247,0.3)] rounded-3xl overflow-hidden p-6 md:p-12 flex flex-col items-center justify-center min-h-[40vh]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Close Button */}
                                <button
                                    onClick={() => setPreviewItem(null)}
                                    className="absolute top-6 right-6 z-[2010] text-white/40 hover:text-white transition-colors p-2"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center w-full px-2 md:px-4 mt-6 md:mt-0">
                                    <div className="relative h-[300px] md:h-[460px] flex items-center justify-center">
                                        <div className="absolute inset-0 bg-[#a855f7]/15 blur-[120px] rounded-full pointer-events-none" />
                                        <DressItem item={previewItem} vaultReady={true} />
                                    </div>

                                    <div className="space-y-6 text-center md:text-left">
                                        <div className="space-y-3">
                                            <span
                                                className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase px-3 py-1 rounded-sm border inline-block"
                                                style={{
                                                    color: tierAccent(previewItem.tier),
                                                    borderColor: `${tierAccent(previewItem.tier)}55`,
                                                    backgroundColor: `${tierAccent(previewItem.tier)}15`
                                                }}
                                            >
                                                ARCHIVE TIER: // {previewItem.tier}
                                            </span>
                                            <h2 className="text-2xl md:text-4xl font-heading font-black tracking-tight uppercase leading-tight text-white">
                                                {previewItem.name}
                                            </h2>
                                            <div className="flex items-center justify-center md:justify-start gap-3">
                                                <div className="h-px w-8 bg-[#D4AF37]/50" />
                                                <span className="text-[10px] font-mono text-white/50 tracking-widest uppercase">
                                                    PROTOCOL VERIFIED
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {previewItem.userName && (
                                                <div className="space-y-1">
                                                    <p className="text-[9px] font-mono text-white/40 uppercase tracking-[0.2em]">
                                                        Synchronized By
                                                    </p>
                                                    <p className="text-lg md:text-xl font-heading font-black text-[#D4AF37]">
                                                        AGENT {previewItem.userName.toUpperCase()}
                                                    </p>
                                                </div>
                                            )}

                                            <p className="text-gray-400 font-light tracking-wide leading-relaxed uppercase text-xs md:text-sm max-w-sm mx-auto md:mx-0">
                                                {previewItem.description && !previewItem.description.includes('8394726150')
                                                    ? previewItem.description
                                                    : "Experimental digital artifact bound to physical luxury. Official piece of the Endura Vault protocol."}
                                            </p>

                                            <div className="flex flex-wrap gap-4 justify-center md:justify-start font-mono text-[9px] tracking-tight text-[#D4AF37]/80">
                                                <span>PHASE: 01_DECRYPTION</span>
                                                <span className="text-white/20">|</span>
                                                <span>REWARDS: SYNC_READY</span>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-white/10 flex flex-wrap gap-3 justify-center md:justify-start">
                                            <div className="px-4 py-2 border border-[#D4AF37]/30 bg-[#D4AF37]/5 rounded-full text-[9px] font-mono uppercase tracking-widest text-[#D4AF37]">
                                                LEGACY STATUS: ACTIVE
                                            </div>
                                            <div className="px-4 py-2 border border-white/10 bg-white/5 rounded-full text-[9px] font-mono uppercase tracking-widest text-white/40">
                                                DATA_SECURED
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* ─── SYNCHRONIZATION CONGRATULATIONS OVERLAY ─── */}
                <AnimatePresence>
                    {showCongrats && (
                        <VaultCongratsOverlay
                            oldScore={congratsData?.oldScore}
                            newScore={congratsData?.newScore}
                            creditDelta={congratsData?.creditDelta}
                            accent={tierAccent(congratsData?.vaultItem?.vaultCard?.tier || 'rare')}
                            serialNumber={`${congratsData?.vaultItem?.serialNumber || '1'} / ${congratsData?.vaultItem?.vaultCard?.codes?.length || 10}`}
                            tier={congratsData?.vaultItem?.vaultCard?.tier || 'RARE'}
                            onEnterDashboard={() => {
                                setShowCongrats(false);
                                navigate('/dashboard');
                            }}
                            onClose={() => setShowCongrats(false)}
                        >
                            <div className="relative w-full h-full rounded-2xl bg-black border border-white/40 overflow-hidden shadow-[0_0_80px_rgba(168,85,247,0.3)]">
                                <DressItem
                                    item={{
                                        ...congratsData?.vaultItem,
                                        name: congratsData?.vaultItem?.vaultCard?.name,
                                        image: congratsData?.vaultItem?.vaultCard?.frontImage,
                                        backImageUrl: congratsData?.vaultItem?.vaultCard?.backImage,
                                        tier: congratsData?.vaultItem?.vaultCard?.tier
                                    }}
                                    vaultReady={true}
                                />
                            </div>
                        </VaultCongratsOverlay>
                    )}
                </AnimatePresence>

                {/* ─── REWARD UNLOCK OVERLAY (Preserved) ─── */}
                {rewardUnlockItem && (
                    <RewardUnlockOverlay
                        item={rewardUnlockItem}
                        onClose={() => setRewardUnlockItem(null)}
                    />
                )}
            </div>
        </>
    );
};

export default Vault;
