
import React, { useEffect, useRef } from 'react';
import OrderCard from './OrderCard';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const OrderHistory = ({ orders }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".order-card-anim", {
                y: 50,
                opacity: 0,
                duration: 1.2,
                stagger: 0.2,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bottom-=100",
                    toggleActions: "play none none none"
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="space-y-12 py-20">
            <div className="flex items-center gap-6 mb-12">
                <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tighter text-white uppercase">
                    Order_History
                </h2>
                <div className="flex-1 h-px bg-white/5" />
                <span className="font-mono text-[10px] text-white/20 tracking-[.4em] uppercase">Archive_Sector_04</span>
            </div>

            <div className="space-y-6">
                {orders.length > 0 ? (
                    orders.map((order, idx) => (
                        <div key={order.id} className="order-card-anim">
                            <OrderCard order={order} />
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center border border-dashed border-white/5 rounded-3xl">
                        <p className="font-heading text-white/20 tracking-[.5em] uppercase text-xs">No active logs found</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default OrderHistory;
