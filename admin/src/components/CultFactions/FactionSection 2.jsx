import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const FactionSection = ({
    id,
    factionName,
    factionNumber,
    description,
    image,
    bgImage,
    themeColor,
    isLeft,
    grayscaleBg = true,
}) => {
    const sectionRef = useRef();
    const charRef = useRef();
    const contentRef = useRef();
    const bgOverlayRef = useRef();
    const titleRef = useRef();
    const descRef = useRef();
    const numRef = useRef();

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top top',
                end: '+=1500',
                scrub: 1,
                pin: true,
                anticipatePin: 1,
            }
        });

        // Background camera push
        tl.to(bgOverlayRef.current, { scale: 1.08, duration: 3 }, 0);

        // Character entry
        tl.fromTo(charRef.current,
            { scale: 1.08, opacity: 0, filter: 'blur(8px) brightness(0.3)' },
            { scale: 1, opacity: 1, filter: `blur(0px) brightness(1.1) drop-shadow(0 0 40px ${themeColor}55)`, duration: 2, ease: 'power2.out' },
            0.2
        );

        // Number reveal
        tl.fromTo(numRef.current,
            { opacity: 0, x: isLeft ? -20 : 20 },
            { opacity: 1, x: 0, duration: 1 },
            0.4
        );

        // Title reveal
        tl.fromTo(titleRef.current,
            { opacity: 0, y: 30, skewY: 3 },
            { opacity: 1, y: 0, skewY: 0, duration: 1.2, ease: 'power3.out' },
            0.6
        );

        // Description reveal
        tl.fromTo(descRef.current,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 1 },
            0.9
        );

        // Exit 
        tl.to([charRef.current, contentRef.current], {
            opacity: 0,
            y: -40,
            duration: 0.8
        }, '+=0.5');

    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            id={id}
            className="h-screen w-full relative bg-black overflow-hidden flex items-center justify-center"
        >
            {/* Background Layer */}
            <div
                ref={bgOverlayRef}
                className={`absolute inset-0 z-0 bg-cover bg-center ${grayscaleBg ? 'grayscale opacity-30' : 'opacity-50'} mix-blend-luminosity`}
                style={{ backgroundImage: bgImage ? `url(${bgImage})` : 'none' }}
            />

            {/* Color tint overlay using themeColor */}
            <div
                className="absolute inset-0 z-[1]"
                style={{ background: `radial-gradient(ellipse at center, ${themeColor}18 0%, transparent 70%)` }}
            />

            {/* Gradient top/bottom fade */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 z-[2]" />

            {/* Character Image - Full bleed centered */}
            <div className="absolute inset-0 flex items-center justify-center z-[10] pointer-events-none">
                <img
                    ref={charRef}
                    src={image}
                    alt={factionName}
                    className="h-[85vh] w-auto object-contain"
                    style={{ opacity: 0 }}
                />
            </div>

            {/* Content Overlay */}
            <div
                ref={contentRef}
                className={`relative z-[20] w-full max-w-7xl px-8 md:px-20 flex ${isLeft ? 'justify-start' : 'justify-end'} items-end pb-24`}
            >
                <div className={`max-w-md ${isLeft ? 'text-left' : 'text-right'}`}>
                    <span
                        ref={numRef}
                        className="font-mono text-[10px] tracking-[1em] uppercase mb-4 block"
                        style={{ color: themeColor, opacity: 0 }}
                    >
                        // {factionNumber}
                    </span>
                    <h2
                        ref={titleRef}
                        className="text-5xl md:text-8xl font-heading tracking-tight uppercase text-white leading-none mb-6"
                        style={{ opacity: 0 }}
                    >
                        {factionName}
                    </h2>
                    <div className="h-[2px] w-16 mb-6 inline-block" style={{ background: themeColor }} />
                    <p
                        ref={descRef}
                        className="font-light text-sm tracking-[0.15em] uppercase leading-relaxed"
                        style={{ color: 'rgba(255,255,255,0.55)', opacity: 0 }}
                    >
                        {description}
                    </p>
                </div>
            </div>

            {/* Cinematic top scan line */}
            <div
                className="absolute top-0 left-0 right-0 h-[1px] z-[30] pointer-events-none"
                style={{ background: `linear-gradient(to right, transparent, ${themeColor}66, transparent)` }}
            />
        </section>
    );
};

export default FactionSection;
