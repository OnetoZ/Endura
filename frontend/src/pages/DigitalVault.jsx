
import React from 'react';

const DigitalVault = () => {
    return (
        <div className="min-h-screen bg-black py-20 px-6">
            <div className="container mx-auto pt-12">
                <div className="text-center mb-24 max-w-3xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-oswald font-bold uppercase mb-6 tracking-tighter">
                        Digital <span className="text-blue-500">Vault.</span>
                    </h1>
                    <p className="text-gray-500 text-lg uppercase tracking-widest font-bold">
                        Physical Asset Mirroring System // v1.0.4
                    </p>
                    <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                    <div className="space-y-12">
                        <div className="glass p-10 border-blue-500/10">
                            <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.5em] mb-4">01 // The Concept</h3>
                            <h4 className="text-2xl font-oswald font-bold uppercase mb-4">Ownership Redefined</h4>
                            <p className="text-gray-400 leading-relaxed">
                                When you purchase ENDURA apparel, you aren't just buying clothes. You are acquiring a unique cryptographic key that unlocks a 1:1 digital twin of your garment.
                            </p>
                        </div>

                        <div className="glass p-10 border-blue-500/10">
                            <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.5em] mb-4">02 // The Rewards</h3>
                            <h4 className="text-2xl font-oswald font-bold uppercase mb-4">Loyalty Ecosystem</h4>
                            <p className="text-gray-400 leading-relaxed mb-6">
                                Our Credit system rewards "The Anomaly" — those who stay active in our ecosystem. Credits earned through purchases can be redeemed here for exclusive "Vault Only" assets.
                            </p>
                            <div className="grid grid-cols-3 gap-4">
                                {[100, 500, 1000].map(val => (
                                    <div key={val} className="text-center p-4 bg-white/5 border border-white/5 rounded">
                                        <p className="text-[10px] text-gray-500 uppercase mb-1">Tier</p>
                                        <p className="font-bold text-blue-400">{val} C</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-0 bg-blue-600/10 blur-[100px] pointer-events-none group-hover:bg-blue-600/20 transition-all"></div>
                        <div className="relative glass border-white/10 overflow-hidden aspect-square flex flex-col items-center justify-center p-12">
                            <div className="absolute top-6 left-6 text-[10px] font-mono text-gray-600">
                                Locker_01 // SECURE_ACCESS
                            </div>

                            {/* Visual Asset Mockup */}
                            <div className="w-64 h-80 relative animate-float">
                                <img
                                    src="https://picsum.photos/seed/vault-skin/400/500"
                                    className="w-full h-full object-cover border border-white/20 shadow-2xl grayscale contrast-125"
                                    alt="Digital Skin Preview"
                                />
                                <div className="absolute inset-0 border-2 border-blue-500/50 animate-pulse m-2"></div>
                                <div className="absolute -bottom-4 -right-4 bg-blue-600 text-[10px] font-black uppercase px-3 py-1 tracking-widest">
                                    Ready to Sync
                                </div>
                            </div>

                            <div className="mt-16 text-center">
                                <p className="text-sm font-bold uppercase tracking-widest text-white mb-2">Alpha_Core_Tee [DIGITAL]</p>
                                <p className="text-[10px] font-mono text-gray-500">HASH: 0x82f...a1c</p>
                                <button className="mt-8 px-10 py-4 border border-blue-500 text-blue-500 text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all">
                                    Claim Digital Twin
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature Grid */}
                <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: 'Cross-Platform', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', desc: 'Skins compatible with Unreal Engine 5, Unity, and Decentraland.' },
                        { title: 'Verified Scarcity', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z', desc: 'Blockchain-verified supply ensures your digital assets remain unique.' },
                        { title: 'Future Expansion', icon: 'M13 10V3L4 14h7v7l9-11h-7z', desc: 'Upcoming AR integration will allow you to wear your digital skins in the real world via Lens.' }
                    ].map((item, idx) => (
                        <div key={idx} className="glass p-8 hover:border-blue-500/30 transition-all cursor-default">
                            <svg className="w-8 h-8 text-blue-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={item.icon} />
                            </svg>
                            <h5 className="text-xl font-oswald font-bold uppercase mb-4">{item.title}</h5>
                            <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
};

export default DigitalVault;
