import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { ArrowRight, Lock, Unlock, Zap, Shield, Loader2, Fingerprint, ChevronDown, MoveLeft, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LoginPanel from '../components/Vault/UI/LoginPanel';
import VaultHUD from '../components/Vault/UI/VaultHUD';
import UnlockPanel from '../components/Vault/UI/UnlockPanel';
import GoldParticles from '../components/Vault/UI/GoldParticles';
import { useStore } from '../context/StoreContext';

gsap.registerPlugin(ScrollTrigger);

const INITIAL_ITEMS = [
    { id: 'v1', name: 'Shadow Jacket', category: 'Apparel', collection: 'Stealth Series', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800', status: 'unlocked', rarity: 'LEGENDARY' },
    { id: 'v2', name: 'Obsidian Hoodie', category: 'Apparel', collection: 'Night Ops', image: 'https://images.unsplash.com/photo-1556314844-31952086e108?auto=format&fit=crop&q=80&w=800', status: 'unlocked', rarity: 'EPIC' },
    { id: 'v3', name: 'Gold Thread Jacket', category: 'Apparel', collection: 'Royal Gold', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800', status: 'unlocked', rarity: 'MYTHIC' },
    { id: 'v4', name: 'Eclipse Sneakers', category: 'Apparel', collection: 'Shadow Step', image: 'https://images.unsplash.com/photo-1512374382149-4334338e749e?auto=format&fit=crop&q=80&w=800', status: 'unlocked', rarity: 'EPIC' },
    { id: 'v5', name: 'Midnight Leather Coat', category: 'Apparel', collection: 'Vesper Noir', image: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&q=80&w=800', status: 'unlocked', rarity: 'LEGENDARY' },
    { id: 'v6', name: 'Vault Edition Cap', category: 'Accessories', collection: 'Archive Ops', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800', status: 'unlocked', rarity: 'RARE' },
    { id: 'v7', name: 'Shadow Cargo Pants', category: 'Apparel', collection: 'Urban Flux', image: 'https://images.unsplash.com/photo-1517441551224-cca4246835be?auto=format&fit=crop&q=80&w=800', status: 'unlocked', rarity: 'EPIC' },
    { id: 'v8', name: 'Endura Signature Boots', category: 'Apparel', collection: 'Archive Silk', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800', status: 'unlocked', rarity: 'LEGENDARY' },
    // Locked items
    { id: 'l1', name: 'Phantom Hoodie', category: 'Apparel', collection: 'Ghost Protocol', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800', status: 'locked', rarity: 'EPIC' },
    { id: 'l2', name: 'Goldline Bomber', category: 'Apparel', collection: 'Aureum', image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=800', status: 'locked', rarity: 'LEGENDARY' },
    { id: 'l3', name: 'Eclipse High Tops', category: 'Apparel', collection: 'Lunar Walk', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800', status: 'locked', rarity: 'MYTHIC' },
    { id: 'l4', name: 'Midnight Tactical Vest', category: 'Apparel', collection: 'Spec Ops', image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=800', status: 'locked', rarity: 'EPIC' },
    { id: 'l5', name: 'Shadow Silk Shirt', category: 'Apparel', collection: 'Obsidian Lux', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800', status: 'locked', rarity: 'RARE' },
    { id: 'l6', name: 'Archive Leather Boots', category: 'Apparel', collection: 'Vanguard', image: 'https://images.unsplash.com/photo-1605733513597-a8f8d410fe3c?auto=format&fit=crop&q=80&w=800', status: 'locked', rarity: 'LEGENDARY' }
];

const BlurText = ({ children, className }) => {
    const textRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!textRef.current) return;
            const { clientX, clientY } = e;
            const rect = textRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dist = Math.hypot(clientX - centerX, clientY - centerY);

            const maxDist = 300;
            const blurAmount = Math.max(0, (maxDist - dist) / 25);

            gsap.to(textRef.current, {
                filter: `blur(${blurAmount}px)`,
                duration: 0.6,
                ease: "power2.out"
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return <div ref={textRef} className={className}>{children}</div>;
};

const LoadingScreen = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const duration = 8000; // 8 seconds
        const interval = 50;
        const step = (interval / duration) * 100;

        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 1200);
                    return 100;
                }
                return prev + step;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8 text-center"
        >
            <div className="relative mb-16">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    className="w-48 h-48 rounded-full border-[1px] border-accent/20 border-t-accent shadow-[0_0_60px_rgba(212,175,55,0.1)]"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.95, 1.05, 0.95] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        <Sparkles className="w-12 h-12 text-accent" />
                    </motion.div>
                </div>
            </div>

            <div className="space-y-8 max-w-sm">
                <h2 className="text-xl font-heading font-black tracking-[0.8em] text-accent uppercase animate-pulse">
                    {progress < 50 ? 'ACCESSING VAULT...' : 'SYNCING ARCHIVE...'}
                </h2>

                <div className="space-y-4">
                    <div className="h-[1px] w-full bg-white/5 relative overflow-hidden">
                        <motion.div
                            className="absolute inset-0 bg-accent origin-left"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: progress / 100 }}
                        />
                    </div>
                    <div className="flex justify-between font-mono text-[10px] text-white/20 tracking-widest uppercase">
                        <span>Status: Neutral_Link_Active</span>
                        <span>{Math.floor(progress)}%</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const VaultCard = ({ item, onSelect, index }) => {
    const isLocked = item.status === 'locked';
    const cardRef = useRef(null);
    const imageRef = useRef(null);
    const shimmerRef = useRef(null);
    const contentRef = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            // 4. Staggered Scroll Reveal
            gsap.fromTo(cardRef.current,
                { opacity: 0, y: 80 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.8,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start: "top bottom-=100px",
                        toggleActions: "play none none none"
                    }
                }
            );

            gsap.set(shimmerRef.current, { x: '-100%', opacity: 0 });
        });
        return () => ctx.revert();
    }, []);

    useEffect(() => {
        const handleGlobalMove = (e) => {
            if (!cardRef.current || !imageRef.current) return;
            const { clientX, clientY } = e;
            const rect = cardRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dist = Math.hypot(clientX - centerX, clientY - centerY);

            const maxDist = 600;
            const normalizedDist = Math.max(0, Math.min(1, dist / maxDist));
            const revealIntensity = 1 - normalizedDist;

            // Global Cursor Parallax Opacity Reveal (Saturation + Opacity)
            gsap.to(imageRef.current, {
                opacity: 0.15 + (revealIntensity * 0.85),
                filter: `grayscale(${100 - (revealIntensity * 100)}%) brightness(${0.3 + (revealIntensity * 0.7)}) ${isLocked ? 'blur(12px)' : ''}`,
                duration: 0.8,
                ease: "power2.out"
            });
        };

        window.addEventListener('mousemove', handleGlobalMove);
        return () => window.removeEventListener('mousemove', handleGlobalMove);
    }, [isLocked]);

    const handleMouseMove = (e) => {
        if (isLocked) return;

        const { clientX, clientY } = e;
        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        const xPercent = (clientX - left) / width - 0.5;
        const yPercent = (clientY - top) / height - 0.5;

        // 2. Cursor Parallax (Image Shift)
        gsap.to(imageRef.current, {
            x: xPercent * 40,
            y: yPercent * 40,
            duration: 1,
            ease: "power2.out"
        });

        gsap.to(contentRef.current, {
            x: xPercent * 15,
            y: yPercent * 15,
            duration: 1.2,
            ease: "power2.out"
        });
    };

    const handleMouseEnter = () => {
        if (isLocked) return;

        // 1. Smooth Hover Zoom
        gsap.to(cardRef.current, {
            scale: 1.03,
            duration: 0.8,
            ease: "power2.out"
        });

        gsap.to(imageRef.current, {
            scale: 1.15,
            duration: 1.2,
            ease: "power2.out"
        });

        // 3. Gradient Sweep Overlay
        gsap.fromTo(shimmerRef.current,
            { x: '-100%', opacity: 0 },
            {
                x: '100%',
                opacity: 0.8,
                duration: 1.8,
                ease: "power3.inOut"
            }
        );
    };

    const handleMouseLeave = () => {
        if (isLocked) return;

        gsap.to(cardRef.current, {
            scale: 1,
            duration: 0.8,
            ease: "power2.out"
        });

        gsap.to(imageRef.current, {
            scale: 1,
            x: 0,
            y: 0,
            duration: 1.2,
            ease: "power2.out"
        });

        gsap.to(contentRef.current, {
            x: 0,
            y: 0,
            duration: 1.2,
            ease: "power2.out"
        });

        gsap.to(shimmerRef.current, {
            opacity: 0,
            duration: 0.5
        });
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`relative group ${isLocked ? 'aspect-square' : 'aspect-[4/5]'} bg-[#080808] overflow-hidden rounded-[2.5rem] transition-shadow duration-1000 ${!isLocked && 'shadow-2xl hover:shadow-[0_40px_100px_rgba(212,175,55,0.15)]'}`}
        >
            <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                    ref={imageRef}
                    src={item.image}
                    alt={item.name}
                    className={`w-full h-full object-cover transform-gpu ${isLocked ? 'grayscale brightness-[0.1] blur-md' : 'brightness-75'}`}
                />
                <div className={`absolute inset-0 ${isLocked ? 'bg-black/60' : 'bg-gradient-to-tr from-black/80 via-transparent to-black/20'}`} />
                {!isLocked && (
                    <div
                        ref={shimmerRef}
                        className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                    />
                )}
            </div>

            <div ref={contentRef} className="absolute inset-0 z-20 p-12 flex flex-col justify-end">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <BlurText className="text-[11px] font-mono text-white/30 tracking-[0.5em] uppercase block">
                            {item.collection}
                        </BlurText>
                        <BlurText className={`text-3xl font-heading font-black tracking-tight ${isLocked ? 'text-white/10' : 'text-white'}`}>
                            {item.name}
                        </BlurText>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className={`flex items-center gap-3 ${isLocked ? 'opacity-20' : 'opacity-100'}`}>
                            {isLocked ? <Lock className="w-5 h-5 text-white" /> : <Unlock className="w-5 h-5 text-accent" />}
                            <span className={`text-[11px] font-mono tracking-widest uppercase ${isLocked ? 'text-white' : 'text-accent'}`}>
                                {isLocked ? 'Archive_Locked' : 'Access_Granted'}
                            </span>
                        </div>
                        {!isLocked && <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_10px_rgba(212,175,55,0.8)]" />}
                    </div>

                    {isLocked && (
                        <motion.button
                            whileHover={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', borderColor: 'rgba(212, 175, 55, 0.6)' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelect(item)}
                            className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-heading font-black tracking-[0.5em] text-accent/60 hover:text-accent transition-all uppercase"
                        >
                            Tap to Unlock
                        </motion.button>
                    )}
                </div>
            </div>

            {!isLocked && <div className="absolute inset-0 z-0 animate-breathing-glow rounded-[2.5rem] pointer-events-none opacity-40" />}
            <div className={`absolute inset-0 border border-white/5 rounded-[2.5rem] pointer-events-none ${!isLocked && 'group-hover:border-accent/30 transition-colors duration-700'}`} />
        </div>
    );
};

const VaultIntro = ({ onComplete }) => {
    const containerRef = useRef(null);
    const line1Ref = useRef(null);
    const line2Ref = useRef(null);
    const line3Ref = useRef(null);

    useLayoutEffect(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                gsap.to(containerRef.current, {
                    opacity: 0,
                    duration: 1.5,
                    ease: "power2.inOut",
                    onComplete: onComplete
                });
            }
        });

        tl.fromTo(line1Ref.current,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 1.5, ease: "power4.out" }
        )
            .fromTo(line2Ref.current,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 1.5, ease: "power4.out" },
                "+=0.4"
            )
            .fromTo(line3Ref.current,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 1.5, ease: "power4.out" },
                "+=0.4"
            )
            .to([line1Ref.current, line2Ref.current, line3Ref.current], {
                opacity: 0,
                y: -20,
                duration: 1.2,
                ease: "power3.in",
                delay: 2
            });

        return () => tl.kill();
    }, [onComplete]);

    return (
        <div ref={containerRef} className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div ref={line1Ref}>
                <BlurText className="text-4xl md:text-7xl font-heading font-black tracking-[0.2em] text-accent uppercase">
                    THE ARCHIVE AWAITS.
                </BlurText>
            </div>
            <div ref={line2Ref}>
                <BlurText className="text-xl md:text-4xl font-heading font-black tracking-[0.3em] text-white/60 uppercase">
                    YOUR COLLECTION IS SECURE.
                </BlurText>
            </div>
            <div ref={line3Ref}>
                <BlurText className="text-lg md:text-xl font-mono tracking-[0.6em] text-white/20 uppercase">
                    WELCOME TO THE ENDURA VAULT.
                </BlurText>
            </div>
        </div>
    );
};

const Vault = () => {
    const { login } = useStore();
    const [view, setView] = useState('ENTER'); // ENTER, LOGIN, LOADING, INTRO, COLLECTION (Unlocked), STORE (Locked)
    const [items, setItems] = useState(INITIAL_ITEMS);
    const [selectedItem, setSelectedItem] = useState(null);
    const [credits, setCredits] = useState(1250);
    const [isBlackedOut, setIsBlackedOut] = useState(false);

    const pageRef = useRef(null);

    const unlockedItems = items.filter(i => i.status === 'unlocked');
    const lockedItems = items.filter(i => i.status === 'locked');

    const transitionView = (nextView) => {
        setIsBlackedOut(true);
        setTimeout(() => {
            setView(nextView);
            window.scrollTo(0, 0);
            setIsBlackedOut(false);
        }, 1000);
    };

    const handleLogin = (email, password) => {
        if (email === 'vault@demo.com' && password === 'vault123') {
            setIsBlackedOut(true);
            setTimeout(() => {
                login(email, 'user', 'Agent_Endura');
                setView('LOADING');
                setIsBlackedOut(false);
            }, 1000);
        } else {
            toast.error('ACCESS DENIED: INVALID KEY');
        }
    };

    const handleUnlock = (itemId) => {
        setItems(prev => prev.map(item =>
            item.id === itemId ? { ...item, status: 'unlocked' } : item
        ));
        setCredits(prev => prev + 500);
        setSelectedItem(null);
        toast.success('DECRYPTION SUCCESSFUL', {
            icon: '🏆',
            style: { background: '#000', color: '#d4af37', border: '1px solid #d4af37', fontFamily: 'Orbitron' }
        });
    };

    return (
        <div ref={pageRef} className="relative w-full min-h-screen bg-black text-white font-body selection:bg-accent/30 overflow-x-hidden">
            <Toaster position="top-right" />
            <GoldParticles />

            {/* Cinematic Fade Overlay */}
            <AnimatePresence>
                {isBlackedOut && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black"
                    />
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {view === 'ENTER' && (
                    <motion.section
                        key="enter"
                        className="relative h-screen flex flex-col items-center justify-center z-10 p-8"
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ duration: 1 }}
                    >
                        <div className="text-center space-y-16">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="space-y-8"
                            >
                                <BlurText className="text-[14px] font-mono tracking-[1.5em] text-accent/60 uppercase block">Endura_Systems_v0.9</BlurText>
                                <BlurText className="text-9xl md:text-[14rem] font-heading font-black tracking-tighter text-white drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                                    THE VAULT
                                </BlurText>
                            </motion.div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => transitionView('LOGIN')}
                                className="group relative px-24 py-10 border border-white/10 bg-white/5 backdrop-blur-xl rounded-full overflow-hidden transition-all hover:border-accent/40"
                            >
                                <BlurText className="relative z-10 font-heading font-black tracking-[1em] text-white flex items-center gap-6 text-xs pl-4">
                                    INITIATE_VAULT
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-4 transition-transform text-accent" />
                                </BlurText>
                                <div className="absolute inset-0 bg-accent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-[1.5s] opacity-[0.05]" />
                            </motion.button>
                        </div>
                    </motion.section>
                )}

                {view === 'LOGIN' && (
                    <motion.section
                        key="login"
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <LoginPanel onLogin={handleLogin} />
                    </motion.section>
                )}

                {view === 'LOADING' && (
                    <LoadingScreen key="loading" onComplete={() => setView('INTRO')} />
                )}

                {view === 'INTRO' && (
                    <VaultIntro key="intro" onComplete={() => setView('COLLECTION')} />
                )}

                {view === 'COLLECTION' && (
                    <motion.div
                        key="collection"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative z-10"
                    >
                        <VaultHUD credits={credits} itemsUnlocked={unlockedItems.length} />

                        {/* PAGE 1: UNLOCKED COLLECTIONS (DIORIVIERA STYLE) */}
                        <div className="max-w-[1600px] mx-auto px-12 pt-44 pb-32">
                            <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
                                <div className="space-y-4">
                                    <BlurText className="text-6xl md:text-7xl font-heading font-black tracking-tighter text-white uppercase leading-none">
                                        Active_Archive
                                    </BlurText>
                                    <BlurText className="text-[11px] font-mono text-white/20 tracking-[0.4em] uppercase border-l-2 border-accent pl-6">
                                        Verified Digital Assets & Exclusive Collectibles
                                    </BlurText>
                                </div>
                                <div className="pb-4">
                                    <div className="flex items-center gap-6 text-[10px] font-mono tracking-[0.4em] text-white/40 uppercase">
                                        <BlurText>Sector_09</BlurText>
                                        <div className="w-12 h-[1px] bg-white/10" />
                                        <BlurText>User_Verified</BlurText>
                                    </div>
                                </div>
                            </div>

                            {/* Dioriviera-style Staggered Luxury Layout */}
                            <div className="space-y-40">
                                {unlockedItems.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}
                                    >
                                        {/* Card Column */}
                                        <div className="w-full lg:w-[48%]">
                                            <VaultCard item={item} onSelect={setSelectedItem} index={index} />
                                        </div>

                                        {/* Editorial Content Column */}
                                        <div className={`w-full lg:w-[52%] space-y-8 ${index % 2 === 0 ? 'lg:pl-16' : 'lg:pr-16 text-right'}`}>
                                            <div className="space-y-3">
                                                <motion.div
                                                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                                    whileInView={{ opacity: 0.4, x: 0 }}
                                                >
                                                    <BlurText className="text-[11px] font-mono text-accent tracking-[0.6em] uppercase block">
                                                        {item.rarity} // {item.category}
                                                    </BlurText>
                                                </motion.div>
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.2 }}
                                                >
                                                    <BlurText className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white uppercase leading-[0.95] tracking-tighter">
                                                        {item.name}
                                                    </BlurText>
                                                </motion.div>
                                            </div>

                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                whileInView={{ opacity: 1 }}
                                                transition={{ delay: 0.4 }}
                                                className={`space-y-6 flex flex-col ${index % 2 === 0 ? 'items-start' : 'items-end'}`}
                                            >
                                                <BlurText className="text-[13px] font-body text-white/30 tracking-widest leading-relaxed max-w-sm">
                                                    A rare digital artifact meticulously archived within the Endura Vault. This {item.rarity.toLowerCase()} piece represents the pinnacle of digital craftsmanship.
                                                </BlurText>
                                                <div className={`w-16 h-[1px] bg-accent/20 ${index % 2 === 0 ? '' : 'ml-auto'}`} />
                                            </motion.div>
                                        </div>
                                    </div>
                                ))}

                                {unlockedItems.length === 0 && (
                                    <div className="py-32 text-center border border-white/5 rounded-[3rem] bg-white/5">
                                        <p className="font-heading text-white/20 tracking-[0.6em] uppercase">No Assets Decrypted Yet</p>
                                    </div>
                                )}
                            </div>

                            {/* Navigation to Page 2 (Centered Portal Button) */}
                            <div className="mt-44 flex justify-center">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => transitionView('STORE')}
                                    className="group relative px-24 py-10 border border-white/5 bg-white/5 backdrop-blur-3xl rounded-[2rem] overflow-hidden transition-all hover:border-accent/40"
                                >
                                    <div className="relative z-10 flex items-center gap-10">
                                        <div className="text-left space-y-1">
                                            <BlurText className="text-[9px] font-mono text-accent/50 tracking-[0.5em] uppercase block group-hover:text-accent transition-colors">Digital_Avenue</BlurText>
                                            <BlurText className="text-[12px] font-heading font-black text-white tracking-[0.6em] uppercase">Unlock New Collections</BlurText>
                                        </div>
                                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-accent group-hover:shadow-[0_0_25px_rgba(212,175,55,0.15)] transition-all duration-500">
                                            <ChevronDown className="w-5 h-5 text-white/20 group-hover:text-accent bounce-subtle" />
                                        </div>
                                    </div>

                                    {/* Luxury Hover Fill */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1.5s] ease-in-out" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Footer */}
                        <footer className="py-24 px-12 border-t border-white/5">
                            <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-12 opacity-30">
                                <BlurText className="text-[10px] font-mono tracking-widest uppercase">Endura Executive Archive © 2026</BlurText>
                                <div className="flex gap-16 font-mono text-[10px] tracking-widest uppercase">
                                    <BlurText>Terms_of_Access</BlurText>
                                    <BlurText>Privacy_Protocol</BlurText>
                                </div>
                            </div>
                        </footer>
                    </motion.div>
                )}

                {view === 'STORE' && (
                    <motion.div
                        key="store"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="relative z-10 pt-44 min-h-screen bg-black"
                    >
                        <div className="max-w-[1400px] mx-auto px-12 pb-32">
                            <div className="flex items-center justify-between mb-24">
                                <button
                                    onClick={() => transitionView('COLLECTION')}
                                    className="flex items-center gap-4 text-[11px] font-mono tracking-[0.5em] text-white/40 hover:text-accent transition-colors group"
                                >
                                    <MoveLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
                                    <BlurText>BACK_TO_VAULT</BlurText>
                                </button>

                                <div className="text-right">
                                    <BlurText className="text-4xl font-heading font-black tracking-tighter text-white uppercase mb-2">Encrypted_Store</BlurText>
                                    <BlurText className="text-[10px] font-mono text-white/20 tracking-[0.3em] uppercase">Archive Sector 0x4f - Locked Data Blocks</BlurText>
                                </div>
                            </div>

                            {/* Grid of Locked Items */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                                {lockedItems.map((item, index) => (
                                    <VaultCard key={item.id} item={item} onSelect={setSelectedItem} index={index} />
                                ))}
                            </div>

                            {lockedItems.length === 0 && (
                                <div className="py-44 text-center">
                                    <Sparkles className="w-12 h-12 text-accent mx-auto mb-8 animate-pulse" />
                                    <p className="font-heading text-white/40 tracking-[0.5em] uppercase">All Archive Items Decrypted</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal for Unlocking */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-3xl flex items-center justify-center p-8"
                    >
                        <UnlockPanel
                            item={selectedItem}
                            onUnlock={handleUnlock}
                            onClose={() => setSelectedItem(null)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Global Grainy Noise Filter */}
            <div className="fixed inset-0 pointer-events-none z-[300] opacity-[0.03] mix-blend-overlay">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>
        </div>
    );
};

export default Vault;
