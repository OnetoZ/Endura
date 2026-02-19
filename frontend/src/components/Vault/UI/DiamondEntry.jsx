import React, { useRef, useState, useEffect, useCallback, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// ─── Diamond Geometry (custom low-poly gem shape) ───────────────────────────
// Built from a BufferGeometry so we have full control — no external assets needed.
function buildDiamondGeometry() {
    // Crown vertices (top half) — 8 facets around a top point
    const crownH = 0.55;   // height of crown
    const girdleR = 1.0;    // radius at girdle (widest point)
    const crownR = 0.72;   // inner crown radius
    const pavilionH = -0.85; // depth of pavilion (bottom)
    const culetY = -0.95;  // very bottom point

    const topPoint = new THREE.Vector3(0, crownH + 0.15, 0);
    const culet = new THREE.Vector3(0, culetY, 0);

    // 8 girdle vertices
    const girdleVerts = Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(a) * girdleR, 0, Math.sin(a) * girdleR);
    });

    // 8 crown table vertices (slightly inset, raised)
    const crownVerts = Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
        return new THREE.Vector3(Math.cos(a) * crownR, crownH * 0.55, Math.sin(a) * crownR);
    });

    const positions = [];
    const normals = [];

    const pushTri = (a, b, c) => {
        const ab = new THREE.Vector3().subVectors(b, a);
        const ac = new THREE.Vector3().subVectors(c, a);
        const n = new THREE.Vector3().crossVectors(ab, ac).normalize();
        [a, b, c].forEach(v => {
            positions.push(v.x, v.y, v.z);
            normals.push(n.x, n.y, n.z);
        });
    };

    // Crown: top point → crown ring → girdle
    for (let i = 0; i < 8; i++) {
        const next = (i + 1) % 8;
        // Upper crown facet (top → crown[i] → crown[next])
        pushTri(topPoint, crownVerts[i], crownVerts[next]);
        // Lower crown facet (crown[i] → girdle[i] → crown[next])
        pushTri(crownVerts[i], girdleVerts[i], crownVerts[next]);
        // Lower crown facet 2 (girdle[i] → girdle[next] → crown[next])
        pushTri(girdleVerts[i], girdleVerts[next], crownVerts[next]);
    }

    // Pavilion: girdle → culet
    for (let i = 0; i < 8; i++) {
        const next = (i + 1) % 8;
        pushTri(girdleVerts[i], culet, girdleVerts[next]);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geo.computeVertexNormals(); // smooth normals
    return geo;
}

// ─── The 3D Diamond Mesh ─────────────────────────────────────────────────────
function Diamond({ onDiamondClick, isExploding }) {
    const meshRef = useRef(null);
    const glowRef = useRef(null);
    const geo = useRef(buildDiamondGeometry());
    const [hovered, setHovered] = useState(false);

    // Idle rotation
    useFrame((state, delta) => {
        if (!meshRef.current || isExploding) return;
        meshRef.current.rotation.y += delta * 0.45;
        // Gentle bob
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.06;
    });

    // Glow sphere pulse
    useFrame((state) => {
        if (!glowRef.current) return;
        const pulse = 0.85 + Math.sin(state.clock.elapsedTime * 1.4) * 0.15;
        glowRef.current.scale.setScalar(pulse);
        glowRef.current.material.opacity = hovered ? 0.22 : 0.10 + Math.sin(state.clock.elapsedTime * 1.4) * 0.04;
    });

    return (
        <group>
            {/* Ambient glow sphere */}
            <mesh ref={glowRef} scale={1.6}>
                <sphereGeometry args={[1.1, 16, 16]} />
                <meshBasicMaterial
                    color="#4fc3f7"
                    transparent
                    opacity={0.10}
                    side={THREE.BackSide}
                    depthWrite={false}
                />
            </mesh>

            {/* Main diamond */}
            <mesh
                ref={meshRef}
                geometry={geo.current}
                onClick={onDiamondClick}
                onPointerEnter={() => setHovered(true)}
                onPointerLeave={() => setHovered(false)}
                castShadow
            >
                <MeshTransmissionMaterial
                    backside
                    samples={4}
                    thickness={0.5}
                    roughness={0.02}
                    transmission={0.96}
                    ior={2.42}
                    chromaticAberration={0.06}
                    anisotropy={0.3}
                    distortion={0.15}
                    distortionScale={0.4}
                    temporalDistortion={0.05}
                    color={hovered ? '#a8d8ff' : '#cce8ff'}
                    attenuationColor="#4fc3f7"
                    attenuationDistance={0.8}
                    envMapIntensity={2.5}
                />
            </mesh>

            {/* Inner core glow (always visible) */}
            <mesh geometry={geo.current} scale={0.92}>
                <meshBasicMaterial
                    color="#7dd3fc"
                    transparent
                    opacity={0.06}
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
}

// ─── Floor Reflection Plane ──────────────────────────────────────────────────
function FloorReflection() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
            <planeGeometry args={[12, 12]} />
            <meshStandardMaterial
                color="#000000"
                metalness={0.8}
                roughness={0.4}
                transparent
                opacity={0.6}
            />
        </mesh>
    );
}

// ─── Scene Lights ────────────────────────────────────────────────────────────
function SceneLights() {
    const lightRef = useRef(null);
    useFrame((state) => {
        if (!lightRef.current) return;
        lightRef.current.intensity = 1.8 + Math.sin(state.clock.elapsedTime * 1.2) * 0.4;
    });

    return (
        <>
            <ambientLight intensity={0.15} color="#0a0a1a" />
            {/* Key blue light from above */}
            <pointLight ref={lightRef} position={[0, 5, 0]} color="#4fc3f7" intensity={2.2} distance={12} />
            {/* Rim light from behind */}
            <pointLight position={[-3, 2, -3]} color="#7c3aed" intensity={1.2} distance={10} />
            {/* Fill from front */}
            <pointLight position={[3, -1, 4]} color="#1e40af" intensity={0.8} distance={8} />
            {/* Warm gold accent */}
            <pointLight position={[2, 3, 2]} color="#d4af37" intensity={0.5} distance={6} />
        </>
    );
}

// ─── Burst Particles (CSS-based, triggered on click) ─────────────────────────
function BurstOverlay({ active }) {
    if (!active) return null;
    return (
        <div className="diamond-burst-overlay">
            {Array.from({ length: 16 }, (_, i) => (
                <div
                    key={i}
                    className="diamond-burst-ray"
                    style={{ '--angle': `${i * 22.5}deg` }}
                />
            ))}
            <div className="diamond-burst-core" />
        </div>
    );
}

// ─── Main DiamondEntry Component ─────────────────────────────────────────────
const DiamondEntry = ({ onComplete }) => {
    const containerRef = useRef(null);
    const overlayRef = useRef(null);
    const textRef = useRef(null);
    const [isExploding, setIsExploding] = useState(false);
    const [showBurst, setShowBurst] = useState(false);
    const [dots, setDots] = useState('');

    // Animated dots on label
    useEffect(() => {
        const iv = setInterval(() => setDots(p => p.length >= 3 ? '' : p + '.'), 500);
        return () => clearInterval(iv);
    }, []);

    // Entrance animation
    useEffect(() => {
        const tl = gsap.timeline();
        tl.fromTo(containerRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.9, ease: 'power2.out' }
        );
        tl.fromTo(textRef.current,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
            0.5
        );
    }, []);

    // Click handler — triggers the burst → scale → fade sequence
    const handleDiamondClick = useCallback(() => {
        if (isExploding) return;
        setIsExploding(true);
        setShowBurst(true);

        const tl = gsap.timeline();

        // 1. Text fades out
        tl.to(textRef.current, { opacity: 0, y: -10, duration: 0.3, ease: 'power2.in' }, 0);

        // 2. Burst holds briefly
        tl.to({}, { duration: 0.5 }, 0.1);

        // 3. Fade entire container to black
        tl.to(overlayRef.current, {
            opacity: 1,
            duration: 0.65,
            ease: 'power2.inOut',
            onComplete: () => {
                setShowBurst(false);
                if (onComplete) onComplete();
            }
        }, 0.4);
    }, [isExploding, onComplete]);

    return (
        <div ref={containerRef} className="diamond-entry-screen" style={{ opacity: 0 }}>
            {/* Ambient floor glow */}
            <div className="diamond-floor-glow" />

            {/* Three.js Canvas */}
            <div className="diamond-canvas-wrapper">
                <Canvas
                    camera={{ position: [0, 0.5, 4.5], fov: 45 }}
                    gl={{
                        antialias: true,
                        alpha: true,
                        powerPreference: 'high-performance',
                    }}
                    shadows
                    style={{ background: 'transparent', cursor: isExploding ? 'default' : 'pointer' }}
                >
                    <Suspense fallback={null}>
                        <SceneLights />
                        <Environment preset="night" />
                        <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.15}>
                            <Diamond
                                onDiamondClick={handleDiamondClick}
                                isExploding={isExploding}
                            />
                        </Float>
                        <FloorReflection />
                    </Suspense>
                </Canvas>
            </div>

            {/* CSS burst overlay */}
            <BurstOverlay active={showBurst} />

            {/* Text below diamond */}
            <div ref={textRef} className="diamond-entry-text" style={{ opacity: 0 }}>
                <div className="diamond-tap-label">TAP TO OPEN THE VAULT{dots}</div>
                <div className="diamond-tap-sublabel">ENDURA DIGITAL ARMORY</div>
            </div>

            {/* Black fade overlay (starts transparent, fades to black on click) */}
            <div
                ref={overlayRef}
                className="diamond-fade-overlay"
                style={{ opacity: 0, pointerEvents: 'none' }}
            />
        </div>
    );
};

export default DiamondEntry;
