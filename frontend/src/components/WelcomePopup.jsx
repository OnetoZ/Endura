import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ArrowRight, X, Sparkles, LogIn, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

/**
 * WelcomePopup Component
 * 
 * Distinct, decoupled interactive flows:
 * 1. If user NOT logged in:
 *    -> Greets visitor & prompts them to log in / enter the order.
 * 2. If user IS logged in:
 *    -> Step A: Wishes the user ("Welcome back, {name}! Good evening/day...")
 *    -> Step B (after wishing): Shows ONLY the FAQ question card ("Have a question? See the FAQ")
 * 
 * All states are completely separate cards with smooth luxury transitions.
 */
const WelcomePopup = () => {
    const { currentUser } = useStore();
    const [isOpen, setIsOpen] = useState(false);
    // For logged-in users: 'wishing' -> 'faq'
    const [loggedInPhase, setLoggedInPhase] = useState('wishing');

    // Determine user display name
    const rawName = currentUser?.username || currentUser?.name || (currentUser?.email ? currentUser.email.split('@')[0] : '');
    const displayName = rawName ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : 'Initiate';

    // Time-based greeting (e.g. Good morning / afternoon / evening)
    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    useEffect(() => {
        // Session storage key differs based on user status
        const isAuth = Boolean(currentUser);
        const sessionKey = isAuth ? 'endura_user_wished' : 'endura_guest_dismissed';
        const alreadySeen = sessionStorage.getItem(sessionKey);

        if (isAuth) {
            if (!alreadySeen) {
                // First time logged in in this session: Show wish card first
                setLoggedInPhase('wishing');
                const timer = setTimeout(() => {
                    setIsOpen(true);
                }, 1400);
                return () => clearTimeout(timer);
            } else {
                // Already wished in this session: Go straight to FAQ phase if open
                setLoggedInPhase('faq');
            }
        } else {
            // Guest visitor: Show login greeting
            if (!alreadySeen) {
                const timer = setTimeout(() => {
                    setIsOpen(true);
                }, 1600);
                return () => clearTimeout(timer);
            }
        }
    }, [currentUser]);

    // Handle auto-transition from "Wishing" card to "Have a question" card
    useEffect(() => {
        if (currentUser && isOpen && loggedInPhase === 'wishing') {
            const timer = setTimeout(() => {
                sessionStorage.setItem('endura_user_wished', '1');
                setLoggedInPhase('faq');
            }, 4500); // 4.5 seconds to read the personalized greeting
            return () => clearTimeout(timer);
        }
    }, [currentUser, isOpen, loggedInPhase]);

    const handleDismiss = (e) => {
        e?.stopPropagation();
        setIsOpen(false);
        if (currentUser) {
            sessionStorage.setItem('endura_user_wished', '1');
            setLoggedInPhase('faq');
        } else {
            sessionStorage.setItem('endura_guest_dismissed', '1');
        }
    };

    const handleSkipToFAQ = (e) => {
        e?.stopPropagation();
        sessionStorage.setItem('endura_user_wished', '1');
        setLoggedInPhase('faq');
    };

    const handleReopen = () => {
        if (currentUser) {
            setLoggedInPhase('faq');
        }
        setIsOpen(true);
    };

    return (
        <aside 
            aria-label="Welcome concierge and assistance"
            className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom,0px)+16px)] right-4 md:bottom-6 md:right-6 z-40 pointer-events-auto select-none"
        >
            <AnimatePresence mode="wait">
                {isOpen ? (
                    !currentUser ? (
                        /* ========================================================= */
                        /* 1. GUEST STATE (NOT LOGGED IN): GREET & TELL TO LOG IN   */
                        /* ========================================================= */
                        <motion.div
                            key="guest-login-card"
                            initial={{ opacity: 0, y: 35, scale: 0.94 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.94, transition: { duration: 0.25 } }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="relative w-[300px] sm:w-[330px] rounded-2xl bg-black/85 backdrop-blur-2xl border border-white/10 p-5 shadow-[0_16px_48px_rgba(0,0,0,0.85),0_0_24px_rgba(212,175,55,0.12)] overflow-hidden"
                        >
                            {/* Top Ambient Gold Scan Accent */}
                            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80" />

                            {/* Header: Status Indicator + Close Button */}
                            <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-white/5">
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                                    </span>
                                    <span className="font-mono text-[9px] tracking-[0.22em] text-white/50 uppercase">
                                        ENDURA // ACCESS
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleDismiss}
                                    aria-label="Minimize login prompt"
                                    className="p-1 -mr-1 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* Greeting & Tell to Login */}
                            <div className="mb-2">
                                <div className="flex items-center gap-1.5 mb-1 text-amber-400">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span className="font-mono text-[9.5px] tracking-widest uppercase text-amber-400/90">
                                        Welcome to ENDURA
                                    </span>
                                </div>
                                <h3 className="font-cinzel text-base sm:text-lg font-medium text-white tracking-[0.04em] leading-snug">
                                    Enter The Order
                                </h3>
                            </div>

                            <p className="text-[11.5px] sm:text-xs text-white/70 font-light leading-relaxed mb-4">
                                Sign in to access your digital vault, sync authenticated garments, and view Genesis drops.
                            </p>

                            {/* Login Action Button */}
                            <Link
                                to="/auth"
                                onClick={() => setIsOpen(false)}
                                className="group/btn flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-white text-black text-xs font-cinzel font-semibold tracking-[0.16em] uppercase hover:bg-amber-300 transition-all duration-300 shadow-[0_4px_16px_rgba(255,255,255,0.15)] hover:shadow-[0_4px_20px_rgba(251,191,36,0.3)] active:scale-[0.98]"
                            >
                                <LogIn className="w-3.5 h-3.5" />
                                <span>Log In to Proceed</span>
                                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                            </Link>
                        </motion.div>
                    ) : loggedInPhase === 'wishing' ? (
                        /* ========================================================= */
                        /* 2A. LOGGED IN STATE: WISH USER SEPARATELY                */
                        /* ========================================================= */
                        <motion.div
                            key="user-wishing-card"
                            initial={{ opacity: 0, y: 35, scale: 0.94 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.94, transition: { duration: 0.25 } }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="relative w-[300px] sm:w-[330px] rounded-2xl bg-black/85 backdrop-blur-2xl border border-emerald-500/20 p-5 shadow-[0_16px_48px_rgba(0,0,0,0.85),0_0_24px_rgba(16,185,129,0.15)] overflow-hidden"
                        >
                            {/* Emerald Accent Bar */}
                            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-90" />

                            {/* Header */}
                            <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-white/5">
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                    </span>
                                    <span className="font-mono text-[9px] tracking-[0.22em] text-emerald-400/90 uppercase">
                                        VAULT // AUTHENTICATED
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleSkipToFAQ}
                                    className="font-mono text-[9.5px] text-white/40 hover:text-white transition-colors cursor-pointer tracking-wider uppercase"
                                    title="Continue"
                                >
                                    Next &rarr;
                                </button>
                            </div>

                            {/* Wish the user */}
                            <div className="mb-2">
                                <div className="flex items-center gap-1.5 mb-1 text-emerald-400">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span className="font-mono text-[9.5px] tracking-widest uppercase">
                                        {timeGreeting}
                                    </span>
                                </div>
                                <h3 className="font-cinzel text-base sm:text-lg font-medium text-white tracking-[0.04em] leading-snug">
                                    Welcome, {displayName}
                                </h3>
                            </div>

                            <p className="text-[11.5px] sm:text-xs text-white/70 font-light leading-relaxed mb-4">
                                Your digital vault is synchronized. We wish you an extraordinary experience exploring the Genesis collection.
                            </p>

                            {/* Animated Auto-Transition Progress Bar */}
                            <div className="relative w-full h-[3px] bg-white/10 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: '0%' }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 4.5, ease: 'linear' }}
                                    className="h-full bg-emerald-400"
                                />
                            </div>
                        </motion.div>
                    ) : (
                        /* ========================================================= */
                        /* 2B. AFTER WISHING: SHOW ONLY "HAVE A QUESTION?" (FAQ)     */
                        /* ========================================================= */
                        <motion.div
                            key="user-faq-only-card"
                            initial={{ opacity: 0, y: 35, scale: 0.94 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.94, transition: { duration: 0.25 } }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="relative w-[300px] sm:w-[330px] rounded-2xl bg-black/85 backdrop-blur-2xl border border-white/10 p-5 shadow-[0_16px_48px_rgba(0,0,0,0.85),0_0_24px_rgba(212,175,55,0.12)] overflow-hidden"
                        >
                            {/* Gold Accent Bar */}
                            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80" />

                            {/* Header */}
                            <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-white/5">
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                    <span className="font-mono text-[9px] tracking-[0.22em] text-white/50 uppercase">
                                        SUPPORT // FAQ
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleDismiss}
                                    aria-label="Minimize FAQ card"
                                    className="p-1 -mr-1 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* Content: ONLY "Have a question?" */}
                            <div className="mb-2">
                                <div className="flex items-center gap-1.5 mb-1 text-amber-400">
                                    <HelpCircle className="w-3.5 h-3.5" />
                                    <span className="font-mono text-[9.5px] tracking-widest uppercase text-amber-400/90">
                                        Help & Guidance
                                    </span>
                                </div>
                                <h3 className="font-cinzel text-base sm:text-lg font-medium text-white tracking-[0.04em] leading-snug">
                                    Have a question?
                                </h3>
                            </div>

                            <p className="text-[11.5px] sm:text-xs text-white/70 font-light leading-relaxed mb-4">
                                Need help with orders, shipping timelines, digital twin claiming, or sizing?
                            </p>

                            {/* Dedicated FAQ Action Button */}
                            <Link
                                to="/faq"
                                onClick={() => setIsOpen(false)}
                                className="group/faq flex items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.05] hover:bg-amber-400/10 border border-white/10 hover:border-amber-400/30 transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20 group-hover/faq:scale-105 transition-transform">
                                        <HelpCircle className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-xs font-medium text-white/95 group-hover/faq:text-white transition-colors">
                                            See the FAQ
                                        </div>
                                        <div className="font-mono text-[9px] text-amber-400/80 tracking-wider">
                                            EXPLORE ANSWERS &rarr;
                                        </div>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-white/40 group-hover/faq:text-amber-400 group-hover/faq:translate-x-1 transition-all flex-shrink-0" />
                            </Link>
                        </motion.div>
                    )
                ) : (
                    /* ========================================================= */
                    /* MINIMIZED FLOATING LAUNCHER PILL                          */
                    /* ========================================================= */
                    <motion.button
                        key="help-pill"
                        initial={{ opacity: 0, scale: 0.85, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 10 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        onClick={handleReopen}
                        type="button"
                        className="group/pill relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-black/85 backdrop-blur-xl border border-white/15 hover:border-amber-400/40 shadow-[0_8px_24px_rgba(0,0,0,0.7),0_0_16px_rgba(212,175,55,0.15)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                        aria-label="Open assistance window"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                        </span>

                        {!currentUser ? (
                            <>
                                <LogIn className="w-3.5 h-3.5 text-amber-400 transition-transform duration-300 group-hover/pill:translate-x-0.5" />
                                <span className="font-cinzel text-xs text-white/90 font-medium tracking-[0.15em] uppercase">
                                    Login / Join
                                </span>
                            </>
                        ) : (
                            <>
                                <HelpCircle className="w-3.5 h-3.5 text-amber-400 transition-transform duration-300 group-hover/pill:rotate-12" />
                                <span className="font-cinzel text-xs text-white/90 font-medium tracking-[0.15em] uppercase">
                                    Have a question?
                                </span>
                            </>
                        )}
                    </motion.button>
                )}
            </AnimatePresence>
        </aside>
    );
};

export default WelcomePopup;
