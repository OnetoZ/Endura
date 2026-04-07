import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SystemBootHero from '../components/SystemBootHero';
import LuxuryDropSection from '../components/LuxuryDropSection';
import DigitalCollectibleSection from '../components/DigitalCollectibleSection';
import DoppelPieceScene from '../components/DoppelPieceScene';
import CinematicFooter from '../components/CinematicFooter';
import SEO from '../components/SEO';
import { useGSAP } from '@gsap/react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

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
                title="ENDURA | Luxury Streetwear India | Exclusive Digital Collectibles"
                description="ENDURA is an official luxury streetwear brand from India. Exclusive drops paired with digital collectibles—crafted not for the masses, but for the chosen few."
                canonical="/"
                image="https://wearendura.com/logo.png"
            />
            {/* SCENE 1: Master Hero Experience */}
            <SystemBootHero />

            {/* SCENE 2: EXCLUSIVE DROP SHOWCASE */}
            <LuxuryDropSection />

            {/* SCENE 3: THE DOPPEL PIECE (Product Philosophy) */}
            <DoppelPieceScene />

            {/* SCENE 4: DIGITAL TWIN / VAULT SYSTEM */}
            <DigitalCollectibleSection />

            {/* SCENE 5: CINEMATIC FOOTER */}
            <CinematicFooter />
        </div>
    );
};

export default Home;
