import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

const VaultGlowMaterial = shaderMaterial(
    {
        uTime: 0,
        uColor: new THREE.Color('#d4af37'),
        uGlowIntensity: 1.0,
    },
    // Vertex shader
    `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    // Fragment shader
    `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uGlowIntensity;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
        // Fresnel-like effect for edge glow
        vec3 viewDirection = normalize(-vPosition);
        float fresnel = pow(1.0 - dot(vNormal, viewDirection), 3.0);
        
        // Pulse effect
        float pulse = 0.8 + 0.2 * sin(uTime * 2.0);
        
        // Scan line effect
        float scanline = abs(sin(vUv.y * 100.0 + uTime * 5.0));
        scanline = smoothstep(0.9, 1.0, scanline) * 0.2;
        
        vec3 finalColor = uColor * (0.2 + fresnel * 2.0 * uGlowIntensity * pulse + scanline);
        
        gl_FragColor = vec4(finalColor, fresnel * uGlowIntensity * pulse + 0.1);
    }
    `
);

extend({ VaultGlowMaterial });

export default VaultGlowMaterial;
