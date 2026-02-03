
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
    }, []);

    return (
        <div className="relative overflow-x-hidden">
            {/* Cinematic Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0 bg-black">
                    <img
                        src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=2000"
                        className={`w-full h-full object-cover transition-all duration-[3000ms] ease-out ${loaded ? 'scale-100 opacity-60' : 'scale-125 opacity-0'}`}
                        alt="Hero Background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className={`transition-all duration-1000 delay-500 transform ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                        <h1 className="text-7xl md:text-[12rem] font-oswald font-bold leading-none tracking-tighter mb-4 uppercase">
                            ENDURA<span className="text-blue-600">.</span>
                        </h1>
                        <p className="text-lg md:text-2xl text-blue-400 font-bold tracking-[0.4em] uppercase mb-12">
                            Beyond the Physical Realm
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link
                                to="/shop"
                                className="group relative px-12 py-5 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white group-hover:bg-blue-600 transition-colors duration-300"></div>
                                <span className="relative z-10 text-black group-hover:text-white font-black uppercase tracking-widest text-sm transition-colors duration-300">
                                    Access Inventory
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

                {/* Animated Decor */}
                <div className="absolute bottom-12 left-6 text-[10px] font-bold tracking-widest uppercase opacity-40 animate-pulse">
                    SYS_INIT // BOOT_SEQ_OK
                </div>
                <div className="absolute bottom-12 right-6 text-[10px] font-bold tracking-widest uppercase opacity-40 flex items-center">
                    <span className="mr-2">SCROLL_FOR_INTEL</span>
                    <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </section>

            {/* Narrative Section 1 */}
            <section className="py-32 px-6 bg-black">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                        <div className="order-2 md:order-1">
                            <h2 className="text-4xl md:text-6xl font-oswald font-bold uppercase mb-8 leading-tight">
                                Physical Strength. <br />
                                <span className="text-blue-500">Digital Soul.</span>
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed mb-8">
                                Every ENDURA garment is more than a piece of apparel. It is a gateway. Our "Digital Twin" technology ensures that your physical items are mirrored in the digital world as high-fidelity assets for your virtual identity.
                            </p>
                            <div className="h-px w-24 bg-blue-500 mb-8"></div>
                            <p className="text-sm font-mono text-gray-600">
                                01000101 01001110 01000100 01010101 01010010 01000001
                            </p>
                        </div>
                        <div className="order-1 md:order-2 relative aspect-[4/5] bg-[#111] overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=800"
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                                alt="Product Aesthetic"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Highlight Grid */}
            <section className="py-32 px-6 bg-[#050505]">
                <div className="container mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-xs font-black text-blue-500 uppercase tracking-[0.5em] mb-4">The Selection</h2>
                        <h3 className="text-5xl font-oswald font-bold uppercase">Forged in the Dark</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="relative aspect-[3/4] overflow-hidden bg-black mb-6">
                                    <img
                                        src={`https://picsum.photos/seed/endura-${i}/800/1000`}
                                        className="w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700"
                                        alt={`Highlight ${i}`}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                                    <div className="absolute bottom-6 left-6">
                                        <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-1">Series_0{i}</p>
                                        <p className="text-2xl font-oswald uppercase font-bold">Model_{i * 100}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-40 px-6 relative bg-black overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="shimmer h-full w-full"></div>
                </div>
                <div className="container mx-auto text-center relative z-10">
                    <h2 className="text-6xl md:text-8xl font-oswald font-bold uppercase mb-12 leading-none">
                        Become the <br /> <span className="text-blue-500 underline decoration-2 underline-offset-8">Anomaly</span>
                    </h2>
                    <Link
                        to="/auth"
                        className="inline-block px-16 py-6 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-2 shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
                    >
                        Initiate Profile
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
