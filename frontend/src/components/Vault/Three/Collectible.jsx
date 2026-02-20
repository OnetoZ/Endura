import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import './GlowMaterial';

const Collectible = ({ item, position, onClick, isSelected }) => {
    const meshRef = useRef();
    const materialRef = useRef();
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        const time = state.clock.elapsedTime;
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.005; // Even slower rotation
            // Subtle lift on hover
            const targetY = hovered ? 0.3 : 0;
            meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.05);
        }
        if (materialRef.current) {
            materialRef.current.uTime = time;
        }
    });

    return (
        <group position={position}>
            {/* Minimal Background Aura Ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
                <ringGeometry args={[1.8, 2, 32]} />
                <meshBasicMaterial
                    color={item.status === 'locked' ? "#ffffff" : "#d4af37"}
                    transparent
                    opacity={hovered ? 0.4 : 0.15}
                />
            </mesh>

            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
                <mesh
                    ref={meshRef}
                    onClick={() => onClick(item)}
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                    scale={isSelected ? 1.4 : hovered ? 1.1 : 1}
                >
                    <boxGeometry args={[1.5, 2, 0.1]} />
                    <meshStandardMaterial
                        color={item.status === 'locked' ? "#050505" : "#111"}
                        metalness={1}
                        roughness={0.2}
                    />

                    {/* Simple Holographic Preview */}
                    <mesh position={[0, 0, 0.051]}>
                        <planeGeometry args={[1.4, 1.9]} />
                        <meshBasicMaterial
                            color="#000"
                            transparent
                            opacity={0.9}
                            map={new THREE.TextureLoader().load(item.image)}
                        />
                    </mesh>

                    {/* Edge Glow Material */}
                    <mesh scale={[1.02, 1.02, 1.02]}>
                        <boxGeometry args={[1.5, 2, 0.1]} />
                        <vaultGlowMaterial
                            ref={materialRef}
                            transparent
                            uColor={new THREE.Color(item.status === 'locked' ? "#ffffff" : "#d4af37")}
                            uGlowIntensity={hovered || isSelected ? 2.0 : 0.6}
                        />
                    </mesh>
                </mesh>
            </Float>

            {/* In-scene Label (Minimal) */}
            <Html position={[0, -2.5, 0]} center>
                <AnimatePresence>
                    {(hovered || isSelected) && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="pointer-events-none text-center"
                        >
                            <div className="bg-black/60 backdrop-blur-md border border-white/5 py-1 px-4 rounded-full">
                                <span className="font-heading text-[8px] text-white tracking-[0.4em] uppercase">{item.name}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Html>
        </group>
    );
};

export default Collectible;
