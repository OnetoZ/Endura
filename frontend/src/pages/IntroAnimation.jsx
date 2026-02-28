import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useNavigate } from 'react-router-dom';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 118;

// Helper function to generate frame path matching actual filenames
const getFramePath = (index) => {
    const frameNumber = index.toString().padStart(3, '0');
    // All frames use delay-0.041s.webp based on file system check
    return `/ezgif-split/frame_${frameNumber}_delay-0.041s.webp`;
};

const IntroAnimation = () => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [showBlackScreen, setShowBlackScreen] = useState(false);
    const imagesRef = useRef([]);
    const navigate = useNavigate();
    // Shared completion guard across scroll + keyboard triggers
    const hasCompletedRef = useRef(false);

    // Lock scroll-behavior while intro is mounted so the document
    // scroll position never drifts — /home will always start at top
    useEffect(() => {
        document.documentElement.style.scrollBehavior = 'auto';
        return () => {
            document.documentElement.style.scrollBehavior = '';
        };
    }, []);

    const goToHome = () => {
        if (hasCompletedRef.current) return;
        hasCompletedRef.current = true;
        localStorage.setItem('endura_animation_completed', 'true');
        setShowBlackScreen(true);

        // Kill all ScrollTriggers to stop them interfering post-navigation
        ScrollTrigger.killAll();

        setTimeout(() => {
            // Force scroll position to absolute top before /home renders
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            navigate('/home');
        }, 400);
    };

    // Press Enter at any time during the intro to skip to /home
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') goToHome();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Preload all images and store them in a ref to avoid re-renders
    useEffect(() => {
        const preloadImages = async () => {
            const imagePromises = [];
            const loadedImages = [];

            for (let i = 0; i < TOTAL_FRAMES; i++) {
                const img = new Image();
                img.src = getFramePath(i);

                const promise = new Promise((resolve) => {
                    img.onload = () => {
                        setLoadingProgress((prev) => Math.min(prev + (100 / TOTAL_FRAMES), 100));
                        resolve();
                    };
                    img.onerror = () => {
                        console.error(`Failed to load frame ${i} at ${img.src}`);
                        resolve();
                    };
                });

                imagePromises.push(promise);
                loadedImages[i] = img;
            }

            try {
                await Promise.all(imagePromises);
                imagesRef.current = loadedImages;
                setImagesLoaded(true);
            } catch (error) {
                console.error('Error preloading frames:', error);
                setImagesLoaded(true);
            }
        };

        preloadImages();
    }, []);

    // Handle canvas drawing and scroll animation
    useGSAP(() => {
        if (!imagesLoaded || !containerRef.current || !canvasRef.current || imagesRef.current.length === 0) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const scrollHeight = window.innerHeight * 5; // Height of the scroll container

        // Object to hold the current frame index for GSAP to animate
        const airbnb = { frame: 0 };

        const renderFrame = (index) => {
            const img = imagesRef.current[index];
            if (!img || !context) return;

            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const imgWidth = img.width;
            const imgHeight = img.height;

            const ratio = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
            const newWidth = imgWidth * ratio;
            const newHeight = imgHeight * ratio;
            const x = (canvasWidth - newWidth) / 2;
            const y = (canvasHeight - newHeight) / 2;

            context.clearRect(0, 0, canvasWidth, canvasHeight);
            context.drawImage(img, x, y, newWidth, newHeight);
        };

        const updateCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            renderFrame(Math.floor(airbnb.frame));
        };

        window.addEventListener('resize', updateCanvasSize);
        updateCanvasSize();

        // Use the shared ref-based guard for scroll-triggered completion
        const handleComplete = () => goToHome();

        // Animation sequence
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: `+=${scrollHeight}`,
                pin: true,
                scrub: 1.5,
                onUpdate: (self) => {
                    renderFrame(Math.floor(airbnb.frame));

                    // Show black screen overlay as we near the end
                    if (self.progress > 0.95 && !showBlackScreen) {
                        setShowBlackScreen(true);
                    }

                    // Primary trigger: navigate once progress is effectively complete
                    if (self.progress >= 0.99) {
                        handleComplete();
                    }
                },
                // Fallback: fires when the user scrolls past the pinned section
                onLeave: () => {
                    handleComplete();
                },
                id: "intro-scroll"
            }
        });

        tl.to(airbnb, {
            frame: TOTAL_FRAMES - 1,
            snap: "frame",
            ease: "none"
        });

        return () => {
            window.removeEventListener('resize', updateCanvasSize);
        };
    }, { dependencies: [imagesLoaded] });

    if (!imagesLoaded) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="text-white text-2xl mb-4 font-mono tracking-widest uppercase">Initializing System...</div>
                    <div className="w-80 h-1 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                        <div
                            className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-300"
                            style={{ width: `${loadingProgress}%` }}
                        />
                    </div>
                    <div className="text-gray-500 mt-2 font-mono text-sm">{Math.round(loadingProgress)}%</div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative bg-black overflow-hidden">
            {/* Black screen overlay */}
            {showBlackScreen && (
                <div className="fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-300">
                    <div className="text-white text-sm font-mono tracking-[0.2em] uppercase animate-pulse">Entering Endura</div>
                </div>
            )}

            {/* Fixed Canvas display */}
            <div className="fixed inset-0 z-10">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full object-cover"
                />

                {/* Scroll indicator - Absolute within the fixed container */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/50 text-center pointer-events-none">
                    <div className="animate-bounce">
                        <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                        <div className="text-[10px] uppercase tracking-[0.3em]">Scroll</div>
                        <div className="text-[9px] tracking-widest mt-1 opacity-60">or press Enter ↵</div>
                    </div>
                </div>
            </div>

            {/* Scrollable container */}
            <div ref={containerRef} className="relative">
                {/* This creates the scrollable space */}
            </div>
        </div>
    );
};

export default IntroAnimation;
