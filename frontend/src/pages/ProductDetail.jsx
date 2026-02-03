
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const ProductDetail = () => {
    const { id } = useParams();
    const { products, addToCart } = useStore();
    const navigate = useNavigate();

    const product = products.find(p => p.id === id);

    if (!product) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center">
                <h2 className="text-4xl font-oswald mb-4">ITEM NOT FOUND</h2>
                <button onClick={() => navigate('/shop')} className="text-blue-500 hover:underline">Return to Shop</button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="bg-[#111] h-[700px] overflow-hidden">
                    <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                </div>
                <div className="flex flex-col justify-center">
                    <div className="mb-8">
                        <span className="text-blue-500 font-bold uppercase text-xs tracking-widest mb-2 block">{product.category}</span>
                        <h1 className="text-6xl font-oswald font-bold uppercase mb-4 tracking-tighter">{product.name}</h1>
                        <p className="text-3xl font-light text-gray-300 mb-8">₹{product.price}</p>
                        <div className="h-px bg-white/10 w-full mb-8"></div>
                        <p className="text-gray-400 text-lg leading-relaxed mb-10">
                            {product.description}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => addToCart(product)}
                            className="w-full py-6 bg-white text-black font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition transform active:scale-95"
                        >
                            Add to Gear Bag
                        </button>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="glass p-4 rounded text-center">
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Earn Credits</p>
                                <p className="font-bold text-blue-400">+{Math.floor(product.price * 0.1)}</p>
                            </div>
                            <div className="glass p-4 rounded text-center">
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Product Type</p>
                                <p className="font-bold uppercase text-xs">{product.type}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 space-y-4">
                        <details className="group border-b border-white/5 pb-4">
                            <summary className="list-none flex justify-between items-center cursor-pointer">
                                <span className="uppercase text-xs font-bold tracking-widest">Specifications</span>
                                <span className="group-open:rotate-180 transition-transform">↓</span>
                            </summary>
                            <div className="mt-4 text-sm text-gray-500">
                                {product.type === 'physical' ? (
                                    <ul className="space-y-1">
                                        <li>• Machine wash cold</li>
                                        <li>• 100% Endura Cotton</li>
                                        <li>• Slim athletic fit</li>
                                    </ul>
                                ) : (
                                    <p>Immediate digital download available after verification.</p>
                                )}
                            </div>
                        </details>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
