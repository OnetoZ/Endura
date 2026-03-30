import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SystemBootHero from '../components/SystemBootHero';
import DivideScene from '../components/DivideScene';
import DoppelPieceScene from '../components/DoppelPieceScene';
// import CinematicFooter from '../components/CinematicFooter';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

import { useGSAP } from '@gsap/react';

const Home = () => {
    const mainRef = useRef();

    useGSAP(() => {
        // Failsafe: Ensure home always starts at absolute top
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;

        // Let things settle then refresh all markers
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);
    }, { scope: mainRef });

    return (
        <div ref={mainRef} className="relative bg-black text-white selection:bg-accent/30 overflow-x-hidden">
            <SEO 
                title="Cinematic Streetwear & Digital Collectibles"
                description="Endura is a premium streetwear brand based in Bangalore, India. Discover oversized hoodies, techwear, and digital vault collectibles for the Gen Z urban audience."
                canonical="/"
                image="https://wearendura.com/logo.png"
            />
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
