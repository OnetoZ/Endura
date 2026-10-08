import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../context/StoreContext';
import PhysicalProductCard from '../components/collections/PhysicalProductCard';
// import CollectionsIntro from '../components/collections/CollectionsIntro';
import { useState } from 'react';
import SEO from '../components/SEO';
import { ROUTES } from '../seo/routes';

const Collections = () => {
    const { products, isLoading } = useStore();
    const [showIntro, setShowIntro] = useState(() => {
        return !sessionStorage.getItem('collections_intro_played');
    });

    const handleIntroComplete = () => {
        setShowIntro(false);
        sessionStorage.setItem('collections_intro_played', 'true');
    };

    // Use all products from context
    const physicalProducts = products;

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
        <>
            <SEO 
                fullTitle={ROUTES['/collections'].title}
                description={ROUTES['/collections'].description}
                canonical="/collections"
            />
            {/* <AnimatePresence>
                {showIntro && <CollectionsIntro onComplete={handleIntroComplete} />}
            </AnimatePresence> */}

            <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="relative pt-28 md:pt-32 pb-24 px-6 md:px-12 lg:px-24"
            >
                {/* Hero Dashboard Banner Section */}
                <div className="max-w-7xl mx-auto mb-12 md:mb-16">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] group"
                    >
                        <img 
                            src="/collection-dashboard.jpg" 
                            alt="Genesis Edition - Collections" 
                            className="w-full h-auto object-cover rounded-2xl md:rounded-3xl transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                        />
                        <div className="absolute inset-0 rounded-2xl md:rounded-3xl ring-1 ring-inset ring-white/10 pointer-events-none" />
                    </motion.div>
                </div>

                {/* Product Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-12 lg:gap-16 [perspective:2000px]"
                >
                    {isLoading ? (
                        <div className="col-span-full py-24 text-center">
                            <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-500 text-[10px] uppercase tracking-[0.5em]">Syncing Archives...</p>
                        </div>
                    ) : physicalProducts.length > 0 ? (
                        physicalProducts.map((product) => (
                            <PhysicalProductCard key={product._id || product.id} product={product} />
                        ))
                    ) : (
                        <div className="col-span-full py-24 text-center border border-white/5 bg-white/[0.02]">
                            <p className="text-gray-500 text-[10px] uppercase tracking-[0.5em]">No physical assets detected in this sector.</p>
                        </div>
                    )}
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

            {/* Background Texture/Elements */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full"></div>
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.02]"></div>
            </div>
            </div>
        </>
    );
};

export default Collections;
