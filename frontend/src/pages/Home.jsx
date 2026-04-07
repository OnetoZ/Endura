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
import SEO from '../components/SEO';

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
                title="official | Luxury Streetwear & Digital Collectibles India"
                description="ENDURA is a luxury streetwear brand from India. Exclusive drops paired with digital collectibles—crafted not for the masses, but for the chosen few."
                canonical="/"
                image="https://wearendura.com/logo.png"
            />
            {/* SCENE 1: System Boot / Hero Identity */}
            <SystemBootHero />

            {/* SCENE 2: THE DOPPEL PIECE (Product Philosophy) */}
            <DoppelPieceScene />

            {/* SCENE 3: THE DIVIDE (Reality vs Digital) (Door animation - commented out per request) */}
            {/* <DivideScene /> */}

            {/* SCENE 4: IMPACT STATEMENT (Emotional Hook) */}
            {/* <ImpactStatement /> */}

            {/* SCENE 5: THE CLOSURE (Cinematic Footer) */}
            {/* <CinematicFooter /> */}
        </div>
    );
};

export default Home;
