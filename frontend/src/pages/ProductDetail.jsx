
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { products, addToCart } = useStore();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('Specs');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const collectedItem = location.state?.item;

    useEffect(() => {
        const found = products.find(p => p._id === id || p.id === id);
        if (found) setProduct(found);
    }, [id, products]);

    if (!product && collectedItem) return (
        <div className="min-h-screen bg-black pt-32 pb-20 px-6 text-white">
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
                        <div className="text-[11px] font-mono tracking-widest uppercase text-white/40">Tier: {collectedItem.tier}</div>
                        <div className="text-[11px] font-mono tracking-widest uppercase text-white/40">Unlock Date: {collectedItem.unlockedAt || '---'}</div>
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
        <div className="min-h-screen bg-black pt-32 pb-20 px-6">
            <div className="container mx-auto max-w-7xl">
                <Link to="/collections" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-primary mb-12 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Inventory
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    {/* Visual Interface */}
                    <div className="relative group reveal active flex flex-col justify-center">
                        <div className="absolute inset-0 bg-primary/10 blur-[100px] -z-10 group-hover:bg-primary/20 transition-all"></div>
                        <div className="aspect-[4/5] bg-neutral-900 border border-white/5 overflow-hidden relative">
                            <img
                                src={allImages[currentImageIndex]}
                                className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 scale-105 group-hover:scale-100"
                                alt={`${product.name} - view ${currentImageIndex + 1}`}
                            />

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
                        <div className="absolute bottom-8 right-8 z-30 pointer-events-none">
                            <div className="glass p-4 border-white/10">
                                <p className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-1">Status</p>
                                <div className="flex items-center gap-2">
                                    {product.stock > 0 ? (
                                        <>
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">In Stock ({product.stock})</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Out of Stock</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Data Intel */}
                    <div className="reveal active" style={{ transitionDelay: '200ms' }}>
                        <p className="text-primary font-bold uppercase tracking-[0.5em] text-xs mb-4">{product.category} // {product.type}</p>
                        <h1 className="text-6xl md:text-8xl font-oswald font-bold uppercase mb-8 leading-none tracking-tighter">
                            {product.name}
                        </h1>

                        <div className="flex items-end gap-6 mb-12">
                            <p className="text-4xl font-bold text-accent">₹{product.price}</p>
                            <p className="text-gray-500 text-sm italic">Local Currency Synchronized</p>
                        </div>

                        <p className="text-gray-400 text-lg leading-relaxed mb-12 border-l-2 border-primary pl-8">
                            {product.description}
                        </p>

                        <div className="flex items-center gap-8 mb-12">
                            <div className="flex border border-white/10">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-6 py-4 hover:bg-white/5 transition-all text-gray-500 font-bold"
                                >-</button>
                                <div className="px-8 py-4 bg-white/5 font-bold text-sm flex items-center">{quantity}</div>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-6 py-4 hover:bg-white/5 transition-all text-gray-500 font-bold"
                                >+</button>
                            </div>

                            <button
                                onClick={() => {
                                    for (let i = 0; i < quantity; i++) addToCart(product);
                                    navigate('/cart');
                                }}
                                className="flex-grow py-5 bg-primary text-white font-black uppercase tracking-widest text-xs hover:bg-primary-light transition-all shadow-[0_10px_30px_rgba(109,40,217,0.3)]"
                            >
                                Initiate Protocol (Add to Cart)
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="border border-white/5 overflow-hidden">
                            <div className="flex border-b border-white/5 bg-white/5">
                                {['Specs', 'Digital Mirror', 'Shipping'].map(tab => (
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
                                        <li className="flex justify-between border-b border-white/5 pb-2">
                                            <span className="uppercase text-[10px] font-bold tracking-widest">Weight</span>
                                            <span className="text-white font-mono">350GSM</span>
                                        </li>
                                        <li className="flex justify-between border-b border-white/5 pb-2">
                                            <span className="uppercase text-[10px] font-bold tracking-widest">Composition</span>
                                            <span className="text-white font-mono">100% Endura-Tech Fiber</span>
                                        </li>
                                    </ul>
                                )}
                                {activeTab === 'Digital Mirror' && (
                                    <p>This item includes a 1:1 digital twin skin. Upon purchase, a sync code will be delivered to your operator node (vault). Compatible with major meta-dimension protocols.</p>
                                )}
                                {activeTab === 'Shipping' && (
                                    <p>Global quantum logistics enabled. Real-time tracking through the operator dashboard. Est. delivery: 3-5 standard temporal cycles.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

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
                                    src={product.images?.[2] || product.digitalTwinImage}
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
