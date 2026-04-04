import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const VaultCongratsOverlay = ({ oldScore, newScore, creditDelta, children, accent, onEnterDashboard, onClose }) => {
    const handleClose = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (typeof onClose === 'function') {
            onClose();
        }
    };

    const hudColor = accent || '#C9A227';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-[8px] px-6 pointer-events-auto"
            onClick={(e) => {
                if (e.target === e.currentTarget) handleClose(e);
            }}
        >
            {/* HUD WRAPPER - Stable Rectangle with Natural Scaling */}
            <div className="relative w-[520px] min-h-[320px] bg-[#000000] p-[24px_48px] box-border flex flex-col items-center justify-center gap-16 overflow-hidden">
                {/* HUD CORNERS LAYER */}
                <div className="absolute inset-0 pointer-events-none z-50">
                    {/* Top Left Corners */}
                    <div className="absolute top-0 left-0 w-[36px] h-[36px] border-t-2 border-l-2 opacity-60" style={{ borderColor: hudColor }} />
                    <div className="absolute top-[8px] left-[8px] w-[18px] h-[18px] border-t border-l opacity-60" style={{ borderColor: hudColor }} />

                    {/* Top Right Corners */}
                    <div className="absolute top-0 right-0 w-[36px] h-[36px] border-t-2 border-r-2 opacity-60" style={{ borderColor: hudColor }} />
                    <div className="absolute top-[8px] right-[8px] w-[18px] h-[18px] border-t border-r opacity-60" style={{ borderColor: hudColor }} />

                    {/* Bottom Left Corners */}
                    <div className="absolute bottom-0 left-0 w-[36px] h-[36px] border-b-2 border-l-2 opacity-60" style={{ borderColor: hudColor }} />
                    <div className="absolute bottom-[8px] left-[8px] w-[18px] h-[18px] border-b border-l opacity-60" style={{ borderColor: hudColor }} />

                    {/* Bottom Right Corners */}
                    <div className="absolute bottom-0 right-0 w-[36px] h-[36px] border-b-2 border-r-2 opacity-60" style={{ borderColor: hudColor }} />
                    <div className="absolute bottom-[8px] right-[8px] w-[18px] h-[18px] border-b border-r opacity-60" style={{ borderColor: hudColor }} />
                </div>


                {/* Repositioned Close Button */}
                <div
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 opacity-40 hover:opacity-100 transition-all hover:rotate-90 z-[100] cursor-pointer group"
                    style={{ color: hudColor }}
                    aria-label="Return to Vault"
                >
                    <X size={24} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.5 }}
                    className="w-full flex flex-col items-center text-center space-y-8"
                >
                    {/* Artifact Display Region */}
                    {children && (
                        <motion.div
                            animate={{ y: [0, -10, 0], rotateZ: [0, 1, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            style={{ background: 'transparent' }}
                            className="artifact-container w-full max-h-[180px] flex items-center justify-center flex-shrink-0 overflow-hidden [&_img]:max-h-[180px] [&_img]:max-w-full [&_img]:object-contain [&_img]:block"
                        >
                            {children}
                        </motion.div>
                    )}

                    <div className="space-y-[14px]">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-heading font-black tracking-[0.3em]" style={{ color: hudColor }}>
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
                                <span className="font-mono text-xl" style={{ color: hudColor }}>→</span>
                                <span className="font-mono text-xl font-bold" style={{ color: hudColor }}>{newScore}</span>
                                <span className="ml-2 text-[10px] font-mono opacity-60" style={{ color: hudColor }}>+{creditDelta}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onEnterDashboard}
                        style={{ backgroundColor: hudColor, boxShadow: `0 0 20px ${hudColor}33` }}
                        className="w-full max-w-[240px] py-4 text-black font-heading font-black text-[12px] tracking-[0.3em] uppercase transition-all hover:bg-white hover:scale-[1.02] active:scale-[0.98]"
                    >
                        [ Enter Dashboard ]
                    </button>
                </motion.div>

            </div>
        </motion.div>
    );
};

export default VaultCongratsOverlay;
