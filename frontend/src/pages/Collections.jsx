import { motion } from 'framer-motion';
import { useStore } from '../context/StoreContext';
import PhysicalProductCard from '../components/collections/PhysicalProductCard';
import CollectionsDashboardBanner from '../components/collections/CollectionsDashboardBanner';
import SEO from '../components/SEO';
import { ROUTES } from '../seo/routes';

const Collections = () => {
    const { products, isLoading } = useStore();

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

            <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
                {/* Full Horizontal Hero Dashboard Section */}
                <div className="relative pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12 w-full">
                    <CollectionsDashboardBanner />
                </div>

                {/* Main Content & Product Grid */}
                <motion.div
                    id="products-archive"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="relative pb-24 px-6 md:px-12 lg:px-24 scroll-mt-24"
                >
                    {/* Section Header */}
                    <div className="max-w-7xl mx-auto mb-8 md:mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-6">
                        <div>
                            <span className="text-gray-500 text-[10px] uppercase font-mono tracking-[0.4em] block mb-1">
                                Sector 01 // Physical Deployments
                            </span>
                            <h2 className="text-xl sm:text-2xl font-heading uppercase tracking-widest text-white">
                                Available Archives
                            </h2>
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gray-500">
                            {physicalProducts.length} Authenticated Units
                        </span>
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
