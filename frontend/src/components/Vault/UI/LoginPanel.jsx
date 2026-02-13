import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, Fingerprint } from 'lucide-react';

const LoginPanel = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(email, password);
    };

    return (
        <div className="relative">
            <div className="absolute inset-0 bg-accent/10 blur-[120px] rounded-full scale-150 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                className="relative w-full max-w-md bg-black border border-white/5 p-12 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,1)]"
            >
                <div className="flex flex-col items-center mb-12">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="w-12 h-12 rounded-full border border-accent/30 flex items-center justify-center mb-6"
                    >
                        <Fingerprint className="w-6 h-6 text-accent" />
                    </motion.div>
                    <h2 className="text-xl font-heading font-black tracking-[0.4em] text-white uppercase">Vault Access</h2>
                    <p className="text-[8px] font-mono text-white/30 tracking-[0.3em] mt-3 uppercase">Restricted Data Archive Section Ω</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                        <div className="relative group">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-transparent border-b border-white/10 py-4 px-2 text-sm text-white focus:outline-none focus:border-accent transition-all font-body tracking-wider placeholder:text-white/10"
                                placeholder="IDENTIFIER"
                                required
                            />
                            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent group-focus-within:w-full transition-all duration-500" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="relative group">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-transparent border-b border-white/10 py-4 px-2 text-sm text-white focus:outline-none focus:border-accent transition-all font-body tracking-wider placeholder:text-white/10"
                                placeholder="ACCESS KEY"
                                required
                            />
                            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent group-focus-within:w-full transition-all duration-500" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-10 relative group h-14 overflow-hidden border border-accent/20 bg-accent/5 transition-all active:scale-95"
                    >
                        <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-10 transition-opacity" />
                        <span className="relative z-10 font-heading font-black tracking-[0.5em] text-[10px] text-accent flex items-center justify-center gap-3">
                            AUTHORIZE
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </span>

                        {/* Gold Shine Animation */}
                        <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer" />
                    </button>
                </form>

                <div className="mt-12 text-center">
                    <p className="text-[7px] font-mono text-white/10 tracking-widest uppercase mb-4">Demo Credentials: vault@demo.com / vault123</p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPanel;
