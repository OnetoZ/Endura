import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ArrowLeft, Sparkles, ExternalLink, Shield, User as UserIcon } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import { useStore } from '../context/StoreContext';
import { vaultService, getImageUrl } from '../services/api';

// ─── Tier Accent ────────────────────────────────────────────────────────────
const tierAccent = (tier) => {
    const t = tier ? tier.toLowerCase() : '';
    if (t === 'common') return '#c0c0c0'; // Silver
    if (t === 'rare') return '#3b82f6';   // Blue / Diamond
    if (t === 'epic') return '#d4af37';   // Gold
    if (t === 'legendary') return '#a855f7'; // Purple
    return '#c0c0c0';
};

// ─── Grid Card ──────────────────────────────────────────────────────────────
const CollectedCard = ({ item, onClick, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const accent = tierAccent(item.cardTier);

    return (
        <motion.div
            whileHover={{ y: -10 }}
            onClick={() => onClick(item)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="collected-card-reveal group relative w-full h-[420px] flex flex-col items-center justify-center cursor-pointer transition-all duration-700"
        >
            {/* AMBIENT LIGHTING (No Box) */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-1000 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at center, ${accent}33 0%, transparent 70%)`,
                    filter: 'blur(60px)'
                }}
            />

            {/* IMMERSIVE HUD SYSTEM */}
            <div className="absolute inset-0 pointer-events-none z-20">
                {/* Large Corner Brackets */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 opacity-10 group-hover:opacity-100 transition-all duration-1000" style={{ borderColor: accent }} />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 opacity-10 group-hover:opacity-100 transition-all duration-1000" style={{ borderColor: accent }} />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 opacity-10 group-hover:opacity-100 transition-all duration-1000" style={{ borderColor: accent }} />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 opacity-10 group-hover:opacity-100 transition-all duration-1000" style={{ borderColor: accent }} />

                {/* Scan Energy Line */}
                <motion.div
                    animate={{ top: ['10%', '90%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-x-12 h-[1px] opacity-0 group-hover:opacity-40"
                    style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
                />
            </div>

            {/* FLOATING ARTIFACT */}
            <motion.div
                className="relative z-10"
                animate={{
                    y: [-15, 15, -15],
                    rotateY: isHovered ? [0, 15, -15, 0] : 0,
                    scale: isHovered ? 1.1 : 1
                }}
                transition={{
                    y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 },
                    rotateY: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                    scale: { duration: 1, ease: "easeOut" }
                }}
            >
                <img
                    src={getImageUrl(item.frontImage)}
                    alt={item.cardName}
                    className="h-56 object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all duration-1000"
                />

                {/* Reflection effect */}
                <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 w-32 h-8 bg-white/5 blur-xl rounded-[50%] opacity-20 group-hover:opacity-40 transition-opacity" />
            </motion.div>

            {/* COLLECTION STATUS INTERFACE */}
            <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-3 z-30 pointer-events-none">
                <div className="h-[1px] w-0 group-hover:w-32 bg-white/10 transition-all duration-1000" />

                <div className="text-center">
                    <h3
                        className="text-lg font-heading font-black tracking-[0.4em] text-white uppercase transition-colors duration-500"
                        style={{ color: isHovered ? accent : 'white' }}
                    >
                        {item.cardName}
                    </h3>
                    <div className="flex items-center justify-center gap-3 mt-1">
                        <span className="text-[9px] font-mono tracking-[0.3em] text-white/30 uppercase">{item.cardTier} ARCHIVE</span>
                        <div className="w-1 h-1 rounded-full bg-accent group-hover:animate-ping" />
                        <span
                            className="text-[9px] font-mono tracking-[0.5em] uppercase font-bold"
                            style={{ color: accent }}
                        >
                            #{item.serialNumber || '001'}
                        </span>
                    </div>
                </div>

                {/* User Info Footer */}
                <div className="flex flex-col items-center gap-2 mt-4">
                     <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                        <UserIcon className="w-2.5 h-2.5 text-accent" />
                        <span className="text-[8px] font-mono text-white/60 tracking-wider uppercase">
                            AGENT: {item.userName}
                        </span>
                    </div>
                    <div className="flex gap-4 opacity-0 group-hover:opacity-40 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                        <span className="text-[7px] font-mono text-white/50 tracking-tighter uppercase">ARCHIVE_SECURED</span>
                    </div>
                </div>
            </div>

            {/* Corner Marker */}
            <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-40 transition-all duration-500 scale-50 group-hover:scale-100">
                <ExternalLink className="w-4 h-4 text-white" />
            </div>
        </motion.div>
    );
};

// ─── Detail View Modal ──────────────────────────────────────────────────────
const ItemDetailModal = ({ item, onClose }) => {
    const accent = tierAccent(item.cardTier);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 md:p-12"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 1.1, opacity: 0, y: -20 }}
                className="relative w-full max-w-4xl bg-black border border-white/10 rounded-3xl overflow-hidden flex flex-col lg:flex-row pointer-events-auto shadow-[0_0_100px_rgba(212,175,55,0.1)]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* HUD Corners */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-white/10 m-8" />
                <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-white/10 m-8" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-white/10 m-8" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-white/10 m-8" />

                {/* Left: Holographic Asset Display */}
                <div className="w-full lg:w-1/2 relative flex items-center justify-center p-12 lg:p-20 overflow-hidden bg-white/[0.02]">
                    <div className="absolute inset-0 bg-radial-gradient from-accent/5 via-transparent to-transparent" />
                    
                    <motion.div
                        animate={{ y: [-15, 15, -15], rotateY: [0, 10, -10, 0] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-10"
                    >
                        <img
                            src={getImageUrl(item.frontImage)}
                            alt={item.cardName}
                            className="h-72 lg:h-96 object-contain drop-shadow-[0_0_60px_rgba(255,255,255,0.1)]"
                        />
                    </motion.div>
                </div>

                {/* Right: Technical Readout */}
                <div className="w-full lg:w-1/2 p-12 lg:p-16 flex flex-col justify-center space-y-10 relative bg-black">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-[9px] font-mono tracking-[0.5em] text-accent uppercase">
                            <div className="w-4 h-[1px] bg-accent" />
                            <span>Global Archive Verification</span>
                        </div>
                        <h2 className="text-4xl lg:text-6xl font-heading font-black tracking-tight text-white uppercase leading-none">
                            {item.cardName}
                        </h2>
                    </div>

                    <div className="space-y-8 pt-8 border-t border-white/5">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <p className="text-[8px] font-mono text-white/30 tracking-[0.3em] uppercase">Collector</p>
                                <p className="text-sm font-heading font-black tracking-widest text-white uppercase">
                                    {item.userName}
                                </p>
                            </div>
                            <div className="space-y-2 text-right">
                                <p className="text-[8px] font-mono text-white/30 tracking-[0.3em] uppercase">Serial</p>
                                <p className="text-sm font-heading font-black tracking-widest text-accent uppercase">
                                    #{item.serialNumber}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-end border-b border-white/5 pb-3">
                                <span className="text-[8px] font-mono text-white/30 tracking-[0.3em] uppercase">Tier</span>
                                <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: accent }}>{item.cardTier}</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-white/5 pb-3">
                                <span className="text-[8px] font-mono text-white/30 tracking-[0.3em] uppercase">Collected</span>
                                <span className="text-[10px] font-mono text-white/60 tracking-widest uppercase">
                                    {new Date(item.collectedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-5 bg-white/5 border border-white/10 text-[10px] font-heading font-black tracking-[0.5em] text-white/60 hover:text-white hover:border-accent hover:bg-accent/5 transition-all uppercase flex items-center justify-center gap-4 group"
                    >
                        <span>BACK_TO_GALLERY</span>
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-2 transition-transform" />
                    </button>
                    
                    <div className="absolute bottom-8 right-8 text-[6px] font-mono text-white/10 tracking-[0.8em] uppercase">
                        Endura://Global_Registry
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─── Main Collected Page ─────────────────────────────────────────────────────
const CollectedPage = () => {
    const navigate = useNavigate();
    const [globalItems, setGlobalItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const fetchGlobalItems = async () => {
            try {
                const data = await vaultService.getGlobalVaultItems();
                setGlobalItems(data);
            } catch (error) {
                console.error("Failed to fetch global collections:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGlobalItems();
    }, []);

    // Scroll Reveal animation
    useEffect(() => {
        if (loading || globalItems.length === 0) return;
        
        const ctx = gsap.context(() => {
            gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power2.out' });
            const cards = gsap.utils.toArray('.collected-card-reveal');
            cards.forEach((card) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: "top 90%",
                        toggleActions: "play none none reverse"
                    },
                    y: 60,
                    opacity: 0,
                    scale: 0.95,
                    duration: 1.5,
                    ease: "power4.out"
                });
            });
        }, containerRef);
        return () => ctx.revert();
    }, [loading, globalItems]);

    return (
        <div ref={containerRef} className="min-h-screen bg-black text-white selection:bg-accent/30 overflow-x-hidden pt-24">
            <Toaster position="top-right" />

            {/* Background Atmosphere */}
            <div
                className="fixed inset-0 pointer-events-none opacity-40"
                style={{ background: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.05), transparent 70%)' }}
            />

            {/* Header */}
            <header className="relative z-50 pt-16 pb-24">
                <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="flex-1 w-full order-2 md:order-1">
                        <button
                            onClick={() => navigate('/vault')}
                            className="group flex items-center gap-4 text-[10px] font-mono tracking-[0.5em] text-white/30 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
                            <span>ACCESS_VAULT_UNIT</span>
                        </button>
                    </div>

                    <div className="flex-1 text-center order-1 md:order-2">
                        <div className="flex items-center justify-center gap-3 text-[10px] font-mono tracking-[0.8em] text-accent uppercase mb-4">
                            <Sparkles className="w-4 h-4" />
                            <span>Global Protocol History</span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-heading font-black tracking-[0.1em] text-white uppercase leading-none">
                            COLLECTED ARCHIVE
                        </h1>
                    </div>

                    <div className="flex-1 flex justify-end order-3">
                        <div className="text-right border-r border-white/10 pr-8">
                            <p className="text-[9px] font-mono text-white/20 tracking-[0.4em] uppercase mb-1">Total Minted</p>
                            <p className="text-2xl font-heading text-white">{globalItems.length}</p>
                        </div>
                        <div className="pl-8 text-left">
                            <p className="text-[9px] font-mono text-white/20 tracking-[0.4em] uppercase mb-1">Status</p>
                            <p className="text-2xl font-heading text-accent">PUBLIC</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Grid Content */}
            <main className="relative z-10 max-w-[1400px] mx-auto px-6 pb-48">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-6">
                        <div className="w-12 h-12 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
                        <p className="text-[10px] font-mono tracking-[0.5em] text-white/40 uppercase">Loading Registry...</p>
                    </div>
                ) : globalItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-40 border border-white/5 bg-white/[0.02] rounded-3xl">
                        <Shield className="w-12 h-12 text-white/10 mb-8" />
                        <p className="text-[10px] font-mono tracking-[0.5em] text-white/40 uppercase">No active protocols detected in global archive</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 lg:gap-16">
                        {globalItems.map((item, index) => (
                            <div key={item.id} className="collected-card-reveal">
                                <CollectedCard
                                    item={item}
                                    index={index}
                                    onClick={setSelectedItem}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Modal Detail */}
            <AnimatePresence>
                {selectedItem && (
                    <ItemDetailModal
                        item={selectedItem}
                        onClose={() => setSelectedItem(null)}
                    />
                )}
            </AnimatePresence>

            <footer className="relative z-10 py-24 border-t border-white/5 bg-black">
                <div className="max-w-[1400px] mx-auto px-6 text-center">
                    <p className="text-[8px] font-mono tracking-[0.5em] text-white/20 uppercase">
                        Endura International Collective // Global Asset Registration // Node 0x99
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default CollectedPage;
