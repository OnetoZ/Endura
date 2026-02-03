
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Link } from 'react-router-dom';

const Shop = () => {
    const { products, addToCart } = useStore();
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = ['All', 'Apparel', 'Digital'];

    const filteredProducts = activeCategory === 'All'
        ? products
        : products.filter(p => p.category === activeCategory);

    return (
        <div className="bg-[#050505] min-h-screen pt-24">
            <div className="container mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/5 pb-8">
                    <div>
                        <h2 className="text-6xl md:text-8xl font-oswald font-bold uppercase tracking-tighter mb-4">
                            EQUIPMENT<span className="text-blue-600">_</span>
                        </h2>
                        <p className="text-blue-400 font-bold tracking-[0.3em] uppercase text-xs">Accessing Sub-System // Products_0.1</p>
                    </div>
                    <div className="flex space-x-12 mt-8 md:mt-0 overflow-x-auto pb-4 w-full md:w-auto scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`text-xs font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap relative ${activeCategory === cat ? 'text-white' : 'text-gray-600 hover:text-gray-400'
                                    }`}
                            >
                                {cat}
                                {activeCategory === cat && (
                                    <span className="absolute -bottom-4 left-0 right-0 h-0.5 bg-blue-600"></span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="group flex flex-col h-full">
                            <Link to={`/product/${product.id}`} className="relative h-[550px] overflow-hidden bg-[#0a0a0a] mb-8 block">
                                <img
                                    src={product.image}
                                    className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1500ms] ease-out"
                                    alt={product.name}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>

                                {/* Product UI Overlay */}
                                <div className="absolute top-4 left-4 flex flex-col items-start gap-2">
                                    <div className="bg-black/80 backdrop-blur-md px-3 py-1 text-[8px] font-black uppercase tracking-widest border border-white/10">
                                        ID: {product.id.padStart(4, '0')}
                                    </div>
                                </div>

                                {product.type === 'digital' && (
                                    <div className="absolute top-4 right-4 bg-blue-600 px-3 py-1 text-[8px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20">
                                        Digital_Asset
                                    </div>
                                )}

                                <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            addToCart(product);
                                        }}
                                        className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 hover:text-white transition-colors"
                                    >
                                        Initiate Gear-Up
                                    </button>
                                </div>
                            </Link>

                            <div className="flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-oswald font-bold uppercase tracking-tight group-hover:text-blue-500 transition-colors">
                                        <Link to={`/product/${product.id}`}>{product.name}</Link>
                                    </h3>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-mono text-gray-500 uppercase">{product.category}</span>
                                    <span className="text-xl font-light text-white tracking-widest">₹{product.price}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Shop;
