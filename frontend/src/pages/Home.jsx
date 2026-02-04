
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [loaded, setLoaded] = useState(false);
    const observerRef = useRef(null);

    useEffect(() => {
        setLoaded(true);

        const observerOptions = {
            threshold: 0.1
        };

        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => observerRef.current.observe(el));

        return () => {
            if (observerRef.current) {
                revealElements.forEach(el => observerRef.current.unobserve(el));
            }
        };
    }, []);

    const sections = [
        {
            id: 'hero',
            title: 'ENDURA',
            subtitle: 'Beyond the Physical Realm',
            description: 'Where luxury fashion meets digital permanence.',
            cta: 'Access Collection',
            ctaLink: '/shop',
            image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=2000',
            video: null // Placeholder for future video
        },
        {
            id: 'philosophy',
            title: 'The Anomaly',
            subtitle: 'Our Philosophy',
            description: 'We don\'t just make clothes; we design digital identities. In a world of fleeting physical trends, Endura provides timeless digital assets tied to every thread.',
            cta: 'Learn More',
            ctaLink: '/auth',
            image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1000'
        },
        {
            id: 'vision',
            title: 'Physical Strength. Digital Soul.',
            subtitle: 'Product Vision',
            description: 'Every garment is forged with a 1:1 digital twin. Wear it in the real world, own it in the metaverse.',
            cta: 'View Collection',
            ctaLink: '/shop',
            image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000'
        },
        {
            id: 'vault',
            title: 'Enter the Vault.',
            subtitle: 'Exclusive Access',
            description: 'Unlock high-fidelity digital fashion assets. Limited series, cryptographic verification, absolute rarity.',
            cta: 'Access Vault',
            ctaLink: '/vault',
            image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000'
        },
        {
            id: 'roadmap',
            title: 'The Future Layer',
            subtitle: 'Roadmap',
            description: 'AR Integration. Virtual Runway. Community DAO. The journey into the anomaly has just begun.',
            cta: 'Join Community',
            ctaLink: '/auth',
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000'
        }
    ];

    return (
        <div className="relative bg-black text-white">
            {/* Fixed Navigation Indicators */}
            <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4">
                {sections.map((section, idx) => (
                    <a key={idx} href={`#${section.id}`} className="w-2 h-2 rounded-full border border-primary-light/50 hover:bg-primary transition-all"></a>
                ))}
            </div>

            {/* Cinematic Hero Section */}
            <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0 bg-black">
                    <img
                        src={sections[0].image}
                        className={`w-full h-full object-cover transition-all duration-[3000ms] ease-out ${loaded ? 'scale-100 opacity-40' : 'scale-125 opacity-0'}`}
                        alt="Hero"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className={`transition-all duration-1000 delay-500 transform ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                        <h1 className="text-8xl md:text-[14rem] font-oswald font-bold leading-none tracking-tighter mb-4 uppercase">
                            ENDURA<span className="text-primary italic">.</span>
                        </h1>
                        <p className="text-xl md:text-3xl text-primary-light font-bold tracking-[0.5em] uppercase mb-12">
                            {sections[0].subtitle}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link
                                to={sections[0].ctaLink}
                                className="group relative px-12 py-5 overflow-hidden border border-accent bg-transparent hover:bg-accent transition-all duration-500"
                            >
                                <span className="relative z-10 text-accent group-hover:text-black font-black uppercase tracking-widest text-sm transition-colors duration-300">
                                    {sections[0].cta}
                                </span>
                            </Link>
                            <Link
                                to="/vault"
                                className="group px-12 py-5 border border-white/20 text-white font-black uppercase tracking-widest text-sm hover:bg-white/5 transition-all"
                            >
                                Enter the Vault
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-12 left-6 text-[10px] font-mono tracking-widest uppercase opacity-40 animate-pulse">
                    SYS_INIT // BOOT_SEQ_OK
                </div>
                <div className="absolute bottom-12 right-6 text-[10px] font-mono tracking-widest uppercase opacity-40 flex items-center">
                    <span className="mr-2">SCROLL_FOR_ANOMALY</span>
                    <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </section>

            {/* Progressive Sections */}
            {sections.slice(1).map((section, idx) => (
                <section key={idx} id={section.id} className="py-24 md:py-48 px-6 bg-black relative overflow-hidden">
                    <div className="container mx-auto max-w-7xl">
                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-20 items-center ${idx % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                            <div className={`reveal ${idx % 2 === 0 ? 'order-2 md:order-1' : 'order-2'}`}>
                                <h3 className="text-primary-light font-bold uppercase tracking-[0.4em] text-xs mb-4">{section.subtitle}</h3>
                                <h2 className="text-5xl md:text-7xl font-oswald font-bold uppercase mb-8 leading-tight">
                                    {section.title}
                                </h2>
                                <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-10 border-l-2 border-primary pl-6">
                                    {section.description}
                                </p>
                                <Link
                                    to={section.ctaLink}
                                    className="inline-flex items-center gap-4 text-accent font-black uppercase tracking-widest text-sm group hover:gap-6 transition-all"
                                >
                                    {section.cta}
                                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                            <div className={`reveal ${idx % 2 === 0 ? 'order-1 md:order-2' : 'order-1'} relative`}>
                                <div className="absolute inset-0 bg-primary/20 blur-[80px] -z-10 rounded-full animate-float"></div>
                                <div className="aspect-[4/5] bg-neutral-900 overflow-hidden border border-white/10 group">
                                    <img
                                        src={section.image}
                                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                                        alt={section.title}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ))}

            {/* Bottom Final CTA */}
            <section className="py-40 px-6 relative bg-black overflow-hidden border-t border-white/5">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="shimmer h-full w-full"></div>
                </div>
                <div className="container mx-auto text-center relative z-10">
                    <div className="reveal">
                        <h2 className="text-6xl md:text-9xl font-oswald font-bold uppercase mb-12 leading-none">
                            Join the <br /> <span className="text-primary-light underline decoration-accent underline-offset-[12px]">Revolution</span>
                        </h2>
                        <Link
                            to="/auth"
                            className="inline-block px-16 py-6 bg-primary text-white font-black uppercase tracking-widest text-sm hover:bg-primary-light transition-all transform hover:-translate-y-2 shadow-[0_20px_50px_rgba(109,40,217,0.3)]"
                        >
                            Initiate Core Profile
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
