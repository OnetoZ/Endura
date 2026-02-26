import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ArrowLeft, Sparkles, ExternalLink, Calendar, Tag, Shield } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import { useStore } from '../context/StoreContext';

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
    const accent = tierAccent(item.tier);

    return (
        <motion.div
            whileHover={{ y: -10 }}
            onClick={() => onClick(item)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="collected-card-reveal group relative w-full h-[380px] flex flex-col items-center justify-center cursor-pointer transition-all duration-700"
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
                    src={item.image}
                    alt={item.name}
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
                        {item.name}
                    </h3>
                    <div className="flex items-center justify-center gap-3 mt-1">
                        <span className="text-[9px] font-mono tracking-[0.3em] text-white/30 uppercase">{item.tier} ARCHIVE</span>
                        <div className="w-1 h-1 rounded-full bg-accent group-hover:animate-ping" />
                        <span
                            className="text-[9px] font-mono tracking-[0.5em] uppercase font-bold"
                            style={{ color: accent }}
                        >
                            COLLECTION ARCHIVED
                        </span>
                    </div>
                </div>

                <div className="flex gap-4 opacity-0 group-hover:opacity-40 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                    <span className="text-[7px] font-mono text-white/50 tracking-tighter">ID: {item.id.slice(0, 8)}</span>
                    <span className="text-[7px] font-mono text-white/50 tracking-tighter">SECURE_LINK: VERIFIED</span>
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
    const accent = tierAccent(item.tier);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 md:p-12"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.1, opacity: 0 }}
                className="relative w-full max-w-3xl h-[500px] flex flex-col lg:flex-row pointer-events-auto"
            >
                {/* Embroidery Designed HUD Corners */}
                <div className="absolute top-0 left-0 w-24 h-24 z-30 pointer-events-none">
                    <div className="absolute top-0 left-0 w-16 h-16 border-t border-l" style={{ borderColor: `${accent}66` }} />
                    <div className="absolute top-2 left-2 w-12 h-12 border-t border-l" style={{ borderColor: `${accent}33` }} />
                    <div className="absolute top-[7px] left-[7px] w-1.5 h-1.5 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ backgroundColor: accent }} />
                </div>
                <div className="absolute top-0 right-0 w-24 h-24 z-30 pointer-events-none">
                    <div className="absolute top-0 right-0 w-16 h-16 border-t border-r" style={{ borderColor: `${accent}66` }} />
                    <div className="absolute top-2 right-2 w-12 h-12 border-t border-r" style={{ borderColor: `${accent}33` }} />
                    <div className="absolute top-[7px] right-[7px] w-1.5 h-1.5 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ backgroundColor: accent }} />
                </div>
                <div className="absolute bottom-0 left-0 w-24 h-24 z-30 pointer-events-none">
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l" style={{ borderColor: `${accent}66` }} />
                    <div className="absolute bottom-2 left-2 w-12 h-12 border-b border-l" style={{ borderColor: `${accent}33` }} />
                    <div className="absolute bottom-[7px] left-[7px] w-1.5 h-1.5 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ backgroundColor: accent }} />
                </div>
                <div className="absolute bottom-0 right-0 w-24 h-24 z-30 pointer-events-none">
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r" style={{ borderColor: `${accent}66` }} />
                    <div className="absolute bottom-2 right-2 w-12 h-12 border-b border-r" style={{ borderColor: `${accent}33` }} />
                    <div className="absolute bottom-[7px] right-[7px] w-1.5 h-1.5 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ backgroundColor: accent }} />
                </div>

                {/* Left: Holographic Asset Display */}
                <div className="w-full lg:w-1/2 relative flex items-center justify-center p-12 overflow-hidden">
                    {/* Ambient Glow */}
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{ background: `radial-gradient(circle at center, ${accent}88, transparent 70%)`, filter: 'blur(80px)' }}
                    />

                    {/* Asset ID Marker */}
                    <div className="absolute top-10 left-10 flex flex-col gap-1 opacity-20">
                        <span className="text-[6px] font-mono tracking-widest text-white uppercase">ID_ENTRY</span>
                        <span className="text-[8px] font-mono tracking-[0.2em] text-white uppercase font-black">{item.id.slice(0, 10)}</span>
                    </div>

                    <motion.div
                        animate={{ y: [-15, 15, -15] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-10"
                    >
                        <img
                            src={item.image}
                            alt={item.name}
                            className="h-64 object-contain drop-shadow-[0_0_60px_rgba(255,255,255,0.15)]"
                        />
                    </motion.div>

                    {/* HUD Status Marker */}
                    <div className="absolute bottom-10 left-10 flex items-center gap-3 opacity-30">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                        <span className="text-[8px] font-mono tracking-[0.4em] text-white uppercase">ARCHIVE_LOADED</span>
                    </div>
                </div>

                {/* Right: Technical Readout */}
                <div className="w-full lg:w-1/2 p-10 md:p-14 flex flex-col justify-center space-y-8 relative">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-[9px] font-mono tracking-[0.5em] text-accent uppercase">
                            <div className="w-4 h-[1px] bg-accent" />
                            <span>Verified archive entry</span>
                        </div>
                        <h2 className="text-4xl font-heading font-black tracking-tighter text-white uppercase leading-[0.9]">
                            {item.name}
                        </h2>
                    </div>

                    <div className="space-y-6 pt-4 border-t border-white/5">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <p className="text-[8px] font-mono text-white/30 tracking-[0.3em] uppercase">Tier.Classification</p>
                                <p className="text-xs font-heading font-black tracking-widest text-white uppercase flex items-center gap-2">
                                    <Shield className="w-3 h-3" style={{ color: accent }} /> {item.tier}
                                </p>
                            </div>
                            <div className="space-y-2 text-right">
                                <p className="text-[8px] font-mono text-white/30 tracking-[0.3em] uppercase">Auth.Status</p>
                                <p className="text-xs font-heading font-black tracking-widest text-accent uppercase">AUTHENTICATED</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-end border-b border-white/5 pb-2">
                                <span className="text-[8px] font-mono text-white/30 tracking-[0.3em] uppercase">Secure_Node</span>
                                <span className="text-[9px] font-mono text-white/60 tracking-widest uppercase">NODE_ARCHIVE_55</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-white/5 pb-2">
                                <span className="text-[8px] font-mono text-white/30 tracking-[0.3em] uppercase">Hash_Verification</span>
                                <span className="text-[9px] font-mono text-white/60 tracking-widest uppercase truncate ml-8">SHA256::D4AF37</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-transparent border border-white/10 text-[10px] font-heading font-black tracking-[0.4em] text-white/60 hover:text-white hover:border-accent group transition-all uppercase flex items-center justify-center gap-4"
                        >
                            <span>BACK_TO_ARCHIVE</span>
                            <motion.div
                                animate={{ x: [0, -4, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                <ArrowLeft className="w-3 h-3 group-hover:text-accent" />
                            </motion.div>
                        </button>
                    </div>

                    {/* Bottom Utility Text */}
                    <div className="absolute bottom-8 left-10 text-[7px] font-mono text-white/10 tracking-[0.5em] uppercase">
                        Endura://Asset_Management - Sect_5
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─── Main Collected Page ─────────────────────────────────────────────────────
const CollectedPage = () => {
    const navigate = useNavigate();
    const { products } = useStore();
    const [selectedItem, setSelectedItem] = useState(null);
    const containerRef = useRef(null);

    // ── Load items and filter for unlocked ones ───────────────────────────
    const items = useMemo(() => {
        const savedData = localStorage.getItem('endura_vault_persistence');
        if (!savedData) return [];

        const { unlockedItems: unlockedIds } = JSON.parse(savedData);
        if (!unlockedIds || unlockedIds.length === 0) return [];

        const vaultItems = products.filter(p =>
            p.type === 'physical' &&
            ['T-Shirt', 'Hoodie', 'Vest', 'Pants', 'Shorts', 'Jacket', 'Coat'].includes(p.subcategory)
        ).map((p, idx) => {
            let tier = 'common';
            if (idx % 8 === 0) tier = 'legendary';
            else if (idx % 5 === 0) tier = 'epic';
            else if (idx % 3 === 0) tier = 'rare';
            return { ...p, tier };
        });

        // Add special support for cards if needed, but usually cards translate to products
        return vaultItems.filter(item => unlockedIds.includes(item.id));
    }, [products]);

    // Scroll Reveal animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Container fade in
            gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power2.out' });

            // Card scroll reveal
            const cards = gsap.utils.toArray('.collected-card-reveal');
            cards.forEach((card, i) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: "top 90%",
                        toggleActions: "play none none reverse"
                    },
                    y: 60,
                    opacity: 0,
                    scale: 0.95,
                    duration: 3.5,
                    ease: "power4.out"
                });
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen bg-black text-white selection:bg-accent/30 overflow-x-hidden">
            <Toaster position="top-right" />

            {/* Background Atmosphere */}
            <div
                className="fixed inset-0 pointer-events-none opacity-40"
                style={{ background: 'radial-gradient(circle at 50% 0%, rgba(124, 58, 237, 0.1), transparent 70%)' }}
            />

            {/* Header */}
            <header className="relative z-50 pt-16 pb-24">
                <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
                    {/* Left: Back Link */}
                    <div className="flex-1 w-full order-2 md:order-1">
                        <button
                            onClick={() => navigate('/vault')}
                            className="group flex items-center gap-4 text-[10px] font-mono tracking-[0.5em] text-white/30 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
                            <span>BACK_TO_VAULT</span>
                        </button>
                    </div>

                    {/* Center: Title */}
                    <div className="flex-1 text-center order-1 md:order-2">
                        <div className="flex items-center justify-center gap-3 text-[10px] font-mono tracking-[0.8em] text-accent uppercase mb-4">
                            <Sparkles className="w-4 h-4" />
                            <span>Verified Assets</span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-heading font-black tracking-[0.1em] text-white uppercase leading-none">
                            COLLECTED ARCHIVE
                        </h1>
                    </div>

                    {/* Right: Stats */}
                    <div className="flex-1 flex justify-end order-3">
                        <div className="text-right border-r border-accent/20 pr-6">
                            <p className="text-[9px] font-mono text-white/20 tracking-[0.4em] uppercase mb-1">Total Assets</p>
                            <p className="text-xl font-heading text-white">{items.length}</p>
                        </div>
                        <div className="pl-6">
                            <p className="text-[9px] font-mono text-white/20 tracking-[0.4em] uppercase mb-1">Sync Status</p>
                            <p className="text-xl font-heading text-accent">100%</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Grid Content */}
            <main className="relative z-10 max-w-[1200px] mx-auto px-6 pb-32">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {items.map((item, index) => (
                        <div key={item.id} className="collected-card-reveal">
                            <CollectedCard
                                item={item}
                                index={index}
                                onClick={setSelectedItem}
                            />
                        </div>
                    ))}
                </div>
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

            {/* Footer */}
            <footer className="relative z-10 py-24 border-t border-white/5 opacity-20">
                <div className="max-w-[1400px] mx-auto px-6 text-center">
                    <p className="text-[9px] font-mono tracking-[0.5em] uppercase">
                        Endura Digital Identity Protocol // Archive Sector 0x4f
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default CollectedPage;
