import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment, Sparkles, Stars, Float } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

const AtmosphericVoid = () => {
    return (
        <group>
            {/* Extremely Subtle Gold Ambient Glow */}
            <mesh position={[0, 0, -30]}>
                <planeGeometry args={[120, 120]} />
                <meshBasicMaterial
                    transparent
                    opacity={0.08}
                    color="#d4af37"
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Floating Particle Dust (Immersive Garden inspired) */}
            <Sparkles
                count={200}
                scale={60}
                size={1.5}
                speed={0.15}
                opacity={0.25}
                color="#d4af37"
            />

            {/* Deep Static Stars for Spatial Context */}
            <Stars
                radius={150}
                depth={50}
                count={3000}
                factor={3}
                saturation={0}
                fade
                speed={0.3}
            />

            {/* Very Sparse, Dark Floating Elements for Parallax Depth */}
            <Float speed={0.8} rotationIntensity={0.3} floatIntensity={0.5}>
                <mesh position={[20, 15, -25]} rotation={[0.5, 0.5, 0.5]}>
                    <octahedronGeometry args={[6, 0]} />
                    <meshStandardMaterial
                        color="#030303"
                        metalness={1}
                        roughness={0}
                        transparent
                        opacity={0.1}
                    />
                </mesh>
            </Float>

            <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.8}>
                <mesh position={[-25, -20, -15]} rotation={[0.2, 0.2, 0.2]}>
                    <boxGeometry args={[4, 4, 4]} />
                    <meshStandardMaterial
                        color="#030303"
                        metalness={1}
                        roughness={0}
                        transparent
                        opacity={0.1}
                    />
                </mesh>
            </Float>

            {/* Ambient Lighting tuned for "Deep Black" theme */}
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={0.4} color="#d4af37" />
            <spotLight
                position={[0, 50, 0]}
                angle={0.15}
                penumbra={1}
                intensity={0.3}
                color="#d4af37"
            />
        </group>
    );
};

const Scene = () => {
    return (
        <div className="w-full h-full bg-black">
            <Canvas
                gl={{ antialias: true, alpha: true, stencil: false, depth: true }}
                dpr={[1, 1.5]}
            >
                <color attach="background" args={['#000']} />

                {/* Fixed Camera: No Orbit Controls, No Drag navigation */}
                <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={45} />

                <Suspense fallback={null}>
                    <AtmosphericVoid />
                    <Environment preset="night" />

                    <EffectComposer disableNormalPass>
                        <Bloom
                            intensity={1.2}
                            luminanceThreshold={0.4}
                            luminanceSmoothing={0.9}
                            mipmapBlur
                        />
                        <Vignette darkness={0.85} offset={0.1} />
                    </EffectComposer>
                </Suspense>
            </Canvas>
        </div>
    );
};

export default Scene;
