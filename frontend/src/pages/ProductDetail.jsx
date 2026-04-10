
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../context/StoreContext';

import SEO from '../components/SEO';
import { getImageUrl } from '../services/api';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { products, addToCart } = useStore();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('M');
    const [showSizeGuide, setShowSizeGuide] = useState(false);
    const [activeTab, setActiveTab] = useState('Specs');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const collectedItem = location.state?.item;

    useEffect(() => {
        const found = products.find(p => p._id === id || p.id === id);
        if (found) setProduct(found);
    }, [id, products]);

    const productSchema = product ? {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": getImageUrl(product.images?.[0] || product.image),
        "description": product.description,
        "brand": {
            "@type": "Brand",
            "name": "ENDURA"
        },
        "offers": {
            "@type": "Offer",
            "url": `https://wearendura.com/product/${id}`,
            "priceCurrency": "INR",
            "price": product.price,
            "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
        }
    } : null;

    if (!product && collectedItem) return (
        <div className="min-h-screen bg-black pt-32 pb-20 px-6 text-white">
            <SEO
                title={`${collectedItem.name} | View Collected Asset`}
                description={`Viewing ${collectedItem.name} from the Endura Digital Vault. Cinematic streetwear asset ownership.`}
            />
            <div className="container mx-auto max-w-5xl">

                <Link to="/collected" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-primary mb-12 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Collected
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-accent/10 blur-[120px]" />
                        <div className="aspect-[4/5] bg-[#0a0a0a] border border-white/10 flex items-center justify-center relative overflow-hidden">
                            <div className="w-[70%] h-[70%] border border-white/10 bg-gradient-to-br from-black via-[#101010] to-black" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="text-[10px] font-mono tracking-[0.5em] uppercase text-white/30">Product View</div>
                        <div className="text-5xl md:text-6xl font-heading font-black tracking-widest uppercase">{collectedItem.name}</div>
                        <div className="text-[11px] font-mono tracking-widest uppercase text-white/40">Tier: {collectedItem.tier || 'Standard'}</div>
                        {collectedItem.size && (
                            <div className="text-[11px] font-mono tracking-widest uppercase text-accent/60">Selected Size: {collectedItem.size}</div>
                        )}
                        <div className="text-[11px] font-mono tracking-widest uppercase text-white/40">Unlock Date: {collectedItem.unlockedAt || collectedItem.createdAt?.split('T')[0] || '---'}</div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (!product) return (
        <div className="h-screen flex items-center justify-center">
            <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
    );

    // Images 0 = Front, 1 = Back, 2 = Digital Twin. We omit index 2 from the main slider.
    const allImages = product?.images?.length
        ? product.images.filter((_, idx) => idx !== 2)
        : [product?.image, product?.backImage, ...(product?.additionalImages || [])].filter(Boolean);
    const hasMultipleImages = allImages.length > 1;

    const nextImage = () => setCurrentImageIndex(prev => (prev + 1) % allImages.length);
    const prevImage = () => setCurrentImageIndex(prev => (prev - 1 + allImages.length) % allImages.length);

    return (
        <div className="min-h-screen bg-black pt-24 pb-20 px-6">
            <SEO
                title={product.name}
                description={product.description}
                canonical={`/product/${id}`}
                image={getImageUrl(product.images?.[0] || product.image)}
                schema={productSchema}
            />
            <div className="container mx-auto max-w-6xl">
                <Link to="/collections" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-primary mb-8 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Inventory
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Visual Interface */}
                    <div className="relative group reveal active flex flex-col justify-center">
                        <div className="absolute inset-0 bg-primary/10 blur-[100px] -z-10 group-hover:bg-primary/20 transition-all"></div>
                        <div className="aspect-[4/5] bg-neutral-900 border border-white/5 overflow-hidden relative touch-none">
                            <AnimatePresence initial={false} mode="wait">
                                <motion.div
                                    key={currentImageIndex}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={0.7}
                                    onDragEnd={(e, { offset, velocity }) => {
                                        const swipe = Math.abs(offset.x) * velocity.x;
                                        if (offset.x > 100 || velocity.x > 500) {
                                            prevImage();
                                        } else if (offset.x < -100 || velocity.x < -500) {
                                            nextImage();
                                        }
                                    }}
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="w-full h-full cursor-grab active:cursor-grabbing"
                                >
                                    <img
                                        src={getImageUrl(allImages[currentImageIndex])}
                                        className="w-full h-full object-cover transition-all duration-1000 scale-105 group-hover:scale-100 pointer-events-none"
                                        alt={`${product.name} - view ${currentImageIndex + 1}`}
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {hasMultipleImages && (
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-black/80 backdrop-blur-md px-6 py-3 border border-white/10 z-20">
                                    <button onClick={prevImage} className="text-white/50 hover:text-white transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                                    </button>
                                    <span className="text-[10px] font-mono font-bold text-white tracking-widest">{currentImageIndex + 1} / {allImages.length}</span>
                                    <button onClick={nextImage} className="text-white/50 hover:text-white transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="hidden md:block absolute top-6 right-6 md:top-auto md:bottom-8 md:right-8 z-30 pointer-events-none">
                            <div className="glass p-3 md:p-4 border-white/10 relative min-w-max">
                                <p className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-1 whitespace-nowrap">Status</p>
                                <div className="flex items-center gap-2 md:gap-3 whitespace-nowrap">
                                    {product.stock > 0 ? (
                                        <>
                                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
                                            <span className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-widest">In Stock ({product.stock})</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0"></div>
                                            <span className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-widest">Out of Stock</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Data Intel */}
                    <div className="reveal active" style={{ transitionDelay: '200ms' }}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <p className="text-primary font-bold uppercase tracking-[0.5em] text-xs">{product.category} // {product.type}</p>
                            
                            {/* Mobile Stock Indicator */}
                            <div className="md:hidden flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                    {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                                </span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-oswald font-bold uppercase mb-8 leading-none tracking-tighter">
                            {product.name}
                        </h1>

                        <div className="flex flex-wrap items-end gap-3 md:gap-6 mb-8 md:mb-12">
                            <p className="text-3xl md:text-4xl font-bold text-accent">₹{product.price}</p>
                            <p className="text-gray-500 text-[10px] md:text-sm italic pb-1">Local Currency Synchronized</p>
                        </div>

                        <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-12 border-l-2 border-primary pl-6 md:pl-8">
                            {product.description}
                        </p>



                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-8 mb-12">
                            <div className="flex border border-white/10 w-[140px] sm:w-auto overflow-hidden shrink-0">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="flex-1 px-4 sm:px-6 py-4 hover:bg-white/5 transition-all text-white font-bold flex items-center justify-center group"
                                >
                                    <svg className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                                </button>
                                <div className="px-4 sm:px-6 py-4 bg-white/5 font-bold text-sm flex items-center justify-center min-w-[3rem] text-white">
                                    {quantity}
                                </div>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="flex-1 px-4 sm:px-6 py-4 hover:bg-white/5 transition-all text-white font-bold flex items-center justify-center group"
                                >
                                    <svg className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                </button>
                            </div>

                            <button
                                onClick={() => {
                                    addToCart(product, quantity, selectedSize);
                                    navigate('/cart');
                                }}
                                className="w-full sm:flex-grow py-4 md:py-5 px-6 md:px-0 bg-primary text-white font-black uppercase tracking-widest text-[10px] sm:text-xs hover:bg-primary-light transition-all shadow-[0_10px_30px_rgba(109,40,217,0.3)]"
                            >
                                Initiate Protocol (Add to Cart)
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="border border-white/5 overflow-hidden">
                            <div className="flex border-b border-white/5 bg-white/5">
                                {['Specs', 'Sizes'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-primary text-white' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <div className="p-8 text-gray-400 text-sm leading-relaxed min-h-[150px]">
                                {activeTab === 'Specs' && (
                                    <ul className="space-y-4">
                                        <li className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-white/5 pb-3 sm:pb-2 gap-1 sm:gap-0">
                                            <span className="uppercase text-[10px] font-bold tracking-widest text-gray-500">Weight</span>
                                            <span className="text-white font-mono text-sm sm:text-base break-words">240-260 gsm</span>
                                        </li>
                                        <li className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-white/5 pb-3 sm:pb-2 gap-1 sm:gap-0">
                                            <span className="uppercase text-[10px] font-bold tracking-widest text-gray-500">Composition</span>
                                            <span className="text-white font-mono text-sm sm:text-base break-words">French terry loopknit</span>
                                        </li>
                                    </ul>
                                )}
                                {activeTab === 'Sizes' && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                                        <div className="flex justify-between items-center mb-6">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Prototype_Selection</label>
                                            <button 
                                                onClick={() => setShowSizeGuide(true)}
                                                className="text-[9px] font-black text-primary hover:text-primary-light uppercase tracking-widest border-b border-primary/30 pb-0.5 transition-all"
                                            >
                                                Size Guide
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-4">
                                            {['S', 'M', 'L', 'XL'].map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`w-14 h-14 border flex items-center justify-center text-[11px] font-black transition-all duration-300 ${selectedSize === size
                                                        ? 'bg-primary border-primary text-white shadow-xl shadow-primary/40 scale-110'
                                                        : 'border-white/10 text-gray-400 hover:border-white/40 hover:text-white'}`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Size Guide Modal */}
                <AnimatePresence>
                    {showSizeGuide && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowSizeGuide(false)}
                                className="absolute inset-0 bg-black/90 backdrop-blur-md"
                            />
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 p-6 md:p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
                            >
                                <div className="flex justify-between items-start mb-8 border-b border-white/5 pb-6">
                                    <div>
                                        <h2 className="text-2xl font-oswald font-bold uppercase tracking-widest text-white mb-2">Technical Specification</h2>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em]">Size Guide // Protocol Synchronization</p>
                                    </div>
                                    <button 
                                        onClick={() => setShowSizeGuide(false)}
                                        className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all text-white"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[600px]">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-500 bg-white/5">Measurement</th>
                                                {['S', 'M', 'L', 'XL'].map(size => (
                                                    <th key={size} className="py-4 px-4 text-[12px] font-black uppercase tracking-widest text-white text-center bg-white/5">{size}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {[
                                                { label: 'UK', values: ['34R-36R', '38R-40R', '42R-44R', '46R-48R'] },
                                                { label: 'EUR', values: ['44-46', '48-50', '52-54', '56-58'] },
                                                { label: 'Chest cm', values: ['86-90', '94-98', '102-106', '110-114'] },
                                                { label: 'Chest inch', values: ['33 3/4 - 35 1/2', '37 - 38 1/2', '40 1/4 - 41 3/4', '43 1/4 - 44 3/4'] },
                                                { label: 'Waist cm', values: ['74-78', '82-86', '90-94', '98.5-103'] },
                                                { label: 'Waist inch', values: ['29 1/4 - 30 3/4', '32 1/4 - 33 3/4', '35 1/2 - 37', '38 3/4 - 40 1/2'] },
                                                { label: 'Arm length cm', values: ['59-60', '60-61', '61-62', '62-62.5'] },
                                                { label: 'Arm length inch', values: ['23 1/4 - 23 3/4', '23 3/4 - 24', '24 1/4 - 24 1/2', '24 1/2'] },
                                                { label: 'Neckline cm', values: ['36', '38', '40', '42'] },
                                                { label: 'Neckline inch', values: ['14', '15', '15 3/4', '16 1/2'] },
                                            ].map((row, i) => (
                                                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                                    <td className="py-4 px-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">{row.label}</td>
                                                    {row.values.map((v, j) => (
                                                        <td key={j} className="py-4 px-4 text-center font-mono text-xs text-white/80">{v}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-8 p-4 bg-primary/5 border border-primary/20 flex items-start gap-4">
                                    <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed">
                                        Measurements provided in the protocol grid are standard approximations. For a precision silhouette, we recommend verifying against your own anatomical dimensions.
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Digital Twin Showcase */}
                {(product.images?.[2] || product.digitalTwinImage) && (
                    <div className="mt-32 border-t border-white/5 pt-20">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            {/* Left Side: Image */}
                            <div className="relative group block w-full max-w-md mx-auto lg:mx-0">
                                <div className="absolute inset-0 bg-[#d4af37]/10 blur-[50px] -z-10 group-hover:bg-[#d4af37]/20 transition-all duration-700"></div>
                                <div className="absolute inset-0 border border-[#d4af37]/30 scale-[1.02] -z-10 bg-black/50"></div>

                                <div className="absolute top-4 left-4 w-12 h-12 border-t border-l border-[#d4af37] z-20"></div>
                                <div className="absolute bottom-4 right-4 w-12 h-12 border-b border-r border-[#d4af37] z-20"></div>

                                <img
                                    src={getImageUrl(product.images?.[2] || product.digitalTwinImage)}
                                    alt={`${product.name} Digital Twin`}
                                    className="w-full h-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-[2000ms] shadow-2xl z-10 relative block"
                                />

                                {/* Overlay Lock Indicator */}
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-700 z-10 backdrop-blur-[2px]">
                                    <svg className="w-12 h-12 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                </div>
                            </div>

                            {/* Right Side: Text & Claim Info */}
                            <div className="text-left space-y-6">
                                <div className="inline-block px-3 py-1 bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-[10px] font-black uppercase tracking-widest mb-4">
                                    Unlockable Asset
                                </div>
                                <h2 className="text-3xl md:text-5xl font-oswald font-bold uppercase tracking-widest text-white">
                                    <span className="text-[#d4af37]">Digital Twin</span> Skin
                                </h2>
                                <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
                                    Experience the metaverse analog of this physical asset. Fully rigorous and engineered for next-gen digital encounters.
                                </p>

                                <div className="p-6 border border-white/10 bg-white/5 mt-8 max-w-lg">
                                    <h4 className="text-[12px] font-black uppercase tracking-widest text-white mb-2 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-[#d4af37]"></div>
                                        How to Claim
                                    </h4>
                                    <p className="text-[11px] text-gray-500 uppercase tracking-widest leading-loose">
                                        Purchase the physical asset to unlock its digital counterpart. Upon successful acquisition, the 1:1 digital twin skin will be automatically deposited into your <span className="text-white">Operator Vault / My Collection</span> in the user dashboard.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
