import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const OrderScene = () => {
    const sectionRef = useRef();

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=2500",
                scrub: 1,
                pin: true,
                anticipatePin: 1
            }
        });

        // Symbols fade in one by one
        tl.fromTo(".order-symbol",
            { opacity: 0, scale: 0.5, filter: 'blur(10px)' },
            { opacity: 0.4, scale: 1, filter: 'blur(0px)', duration: 1, stagger: 0.5 }
        );

        // Text slow reveal
        tl.fromTo(".order-text-1", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.5 }, "-=1");
        tl.fromTo(".order-text-2", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.5 }, "+=0.5");

        // Final closing animation (Vault door vibe)
        tl.to(".order-symbol", {
            scale: 1.5,
            opacity: 0,
            filter: 'brightness(3) blur(20px)',
            duration: 1
        }, "+=1");

    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="h-screen w-full relative bg-black overflow-hidden flex flex-col items-center justify-center p-12">
            {/* Dark Restricted Chamber background elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[150px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)]" />
            </div>

            {/* Gold-lined symbols */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="order-symbol absolute w-64 h-64 border border-accent/20 rotate-45" />
                <div className="order-symbol absolute w-80 h-80 border border-accent/10 -rotate-12" />
                <div className="order-symbol absolute w-96 h-96 border border-accent/5 rotate-90" />
            </div>

            <div className="relative z-10 max-w-2xl text-center space-y-16">
                <div className="space-y-4">
                    <p className="order-text-1 order-text text-xl md:text-3xl font-oswald tracking-[0.3em] uppercase leading-tight italic text-white/90">
                        ENDURA is not worn. <br />
                        <span className="text-accent system-text-glow">It is entered.</span>
                    </p>
                </div>

                <div className="order-text-2 order-text space-y-8">
                    <div className="h-px w-24 bg-accent/30 mx-auto" />
                    <p className="text-gray-500 font-mono text-xs md:text-sm tracking-[0.5em] uppercase leading-relaxed max-w-md mx-auto">
                        Only those who possess may unlock both worlds.
                    </p>
                </div>
            </div>

            {/* Restricted label */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
                <span className="text-[9px] font-mono tracking-[1em] text-white/20 uppercase animate-pulse">
                    // ACCESS_PENDING_LAYER_09
                </span>
            </div>
        </section>
    );
};

export default OrderScene;
