import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SystemBootHero from '../components/SystemBootHero';
import DivideScene from '../components/DivideScene';
import DoppelPieceScene from '../components/DoppelPieceScene';
// import CinematicFooter from '../components/CinematicFooter';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Home = () => {
    const mainRef = useRef();

    return (
        <div ref={mainRef} className="relative bg-black text-white selection:bg-accent/30 overflow-x-hidden">
            {/* SCENE 1: System Boot / Hero Identity */}
            <SystemBootHero />

            {/* SCENE 2: THE DOPPEL PIECE (Product Philosophy) */}
            <DoppelPieceScene />

            {/* SCENE 3: THE DIVIDE (Reality vs Digital) */}
            <DivideScene />

            {/* SCENE 4: IMPACT STATEMENT (Emotional Hook) */}
            {/* <ImpactStatement /> */}

            {/* SCENE 5: THE CLOSURE (Cinematic Footer) */}
            {/* <CinematicFooter /> */}
        </div>
    );
};

export default Home;
