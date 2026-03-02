import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const VaultCongratsOverlay = ({ oldScore, newScore, creditDelta, children, onEnterDashboard, onClose }) => {
    // Safety check to ensure onClose is a function
    const handleClose = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (typeof onClose === 'function') {
            onClose();
        } else {
            console.warn('VaultCongratsOverlay: onClose prop is missing or not a function');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 backdrop-blur-2xl px-6 pointer-events-auto"
            onClick={(e) => {
                if (e.target === e.currentTarget) handleClose(e);
            }}
        >
            {/* Close Button - High Priority Hitbox */}
            <div
                onClick={handleClose}
                className="absolute top-10 right-10 p-5 text-white/40 hover:text-[#d4af37] transition-all hover:rotate-90 z-[100000] cursor-pointer group"
                aria-label="Return to Vault"
            >
                <X size={36} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full flex flex-col items-center text-center space-y-12"
            >
                {/* Display Artifact Card if provided */}
                {children && (
                    <motion.div
                        animate={{ y: [0, -10, 0], rotateZ: [0, 1, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="w-full max-w-[280px] pointer-events-none drop-shadow-[0_0_50px_rgba(212,175,55,0.2)]"
                    >
                        {children}
                    </motion.div>
                )}

                <div className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-3xl md:text-4xl font-heading font-black tracking-[0.3em] text-[#d4af37] drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                            THE VAULT HAS SPOKEN
                        </h2>
                        <p className="text-[10px] font-mono tracking-[0.4em] text-white/40 uppercase">
                            Imperial Authorization Confirmed
                        </p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-[12px] font-heading font-bold tracking-[0.2em] text-white/80 uppercase">
                            Credit Score Updated
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <span className="text-white/40 font-mono text-sm">{oldScore}</span>
                            <span className="text-[#d4af37] font-mono text-xl">→</span>
                            <span className="text-[#d4af37] font-mono text-xl font-bold">{newScore}</span>
                            <span className="ml-2 text-[10px] font-mono text-[#d4af37]/60">+{creditDelta}</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onEnterDashboard}
                    className="w-full max-w-[240px] py-4 bg-[#d4af37] text-black font-heading font-black text-[12px] tracking-[0.3em] uppercase transition-all hover:bg-white hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(212,175,55,0.2)]"
                >
                    [ Enter Dashboard ]
                </button>
            </motion.div>
        </motion.div>
    );
};

export default VaultCongratsOverlay;
