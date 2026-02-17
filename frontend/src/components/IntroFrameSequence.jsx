import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 115; // frame_000 to frame_114

// Helper function to generate frame path matching actual filenames
// Pattern: indices where (i % 3 == 1) use 0.041s, all others use 0.042s
const getFramePath = (index) => {
    const frameNumber = index.toString().padStart(3, '0');
    const delay = (index % 3 === 1) ? '0.041s' : '0.042s';
    return `/ezgif-split/frame_${frameNumber}_delay-${delay}.webp`;
};

const IntroFrameSequence = ({ onComplete }) => {
    const sectionRef = useRef(null);
    const imgRef = useRef(null);
    const transitionDone = useRef(false);
    const [currentFrame, setCurrentFrame] = useState(0);

    // Preload critical frames for smooth initial experience
    useEffect(() => {
        const preloadFrames = [0, 1, 2, 3, 4, 5, 10, 20, 30, 50, 80, 114];
        preloadFrames.forEach(index => {
            const img = new Image();
            img.src = getFramePath(index);
        });
    }, []);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        let scrollTriggerInstance = null;

        // Create the scroll-controlled frame sequence
        scrollTriggerInstance = ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: "+=3000", // Scroll length for the frame sequence
            pin: true,
            scrub: 0.5, // Smooth scrubbing
            onUpdate: (self) => {
                const progress = self.progress;

                // Map progress (0-1) to frame index (0-114)
                const frameIndex = Math.min(
                    Math.floor(progress * TOTAL_FRAMES),
                    TOTAL_FRAMES - 1
                );

                // Update frame
                setCurrentFrame(frameIndex);

                // Transition detection
                if (progress >= 0.99 && !transitionDone.current) {
                    transitionDone.current = true;
                    if (onComplete) onComplete();
                }
            }
        });

        return () => {
            if (scrollTriggerInstance) {
                scrollTriggerInstance.kill();
            }
        };
    }, [onComplete]);

    return (
        <section
            ref={sectionRef}
            className="intro-frame-section relative h-screen w-full overflow-hidden bg-black z-[60]"
        >
            <img
                ref={imgRef}
                src={getFramePath(currentFrame)}
                alt={`Intro frame ${currentFrame}`}
                className="w-full h-full object-cover pointer-events-none"
                loading="eager"
            />

            {/* HUD / Overlay elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
        </section>
    );
};

export default IntroFrameSequence;
