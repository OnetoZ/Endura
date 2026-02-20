
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, Sparkles } from 'lucide-react';
import TierBadge from './TierBadge';
import gsap from 'gsap';

const CreditPointsCard = ({ credits = 0, rank = 'Initiate' }) => {
    const [displayCredits, setDisplayCredits] = useState(0);

    useEffect(() => {
        // Number Count Animation
        const obj = { val: 0 };
        gsap.to(obj, {
            val: credits,
            duration: 2.5,
            ease: "power2.out",
            onUpdate: () => {
                setDisplayCredits(Math.floor(obj.val));
            }
        });

        // Glow Pulse
        gsap.to(".points-glow", {
            opacity: 0.8,
            scale: 1.1,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }, [credits]);

    return (
        <section className="py-20 flex justify-center">
            <motion.div
                whileHover={{ y: -10, boxShadow: '0 40px 100px rgba(212, 175, 55, 0.1)' }}
                className="relative w-full max-w-2xl aspect-[1.8/1] bg-[#0c0c0c] border border-accent/20 rounded-[3rem] overflow-hidden group p-12 flex flex-col justify-between"
            >
                <div className="relative z-10 flex justify-between items-start">
                    <div className="space-y-4">
                        <TierBadge rank={rank} />
                        <div className="flex flex-col">
                            <span className="font-mono text-[10px] text-white/50 tracking-[.5em] uppercase">User_Asset_Value</span>
                            <div className="relative inline-block">
                                <span className="text-7xl md:text-8xl font-heading font-black text-white tracking-tighter">
                                    {displayCredits}
                                </span>
                                <div className="points-glow absolute -inset-4 bg-accent/10 blur-2xl opacity-0 rounded-full" />
                            </div>
                        </div>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent">
                        <Sparkles className="w-8 h-8" />
                    </div>
                </div>

                <div className="relative z-10 flex border-t border-white/5 pt-8 justify-between items-end">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-accent">
                            <TrendingUp className="w-4 h-4" />
                            <span className="font-mono text-[10px] tracking-widest uppercase">+12% Since Last Login</span>
                        </div>
                        <p className="text-[10px] font-mono text-white/50 uppercase tracking-[.4em]">Next Reward: Epic Crate [80%]</p>
                        <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '80%' }}
                                transition={{ duration: 2, ease: "power4.out" }}
                                className="h-full bg-gradient-to-r from-accent/50 to-accent"
                            />
                        </div>
                    </div>
                    <button className="px-8 py-4 bg-accent text-black font-heading font-black text-[11px] tracking-[.3em] uppercase rounded-2xl hover:bg-white hover:text-black transition-all">
                        REDEEM_ASSETS
                    </button>
                </div>

                {/* Card Corner accents */}
                <div className="absolute top-10 left-10 w-2 h-2 border-t-2 border-l-2 border-accent/20" />
                <div className="absolute bottom-10 right-10 w-2 h-2 border-b-2 border-r-2 border-accent/20" />
            </motion.div>
        </section>
    );
};

export default CreditPointsCard;
