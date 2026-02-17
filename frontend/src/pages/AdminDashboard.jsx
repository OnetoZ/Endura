
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { products, orders, addProduct, removeProduct, currentUser, vaultItems, users } = useStore();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isAdding, setIsAdding] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
        backImage: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800',
        digitalTwinImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
        faction: 'Core',
        shortAtmosphericLine: ''
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
        // Validation: Cannot publish without digital twin
        if (!newProduct.digitalTwinImage) {
            alert('Error: Digital Twin Image is mandatory.');
            return;
        }

        const p = {
            ...newProduct,
            id: `ART-${Date.now()}`,
            price: Number(newProduct.price),
            stock: Number(newProduct.stock)
        };
        addProduct(p);
        setIsAdding(false);
        setNewProduct({
            name: '',
            description: '',
            price: '',
            stock: '',
            image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
            backImage: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800',
            digitalTwinImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
            faction: 'Core',
            shortAtmosphericLine: ''
        });
    };

    const StatusWidget = ({ label, value, color = 'primary' }) => (
        <div className="glass border-white/5 p-6 flex flex-col justify-between h-32 relative group overflow-hidden">
            <div className={`absolute top-0 right-0 w-16 h-16 bg-${color}/10 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-${color}/20 transition-all`}></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">{label}</span>
            <span className={`text-4xl font-oswald font-bold text-${color} tracking-tighter`}>{value}</span>
            <div className={`absolute bottom-0 left-0 h-0.5 bg-${color}/40 w-0 group-hover:w-full transition-all duration-500`}></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black pt-28 pb-20 px-6 font-sans">
            <div className="container mx-auto max-w-7xl">
                {/* Dashboard Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Management Portal</span>
                        </div>
                        <h1 className="text-4xl font-bold uppercase tracking-tight mb-2">
                            Admin <span className="text-primary">Dashboard</span>
                        </h1>
                    </div>

                    <nav className="flex flex-wrap gap-2 glass p-1 border-white/5">
                        {[
                            { id: 'dashboard', label: 'Overview', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
                            { id: 'products', label: 'Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
                            { id: 'orders', label: 'Orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
                            { id: 'vault', label: 'Vault', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
                            { id: 'users', label: 'Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
                                </svg>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content Sections */}
                <div className="reveal">
                    {activeTab === 'dashboard' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-700">
                            <StatusWidget label="Total Products" value={products.length} color="primary" />
                            <StatusWidget label="Active Orders" value={orders.length} color="accent" />
                            <StatusWidget label="Total Users" value={users?.length || 0} color="purple-500" />
                            <StatusWidget label="Vault Items" value={vaultItems?.length || 0} color="green-400" />
                            <StatusWidget label="Items Redeemed" value={vaultItems?.filter(v => !v.locked).length || 0} color="blue-400" />
                            <StatusWidget label="Avg. Price" value={`₹${Math.round(products.reduce((acc, p) => acc + p.price, 0) / products.length) || 0}`} color="yellow-400" />

                            {/* Recent Activity Mini-Feed */}
                            <div className="lg:col-span-3 glass border-white/5 p-8 mt-4">
                                <h3 className="text-xl font-oswald font-bold uppercase mb-6 flex items-center gap-3">
                                    <span className="w-1.5 h-6 bg-primary"></span>
                                    Recent Activity
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { action: 'Product Added', time: '2m ago', detail: 'Alpha Core Shield' },
                                        { action: 'Store Purchase', time: '15m ago', detail: 'Order #8832 Processed' },
                                        { action: 'Order Shipped', time: '1h ago', detail: 'Order #ORD-1723467 dispatched' }
                                    ].map((log, i) => (
                                        <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 hover:bg-white/5 px-2 transition-all">
                                            <div className="flex items-center gap-8">
                                                <span className="text-[10px] font-mono text-primary/60">{log.time}</span>
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-black uppercase text-white tracking-widest">{log.action}</span>
                                                    <span className="text-[10px] text-gray-500 uppercase">{log.detail}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <div className="animate-in fade-in duration-500">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h3 className="text-2xl font-oswald font-bold uppercase tracking-tight">Product List</h3>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em]">Manage your store products</p>
                                </div>
                                <button
                                    onClick={() => setIsAdding(!isAdding)}
                                    className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${isAdding ? 'bg-red-500 text-white' : 'bg-accent text-black hover:bg-white hover:text-black'}`}
                                >
                                    {isAdding ? 'Cancel' : '+ Add New Product'}
                                </button>
                            </div>

                            {isAdding && (
                                <div className="glass border-primary/20 p-10 mb-12 animate-in slide-in-from-top-8 duration-500 relative">
                                    <div className="absolute top-0 left-0 w-24 h-px bg-primary"></div>
                                    <div className="absolute top-0 left-0 w-px h-24 bg-primary"></div>

                                    <form onSubmit={handleAddProduct} className="space-y-12">
                                        {/* Physical Layer */}
                                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                                            <div className="lg:col-span-4 border-b border-white/10 pb-4">
                                                <h4 className="text-primary font-black uppercase tracking-[0.4em] text-xs">01 Product Details</h4>
                                            </div>
                                            <div className="lg:col-span-2 space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Product Name</label>
                                                    <input
                                                        className="w-full bg-white/5 border border-white/10 p-4 text-sm font-bold uppercase tracking-widest text-white outline-none focus:border-primary transition-all"
                                                        value={newProduct.name}
                                                        onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                                        placeholder="Enter Name"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Description</label>
                                                    <textarea
                                                        className="w-full bg-white/5 border border-white/10 p-4 text-sm font-bold uppercase tracking-widest text-white outline-none focus:border-primary transition-all h-32"
                                                        value={newProduct.description}
                                                        onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                                        placeholder="ATMOSPHERIC_DESCRIPTION"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Price (INR)</label>
                                                    <input
                                                        type="number"
                                                        className="w-full bg-white/5 border border-white/10 p-4 text-sm font-bold uppercase tracking-widest text-accent outline-none focus:border-accent transition-all"
                                                        value={newProduct.price}
                                                        onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                                        placeholder="₹0.00"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Stock</label>
                                                    <input
                                                        type="number"
                                                        className="w-full bg-white/5 border border-white/10 p-4 text-sm font-bold uppercase tracking-widest text-white outline-none focus:border-primary transition-all"
                                                        value={newProduct.stock}
                                                        onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                                                        placeholder="QUANTITY"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Front Image (URL)</label>
                                                    <input
                                                        className="w-full bg-white/5 border border-white/10 p-4 text-[10px] text-gray-500 outline-none focus:border-primary transition-all"
                                                        value={newProduct.image}
                                                        onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Back Image (URL)</label>
                                                    <input
                                                        className="w-full bg-white/5 border border-white/10 p-4 text-[10px] text-gray-500 outline-none focus:border-primary transition-all"
                                                        value={newProduct.backImage}
                                                        onChange={e => setNewProduct({ ...newProduct, backImage: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Digital Layer */}
                                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                                            <div className="lg:col-span-4 border-b border-white/10 pb-4">
                                                <h4 className="text-accent font-black uppercase tracking-[0.4em] text-xs">02 Digital Assets</h4>
                                            </div>
                                            <div className="lg:col-span-2 space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Digital Image (URL) *Required</label>
                                                    <input
                                                        className="w-full bg-white/5 border border-accent/20 p-4 text-[10px] text-gray-500 outline-none focus:border-accent transition-all"
                                                        value={newProduct.digitalTwinImage}
                                                        onChange={e => setNewProduct({ ...newProduct, digitalTwinImage: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Short Tagline</label>
                                                    <input
                                                        className="w-full bg-white/5 border border-white/10 p-4 text-sm font-bold uppercase tracking-widest text-white outline-none focus:border-primary transition-all"
                                                        value={newProduct.shortAtmosphericLine}
                                                        onChange={e => setNewProduct({ ...newProduct, shortAtmosphericLine: e.target.value })}
                                                        placeholder="Enter short description..."
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Faction Assignment</label>
                                                    <select
                                                        className="w-full bg-black border border-white/10 p-4 text-xs font-bold uppercase tracking-widest text-primary outline-none focus:border-primary"
                                                        value={newProduct.faction}
                                                        onChange={e => setNewProduct({ ...newProduct, faction: e.target.value })}
                                                    >
                                                        <option value="Core">Core</option>
                                                        <option value="Expanse">Expanse</option>
                                                        <option value="Sentinel">Sentinel</option>
                                                        <option value="Void">Void</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <button type="submit" className="w-full py-6 bg-accent text-black font-black uppercase tracking-[0.5em] text-xs hover:bg-white transition-all shadow-2xl">
                                            Add Product
                                        </button>
                                    </form>
                                </div>
                            )}

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/10">
                                        <tr>
                                            <th className="pb-4">Product ID</th>
                                            <th className="pb-4">Images</th>
                                            <th className="pb-4">Name & Price</th>
                                            <th className="pb-4">Category</th>
                                            <th className="pb-4">Stock</th>
                                            <th className="pb-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-sm">
                                        {products.map(p => (
                                            <tr key={p.id} className="group hover:bg-white/5 transition-all">
                                                <td className="py-6 font-mono text-xs text-gray-600">#{p.id.slice(-6)}</td>
                                                <td className="py-6">
                                                    <div className="flex gap-2">
                                                        <img src={p.image} className="w-10 h-10 object-cover grayscale group-hover:grayscale-0 transition-all border border-white/10" alt="" />
                                                        <img src={p.digitalTwinImage} className="w-10 h-10 object-cover border border-accent/30 p-0.5" alt="" />
                                                    </div>
                                                </td>
                                                <td className="py-6">
                                                    <p className="font-bold uppercase tracking-tight">{p.name}</p>
                                                    <p className="text-accent font-mono text-[10px]">₹{p.price}</p>
                                                </td>
                                                <td className="py-6">
                                                    <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border border-${p.faction === 'Void' ? 'purple-500' : 'primary'}/30 text-white/70`}>
                                                        {p.faction}
                                                    </span>
                                                </td>
                                                <td className="py-6 font-mono text-xs">{p.stock || '∞'}</td>
                                                <td className="py-6 text-right space-x-4">
                                                    <button className="text-gray-500 hover:text-white text-[9px] font-black uppercase">Edit</button>
                                                    <button onClick={() => removeProduct(p.id)} className="text-red-500 hover:text-white text-[9px] font-black uppercase">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="animate-in fade-in duration-500">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h3 className="text-2xl font-oswald font-bold uppercase tracking-tight">All Orders</h3>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em]">View and manage order status</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="glass px-4 py-2 border-white/10 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-[9px] font-bold uppercase text-gray-400">Shopify Linked</span>
                                    </div>
                                    <button className="px-6 py-2 border border-white/10 text-[9px] font-black uppercase tracking-widest hover:border-primary transition-all">Sync Now</button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/10">
                                        <tr>
                                            <th className="pb-4">Order ID</th>
                                            <th className="pb-4">Customer</th>
                                            <th className="pb-4">Items</th>
                                            <th className="pb-4">Payment</th>
                                            <th className="pb-4">Status</th>
                                            <th className="pb-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-sm">
                                        {orders.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="py-20 text-center text-gray-600 text-[10px] font-black uppercase tracking-[0.4em]">No orders found</td>
                                            </tr>
                                        ) : (
                                            orders.map(o => (
                                                <tr key={o.id} className="group hover:bg-white/5 transition-all">
                                                    <td className="py-6 font-mono text-xs text-gray-500">{o.id}</td>
                                                    <td className="py-6 uppercase font-bold text-xs">{o.userId}</td>
                                                    <td className="py-6">
                                                        {o.items?.map((item, i) => (
                                                            <p key={i} className="text-[10px] text-gray-400 uppercase font-black">{item.name} x{item.quantity}</p>
                                                        ))}
                                                    </td>
                                                    <td className="py-6">
                                                        <span className="font-mono text-[10px] bg-accent/10 px-2 py-1 text-accent border border-accent/20">
                                                            {o.status === 'paid' ? 'PENDING_GENERATION' : 'LOCKED'}
                                                        </span>
                                                    </td>
                                                    <td className="py-6">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${o.status === 'paid' ? 'bg-primary' : 'bg-yellow-500'}`}></div>
                                                            <span className="text-[9px] font-black uppercase tracking-widest">{o.status}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-6 text-right">
                                                        <button className="px-4 py-2 bg-primary/20 text-primary text-[8px] font-black uppercase hover:bg-primary hover:text-black transition-all">View Details</button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'vault' && (
                        <div className="animate-in fade-in duration-500">
                            <div className="mb-10 lg:flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-oswald font-bold uppercase tracking-tight">Digital Vault</h3>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em]">View user digital items</p>
                                </div>
                                <div className="flex gap-4 mt-6 lg:mt-0">
                                    <input placeholder="Filter by User" className="glass bg-transparent border-white/10 px-4 py-2 text-[10px] uppercase font-bold text-white outline-none focus:border-primary" />
                                    <select className="glass bg-black border-white/10 px-4 py-2 text-[10px] uppercase font-bold text-gray-400 outline-none">
                                        <option>All Categories</option>
                                        <option>Core</option>
                                        <option>Void</option>
                                    </select>
                                </div>
                            </div>

                            <div className="glass border-white/5 overflow-hidden">
                                <div className="bg-white/5 px-8 py-4 border-b border-white/10 flex items-center justify-between">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-primary">Status: Active</span>
                                    <span className="text-[9px] font-mono text-gray-600 tracking-tighter">Total Redeemed: {vaultItems?.filter(v => !v.locked).length || 0}</span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="text-[9px] font-black uppercase tracking-widest text-gray-500 px-8">
                                            <tr className="border-b border-white/5">
                                                <th className="py-4 pl-8">Item ID</th>
                                                <th className="py-4">Item Name</th>
                                                <th className="py-4">Category</th>
                                                <th className="py-4">Redemption Code</th>
                                                <th className="py-4 pr-8">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {(vaultItems || []).map(v => (
                                                <tr key={v.id} className="hover:bg-white/5 transition-all cursor-default">
                                                    <td className="py-6 pl-8 font-mono text-[10px] text-gray-500">#{v.id}</td>
                                                    <td className="py-6 flex items-center gap-4">
                                                        <img src={v.image} className="w-10 h-10 border border-white/20" alt="" />
                                                        <span className="font-bold uppercase text-xs tracking-tight">{v.name}</span>
                                                    </td>
                                                    <td className="py-6 text-[10px] text-gray-400 font-black uppercase">Standard Item</td>
                                                    <td className="py-6 font-mono text-[10px] text-accent font-bold tracking-[0.2em]">{v.locked ? '********' : v.code}</td>
                                                    <td className="py-6 pr-8">
                                                        <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-sm ${v.locked ? 'bg-gray-800 text-gray-500' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
                                                            {v.locked ? 'LOCKED' : 'REDEEMED'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {(!vaultItems || vaultItems.length === 0) && (
                                                <tr>
                                                    <td colSpan={5} className="py-20 text-center text-gray-700 text-[10px] font-black uppercase tracking-[0.5em]">Vault is empty</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="animate-in fade-in duration-500">
                            <div className="mb-10">
                                <h3 className="text-2xl font-oswald font-bold uppercase tracking-tight">Active Operatives</h3>
                                <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em]">Total Registered Users: {users?.length || 0}</p>
                            </div>

                            <div className="glass border-white/5 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="text-[10px] font-black uppercase tracking-widest text-gray-500 bg-white/5 border-b border-white/10">
                                            <tr>
                                                <th className="py-4 pl-8">User Name</th>
                                                <th className="py-4 pr-8 text-right">Overview</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {(users || []).map(user => (
                                                <tr key={user.id} className="hover:bg-white/5 transition-all">
                                                    <td className="py-6 pl-8">
                                                        <span className="font-bold uppercase text-sm text-white tracking-widest">{user.name}</span>
                                                    </td>
                                                    <td className="py-6 pr-8 text-right">
                                                        <span className="text-[10px] font-mono text-gray-500 uppercase">Standard User</span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {(!users || users.length === 0) && (
                                                <tr>
                                                    <td colSpan={2} className="py-20 text-center text-gray-700 text-[10px] font-black uppercase tracking-[0.5em]">No operatives found</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Global Admin Styles */}
            <style>{`
                .glass {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .text-primary { color: #9370DB; }
                .bg-primary { background-color: #9370DB; }
                .text-accent { color: #FFD700; }
                .bg-accent { background-color: #FFD700; }
                
                @keyframes slideInUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .reveal {
                    animation: slideInUp 0.8s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
