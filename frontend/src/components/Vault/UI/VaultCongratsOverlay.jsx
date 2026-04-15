import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const VaultCongratsOverlay = ({ children, accent, onEnterDashboard, onClose, serialNumber, tier }) => {
    const [isFlipped, setIsFlipped] = React.useState(false);
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
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-[12px] px-6 pointer-events-auto"
            onClick={(e) => {
                if (e.target === e.currentTarget) handleClose(e);
            }}
        >
            {/* HUD WRAPPER - Stable Rectangle with Natural Scaling */}
            <div className="relative w-[520px] min-h-[600px] bg-[#000000] p-[48px] box-border flex flex-col items-center justify-center gap-12 overflow-hidden shadow-[0_0_150px_rgba(201,162,39,0.1)]">
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
                    className="absolute top-6 right-6 p-2 opacity-40 hover:opacity-100 transition-all hover:rotate-90 z-[100] cursor-pointer group"
                    style={{ color: hudColor }}
                    aria-label="Return to Vault"
                >
                    <X size={28} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.5 }}
                    className="w-full flex flex-col items-center text-center space-y-12"
                >
                    {/* Interactive Artifact Display Region */}
                    {children && (
                        <div
                            className="w-[280px] h-[380px] [perspective:1000px] group/item cursor-help"
                            onMouseEnter={() => setIsFlipped(true)}
                            onMouseLeave={() => setIsFlipped(false)}
                        >
                            <motion.div
                                className="relative w-full h-full duration-1000 [transform-style:preserve-3d]"
                                animate={{
                                    rotateY: isFlipped ? 180 : 0,
                                }}
                                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            >
                                {children}
                            </motion.div>
                        </div>
                    )}

                    <div className="space-y-[14px]">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-heading font-black tracking-[0.2em]" style={{ color: hudColor }}>
                                ARCHIVE SYNCHRONIZED
                            </h2>
                            <div className="flex flex-col gap-2">
                                <p className="text-[12px] font-mono tracking-[0.4em] text-white font-bold uppercase">
                                    TIER : {tier || 'COMMON'}
                                </p>
                                <p className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase">
                                    SERIAL NO. {serialNumber || '1'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onEnterDashboard}
                        style={{ backgroundColor: hudColor, boxShadow: `0 0 20px ${hudColor}33` }}
                        className="w-full max-w-[280px] py-5 text-black font-heading font-black text-[12px] tracking-[0.4em] uppercase transition-all hover:bg-white hover:scale-[1.02] active:scale-[0.98]"
                    >
                        [ VIEW COLLECTION ]
                    </button>
                </motion.div>

            </div>
        </motion.div>
    );
};

export default VaultCongratsOverlay;
