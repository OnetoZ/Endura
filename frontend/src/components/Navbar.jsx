
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/react';
import { useStore } from '../context/StoreContext';

const Navbar = React.forwardRef((props, ref) => {
    const { currentUser, cart, logout } = useStore();
    const navigate = useNavigate();
    const location = useLocation();
    const lenis = useLenis();
    const [visible, setVisible] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [time, setTime] = useState(new Date());

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    const handleLogoClick = (e) => {
        if (location.pathname === '/') {
            e.preventDefault();
            if (lenis) {
                lenis.scrollTo(0, { immediate: false, duration: 1.5 });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    };

    useEffect(() => {
        setVisible(true);
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



    const istTime = time.toLocaleTimeString('en-US', {
        hour12: false,
        timeZone: 'Asia/Kolkata'
    });

    return (
        <React.Fragment>
            <nav
                ref={ref}
                style={props.style}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}
            >
                {/* Holographic Top Border - Hidden on mobile */}
                <div className="hidden md:block absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

                {/* Main Navbar Container - Dynamic Transparency */}
                <div className={`relative transition-all duration-500 ${scrolled ? 'bg-black/60 border-b border-primary/20 blur-extreme' : 'bg-transparent border-b border-transparent'}`}>
                    {/* Animated Scan Line - Desktop only */}
                    <div className="hidden md:block absolute top-0 left-0 right-0 h-full overflow-hidden pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent animate-[scan_4s_ease-in-out_infinite]" />
                    </div>

                    <div className="max-w-[1920px] mx-auto px-4 md:px-6 h-16 md:h-24 flex items-center justify-between">
                        {/* LEFT: Logo + System Diagnostics */}
                        <div className="flex items-center gap-8">
                            <Link to="/" onClick={handleLogoClick} className="group relative">
                                {/* Logo Container with Glow */}
                                <div className="relative">
                                    <img
                                        src="/logo.png"
                                        alt="ENDURA"
                                        className="h-5 md:h-8 object-contain brightness-150 transition-all duration-500 group-hover:brightness-200 group-hover:drop-shadow-[0_0_20px_rgba(147,112,219,0.6)]"
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
                                        {istTime}
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
                                { to: '/cult', label: 'Factions', accent: false },
                                { to: '/collections', label: 'COLLECTIONS', accent: false },
                                ...(currentUser ? [{ to: '/vault', label: 'The Vault', accent: true }] : [])
                            ].map((link, idx) => (
                                <Link
                                    key={idx}
                                    to={link.to}
                                    onClick={link.locked ? (e) => e.preventDefault() : (link.to === '/' ? handleLogoClick : undefined)}
                                    className={`relative px-6 py-3 group overflow-hidden ${link.accent ? 'text-accent' : 'text-white/70'} ${link.locked ? 'cursor-not-allowed opacity-50' : ''}`}
                                >
                                    {link.locked && (
                                        <div className="absolute top-1 right-2">
                                            <svg className="w-2 h-2 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
                                            </svg>
                                        </div>
                                    )}
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

                        </div>

                        {/* RIGHT: Cart + User Actions */}
                        <div className="flex items-center gap-6">
                            {/* Cart Icon */}
                            
                            <Link to="/cart" className="relative group">
                                <div className="relative px-3 py-1.5 md:p-2.5 border border-white/10 hover:border-primary/50 transition-all duration-300 flex items-center gap-1.5 md:gap-2">
                                    <svg className="w-4 h-4 md:w-5 md:h-5 text-white/70 group-hover:text-primary transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    <span className="text-[9px] md:text-[10px] font-black tracking-[0.2em] uppercase text-white/70 group-hover:text-primary transition-all duration-300">
                                        CART
                                    </span>
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-accent text-black text-[7px] md:text-[8px] w-3.5 h-3.5 md:w-4 md:h-4 flex items-center justify-center rounded-full font-black">
                                            {cartCount}
                                        </span>
                                    )}
                                </div>
                            </Link>

                            {/* User Section */}
                            {currentUser ? (
                                <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                                    <div className="relative group">
                                        <button className="flex items-center gap-3 group">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-[8px] text-gray-500 uppercase font-black tracking-[0.2em]">Agent</p>
                                                <p className="text-[10px] font-bold text-primary group-hover:text-accent transition-all">
                                                    {(currentUser.username || currentUser.name || 'Operator').toUpperCase()}
                                                </p>
                                            </div>
                                            <div className="relative w-9 h-9 rounded-sm border border-primary/40 bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center overflow-hidden group-hover:border-accent transition-all duration-300">
                                                {currentUser.avatar ? (
                                                    <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
                                                ) : (
                                                    <span className="text-[11px] text-primary font-black">{(currentUser.username || currentUser.name || 'E').charAt(0).toUpperCase()}</span>
                                                )}
                                                {/* Animated Corner */}
                                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent/0 group-hover:border-accent transition-all duration-300" />
                                            </div>
                                        </button>

                                        {/* Dropdown Menu */}
                                        <div className="absolute top-full right-0 mt-2 w-48 glass border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                            <Link
                                                to="/dashboard"
                                                className="block px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-primary/20 hover:text-primary transition-all"
                                            >
                                                User Dashboard
                                            </Link>
                                            <button
                                                onClick={() => { logout(); navigate('/auth'); }}
                                                className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-red-500/20 hover:text-red-400 transition-all"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link to="/auth" className="relative group overflow-hidden md:scale-100 scale-[0.8] origin-right transition-all duration-500 hover:scale-105 active:scale-95">
                                    {/* Gold Gradient Background */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#fee08b] via-[#d4af37] to-[#b8860b] animate-shimmer" />

                                    {/* Shimmer Overlay */}
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />

                                    {/* Content */}
                                    <div className="relative z-10 px-6 md:px-10 py-2 md:py-3 flex items-center gap-1 md:gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black">
                                            Login
                                        </span>
                                        <svg className="w-3.5 h-3.5 text-black group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
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

            {/* MOBILE BOTTOM NAVIGATION */}
            <div className={`md:hidden fixed bottom-0 left-0 right-0 z-50 glass bg-black/80 border-t border-white/10 transition-all duration-500 pb-safe ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`}>
                <div className="flex justify-around items-center h-16 px-1">
                    {[
                        { to: '/', label: 'HOME', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                        { to: '/cult', label: 'FACTIONS', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
                        { to: '/collections', label: 'COLLECTIONS', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
                        ...(currentUser ? [
                            { to: '/vault', label: 'VAULT', accent: true, icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
                            { to: '/dashboard', label: 'PROFILE', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
                        ] : [])
                    ].map((link, idx) => {
                        const isActive = location.pathname === link.to;
                        return (

                            <Link
                                key={idx}
                                to={link.to}
                                onClick={link.locked ? (e) => e.preventDefault() : (link.to === '/' ? handleLogoClick : undefined)}
                                className={`flex flex-col items-center justify-center w-full h-full gap-1 group ${link.locked ? 'opacity-20 grayscale' : ''}`}
                            >
                                <svg className={`w-5 h-5 transition-all duration-300 ${isActive ? (link.accent ? 'text-accent' : 'text-primary') : 'text-white/40 group-hover:text-white/80'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? "2" : "1.5"} d={link.icon} />
                                </svg>
                                <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? (link.accent ? 'text-accent' : 'text-primary') : 'text-white/40 group-hover:text-white/80'}`}>
                                    {link.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </React.Fragment>
    );
});

export default Navbar;
