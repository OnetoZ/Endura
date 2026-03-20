import { useRef, useEffect, useState, useCallback, memo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 118;

const getFramePath = (index) => {
    const frameNumber = index.toString().padStart(3, '0');
    return `/ezgif-split/frame_${frameNumber}_delay-0.041s.webp`;
};

const IntroAnimation = memo(({ onComplete }) => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const imagesRef = useRef([]);
    const frameRef = useRef({ index: 0 });
    const requestRef = useRef();

    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [showBlackScreen, setShowBlackScreen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [scrollHeight, setScrollHeight] = useState(0);

    const navigate = useNavigate();
    const hasCompletedRef = useRef(false);
    const mountTimeRef = useRef(Date.now());

    // ✅ Detect mobile
    useEffect(() => {
        const mobile = window.innerWidth <= 768;
        setIsMobile(mobile);
        setScrollHeight(window.innerHeight * (mobile ? 4 : 5));
    }, []);

    // ✅ Scroll behavior
    useEffect(() => {
        window.scrollTo(0, 0);
        document.documentElement.style.scrollBehavior = isMobile ? 'auto' : 'smooth';

        return () => {
            document.documentElement.style.scrollBehavior = '';
        };
    }, [isMobile]);

    // ✅ Navigation
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

    // ✅ Enter key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') goToHome();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [goToHome]);

    // ✅ Preload images
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

                    img.onerror = () => {
                        console.error("❌ Image failed:", img.src);
                        resolve();
                    };
                });
            });

            await Promise.all(promises);
            imagesRef.current = loadedImages;
            setImagesLoaded(true);
        };

        preloadImages();
    }, []);

    // ✅ DRAW (CENTER FIX)
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !imagesLoaded) return;

        const context = canvas.getContext('2d');
        const img = imagesRef.current[Math.floor(frameRef.current.index)];

        if (!img || !context) return;

        const rect = canvas.getBoundingClientRect();

        const cw = rect.width;
        const ch = rect.height;

        const iw = img.width;
        const ih = img.height;

        const ratio = Math.max(cw / iw, ch / ih);

        const nw = iw * ratio;
        const nh = ih * ratio;

        const nx = (cw - nw) / 2;
        const ny = (ch - nh) / 2;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, nx, ny, nw, nh);
    }, [imagesLoaded]);

    // ✅ First frame
    useEffect(() => {
        if (imagesLoaded) {
            frameRef.current.index = 0;
            draw();
        }
    }, [imagesLoaded, draw]);

    // ✅ Animation loop
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

    // ✅ GSAP
    useGSAP(() => {
        if (!imagesLoaded || !containerRef.current) return;

        const handleResize = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const dpr = window.devicePixelRatio || 1;

            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;

            const ctx = canvas.getContext('2d');
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: `+=${scrollHeight}`,
                pin: true,
                scrub: isMobile ? 0.2 : 1.5,
                onUpdate: (self) => {
                    frameRef.current.index = Math.floor(self.progress * (TOTAL_FRAMES - 1));

                    if (self.progress > 0.95) setShowBlackScreen(true);
                    if (self.progress >= 0.995) goToHome();
                }
            }
        });

        tl.to({}, { duration: 1 });

        return () => window.removeEventListener('resize', handleResize);
    }, { dependencies: [imagesLoaded, scrollHeight, isMobile] });

    // ✅ Loader
    if (!imagesLoaded) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white">Loading {Math.round(loadingProgress)}%</div>
            </div>
        );
    }

    return (
        <div className="relative bg-black overflow-hidden">

            {showBlackScreen && (
                <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
                    <div className="text-white">Entering Endura</div>
                </div>
            )}

            <div className="fixed inset-0 z-10">
                <canvas ref={canvasRef} className="w-full h-full" />

                {/* 🔥 SCROLL INDICATOR */}
                <div 
                    className="absolute bottom-8 left-1/2 text-white/60 text-center pointer-events-none"
                    style={{ transform: 'translateX(-50%)' }}
                >
                    <div className="animate-bounce">
                        <svg 
                            className="w-5 h-5 mx-auto mb-1 opacity-80" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={1.5} 
                                d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                            />
                        </svg>

                        <div className="text-[10px] uppercase tracking-[0.3em]">
                            Scroll
                        </div>

                        <div className="text-[9px] tracking-widest mt-1 opacity-60">
                            or press Enter ↵
                        </div>
                    </div>
                </div>
            </div>

            <div
                ref={containerRef}
                style={{ height: scrollHeight }}
            />
        </div>
    );
});

export default IntroAnimation;