
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ThreeScene } from './ThreeScene';

gsap.registerPlugin(ScrollTrigger);

const CollectionHero = ({ images }) => {
    const sectionRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Fade and slide animation on load
            gsap.from(contentRef.current, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: "power4.out"
            });

            /* Cinematic collapse on scroll
            gsap.to(sectionRef.current, {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                    pin: true,
                    pinSpacing: false
                },
                scale: 0.9,
                opacity: 0,
                filter: "blur(10px)",
                y: -100
            });
            */
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative h-[100vh] w-full flex items-center justify-center overflow-hidden bg-black"
            style={{ zIndex: 10 }}
        >
            {/* The 3D Cinematic Background */}
            <div className="absolute inset-0 z-0">
                <ThreeScene images={images} />
            </div>

            {/* Content Overlay */}
            <div
                ref={contentRef}
                className="relative z-10 text-center px-4"
            >
                <h1 className="text-4xl md:text-8xl font-heading uppercase tracking-tighter leading-none">
                    THE <span className="text-accent italic">VAULT</span>
                </h1>
            </div>
        </section>
    );
};

export default CollectionHero;
