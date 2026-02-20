import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ArrowLeft, Sparkles, ExternalLink, Calendar, Tag, Shield } from 'lucide-react';
import gsap from 'gsap';

// ─── Vault Items (same as Vault page) ────────────────────────────────────────
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

const isAuthenticated = () => {
    return localStorage.getItem('enduraUser') === 'authenticated';
};

// ─── Tier Accent ────────────────────────────────────────────────────────────
const tierAccent = (tier) => {
    if (tier === 'Bronze') return '#8a6e45';
    if (tier === 'Gold') return '#d4af37';
    if (tier === 'Diamond') return '#b0e0e6';
    return '#d4af37';
};

// ─── Grid Card ──────────────────────────────────────────────────────────────
const CollectedCard = ({ item, onClick, index }) => {
    const accent = tierAccent(item.tier);
    const cardRef = useRef(null);

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -10 }}
            onClick={() => onClick(item)}
            className="group relative w-full aspect-[4/5] bg-[#0a0a0a] border border-white/10 cursor-pointer overflow-hidden"
        >
            {/* Item Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src={item.image + '?auto=format&fit=crop&q=80&w=800'}
                    alt={item.name}
                    className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>

            {/* Accent Glow */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at center, ${accent}, transparent 70%)`, filter: 'blur(30px)' }}
            />

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-end p-6 space-y-3">
                <div className="space-y-1">
                    <span className="text-[9px] font-mono tracking-widest uppercase" style={{ color: accent }}>
                        {item.tier}
                    </span>
                    <h3 className="text-xl font-heading font-black tracking-widest text-white uppercase truncate">
                        {item.name}
                    </h3>
                </div>
                <p className="text-[10px] font-body text-white/40 tracking-wider truncate">
                    {item.tier} Tier Asset
                </p>
                <div className="w-10 h-[1px] bg-white/10 group-hover:w-full transition-all duration-500" />
            </div>

            {/* Corner Accent */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="w-4 h-4 text-white/40" />
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
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8"
        >
            <div className="relative w-full max-w-5xl bg-[#050505] border border-white/10 overflow-hidden flex flex-col lg:flex-row">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-50 p-2 text-white/40 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>

                {/* Left: Image Section */}
                <div className="w-full lg:w-3/5 relative aspect-video lg:aspect-auto">
                    <img
                        src={item.image + '?auto=format&fit=crop&q=90&w=1200'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

                    {/* Floating Tier Badge */}
                    <div className="absolute bottom-8 left-8 flex items-center gap-4 bg-black/60 backdrop-blur-md border border-white/10 px-6 py-3">
                        <Shield className="w-5 h-5" style={{ color: accent }} />
                        <span className="text-xs font-heading font-black tracking-[0.3em] text-white uppercase">{item.tier} Tier</span>
                    </div>
                </div>

                {/* Right: Info Section */}
                <div className="w-full lg:w-2/5 p-8 md:p-12 flex flex-col justify-center space-y-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.4em] text-white/30 uppercase">
                            <Sparkles className="w-4 h-4" />
                            <span>Digital Archive Record</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tight text-white uppercase leading-none">
                            {item.name}
                        </h2>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <span className="text-[10px] font-mono text-white/20 tracking-widest uppercase flex items-center gap-2">
                                <Tag className="w-3 h-3" /> Asset Type
                            </span>
                            <p className="text-sm font-body text-white/60 leading-relaxed tracking-wide">
                                {item.tier} Tier Digital Asset
                            </p>
                        </div>

                        <div className="h-[1px] w-full bg-white/5" />

                        <div className="flex justify-between items-center">
                            <div className="space-y-2">
                                <span className="text-[10px] font-mono text-white/20 tracking-widest uppercase flex items-center gap-2">
                                    <Calendar className="w-3 h-3" /> Unlock Date
                                </span>
                                <p className="text-xs font-heading text-white tracking-[0.1em]">UNLOCKED</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[8px] font-mono text-white/10 tracking-[0.4em] uppercase mb-1">Status</p>
                                <div className="px-3 py-1 border border-accent/20 text-[9px] font-mono text-accent tracking-widest uppercase">Verified</div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-5 border border-white/10 bg-white/5 text-[11px] font-heading font-black tracking-[0.5em] text-white/60 hover:text-white hover:border-white/40 transition-all uppercase"
                    >
                        Return to Archive
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// ─── Main Collected Page ─────────────────────────────────────────────────────
const CollectedPage = () => {
    const navigate = useNavigate();
    const [selectedItem, setSelectedItem] = useState(null);
    const [items, setItems] = useState([]);
    const containerRef = useRef(null);

    // ── Load items and filter for unlocked ones ───────────────────────────
    useEffect(() => {
        const allItems = buildItems();
        const unlockedIds = getUnlockedItems();
        const unlockedItems = allItems.filter(item => unlockedIds.includes(item.id));
        setItems(unlockedItems);
    }, []);

    // Fade in animation
    useEffect(() => {
        gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power2.out' });
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
            <header className="relative z-50 pt-32 pb-16">
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
            <main className="relative z-10 max-w-[1400px] mx-auto px-6 pb-32">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {items.map((item, index) => (
                        <CollectedCard
                            key={item.id}
                            item={item}
                            index={index}
                            onClick={setSelectedItem}
                        />
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
