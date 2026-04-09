
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-black border-t border-white/5 pt-16 pb-24 md:pb-12 px-6 overflow-hidden relative">
            {/* Background Accent */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-primary/5 blur-[120px] rounded-full -z-10"></div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-16 text-center md:text-left">
                {/* Brand Section */}
                <div className="col-span-1 md:col-span-1 flex flex-col items-center md:items-start gap-6">
                    <Link to="/" className="group relative">
                        {/* Logo Container with High-End Branding */}
                        <div className="relative">
                            <img
                                src="/logo.png"
                                alt="ENDURA"
                                className="h-10 w-auto object-contain transition-all duration-500 group-hover:brightness-200"
                            />
                            {/* Animated Corner Brackets */}
                            <div className="absolute -top-1 -left-1 w-3 h-3 border-l border-t border-primary/40 group-hover:border-primary transition-all duration-300" />
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r border-b border-primary/40 group-hover:border-primary transition-all duration-300" />
                        </div>
                    </Link>
                    <p className="text-gray-500 text-[11px] leading-relaxed uppercase tracking-widest max-w-[240px]">
                        Luxury streetwear from India. Exclusive drops paired with digital collectibles—crafted not for the masses, but for the chosen few.
                    </p>
                </div>

                {/* Navigation Section */}
                <div>
                    <h4 className="text-[11px] font-black uppercase tracking-[0.4em] mb-8 text-primary">Navigation</h4>
                    <ul className="space-y-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                        <li><Link to="/" className="hover:text-primary transition-all">Home</Link></li>
                        <li><Link to="/vault" className="hover:text-primary transition-all">Vault</Link></li>
                        <li><Link to="/collections" className="hover:text-primary transition-all">Collections</Link></li>
                        <li><Link to="/dashboard" className="hover:text-primary transition-all">Account</Link></li>
                    </ul>
                </div>

                {/* Legal & Help Section */}
                <div>
                    <h4 className="text-[11px] font-black uppercase tracking-[0.4em] mb-8 text-primary">Protocol</h4>
                    <ul className="space-y-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                        <li><a href="#" className="hover:text-primary transition-all">Terms and conditions</a></li>
                        <li><a href="#" className="hover:text-primary transition-all">Exchange policy</a></li>
                        <li><a href="#" className="hover:text-primary transition-all">Privacy policy</a></li>
                        <li><a href="#" className="hover:text-primary transition-all">FAQ</a></li>
                        <li><a href="#" className="hover:text-primary transition-all">Care</a></li>
                        <li><a href="#" className="hover:text-primary transition-all">About us</a></li>
                    </ul>
                </div>

                {/* Contact Section */}
                <div className="flex flex-col items-center md:items-start">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.4em] mb-8 text-primary">Establish Link</h4>
                    <ul className="space-y-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 text-center md:text-left">
                        <li>
                            <button 
                                onClick={() => window.location.href = `mailto:${['enduraclothing', 'team', 'gmail.com'].join('.').replace('.team.', '.team@')}`}
                                className="hover:text-accent transition-all normal-case tracking-normal md:text-left"
                            >
                                enduraclothing.team [at] gmail.com
                            </button>
                        </li>
                        <li><a href="https://www.instagram.com/enduratheorder?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-all">Instagram</a></li>
                        <li><a href="https://gmail.com" className="hover:text-primary transition-all">Gmail</a></li>
                        <li><a href="#" className="hover:text-primary transition-all">Socials</a></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[9px] font-black tracking-[0.3em] text-gray-600 uppercase relative z-50">
                <p>© 2026 ENDURA_NETWORK_PROTOCOL // ALL_DATA_SECURED</p>
                <div className="flex space-x-8 mt-6 md:mt-0">
                    <span className="text-primary/40">PHYSICAL X DIGITAL</span>
                    <span className="text-secondary/40">STAY_CONNECTED</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
