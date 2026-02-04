
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { products, orders, addProduct, removeProduct, currentUser } = useStore();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('products');
    const [isAdding, setIsAdding] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        category: 'Apparel',
        type: 'physical',
        description: '',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800'
    });

    if (!currentUser || currentUser.role !== 'admin') {
        return (
            <div className="h-screen bg-black flex flex-col items-center justify-center text-center px-6">
                <div className="w-24 h-24 border border-red-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0-8v6m0-8a9 9 0 110 18 9 9 0 010-18z" />
                    </svg>
                </div>
                <h2 className="text-4xl font-oswald font-bold uppercase text-red-500 mb-2 tracking-widest">Access Denied</h2>
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-8">Insufficient Protocol Clearance</p>
                <button
                    onClick={() => navigate('/auth')}
                    className="px-8 py-3 border border-red-500 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-black transition-all"
                >
                    Return to Login
                </button>
            </div>
        );
    }

    const handleAddProduct = (e) => {
        e.preventDefault();
        const p = {
            ...newProduct,
            id: `P-${Date.now()}`,
            price: Number(newProduct.price)
        };
        addProduct(p);
        setIsAdding(false);
        setNewProduct({
            name: '',
            price: '',
            category: 'Apparel',
            type: 'physical',
            description: '',
            image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800'
        });
    };

    return (
        <div className="min-h-screen bg-black pt-28 pb-20 px-6">
            <div className="container mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-8">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-oswald font-bold uppercase mb-2 tracking-tighter">
                            Command <span className="text-accent italic">Center</span>
                        </h1>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">
                            Admin Node // {currentUser.email}
                        </p>
                    </div>

                    <div className="flex gap-4 mt-8 md:mt-0">
                        {['products', 'orders', 'users'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-accent text-black' : 'border border-white/10 text-gray-500 hover:text-white'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="glass border-white/5 p-8 min-h-[500px]">
                    {activeTab === 'products' && (
                        <div>
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-oswald font-bold uppercase">Global Inventory</h3>
                                <button
                                    onClick={() => setIsAdding(true)}
                                    className="px-6 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary-light transition-all"
                                >
                                    + Initialize Asset
                                </button>
                            </div>

                            {isAdding && (
                                <div className="mb-12 p-8 bg-white/5 border border-primary/20 animate-in fade-in slide-in-from-top-4">
                                    <form onSubmit={handleAddProduct} className="grid grid-cols-2 gap-6">
                                        <div className="col-span-2 flex justify-between">
                                            <h4 className="text-primary font-bold uppercase tracking-widest text-xs">New Asset Manifest</h4>
                                            <button type="button" onClick={() => setIsAdding(false)} className="text-red-500 text-xs font-bold uppercase">Cancel</button>
                                        </div>
                                        <input
                                            placeholder="ASSET NAME"
                                            className="bg-black border border-white/10 p-4 text-xs font-bold uppercase tracking-widest text-white outline-none focus:border-primary"
                                            value={newProduct.name}
                                            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                            required
                                        />
                                        <input
                                            placeholder="PRICE (INR)"
                                            type="number"
                                            className="bg-black border border-white/10 p-4 text-xs font-bold uppercase tracking-widest text-white outline-none focus:border-primary"
                                            value={newProduct.price}
                                            onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                            required
                                        />
                                        <select
                                            className="bg-black border border-white/10 p-4 text-xs font-bold uppercase tracking-widest text-gray-400 outline-none focus:border-primary"
                                            value={newProduct.category}
                                            onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                        >
                                            <option value="Apparel">Apparel</option>
                                            <option value="Digital">Digital</option>
                                        </select>
                                        <select
                                            className="bg-black border border-white/10 p-4 text-xs font-bold uppercase tracking-widest text-gray-400 outline-none focus:border-primary"
                                            value={newProduct.type}
                                            onChange={e => setNewProduct({ ...newProduct, type: e.target.value })}
                                        >
                                            <option value="physical">Physical</option>
                                            <option value="digital">Digital Clone</option>
                                        </select>
                                        <textarea
                                            placeholder="DESCRIPTION"
                                            className="col-span-2 bg-black border border-white/10 p-4 text-xs font-bold uppercase tracking-widest text-white outline-none focus:border-primary h-24"
                                            value={newProduct.description}
                                            onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                        />
                                        <button type="submit" className="col-span-2 py-4 bg-primary text-white font-black uppercase tracking-widest text-xs hover:bg-primary-light transition-all">
                                            Confirm Upload
                                        </button>
                                    </form>
                                </div>
                            )}

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/10">
                                        <tr>
                                            <th className="pb-4 pl-4">Asset ID</th>
                                            <th className="pb-4">Preview</th>
                                            <th className="pb-4">Name</th>
                                            <th className="pb-4">Category</th>
                                            <th className="pb-4">Value</th>
                                            <th className="pb-4 pr-4 text-right">Protocol</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {products.map(p => (
                                            <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="py-4 pl-4 font-mono text-xs text-gray-500">#{p.id}</td>
                                                <td className="py-4">
                                                    <div className="w-10 h-10 overflow-hidden bg-neutral-800">
                                                        <img src={p.image} className="w-full h-full object-cover" alt="" />
                                                    </div>
                                                </td>
                                                <td className="py-4 font-bold text-sm uppercase">{p.name}</td>
                                                <td className="py-4 text-xs uppercase tracking-widest text-primary">{p.category}</td>
                                                <td className="py-4 font-mono text-accent">₹{p.price}</td>
                                                <td className="py-4 pr-4 text-right">
                                                    <button
                                                        onClick={() => removeProduct(p.id)}
                                                        className="text-red-500 hover:text-white text-[10px] font-black uppercase tracking-widest"
                                                    >
                                                        Purge
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div>
                            <h3 className="text-xl font-oswald font-bold uppercase mb-8">Transaction Logs</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/10">
                                        <tr>
                                            <th className="pb-4 pl-4">Order Hash</th>
                                            <th className="pb-4">User ID</th>
                                            <th className="pb-4">Total Value</th>
                                            <th className="pb-4">Credits Issued</th>
                                            <th className="pb-4">Status</th>
                                            <th className="pb-4 pr-4">Timestamp</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {orders.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="py-12 text-center text-gray-500 text-xs uppercase tracking-widest">No recent protocols</td>
                                            </tr>
                                        ) : (
                                            orders.map(o => (
                                                <tr key={o.id} className="hover:bg-white/5 transition-colors">
                                                    <td className="py-4 pl-4 font-mono text-xs text-gray-500">{o.id}</td>
                                                    <td className="py-4 font-mono text-xs text-primary">{o.userId}</td>
                                                    <td className="py-4 font-mono text-accent">₹{o.total}</td>
                                                    <td className="py-4 font-bold text-green-500">+{o.creditsEarned}</td>
                                                    <td className="py-4">
                                                        <span className="px-2 py-1 bg-primary/20 text-primary-light text-[8px] font-black uppercase tracking-widest border border-primary/30">
                                                            {o.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 pr-4 text-xs text-gray-500">{new Date(o.createdAt).toLocaleString()}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="text-gray-600 mb-4">
                                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <p className="text-xs uppercase tracking-widest font-bold">User Database Encryption active</p>
                            </div>
                            <p className="text-[10px] text-gray-700 font-mono">
                                To view full operator list, upgraded clearance is required (Mock Data).
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
