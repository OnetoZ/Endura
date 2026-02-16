
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const Navbar = React.forwardRef((props, ref) => {
    const { currentUser, cart, logout } = useStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [visible, setVisible] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [time, setTime] = useState(new Date());

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        if (location.pathname === '/') {
            const timer = setTimeout(() => setVisible(true), 3500);
            return () => clearTimeout(timer);
        } else {
            setVisible(true);
        }
    }, [location.pathname]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <nav
            ref={ref}
            style={props.style}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}
        >
            {/* Holographic Top Border - Hidden on mobile */}
            <div className="hidden md:block absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            {/* Main Navbar Container - Minimal on mobile */}
            <div className={`relative transition-all duration-500 ${scrolled ? 'md:bg-black/90 bg-black/50 border-b border-primary/30 md:backdrop-blur-xl backdrop-blur-sm' : 'bg-transparent md:bg-black/40 border-b border-white/5 md:backdrop-blur-xl backdrop-blur-none'}`}>
                {/* Animated Scan Line - Desktop only */}
                <div className="hidden md:block absolute top-0 left-0 right-0 h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent animate-[scan_4s_ease-in-out_infinite]" />
                </div>

                <div className="max-w-[1920px] mx-auto px-4 md:px-6 h-16 md:h-24 flex items-center justify-between">
                    {/* LEFT: Logo + System Diagnostics */}
                    <div className="flex items-center gap-8">
                        <Link to="/" className="group relative">
                            {/* Logo Container with Glow */}
                            <div className="relative">
                                <img
                                    src="/logo.png"
                                    alt="ENDURA"
                                    className="h-10 md:h-12 object-contain brightness-200 transition-all duration-500 group-hover:brightness-150 group-hover:drop-shadow-[0_0_20px_rgba(147,112,219,0.6)]"
                                />
                                {/* Animated Corner Brackets */}
                                <div className="absolute -top-1 -left-1 w-3 h-3 border-l border-t border-primary/40 group-hover:border-primary transition-all duration-300" />
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r border-b border-primary/40 group-hover:border-primary transition-all duration-300" />
                            </div>
                        </Link>

                        {/* System Time + Status */}
                        <div className="hidden lg:flex items-center gap-4 border-l border-white/10 pl-6">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-accent rounded-full animate-pulse" />
                                <span className="font-mono text-[9px] text-white/40 tracking-[0.2em]">
                                    {time.toLocaleTimeString('en-US', { hour12: false })}
                                </span>
                            </div>
                            <div className="w-px h-4 bg-white/10" />
                            <span className="font-mono text-[8px] text-accent/60 tracking-[0.3em]">
                                SYNC_ACTIVE
                            </span>
                        </div>
                    </div>

                    {/* CENTER: Navigation Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {[
                            { to: '/', label: 'Home', accent: false },
                            { to: '/collections', label: 'collections', accent: false },
                            { to: '/vault', label: 'The Vault', accent: true }
                        ].map((link, idx) => (
                            <Link
                                key={idx}
                                to={link.to}
                                className={`relative px-6 py-3 group overflow-hidden ${link.accent ? 'text-accent' : 'text-white/70'}`}
                            >
                                {/* Hover Background */}
                                <div className={`absolute inset-0 ${link.accent ? 'bg-accent/10' : 'bg-primary/5'} translate-y-full group-hover:translate-y-0 transition-transform duration-300`} />

                                {/* Animated Border */}
                                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/60 transition-all duration-500" />

                                {/* Text */}
                                <span className="relative z-10 text-[10px] font-black tracking-[0.3em] uppercase group-hover:text-white transition-colors duration-300">
                                    {link.label}
                                </span>

                                {/* Corner Indicators */}
                                <div className="absolute top-0 left-0 w-1 h-1 bg-primary/0 group-hover:bg-primary transition-all duration-300" />
                                <div className="absolute bottom-0 right-0 w-1 h-1 bg-primary/0 group-hover:bg-primary transition-all duration-300" />
                            </Link>
                        ))}

                        {/* Admin Terminal (if admin) */}
                        {currentUser?.role === 'admin' && (
                            <Link
                                to="/admin"
                                className="relative ml-4 px-4 py-2 border border-primary/40 text-primary hover:bg-primary hover:text-black transition-all duration-300 group"
                            >
                                <span className="text-[9px] font-black uppercase tracking-[0.25em]">Admin_Terminal</span>
                                <div className="absolute inset-0 border border-primary/0 group-hover:border-primary animate-pulse" />
                            </Link>
                        )}
                    </div>

                    {/* RIGHT: Cart + User Actions */}
                    <div className="flex items-center gap-6">
                        {/* Cart Icon */}
                        <Link to="/cart" className="relative group">
                            <div className="relative p-2.5 border border-white/10 hover:border-primary/50 transition-all duration-300">
                                <svg className="w-5 h-5 text-white/70 group-hover:text-primary transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-accent text-black text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-black">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                        </Link>

                        {/* User Section */}
                        {currentUser ? (
                            <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                                <Link to="/dashboard" className="flex items-center gap-3 group">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-[8px] text-gray-500 uppercase font-black tracking-[0.2em]">Operator</p>
                                        <p className="text-[10px] font-bold text-primary group-hover:text-accent transition-all">{currentUser.name.toUpperCase()}</p>
                                    </div>
                                    <div className="relative w-9 h-9 rounded-sm border border-primary/40 bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center overflow-hidden group-hover:border-accent transition-all duration-300">
                                        <span className="text-[11px] text-primary font-black">{currentUser.name.charAt(0).toUpperCase()}</span>
                                        {/* Animated Corner */}
                                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent/0 group-hover:border-accent transition-all duration-300" />
                                    </div>
                                </Link>
                                <button
                                    onClick={() => { logout(); navigate('/'); }}
                                    className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-red-400 transition-all px-3 py-1 border border-transparent hover:border-red-400/30"
                                >
                                    De-Sync
                                </button>
                            </div>
                        ) : (
                            <Link to="/auth" className="relative group overflow-hidden">
                                {/* Animated Background */}
                                <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite]" />
                                <div className="absolute inset-0 bg-black/80 group-hover:bg-black/60 transition-all duration-300" />

                                {/* Border Frame */}
                                <div className="absolute inset-0 border border-primary/60 group-hover:border-accent transition-all duration-300" />

                                {/* Content */}
                                <div className="relative z-10 px-8 py-3 flex items-center gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
                                        Initiate
                                    </span>
                                    <svg className="w-3 h-3 text-accent group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Bottom Holographic Line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
            </div>

            {/* Add custom animations to global CSS */}
            {/* Add custom animations to global CSS */}
            <style>{`
                @keyframes scan {
                    0%, 100% { transform: translateX(-100%); }
                    50% { transform: translateX(100%); }
                }
                @keyframes shimmer {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
            `}</style>
        </nav>
    );
});

export default Navbar;
