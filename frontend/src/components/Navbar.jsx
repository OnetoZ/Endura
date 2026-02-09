
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const Navbar = () => {
    const { currentUser, cart, logout } = useStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [visible, setVisible] = useState(false);

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        if (location.pathname === '/') {
            // Delay navbar on home page to match boot sequence
            const timer = setTimeout(() => setVisible(true), 3500);
            return () => clearTimeout(timer);
        } else {
            setVisible(true);
        }
    }, [location.pathname]);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 glass border-b border-primary/20 h-20 px-6 flex items-center justify-between transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}>
            <Link to="/" className="hover:opacity-80 transition-opacity group">
                <img src="/logo.png" alt="ENDURA" className="h-8 md:h-10 object-contain brightness-200" />
            </Link>

            <div className="hidden md:flex items-center space-x-10 text-[10px] font-black tracking-[0.3em] uppercase">
                <Link to="/" className="hover:text-primary transition-all duration-300">Home</Link>
                <Link to="/shop" className="hover:text-primary transition-all duration-300">Collection</Link>
                <Link to="/vault" className="text-accent hover:text-accent-dark transition-all duration-300">The Vault</Link>
                {currentUser?.role === 'admin' && (
                    <Link to="/admin" className="text-primary border border-primary/30 px-3 py-1 hover:bg-primary hover:text-white transition-all duration-300">Admin_Terminal</Link>
                )}
            </div>

            <div className="flex items-center space-x-6">
                <Link to="/cart" className="relative p-2 group">
                    <svg className="w-5 h-5 group-hover:text-primary transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    {cartCount > 0 && (
                        <span className="absolute top-0 right-0 bg-primary text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                            {cartCount}
                        </span>
                    )}
                </Link>

                {currentUser ? (
                    <div className="flex items-center space-x-6">
                        <Link to="/dashboard" className="flex items-center space-x-3 group">
                            <div className="text-right hidden sm:block">
                                <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest">Operator</p>
                                <p className="text-[10px] font-bold text-primary group-hover:text-primary-light transition-all">{currentUser.name.toUpperCase()}</p>
                            </div>
                            <div className="w-8 h-8 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center overflow-hidden">
                                <span className="text-[10px] text-primary">{currentUser.name.charAt(0).toUpperCase()}</span>
                            </div>
                        </Link>
                        <button
                            onClick={() => { logout(); navigate('/'); }}
                            className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-all"
                        >
                            De-Sync
                        </button>
                    </div>
                ) : (
                    <Link to="/auth" className="relative px-8 py-2 overflow-hidden group">
                        <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <div className="absolute inset-0 border border-primary"></div>
                        <span className="relative z-10 text-[10px] font-black uppercase tracking-widest group-hover:text-white transition-colors duration-300">
                            Initiate
                        </span>
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
