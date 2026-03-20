import { useRef, useEffect, useState, useCallback, memo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useNavigate } from 'react-router-dom';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 118;
const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth <= 768;

const getFramePath = (index) => {
    const frameNumber = index.toString().padStart(3, '0');
    return `/ezgif-split/frame_${frameNumber}_delay-0.041s.webp`;
};

const IntroAnimation = memo(({ onComplete }) => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [showBlackScreen, setShowBlackScreen] = useState(false);
    const imagesRef = useRef([]);
    const frameRef = useRef({ index: 0 });
    const requestRef = useRef();
    const navigate = useNavigate();
    const hasCompletedRef = useRef(false);
    const mountTimeRef = useRef(Date.now());

    // Optimize window scrolling
    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);
        document.documentElement.style.scrollBehavior = IS_MOBILE ? 'auto' : 'smooth';

        return () => {
            document.documentElement.style.scrollBehavior = '';
            if ('scrollRestoration' in window.history) {
                window.history.scrollRestoration = 'auto';
            }
        };
    }, []);

    const goToHome = useCallback(() => {
        if (hasCompletedRef.current) return;
        if (Date.now() - mountTimeRef.current < 800) return;

        hasCompletedRef.current = true;
        localStorage.setItem('endura_animation_completed', 'true');

        setShowBlackScreen(true);
        ScrollTrigger.getAll().forEach(st => st.kill());

        setTimeout(() => {
            if (onComplete) onComplete();
            window.scrollTo(0, 0);
            if (!onComplete) navigate('/');
        }, 500);
    }, [onComplete, navigate]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') goToHome();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [goToHome]);

    // Preload with Throttling for Mobile
    useEffect(() => {
        const preloadImages = async () => {
            const loadedImages = [];
            let count = 0;

            const promises = Array.from({ length: TOTAL_FRAMES }).map((_, i) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.src = getFramePath(i);
                    img.onload = () => {
                        count++;
                        setLoadingProgress((count / TOTAL_FRAMES) * 100);
                        loadedImages[i] = img;
                        resolve();
                    };
                    img.onerror = resolve;
                });
            });

            await Promise.all(promises);
            imagesRef.current = loadedImages;
            setImagesLoaded(true);
        };

        preloadImages();
    }, []);

    const scrollHeight = window.innerHeight * (IS_MOBILE ? 4 : 5);

    // Optimized Render Function using requestAnimationFrame
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !imagesLoaded) return;
        
        const context = canvas.getContext('2d', { alpha: false, desynchronized: IS_MOBILE });
        const img = imagesRef.current[Math.floor(frameRef.current.index)];
        
        if (!img || !context) return;

        const cw = canvas.width;
        const ch = canvas.height;
        const iw = img.width;
        const ih = img.height;

        // FIXED SCALE CALCULATION: Prevent shrinking/shifting
        const ratio = Math.max(cw / iw, ch / ih);
        const nw = iw * ratio;
        const nh = ih * ratio;
        const nx = (cw - nw) / 2;
        const ny = (ch - nh) / 2;

        context.drawImage(img, nx, ny, nw, nh);
    }, [imagesLoaded]);

    const animate = useCallback(() => {
        draw();
        requestRef.current = requestAnimationFrame(animate);
    }, [draw]);

    useEffect(() => {
        if (imagesLoaded) {
            requestRef.current = requestAnimationFrame(animate);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [imagesLoaded, animate]);

    useGSAP(() => {
        if (!imagesLoaded || !containerRef.current) return;

        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth * (window.devicePixelRatio || 1);
                canvasRef.current.height = window.innerHeight * (window.devicePixelRatio || 1);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        // SCROLL TRIGGER CONFIGURATION
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: `+=${scrollHeight}`,
                pin: true,
                scrub: IS_MOBILE ? 0.2 : 1.5, // Ultra-fast scrub for mobile touch smoothness
                onUpdate: (self) => {
                    frameRef.current.index = Math.min(
                        Math.floor(self.progress * (TOTAL_FRAMES - 1)),
                        TOTAL_FRAMES - 1
                    );

                    if (self.progress > 0.95 && !showBlackScreen) {
                        setShowBlackScreen(true);
                    }
                    if (self.progress >= 0.995) {
                        goToHome();
                    }
                },
                id: "intro-scroll"
            }
        });

        // Use a dummy object for GSAP to manipulate, while rAF handles the draw
        tl.to({}, { duration: 1 }); 

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, { dependencies: [imagesLoaded, showBlackScreen] });

    if (!imagesLoaded) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="text-white text-2xl mb-4 font-mono tracking-widest uppercase">Initializing System...</div>
                    <div className="w-80 h-1 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                        <div
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ 
                                width: `${loadingProgress}%`,
                                transform: 'translate3d(0,0,0)'
                            }}
                        />
                    </div>
                    <div className="text-gray-500 mt-2 font-mono text-sm">{Math.round(loadingProgress)}%</div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative bg-black" style={{ contain: 'strict', overflow: 'hidden' }}>
            {showBlackScreen && (
                <div 
                    className="fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-300"
                    style={{ transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden' }}
                >
                    <div className="text-white text-sm font-mono tracking-[0.2em] uppercase animate-pulse">Entering Endura</div>
                </div>
            )}

            <div 
                className="fixed inset-0 z-10" 
                style={{ 
                    transform: 'translate3d(0,0,0)', 
                    backfaceVisibility: 'hidden',
                    contain: 'layout paint'
                }}
            >
                <canvas
                    ref={canvasRef}
                    className="w-full h-full"
                    style={{ 
                        display: 'block',
                        width: '100vw',
                        height: '100vh',
                        objectFit: 'cover',
                        willChange: 'transform',
                        transform: 'translate3d(0,0,0) rotate(0.001deg)',
                        backfaceVisibility: 'hidden',
                        imageRendering: IS_MOBILE ? 'auto' : 'high-quality'
                    }}
                />

                <div 
                    className="absolute bottom-8 left-1/2 text-white/50 text-center pointer-events-none"
                    style={{ transform: 'translate3d(-50%, 0, 0)' }}
                >
                    <div className="animate-bounce">
                        <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                        <div className="text-[10px] uppercase tracking-[0.3em]">Scroll</div>
                        <div className="text-[9px] tracking-widest mt-1 opacity-60">or press Enter ↵</div>
                    </div>
                </div>
            </div>

            <div 
                ref={containerRef} 
                className="relative z-20" 
                style={{ height: scrollHeight, contain: 'layout' }}
            >
                {/* Scroll track */}
            </div>
        </div>
    );
});

IntroAnimation.displayName = 'IntroAnimation';
export default IntroAnimation;
