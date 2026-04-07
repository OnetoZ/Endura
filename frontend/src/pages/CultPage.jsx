import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SEO from '../components/SEO';

const CultPage = () => {
    const containerRef = useRef();
    const lockRef = useRef();
    const textRef = useRef();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useGSAP(() => {
        const tl = gsap.timeline();
        
        tl.fromTo(lockRef.current, 
            { scale: 0.5, opacity: 0, filter: 'blur(10px)' },
            { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.5, ease: 'power4.out' }
        )
        .fromTo(textRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
            "-=0.5"
        );
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="bg-black text-white min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
            <SEO 
                title="FACTIONS | Locked"
                description="Experience the factions of ENDURA. Coming soon to the India luxury streetwear network."
                canonical="/cult"
            />
            
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)]" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(to right, #3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            {/* Lock Symbol Container */}
            <div ref={lockRef} className="relative z-10 mb-12">
                <div className="w-32 h-32 md:w-48 md:h-48 border border-blue-500/20 rounded-full flex items-center justify-center relative">
                    {/* Pulsing Rings */}
                    <div className="absolute inset-0 border border-blue-500/40 rounded-full animate-ping opacity-20" style={{ animationDuration: '3s' }} />
                    <div className="absolute inset-[-20px] border border-blue-500/10 rounded-full" />
                    
                    <svg className="w-16 h-16 md:w-24 md:h-24 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
            </div>

            {/* Restricted Info */}
            <div ref={textRef} className="text-center z-10 space-y-6 px-6">
                <div className="space-y-2">
                    <span className="font-mono text-[9px] md:text-[10px] tracking-[1.2rem] text-blue-500/60 uppercase block mr-[-1.2rem]">
                        // ACCESS_RESTRICTED
                    </span>
                    <h1 className="text-4xl md:text-7xl font-heading tracking-tighter uppercase">
                        FACTIONS <span className="text-blue-500">LOCKED</span>
                    </h1>
                </div>
                
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent mx-auto" />
                
                <p className="text-gray-500 font-light tracking-[0.4em] uppercase text-[10px] md:text-xs max-w-sm mx-auto leading-loose">
                    The faction selection protocol is currently under encryption.<br/>
                    Digital identities will be assigned soon.
                </p>
                
                <div className="pt-8">
                    <span className="font-mono text-[10px] text-white/20 tracking-widest uppercase animate-pulse">
                        S01_BOOT_SEQUENCE_IN_PROGRESS
                    </span>
                </div>
            </div>

            {/* Back Scan Line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        </div>
    );
};

export default CultPage;
