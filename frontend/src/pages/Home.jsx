import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import SystemBootHero from '../components/SystemBootHero';
import PhilosophyScene from '../components/PhilosophyScene';
import VisionScene from '../components/VisionScene';
import VaultScene from '../components/VaultScene';
import RoadmapScene from '../components/RoadmapScene';
import DivideScene from '../components/DivideScene';
import DoppelPieceScene from '../components/DoppelPieceScene';
import CallScene from '../components/CallScene';
import CultWorlds from '../components/CultWorlds';
import CinematicFooter from '../components/CinematicFooter';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Home = () => {
    const mainRef = useRef();

    return (
        <div ref={mainRef} className="relative bg-black text-white selection:bg-accent/30 overflow-x-hidden">
            {/* SCENE 1 & 2: System Boot / Hero Identity */}
            <SystemBootHero />

            {/* SCENE 3: PHILOSOPHY (The Anomaly) */}
            <PhilosophyScene />

            {/* SCENE 4: VISION (Strength & Soul) */}
            <VisionScene />

            {/* SCENE 4: CULT WORLDS */}
            <CultWorlds />

            {/* SCENE 5: THE VAULT (Entrance) */}
            <VaultScene />

            {/* SCENE 6: ROADMAP (The Future Layer) */}
            <RoadmapScene />

            {/* SCENE 7: THE DIVIDE (Reality vs Digital) */}
            <DivideScene />

            {/* SCENE 8: THE DOPPEL PIECE (Product Philosophy) */}
            <DoppelPieceScene />

            {/* SCENE 10: THE CALL (Final CTA) */}
            <CallScene />

            {/* SCENE 11: THE CLOSURE (Cinematic Footer) */}
            <CinematicFooter />
        </div>
    );
};

export default Home;
