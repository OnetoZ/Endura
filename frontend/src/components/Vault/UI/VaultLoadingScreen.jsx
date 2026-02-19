import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import gsap from 'gsap';

// Lazy-load the heavy Three.js diamond so it doesn't block the initial render
const DiamondEntry = lazy(() => import('./DiamondEntry'));

// ─── Floating Particle ──────────────────────────────────────────────────────
const Particle = ({ style }) => (
    <div className="vault-particle" style={style} />
);

// ─── Stage 1: Gold Ring Loader ───────────────────────────────────────────────
const RingLoader = ({ onComplete }) => {
    const screenRef = useRef(null);
    const ringRef = useRef(null);
    const ring2Ref = useRef(null);
    const glowRef = useRef(null);
    const textRef = useRef(null);
    const [dots, setDots] = useState('');

    // Animated dots
    useEffect(() => {
        const iv = setInterval(() => setDots(p => p.length >= 3 ? '' : p + '.'), 400);
        return () => clearInterval(iv);
    }, []);

    useEffect(() => {
        const tl = gsap.timeline();

        // Fade in
        tl.fromTo(screenRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.5, ease: 'power2.out' }
        );

        // Ring rotations (continuous)
        gsap.to(ringRef.current, {
            rotation: 360, duration: 4, ease: 'none', repeat: -1,
        });
        gsap.to(ring2Ref.current, {
            rotation: -360, duration: 6, ease: 'none', repeat: -1,
        });

        // Glow pulse
        gsap.to(glowRef.current, {
            opacity: 0.8, scale: 1.15, duration: 1.8,
            ease: 'sine.inOut', repeat: -1, yoyo: true,
        });

        // Text fade in
        tl.fromTo(textRef.current,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
            0.6
        );

        // After ~5.5s, fade out and call onComplete
        tl.to(screenRef.current, {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.inOut',
            delay: 5.0,
            onComplete: () => onComplete && onComplete(),
        });

        return () => tl.kill();
    }, [onComplete]);

    // Generate particles (stable — no re-render jitter)
    const particles = useRef(
        Array.from({ length: 22 }, (_, i) => ({
            id: i,
            style: {
                left: `${(i * 4.7 + 3) % 100}%`,
                top: `${(i * 7.3 + 11) % 100}%`,
                width: `${(i % 3) + 1}px`,
                height: `${(i % 3) + 1}px`,
                animationDelay: `${(i * 0.4) % 6}s`,
                animationDuration: `${8 + (i % 5)}s`,
                opacity: 0.15 + (i % 4) * 0.1,
            }
        }))
    ).current;

    return (
        <div ref={screenRef} className="vault-loading-screen" style={{ opacity: 0 }}>
            {particles.map(p => <Particle key={p.id} style={p.style} />)}

            <div className="vault-loader-center">
                <div ref={glowRef} className="vault-ring-glow" />
                <div ref={ringRef} className="vault-ring-outer">
                    <div className="vault-ring-tick vault-ring-tick--top" />
                    <div className="vault-ring-tick vault-ring-tick--right" />
                    <div className="vault-ring-tick vault-ring-tick--bottom" />
                    <div className="vault-ring-tick vault-ring-tick--left" />
                </div>
                <div ref={ring2Ref} className="vault-ring-inner">
                    <div className="vault-ring-dot vault-ring-dot--1" />
                    <div className="vault-ring-dot vault-ring-dot--2" />
                    <div className="vault-ring-dot vault-ring-dot--3" />
                </div>
                <div className="vault-ring-emblem">
                    <span className="vault-ring-emblem-text">E</span>
                </div>
            </div>

            <div ref={textRef} className="vault-loading-text" style={{ opacity: 0 }}>
                <div className="vault-loading-label">ACCESSING VAULT{dots}</div>
                <div className="vault-loading-sublabel">SYNCING ARCHIVE</div>
            </div>
        </div>
    );
};

// ─── Stage 2: Diamond Entry wrapper ─────────────────────────────────────────
const DiamondStage = ({ onComplete }) => (
    <div className="vault-diamond-stage">
        <Suspense fallback={
            <div className="vault-diamond-fallback">
                <div className="vault-diamond-fallback-icon">◆</div>
            </div>
        }>
            <DiamondEntry onComplete={onComplete} />
        </Suspense>
    </div>
);

// ─── Orchestrator: Ring → Diamond → Vault ────────────────────────────────────
const VaultLoadingScreen = ({ onComplete }) => {
    // stage: 'ring' | 'diamond'
    const [stage, setStage] = useState('ring');

    return (
        <>
            {stage === 'ring' && (
                <RingLoader onComplete={() => setStage('diamond')} />
            )}
            {stage === 'diamond' && (
                <DiamondStage onComplete={onComplete} />
            )}
        </>
    );
};

export default VaultLoadingScreen;
