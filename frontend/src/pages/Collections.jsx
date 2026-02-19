import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../context/StoreContext';
import CollectionsIntro from '../components/collections/CollectionsIntro';
import PhysicalProductCard from '../components/collections/PhysicalProductCard';

const Collections = () => {
    const { products } = useStore();
    const [showIntro, setShowIntro] = useState(() => {
        // Check if intro has already been played in this session
        return !sessionStorage.getItem('collections_intro_played');
    });

    const handleIntroComplete = () => {
        setShowIntro(false);
        sessionStorage.setItem('collections_intro_played', 'true');
    };

    // Filter only physical apparel products
    const physicalProducts = products.filter(p =>
        p.type === 'physical' &&
        ['T-Shirt', 'Hoodie', 'Vest', 'Pants', 'Shorts'].includes(p.subcategory)
    );

    // Stagger container variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
            <AnimatePresence>
                {showIntro && (
                    <CollectionsIntro onComplete={handleIntroComplete} />
                )}
            </AnimatePresence>

            {/* Main Content */}
            {!showIntro && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="relative pt-32 pb-24 px-6 md:px-12 lg:px-24"
                >
                    {/* Header Section */}
                    <div className="max-w-7xl mx-auto mb-20 text-center">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <h2 className="text-[12px] font-bold text-[#d4af37] uppercase tracking-[0.8em] mb-4">
                                Season_01 // Physical Assets
                            </h2>
                            <h1 className="group/title cursor-default text-5xl md:text-8xl font-oswald font-bold uppercase tracking-tighter mb-6">
                                THE <span className="text-transparent transition-all duration-700 ease-in-out group-hover/title:text-[#d4af37] group-hover/title:drop-shadow-[0_0_30px_rgba(212,175,55,0.4)]" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>COLLECTION</span>
                            </h1>
                            <div className="flex items-center justify-center gap-4">
                                <div className="h-[1px] w-12 bg-white/20"></div>
                                <p className="text-gray-500 text-[10px] uppercase tracking-widest font-medium">Tactical Engineering meets Premium Fabric</p>
                                <div className="h-[1px] w-12 bg-white/20"></div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Product Grid */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 lg:gap-16 [perspective:2000px]"
                    >
                        {physicalProducts.map((product) => (
                            <PhysicalProductCard key={product.id} product={product} />
                        ))}
                    </motion.div>

                    {/* Footer Info */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="mt-32 text-center border-t border-white/5 pt-16"
                    >
                        <p className="text-gray-600 text-[9px] uppercase tracking-[1em]">All items are limited production runs</p>
                    </motion.div>
                </motion.div>
            )}

            {/* Background Texture/Elements */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02]"></div>
            </div>
        </div>
    );
};

export default Collections;
