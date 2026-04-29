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
            <div className="relative w-full max-w-[420px] min-h-[480px] md:min-h-[500px] bg-[#000000] p-6 md:p-[36px] box-border flex flex-col items-center justify-center gap-6 md:gap-8 overflow-hidden shadow-[0_0_60px_rgba(168,85,247,0.3)] border border-white/70 mx-4">
                {/* HUD CORNERS LAYER */}
                <div className="absolute inset-0 pointer-events-none z-50">
                    {/* Top Left Corners */}
                    <div className="absolute top-0 left-0 w-[20px] md:w-[24px] h-[20px] md:h-[24px] border-t-2 border-l-2 opacity-60" style={{ borderColor: hudColor }} />
                    <div className="absolute top-[6px] left-[6px] w-[10px] md:w-[12px] h-[10px] md:h-[12px] border-t border-l opacity-60" style={{ borderColor: hudColor }} />

                    {/* Top Right Corners */}
                    <div className="absolute top-0 right-0 w-[20px] md:w-[24px] h-[20px] md:h-[24px] border-t-2 border-r-2 opacity-60" style={{ borderColor: hudColor }} />
                    <div className="absolute top-[6px] right-[6px] w-[10px] md:w-[12px] h-[10px] md:h-[12px] border-t border-r opacity-60" style={{ borderColor: hudColor }} />

                    {/* Bottom Left Corners */}
                    <div className="absolute bottom-0 left-0 w-[20px] md:w-[24px] h-[20px] md:h-[24px] border-b-2 border-l-2 opacity-60" style={{ borderColor: hudColor }} />
                    <div className="absolute bottom-[6px] left-[6px] w-[10px] md:w-[12px] h-[10px] md:h-[12px] border-b border-l opacity-60" style={{ borderColor: hudColor }} />

                    {/* Bottom Right Corners */}
                    <div className="absolute bottom-0 right-0 w-[20px] md:w-[24px] h-[20px] md:h-[24px] border-b-2 border-r-2 opacity-60" style={{ borderColor: hudColor }} />
                    <div className="absolute bottom-[6px] right-[6px] w-[10px] md:w-[12px] h-[10px] md:h-[12px] border-b border-r opacity-60" style={{ borderColor: hudColor }} />
                </div>


                {/* Repositioned Close Button */}
                <div
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-1.5 opacity-40 hover:opacity-100 transition-all hover:rotate-90 z-[100] cursor-pointer group"
                    style={{ color: hudColor }}
                    aria-label="Return to Vault"
                >
                    <X size={20} md:size={22} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.5 }}
                    className="w-full flex flex-col items-center text-center space-y-6 md:space-y-8"
                >
                    {/* Interactive Artifact Display Region */}
                    {children && (
                        <div
                            className="w-[180px] md:w-[200px] h-[240px] md:h-[280px] [perspective:1000px] group/item cursor-help"
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

                    <div className="space-y-[8px] md:space-y-[10px]">
                        <div className="space-y-2 md:space-y-3">
                            <h2 className="text-xl md:text-2xl font-heading font-black tracking-[0.2em] leading-tight" style={{ color: hudColor }}>
                                ARCHIVE SYNCHRONIZED
                            </h2>
                            <div className="flex flex-col gap-1 md:gap-1.5">
                                <p className="text-[9px] md:text-[10px] font-mono tracking-[0.3em] text-white font-bold uppercase">
                                    TIER : {tier || 'COMMON'}
                                </p>
                                <p className="text-[8px] md:text-[9px] font-mono tracking-[0.2em] text-white/40 uppercase">
                                    SERIAL NO. {serialNumber || '1'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onEnterDashboard}
                        style={{ backgroundColor: hudColor, boxShadow: `0 0 15px ${hudColor}33` }}
                        className="w-full max-w-[200px] md:max-w-[240px] py-3.5 md:py-4 text-black font-heading font-black text-[9px] md:text-[10px] tracking-[0.3em] uppercase transition-all hover:bg-white hover:scale-[1.02] active:scale-[0.98]"
                    >
                        [ VIEW COLLECTION ]
                    </button>
                </motion.div>

            </div>
        </motion.div>
    );
};

export default VaultCongratsOverlay;
