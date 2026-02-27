import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 117; // frame_000 to frame_114

// Helper function to generate frame path matching actual filenames
const getFramePath = (index) => {
    const frameNumber = index.toString().padStart(3, '0');
    const delay = (index % 3 === 1) ? '0.041s' : '0.042s';
    return `/ezgif-split/frame_${frameNumber}_delay-${delay}.webp`;
};

const IntroAnimation = () => {
    const containerRef = useRef(null);
    const frameRef = useRef(null);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [showBlackScreen, setShowBlackScreen] = useState(false);

    console.log('IntroAnimation component mounted');

    // Preload all images
    useEffect(() => {
        const preloadImages = async () => {
            const imagePromises = [];

            for (let i = 0; i < TOTAL_FRAMES; i++) {
                const img = new Image();
                img.src = getFramePath(i);

                const promise = new Promise((resolve) => {
                    img.onload = () => {
                        setLoadingProgress((prev) => Math.min(prev + (100 / TOTAL_FRAMES), 100));
                        resolve();
                    };
                    img.onerror = () => resolve(); // Continue even if some images fail
                });

                imagePromises.push(promise);
            }

            try {
                await Promise.all(imagePromises);
                console.log('All intro frames loaded successfully');
                setImagesLoaded(true);
            } catch (error) {
                console.error('Error loading frames:', error);
                setImagesLoaded(true); // Continue anyway
            }
        };

        preloadImages();
    }, []);

    // Set up scroll-based frame animation
    useGSAP(() => {
        if (!imagesLoaded || !containerRef.current) return;

        // Create a tall scrollable container
        const scrollHeight = window.innerHeight * 3; // 3 screen heights for smooth scrolling

        // Set up ScrollTrigger for frame-by-frame animation
        ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top top",
            end: `+=${scrollHeight}`,
            pin: true,
            scrub: 1, // Smooth scrubbing
            onUpdate: (self) => {
                // Calculate frame based on scroll progress
                const progress = self.progress;
                const frameIndex = Math.min(
                    Math.floor(progress * TOTAL_FRAMES),
                    TOTAL_FRAMES - 1
                );

                setCurrentFrame(frameIndex);

                // Navigate to home when reaching the last frame
                if (frameIndex === TOTAL_FRAMES - 1 && progress >= 0.99) {
                    localStorage.setItem('endura_animation_completed', 'true');

                    // Show black screen
                    setShowBlackScreen(true);

                    // Navigate to home immediately after black screen shows
                    setTimeout(() => {
                        window.location.href = '/home';
                    }, 100);
                }
            },
            onLeave: () => {
                localStorage.setItem('endura_animation_completed', 'true');
                // Force navigation to home
                window.location.href = '/home';
            }
        });

        // Set the container height for scrolling
        gsap.set(containerRef.current, { height: scrollHeight });

    }, { dependencies: [imagesLoaded] });

    if (!imagesLoaded) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="text-white text-2xl mb-4">Loading Animation...</div>
                    <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white transition-all duration-300"
                            style={{ width: `${loadingProgress}%` }}
                        />
                    </div>
                    <div className="text-gray-400 mt-2">{Math.round(loadingProgress)}%</div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative bg-black overflow-hidden">
            {/* Black screen overlay */}
            {showBlackScreen && (
                <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
                    <div className="text-white text-xl animate-pulse">Loading...</div>
                </div>
            )}

            {/* Fixed frame display */}
            <div className="fixed inset-0 z-10 flex items-center justify-center">
                <img
                    ref={frameRef}
                    src={getFramePath(currentFrame)}
                    alt={`Frame ${currentFrame}`}
                    className="w-full h-full object-cover"
                    style={{ maxHeight: '100vh' }}
                />

                {/* Scroll indicator */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
                    <div className="animate-bounce">
                        <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                        <div className="text-sm">Scroll down</div>
                    </div>
                </div>
            </div>

            {/* Hidden scroll container */}
            <div ref={containerRef} className="relative">
                {/* This creates the scrollable space */}
                <div style={{ height: '300vh' }} />
            </div>
        </div>
    );
};

export default IntroAnimation;
