
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const Shop = () => {
    const { products, addToCart } = useStore();
    const [filter, setFilter] = useState('All');

    const categories = ['All', 'Apparel', 'Digital'];
    const filteredProducts = filter === 'All'
        ? products
        : products.filter(p => p.category === filter);

    return (
        <div className="min-h-screen bg-black pt-24 pb-20 px-6">
            <div className="container mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="reveal active">
                        <h1 className="text-5xl md:text-7xl font-oswald font-bold uppercase tracking-tighter">
                            The <span className="text-primary italic">Inventory</span>
                        </h1>
                        <p className="text-gray-500 text-xs uppercase tracking-[0.4em] font-black mt-4">
                            Sector_01 // All_Available_Assets
                        </p>
                    </div>

                    <div className="flex gap-4">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-8 py-3 text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${filter === cat ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'border-white/10 text-gray-500 hover:border-primary/50 hover:text-white'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {filteredProducts.map((product, idx) => (
                        <div
                            key={product.id}
                            className="group relative reveal active"
                            style={{ transitionDelay: `${idx * 100}ms` }}
                        >
                            {/* Image Container */}
                            <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900 border border-white/5 group-hover:border-primary/30 transition-all duration-500">
                                <img
                                    src={product.image}
                                    className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                                    alt={product.name}
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity"></div>

                                {/* Hover Actions */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                    <div className="flex flex-col gap-4 w-48">
                                        <Link
                                            to={`/product/${product.id}`}
                                            className="py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest text-center hover:bg-primary hover:text-white transition-all"
                                        >
                                            View Intel
                                        </Link>
                                        <button
                                            onClick={() => addToCart(product)}
                                            className="py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary-light transition-all"
                                        >
                                            Initialize Sync
                                        </button>
                                    </div>
                                </div>

                                {/* Product Badge */}
                                <div className="absolute top-6 left-6">
                                    <span className="px-3 py-1 bg-black/80 border border-white/10 text-[8px] font-black uppercase tracking-[0.2em] text-primary">
                                        {product.type}
                                    </span>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="mt-8 flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{product.category}</p>
                                    <Link to={`/product/${product.id}`}>
                                        <h3 className="text-2xl font-oswald font-bold uppercase group-hover:text-primary transition-colors">{product.name}</h3>
                                    </Link>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-accent">₹{product.price}</p>
                                    <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest mt-1">Ref_ID: {product.id.padStart(4, '0')}</p>
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
