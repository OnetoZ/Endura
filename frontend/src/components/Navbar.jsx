
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const Navbar = () => {
    const { currentUser, cart, logout } = useStore();
    const navigate = useNavigate();
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 h-20 px-6 flex items-center justify-between">
            <Link to="/" className="text-3xl font-oswald tracking-tighter hover:opacity-80 transition-opacity">
                ENDURA<span className="text-blue-500">.</span>
            </Link>

            <div className="hidden md:flex items-center space-x-10 text-sm font-medium tracking-widest uppercase">
                <Link to="/" className="hover:text-blue-400 transition">Home</Link>
                <Link to="/shop" className="hover:text-blue-400 transition">Shop</Link>
                <Link to="/vault" className="hover:text-blue-400 transition">Vault</Link>
                {currentUser?.role === 'admin' && (
                    <Link to="/admin" className="text-blue-500 hover:text-blue-300 transition">Admin</Link>
                )}
            </div>

            <div className="flex items-center space-x-6">
                <Link to="/cart" className="relative p-2 group">
                    <svg className="w-6 h-6 group-hover:text-blue-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-black">
                            {cartCount}
                        </span>
                    )}
                </Link>

                {currentUser ? (
                    <div className="flex items-center space-x-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs text-gray-500 uppercase">Credits</p>
                            <p className="text-sm font-bold text-blue-400">{currentUser.credits}</p>
                        </div>
                        <button
                            onClick={() => { logout(); navigate('/'); }}
                            className="px-4 py-2 border border-white/10 rounded hover:bg-white/5 text-xs uppercase tracking-widest"
                        >
                            Exit
                        </button>
                    </div>
                ) : (
                    <Link to="/auth" className="px-6 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition">
                        Access
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
