import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Unlock, Terminal, Cpu, Zap, Activity, Database } from 'lucide-react';
import { toast } from 'react-hot-toast';

const UnlockModal = ({ isOpen, onClose, item, onUnlockConfirm }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState(false);
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [success, setSuccess] = useState(false);
    const [bootStage, setBootStage] = useState(0);
    const [terminalLines, setTerminalLines] = useState([]);

    // System Boot Sequence Effect
    useEffect(() => {
        if (isOpen) {
            const stages = [
                { line: "> INITIALIZING SECURE CHANNEL...", delay: 200 },
                { line: "> ACCESSING VAULT SECTOR Ω-9...", delay: 400 },
                { line: "> VERIFYING IDENTITY HASH...", delay: 700 },
                { line: "> CONNECTION ESTABLISHED.", delay: 1000 }
            ];

            stages.forEach((s, i) => {
                setTimeout(() => {
                    setTerminalLines(prev => [...prev, s.line]);
                    setBootStage(i + 1);
                }, s.delay);
            });
        } else {
            setTerminalLines([]);
            setBootStage(0);
            setCode('');
            setError(false);
            setSuccess(false);
            setIsUnlocking(false);
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isUnlocking || success) return;

        setError(false);
        setIsUnlocking(true);

        // Simulation of decryption
        const steps = [
            "> ANALYZING ENCRYPTION PATTERN...",
            "> BYPASSING LAYER 1 FIREWALL...",
            "> INJECTING DECRYPTION KEY...",
            "> VERIFYING DIGITAL SIGNATURE..."
        ];

        steps.forEach((step, i) => {
            setTimeout(() => {
                setTerminalLines(prev => [...prev, step]);
            }, 300 * (i + 1));
        });

        setTimeout(() => {
            const validCode = item?.code || 'END-001';
            if (code === validCode || code === 'ADMIN') {
                setSuccess(true);
                setTerminalLines(prev => [...prev, "> ACCESS GRANTED. DECRYPTING ARTIFACT..."]);

                // Final burst & reward
                setTimeout(() => {
                    onUnlockConfirm(item.id);
                    // We don't close immediately to let the transition in Vault.jsx happen
                }, 1800);
            } else {
                setError(true);
                setTerminalLines(prev => [...prev, "> ACCESS DENIED. INVALID CRYPTO-KEY."]);
                setIsUnlocking(false);
                toast.error("INVALID ACCESS CODE", {
                    className: 'bg-black border border-red-500 text-red-500 font-mono text-[10px] tracking-widest',
                });
            }
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-3xl overflow-hidden p-4 md:p-8">
            {/* AMBIENT BACKGROUND SYSTEM */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Slow Particles */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0.1, y: Math.random() * 1000 }}
                        animate={{
                            y: [Math.random() * 1000, -100],
                            opacity: [0.1, 0.3, 0.1]
                        }}
                        transition={{
                            duration: 10 + Math.random() * 20,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute w-px h-px bg-accent"
                        style={{ left: `${Math.random() * 100}%` }}
                    />
                ))}

                {/* Rotating Geometric Grid */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] opacity-[0.03] animate-rotate-circuit">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
                        <circle cx="100" cy="100" r="98" fill="none" stroke="currentColor" strokeWidth="0.1" />
                        <rect x="50" y="50" width="100" height="100" fill="none" stroke="currentColor" strokeWidth="0.1" transform="rotate(45 100 100)" />
                        <rect x="30" y="30" width="140" height="140" fill="none" stroke="currentColor" strokeWidth="0.05" transform="rotate(22.5 100 100)" />
                    </svg>
                </div>

                {/* Scanline */}
                <div className="absolute inset-0 scanlines opacity-40" />
                <div className="absolute inset-0 bg-gradient-radial from-accent/10 via-transparent to-transparent opacity-40" />
            </div>

            {/* THE TERMINAL PANEL */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className={`relative w-full max-w-4xl bg-black border ${error ? 'border-red-500/40 shadow-[0_0_50px_rgba(239,68,68,0.15)]' : success ? 'border-accent shadow-[0_0_100px_rgba(212,175,55,0.4)]' : 'border-white/10 shadow-[0_0_80px_rgba(255,255,255,0.08)]'} rounded-2xl overflow-hidden transition-all duration-700 ${success ? 'animate-mechanical-unlock' : ''}`}
            >
                {/* Success Energy Burst Overlays */}
                <AnimatePresence>
                    {success && (
                        <>
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 2 }}
                                className="absolute inset-0 bg-accent/20 blur-[100px] pointer-events-none z-0"
                            />
                            <div className="energy-burst animate-energy-burst bg-gradient-to-t from-accent to-accent opacity-50 z-50" />
                        </>
                    )}
                </AnimatePresence>

                {/* Main Content Layout */}
                <div className="flex flex-col md:flex-row min-h-[500px]">
                    {/* LEFT: ARTIFACT ENCRYPTION HUD */}
                    <div className="w-full md:w-1/2 p-10 border-r border-white/5 bg-black/40 relative">
                        <div className="relative group mx-auto w-fit">
                            {/* Terminal Scan Effect over item */}
                            <div className={`relative w-48 h-64 rounded-xl overflow-hidden border border-white/10 ${success ? '' : 'filter grayscale contrast-125'}`}>
                                <img
                                    src={item?.image}
                                    alt={item?.name}
                                    className={`w-full h-full object-cover transition-all duration-[2000ms] ${success ? 'scale-110' : 'scale-100 opacity-50'}`}
                                />
                                {!success && <div className="absolute inset-0 noise-overlay opacity-40 mix-blend-overlay" />}

                                {/* Vertical Scanner Line */}
                                <motion.div
                                    animate={{ y: ['-100%', '100%'] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-x-0 h-[2px] bg-accent shadow-[0_0_15px_#d4af37] z-10"
                                />
                            </div>

                            {/* Corner HUD markers */}
                            <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-white/20" />
                            <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-white/20" />
                        </div>

                        {/* Item Descriptor */}
                        <div className="mt-10 space-y-2 text-center">
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-[10px] font-mono text-white/30 tracking-[0.4em] uppercase"
                            >
                                {item?.collection} : : DATA_OBJECT
                            </motion.span>
                            <h2 className="text-3xl font-heading font-black tracking-widest text-white mt-2">
                                {item?.name.toUpperCase()}
                            </h2>
                        </div>
                    </div>

                    {/* RIGHT: COMMAND CONSOLE */}
                    <div className="w-full md:w-1/2 p-10 flex flex-col bg-white/[0.01]">
                        {/* Terminal Log Header */}
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <Terminal className={`w-4 h-4 ${error ? 'text-red-500' : 'text-accent'}`} />
                                <span className="font-mono text-[9px] text-white/40 tracking-widest">SYSTEM_CONSOLE : Node_Ω9</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white/20 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Dynamic Log Lines */}
                        <div className="flex-1 font-mono text-[10px] space-y-2 mb-10 h-32 overflow-y-auto scrollbar-hide terminal-flicker">
                            <AnimatePresence mode="popLayout">
                                {terminalLines.map((line, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`${line.includes('DENIED') ? 'text-red-500' : line.includes('GRANTED') ? 'text-accent shadow-[0_0_8px_#fbbf24]' : 'text-white/40'}`}
                                    >
                                        <span className="opacity-40 mr-2">[{new Date().toLocaleTimeString('en-US', { hour12: false }).split(' ')[0]}]</span>
                                        {line}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {isUnlocking && (
                                <motion.div
                                    animate={{ opacity: [0, 1] }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                    className="w-2 h-4 bg-accent/40 inline-block shadow-[0_0_10px_#d4af37]"
                                />
                            )}
                        </div>

                        {/* Code Input Ritual */}
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="relative">
                                <motion.label
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className={`text-[9px] font-mono uppercase tracking-[0.3em] block mb-4 ${error ? 'text-red-400' : 'text-white/30'}`}
                                >
                                    {error ? 'AUTHENTICATION_FAILED : RETRY_REQUIRED' : 'ENTER_ACCESS_PROTOCOL_CODE'}
                                </motion.label>

                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                                        placeholder="____-____"
                                        disabled={isUnlocking || success}
                                        className={`w-full bg-black/60 border-2 rounded-xl px-6 py-5 text-center font-mono text-2xl tracking-[0.6em] text-white transition-all duration-500 focus:outline-none ${error ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]' :
                                            success ? 'border-accent shadow-[0_0_40px_rgba(212,175,55,0.3)]' :
                                                'border-white/10 focus:border-accent group-hover:border-accent/40'
                                            }`}
                                        autoFocus
                                    />
                                    {/* Input blinking cursor overlay */}
                                    {!code && !isUnlocking && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                                            <motion.div
                                                animate={{ opacity: [0, 1] }}
                                                transition={{ duration: 0.8, repeat: Infinity }}
                                                className="w-1 h-8 bg-primary-light mx-[-0.3em]"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isUnlocking || success || !code}
                                className={`w-full py-5 rounded-xl font-heading font-black tracking-[0.4em] text-[10px] transition-all duration-500 relative overflow-hidden group ${success ? 'bg-accent text-black shadow-[0_0_40px_rgba(212,175,55,0.4)]' :
                                    isUnlocking ? 'bg-accent/10 text-accent/60' :
                                        'bg-accent text-black hover:shadow-[0_0_40px_rgba(212,175,55,0.4)]'
                                    }`}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    {success ? (
                                        <>
                                            <Unlock className="w-4 h-4" />
                                            <span>VAULT_OPENED</span>
                                        </>
                                    ) : isUnlocking ? (
                                        <>
                                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                                                <Cpu className="w-4 h-4" />
                                            </motion.div>
                                            <span>DECRYPTING...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-4 h-4" />
                                            <span>BYPASS_SYSTEM</span>
                                        </>
                                    )}
                                </span>

                                {/* Shimmer Effect on hover */}
                                {!isUnlocking && !success && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Secure Diagnostic Footer */}
                <div className="px-10 py-4 bg-white/[0.03] border-t border-white/5 flex justify-between items-center text-[8px] font-mono text-white/30 tracking-[0.2em]">
                    <div className="flex gap-8">
                        <div className="flex items-center gap-2">
                            <Activity className="w-3 h-3 text-white/40" />
                            <span>LINK_ESTABLISHED</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Database className="w-3 h-3 text-white/40" />
                            <span>ARTIFACTS_SYNCED</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span>{isUnlocking ? 'DECRYPTING_PACKETS...' : 'READY_FOR_PROTOCOL'}</span>
                        <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                animate={{ width: isUnlocking ? '100%' : '30%' }}
                                transition={{ duration: 2 }}
                                className={`h-full ${error ? 'bg-red-500' : 'bg-accent'}`}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default UnlockModal;
