import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Zap, Fingerprint } from 'lucide-react';
import { toast } from 'react-hot-toast';

const UnlockPanel = ({ item, onUnlock, onClose }) => {
    const [code, setCode] = useState('');
    const [status, setStatus] = useState('idle'); // idle, checking, success, error

    const handleVerify = async () => {
        setStatus('checking');

        // Simulation with cinematic timing
        setTimeout(() => {
            if (code.toUpperCase() === 'ENDURA123') {
                setStatus('success');
                setTimeout(() => onUnlock(item.id), 1200);
            } else {
                setStatus('error');
                toast.error('INVALID CODE', {
                    style: { background: '#000', color: '#f87171', border: '1px solid #ef4444', fontFamily: 'Orbitron' }
                });
                setTimeout(() => setStatus('idle'), 2000);
            }
        }, 1500);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-2xl bg-black border border-white/10 p-12 rounded-[2rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden"
        >
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />

            <div className="absolute top-6 right-6">
                <button
                    onClick={onClose}
                    className="p-2 text-white/20 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-12 items-center">
                {/* Visual Archive Preview */}
                <div className="w-56 aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 relative bg-white/5">
                    {item.image ? (
                        <img
                            src={item.image}
                            alt={item.name}
                            className={`w-full h-full object-cover transition-all duration-1000 ${status === 'success' ? 'grayscale-0' : 'grayscale brightness-50'}`}
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-black via-[#0a0a0a] to-black" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                    {/* Status Glow & Gold Pulse */}
                    <AnimatePresence>
                        {status === 'success' && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 bg-accent/20 flex items-center justify-center z-10"
                                >
                                    <CheckCircle2 className="w-12 h-12 text-accent animate-pulse" />
                                </motion.div>
                                {/* Gold Energy Pulse */}
                                <motion.div
                                    initial={{ scale: 0, opacity: 1 }}
                                    animate={{ scale: 4, opacity: 0 }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="absolute inset-0 m-auto w-20 h-20 bg-accent rounded-full blur-2xl z-20 pointer-events-none"
                                />
                            </>
                        )}
                    </AnimatePresence>
                </div>

                {/* Interaction Interface */}
                <div className="flex-1 space-y-8 w-full">
                    <div className="space-y-2">
                        <span className="text-[10px] font-mono text-accent tracking-[0.5em] uppercase">Security Protocol</span>
                        <h3 className="text-3xl font-heading font-black tracking-tight text-white uppercase">{item.name}</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Fingerprint className="w-4 h-4 text-white/40" />
                            <span className="text-[10px] font-mono text-white/20 tracking-widest uppercase">Encryption Key Required</span>
                        </div>

                        <div className="relative group">
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                placeholder="ACCESS-CODE"
                                disabled={status === 'checking' || status === 'success'}
                                className={`w-full bg-transparent border-b ${status === 'error' ? 'border-red-500' : 'border-white/10'} py-4 text-center text-xl font-heading font-bold tracking-[0.5em] text-white focus:outline-none focus:border-accent transition-all placeholder:text-white/5`}
                            />
                            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent transition-all duration-500 group-focus-within:w-full" />
                        </div>

                        <button
                            onClick={handleVerify}
                            disabled={status !== 'idle' || !code}
                            className={`w-full py-5 rounded-xl font-heading font-black tracking-[0.5em] text-[10px] transition-all relative overflow-hidden active:scale-95 ${status === 'success'
                                ? 'bg-accent text-black'
                                : 'bg-white/5 text-white/60 border border-white/10 hover:border-accent/40 hover:text-white'
                                }`}
                        >
                            <span className="relative z-10">
                                {status === 'idle' ? 'INITIATE_DECRYPTION' : status === 'checking' ? 'DECODING...' : 'ACCESS_GRANTED'}
                            </span>
                        </button>
                    </div>

                    {/* Metadata Footer */}
                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Zap className="w-3 h-3 text-accent fill-accent" />
                            <span className="text-[9px] font-mono text-accent tracking-widest uppercase">+500 Credits</span>
                        </div>
                        <span className="text-[8px] font-mono text-white/20 tracking-[0.3em] uppercase">Archive_Ref: {item.id}</span>
                    </div>
                </div>
            </div>

            {/* Error Shake Effect */}
            {status === 'error' && (
                <motion.div
                    animate={{ x: [-2, 2, -2, 2, 0] }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 border border-red-500/20 pointer-events-none rounded-[2rem]"
                />
            )}
        </motion.div>
    );
};

export default UnlockPanel;
