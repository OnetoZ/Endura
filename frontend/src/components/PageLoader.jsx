import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

const PageLoader = () => {
    const [isVisible, setIsVisible] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Trigger loader on route change
        setIsVisible(true);
        
        const tl = gsap.timeline({
            onComplete: () => {
                setTimeout(() => {
                    setIsVisible(false);
                }, 800); // Duration to stay visible
            }
        });

        // Background Fade In
        tl.to(".page-loader-bg", { opacity: 1, duration: 0.3, ease: "power2.inOut" })
          // Logo Rise
          .fromTo(".page-loader-logo", 
            { opacity: 0, y: 30, filter: 'blur(10px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: "power3.out" }
          )
          // Tagline Fade
          .fromTo(".page-loader-tagline",
            { opacity: 0, scale: 0.9 },
            { opacity: 0.4, scale: 1, duration: 0.4 },
            "-=0.2"
          )
          // Hold
          .to({}, { duration: 0.5 })
          // Exit
          .to(".page-loader-bg", { opacity: 0, duration: 0.4, ease: "power2.inOut" });

        return () => tl.kill();
    }, [location.pathname]);

    if (!isVisible) return null;

    return (
        <div className="page-loader-bg fixed inset-0 z-[9999] bg-black flex items-center justify-center opacity-0 pointer-events-none">
            {/* Ultra-precise Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12)_0%,transparent_60%)]" />
            
            <div className="relative flex flex-col items-center justify-center space-y-10">
                <div className="relative">
                    <img 
                        src="/logo.png" 
                        alt="ENDURA" 
                        className="page-loader-logo w-64 md:w-[450px] object-contain opacity-0 brightness-125"
                    />
                    {/* Secondary Glow behind logo */}
                    <div className="absolute inset-0 bg-blue-500/10 blur-[100px] -z-10 rounded-full" />
                </div>
                
                <div className="page-loader-tagline overflow-hidden w-full flex justify-center opacity-0">
                    <p className="font-mono text-[9px] md:text-[11px] tracking-[1.8em] text-blue-500/60 uppercase mr-[-1.8em] whitespace-nowrap">
                        // DIGITAL_LEGACY_PROTOCOL
                    </p>
                </div>
            </div>

            {/* Scan line effect */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
        </div>
    );
};

export default PageLoader;
