
import React, { useEffect, useRef } from 'react';
import { Shield } from 'lucide-react';
import gsap from 'gsap';

const TierBadge = ({ rank = 'Initiate' }) => {
    const badgeRef = useRef(null);
    const shineRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });
        tl.fromTo(shineRef.current,
            { x: '-150%', opacity: 0 },
            { x: '150%', opacity: 0.5, duration: 2, ease: "power2.inOut" }
        );
        return () => tl.kill();
    }, []);

    const getRankColor = () => {
        switch (rank.toLowerCase()) {
            case 'initiate': return 'from-slate-400 to-slate-200';
            case 'silver': return 'from-gray-300 to-white';
            case 'gold': return 'from-accent to-yellow-200';
            case 'master': return 'from-purple-500 to-accent';
            default: return 'from-accent to-accent-light';
        }
    };

    return (
        <div ref={badgeRef} className="relative inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full overflow-hidden">
            <Shield className="w-3 h-3 text-accent" />
            <span className={`text-[10px] font-heading font-black tracking-[.4em] uppercase bg-gradient-to-r ${getRankColor()} bg-clip-text text-transparent`}>
                {rank}_CLEARENCE
            </span>

            {/* Animated Shine */}
            <div
                ref={shineRef}
                className="absolute inset-0 w-1/3 bg-white/20 skew-x-[45deg] pointer-events-none"
                style={{ filter: 'blur(10px)' }}
            />
        </div>
    );
};

export default TierBadge;
