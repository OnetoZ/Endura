import React from 'react';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const VaultRoom = ({ simplified = false }) => {
    return (
        <group>
            {/* Minimal Floor with subtle glow ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial
                    color="#000000"
                    roughness={1}
                    metalness={0}
                />
            </mesh>

            {/* Ritual Aura Rings - Lightweight */}
            <group position={[0, -4.99, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <mesh>
                    <ringGeometry args={[8, 8.2, 64]} />
                    <meshBasicMaterial color="#d4af37" transparent opacity={0.08} />
                </mesh>
                <mesh>
                    <ringGeometry args={[12, 12.1, 64]} />
                    <meshBasicMaterial color="#d4af37" transparent opacity={0.04} />
                </mesh>
            </group>

            {/* Simple Golden Pedestal - Focal Point Only */}
            <group position={[0, -5, 0]}>
                <mesh position={[0, 0.4, 0]}>
                    <cylinderGeometry args={[4, 5, 0.8, 32]} />
                    <meshStandardMaterial color="#0a0a0a" metalness={1} roughness={0.1} />
                </mesh>
                <mesh position={[0, 0.9, 0]}>
                    <cylinderGeometry args={[3.8, 4, 0.2, 32]} />
                    <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.05} />
                </mesh>
            </group>

            {/* Atmosphere Pod Lights */}
            <pointLight position={[10, 5, -5]} intensity={0.4} color="#d4af37" />
            <pointLight position={[-10, 5, -5]} intensity={0.4} color="#d4af37" />
        </group>
    );
};

export default VaultRoom;
