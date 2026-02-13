
import React, { useEffect, useRef } from 'react';
import { MapPin, Clock, Truck, ShieldCheck } from 'lucide-react';
import gsap from 'gsap';

const ShippingDetails = ({ user }) => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(sectionRef.current, {
                opacity: 0,
                y: 30,
                duration: 1.5,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom-=100",
                }
            });
        });
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-20">
            <div className="flex items-center gap-6 mb-12">
                <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tighter text-white uppercase">
                    Shipping_Manifest
                </h2>
                <div className="flex-1 h-px bg-white/5" />
                <span className="font-mono text-[10px] text-white/20 tracking-[.4em] uppercase">Logistics_Core</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Primary Address Card */}
                <div className="group relative bg-white/[0.02] border border-white/5 p-10 rounded-3xl transition-all duration-700 hover:border-accent/40 hover:bg-white/[0.04]">
                    <div className="space-y-8">
                        <div className="flex items-center gap-4 text-accent/60">
                            <MapPin className="w-5 h-5" />
                            <span className="font-mono text-[10px] tracking-[.4em] uppercase">Primary_Node</span>
                        </div>

                        <div className="space-y-2">
                            <p className="text-xl text-white font-body leading-relaxed group-hover:text-white transition-colors">
                                {user.address || '742 Galactic Way, Sector 09, Neo Delhi, IN'}
                            </p>
                            <p className="text-white/40 font-mono text-[11px] tracking-widest uppercase">Registry ID: {user.id}-LOC</p>
                        </div>

                        <div className="pt-8 border-t border-white/5 flex justify-between items-center">
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white/40">
                                    <Truck className="w-4 h-4" />
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white/40">
                                    <ShieldCheck className="w-4 h-4" />
                                </div>
                            </div>
                            <button className="text-accent text-[9px] font-heading font-black tracking-[.3em] uppercase hover:text-white transition-colors">
                                MODIFY_ADR
                            </button>
                        </div>
                    </div>
                </div>

                {/* Logistics Stats */}
                <div className="space-y-6">
                    <div className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-mono text-[9px] text-white/20 tracking-[.3em] uppercase mb-1">Avg_Delivery_Time</p>
                            <p className="text-xl text-white font-heading font-black uppercase">48 Hours</p>
                        </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                            <Truck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-mono text-[9px] text-white/20 tracking-[.3em] uppercase mb-1">Carrier_Network</p>
                            <p className="text-xl text-white font-heading font-black uppercase">Endura_Prime_Drones</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ShippingDetails;
