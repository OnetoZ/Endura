import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LuxuryDropSection = () => {
    const sectionRef = useRef();
    const imageRef = useRef();
    const contentRef = useRef();

    useGSAP(() => {
        gsap.from(imageRef.current, {
            scale: 1.2,
            opacity: 0,
            duration: 1.5,
            ease: "power4.out",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
            }
        });

        gsap.from(contentRef.current.children, {
            y: 50,
            opacity: 0,
            stagger: 0.2,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 70%",
            }
        });
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="relative py-24 px-6 md:px-12 bg-black overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Image Section */}
                <div className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-accent/20 to-primary/20 blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="relative overflow-hidden aspect-[4/5] border border-white/10 rounded-sm">
                        <img 
                            ref={imageRef}
                            src="/drop-hoodie.png" 
                            alt="Endura Apex Royale Limited Edition Luxury Hoodie India - Luxury Streetwear India" 
                            className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                        />
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 border border-accent/40">
                            <span className="text-accent text-[10px] font-mono tracking-[0.3em] uppercase">Limited Release</span>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black via-transparent to-transparent">
                            <p className="text-white/60 text-[10px] font-mono tracking-widest uppercase">Serial No: ED-2024-001</p>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div ref={contentRef} className="flex flex-col items-start space-y-8">
                    <div className="space-y-2">
                        <h3 className="text-accent font-mono text-sm tracking-[0.5em] uppercase">Genesis Drop</h3>
                        <h2 className="text-4xl md:text-6xl font-heading font-black leading-tight">
                            APEX <span className="text-gold">ROYALE</span>
                        </h2>
                    </div>
                    
                    <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                        The definitive statement of digital craftsmanship. An ultra-heavyweight 500GSM hoodie featuring gold silk embroidery and a secure digital twin link. 
                    </p>

                    <div className="flex flex-col space-y-4 w-full max-w-xs">
                        <div className="flex items-center justify-between py-3 border-b border-white/10">
                            <span className="text-gray-500 font-mono text-[10px] uppercase tracking-widest">Availability</span>
                            <span className="text-white font-mono text-[10px] uppercase tracking-widest">04 / 100 Left</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-white/10">
                            <span className="text-gray-500 font-mono text-[10px] uppercase tracking-widest">Digital Status</span>
                            <span className="text-accent font-mono text-[10px] uppercase tracking-widest">V-01 Verified</span>
                        </div>
                    </div>

                    <Link to="/shop" className="group relative w-full md:w-auto px-12 py-5 bg-white text-black font-heading text-xs tracking-[0.4em] uppercase font-black overflow-hidden transition-all hover:bg-accent transition-colors duration-500">
                        <span className="relative z-10">Secure the Drop</span>
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    </Link>

                    <div className="pt-8 flex items-center gap-4">
                        <div className="w-12 h-[1px] bg-white/20" />
                        <span className="text-[10px] text-white/40 font-mono tracking-[0.2em] uppercase italic">
                            Reserved for the inner circle
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LuxuryDropSection;
