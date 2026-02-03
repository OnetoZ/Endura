
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

const AdminDashboard = () => {
    const { products, orders, addProduct, removeProduct, currentUser } = useStore();
    const [activeTab, setActiveTab] = useState('products');
    const [isAdding, setIsAdding] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: 0,
        category: 'Apparel',
        type: 'physical',
        description: '',
        image: 'https://picsum.photos/seed/admin/600/800'
    });

    if (currentUser?.role !== 'admin') {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center text-center">
                <h2 className="text-4xl font-oswald text-red-500 mb-4">ACCESS DENIED</h2>
                <p className="text-gray-500">Insufficient clearance for system modifications.</p>
            </div>
        );
    }

    const handleAddProduct = (e) => {
        e.preventDefault();
        const p = {
            ...newProduct,
            id: `P-${Date.now()}`,
        };
        addProduct(p);
        setIsAdding(false);
        setNewProduct({
            name: '',
            price: 0,
            category: 'Apparel',
            type: 'physical',
            description: '',
            image: 'https://picsum.photos/seed/admin/600/800'
        });
    };

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                <h2 className="text-5xl font-oswald font-bold uppercase tracking-tight">Admin Console</h2>
                <div className="flex space-x-4 mt-6 md:mt-0">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`px-6 py-2 text-xs font-bold uppercase tracking-widest border transition ${activeTab === 'products' ? 'bg-blue-600 border-blue-600' : 'border-white/10'}`}
                    >
                        Inventory
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-2 text-xs font-bold uppercase tracking-widest border transition ${activeTab === 'orders' ? 'bg-blue-600 border-blue-600' : 'border-white/10'}`}
                    >
                        System Logs (Orders)
                    </button>
                </div>
            </div>

            {activeTab === 'products' ? (
                <div className="space-y-8">
                    <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-oswald uppercase">Current Stock</h3>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="px-6 py-3 bg-white text-black font-bold uppercase text-xs tracking-widest hover:bg-blue-500 hover:text-white transition"
                        >
                            Initialize New Item
                        </button>
                    </div>

                    {isAdding && (
                        <div className="glass p-8 border-blue-500/30">
                            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 flex justify-between items-center mb-4">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-blue-400">New Product Manifest</h4>
                                    <button type="button" onClick={() => setIsAdding(false)} className="text-gray-500 hover:text-white">Cancel</button>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-gray-500 block mb-2">Item Name</label>
                                    <input
                                        className="w-full bg-white/5 border border-white/10 p-3 outline-none"
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-gray-500 block mb-2">Price (INR)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-white/5 border border-white/10 p-3 outline-none"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-gray-500 block mb-2">Category</label>
                                    <select
                                        className="w-full bg-white/5 border border-white/10 p-3 outline-none"
                                        value={newProduct.category}
                                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                    >
                                        <option value="Apparel">Apparel</option>
                                        <option value="Digital">Digital</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-gray-500 block mb-2">Type</label>
                                    <select
                                        className="w-full bg-white/5 border border-white/10 p-3 outline-none"
                                        value={newProduct.type}
                                        onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
                                    >
                                        <option value="physical">Physical</option>
                                        <option value="digital">Digital</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-[10px] uppercase tracking-widest text-gray-500 block mb-2">Description</label>
                                    <textarea
                                        className="w-full bg-white/5 border border-white/10 p-3 outline-none h-32"
                                        value={newProduct.description}
                                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                        required
                                    />
                                </div>
                                <button type="submit" className="md:col-span-2 py-4 bg-blue-600 font-bold uppercase text-xs tracking-widest">
                                    Confirm Item Entry
                                </button>
                            </form>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="border-b border-white/10 text-gray-500 text-[10px] uppercase tracking-widest font-bold">
                                <tr>
                                    <th className="pb-4">Image</th>
                                    <th className="pb-4">Item Name</th>
                                    <th className="pb-4">Category</th>
                                    <th className="pb-4">Type</th>
                                    <th className="pb-4">Price</th>
                                    <th className="pb-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {products.map(p => (
                                    <tr key={p.id} className="group hover:bg-white/5 transition">
                                        <td className="py-4">
                                            <img src={p.image} className="w-12 h-16 object-cover" alt="" />
                                        </td>
                                        <td className="py-4 font-bold">{p.name}</td>
                                        <td className="py-4 text-xs">{p.category}</td>
                                        <td className="py-4 text-xs uppercase tracking-widest">{p.type}</td>
                                        <td className="py-4 text-gray-400">₹{p.price}</td>
                                        <td className="py-4">
                                            <button
                                                onClick={() => removeProduct(p.id)}
                                                className="text-red-500 hover:text-red-400 text-xs uppercase font-bold"
                                            >
                                                Decommission
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    <h3 className="text-2xl font-oswald uppercase">Transaction History</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="border-b border-white/10 text-gray-500 text-[10px] uppercase tracking-widest font-bold">
                                <tr>
                                    <th className="pb-4">Order ID</th>
                                    <th className="pb-4">User</th>
                                    <th className="pb-4">Total</th>
                                    <th className="pb-4">Status</th>
                                    <th className="pb-4">Credits Issued</th>
                                    <th className="pb-4">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-20 text-center text-gray-600 uppercase text-xs tracking-widest">No transactions logged yet</td>
                                    </tr>
                                ) : (
                                    orders.map(o => (
                                        <tr key={o.id} className="hover:bg-white/5 transition">
                                            <td className="py-4 font-mono text-xs">{o.id}</td>
                                            <td className="py-4 text-sm">{o.userId}</td>
                                            <td className="py-4 font-bold">₹{o.total}</td>
                                            <td className="py-4">
                                                <span className="px-2 py-1 bg-green-500/20 text-green-500 text-[10px] font-bold uppercase rounded">
                                                    {o.status}
                                                </span>
                                            </td>
                                            <td className="py-4 text-blue-400 font-bold">+{o.creditsEarned}</td>
                                            <td className="py-4 text-xs text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
