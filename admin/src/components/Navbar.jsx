
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/react';
import { useStore } from '../context/StoreContext';

const Navbar = React.forwardRef((props, ref) => {
    const { currentUser, logout } = useStore();
    const navigate = useNavigate();
    const location = useLocation();
    const lenis = useLenis();
    const [visible, setVisible] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [time, setTime] = useState(new Date());

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
                                ...(currentUser ? [{ to: '/', label: 'Admin Dashboard', accent: true }] : [])
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

                            {/* User Section */}
                            {currentUser ? (
                                <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                                        <div className="relative group">
                                            <button className="flex items-center gap-3 group">
                                                <div className="text-right hidden sm:block">
                                                    <p className="text-[8px] text-accent uppercase font-black tracking-[0.2em]">Admin</p>
                                                    <p className="text-[10px] font-bold text-primary group-hover:text-accent transition-all">{(currentUser.username || currentUser.name || 'Admin').toUpperCase()}</p>
                                                </div>
                                                <div className="relative w-9 h-9 rounded-sm border border-primary/40 bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center overflow-hidden group-hover:border-accent transition-all duration-300">
                                                    {currentUser.avatar ? (
                                                        <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
                                                    ) : (
                                                        <span className="text-[11px] text-primary font-black">{(currentUser.username || currentUser.name || 'A').charAt(0).toUpperCase()}</span>
                                                    )}
                                                    {/* Animated Corner */}
                                                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent/0 group-hover:border-accent transition-all duration-300" />
                                                </div>
                                            </button>

                                            {/* Dropdown Menu */}
                                            <div className="absolute top-full right-0 mt-2 w-48 glass border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
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
                        ...(currentUser ? [{ to: '/', label: 'DASHBOARD', accent: true, icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M12 12m-3 0a3 3 0 106 0 3 3 0 10-6 0' }] : [])
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
