import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService, userService, uploadService } from '../services/api';
import { toast } from 'react-hot-toast';

const CATEGORY_STYLES = {
    Common: { border: '#a3a3a3', glow: '#a3a3a355', label: 'COMMON' },
    Rare: { border: '#3b82f6', glow: '#3b82f655', label: 'RARE' },
    Epic: { border: '#a855f7', glow: '#a855f755', label: 'EPIC' },
    Legendary: { border: '#eab308', glow: '#eab30855', label: 'LEGENDARY' },
};

const INITIAL_PRODUCT_STATE = {
    name: '',
    description: '',
    price: '',
    stock: '',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
    backImage: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800',
    additionalImages: [],
    digitalTwinImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
    type: 'Worn',
    shortAtmosphericLine: ''
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isAdding, setIsAdding] = useState(false);
    const [isSavingProduct, setIsSavingProduct] = useState(false);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [vaultItems, setVaultItems] = useState([]);

    // ── Vault Cards ────────────────────────────────────────────────────────
    const [vaultCards, setVaultCards] = useState([]);
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [cardSaving, setCardSaving] = useState(false);
    const [newCard, setNewCard] = useState({
        name: '', description: '', frontImage: '', backImage: '', category: 'Common'
    });

    // ── Filters & Search ───────────────────────────────────────────────────
    const [userSearch, setUserSearch] = useState('');
    const [productSearch, setProductSearch] = useState('');
    const [orderFilter, setOrderFilter] = useState('All');

    // Fetch real data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsData, ordersData, usersData, userData, cardsData] = await Promise.all([
                    productService.getProducts(),
                    userService.getUserOrders(),
                    userService.getUsers(),
                    userService.getCurrentUser(),
                    productService.getVaultCards(),
                ]);
                setProducts(productsData.products || []);
                setOrders(ordersData || []);
                setUsers(usersData || []);
                setCurrentUser(userData || null);
                setVaultCards(cardsData || []);
                const vaultData = await productService.getVaultItems();
                setVaultItems(vaultData || []);
            } catch (error) {
                console.error('Failed to fetch admin data:', error);
                toast.error('Failed to load admin data');
            } finally {
                setIsAuthLoading(false);
            }
        };

        fetchData();
    }, []);

    // ── Products ──────────────────────────────────────────────────────────
    const [newProduct, setNewProduct] = useState(INITIAL_PRODUCT_STATE);
    const [editingProductId, setEditingProductId] = useState(null);

    // Show spinner while profile is being fetched
    if (isAuthLoading) {
        return (
            <div className="h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Verifying Clearance...</p>
                </div>
            </div>
        );
    }

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

    const handleImageUpload = async (e, fieldName) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadPromise = uploadService.uploadImage(file);
        toast.promise(uploadPromise, {
            loading: 'Uploading image...',
            success: 'Image uploaded!',
            error: 'Failed to upload image'
        });

        try {
            const url = await uploadPromise;
            setNewProduct(prev => ({ ...prev, [fieldName]: url }));
        } catch (error) {
            console.error('Upload error:', error);
        }
    };

    const handleAdditionalImageUpload = async (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadPromise = uploadService.uploadImage(file);
        toast.promise(uploadPromise, {
            loading: 'Uploading additional image...',
            success: 'Image uploaded!',
            error: 'Failed to upload image'
        });

        try {
            const url = await uploadPromise;
            setNewProduct(prev => {
                const updated = [...prev.additionalImages];
                updated[index] = url;
                return { ...prev, additionalImages: updated };
            });
        } catch (error) {
            console.error('Upload error:', error);
        }
    };

    const handleCardImageUpload = async (e, fieldName) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadPromise = uploadService.uploadImage(file);
        toast.promise(uploadPromise, {
            loading: 'Uploading card image...',
            success: 'Image uploaded!',
            error: 'Failed to upload image'
        });

        try {
            const url = await uploadPromise;
            setNewCard(prev => ({ ...prev, [fieldName]: url }));
        } catch (error) {
            console.error('Upload error:', error);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        // Validation: Cannot publish without digital twin
        if (!newProduct.digitalTwinImage) {
            toast.error('Error: Digital Twin Image is mandatory.');
            return;
        }

        setIsSavingProduct(true);
        try {
            const productData = {
                ...newProduct,
                images: [newProduct.image, newProduct.backImage, newProduct.digitalTwinImage, ...newProduct.additionalImages],
                price: Number(newProduct.price),
                stock: Number(newProduct.stock)
            };

            if (editingProductId) {
                const updated = await productService.updateProduct(editingProductId, productData);
                setProducts(prev => prev.map(p => {
                    const idToMatch = p._id || p.id;
                    const resultId = updated._id || updated.id || updated.product?._id || updated.product?.id;
                    return idToMatch === editingProductId ? (updated.product || updated) : p;
                }));
                toast.success('Product updated successfully!');
            } else {
                const created = await productService.createProduct(productData);
                setProducts(prev => [created.product || created, ...prev]);
                toast.success('Product added successfully!');
            }

            setIsAdding(false);
            setEditingProductId(null);
            setNewProduct(INITIAL_PRODUCT_STATE);
        } catch (error) {
            console.error('Failed to save product:', error);
            toast.error(error?.response?.data?.message || 'Failed to save product');
        } finally {
            setIsSavingProduct(false);
        }
    };

    const handleEditClick = (product) => {
        setEditingProductId(product._id || product.id);
        setNewProduct({
            name: product.name || '',
            description: product.description || '',
            price: product.price || '',
            stock: product.stock || '',
            image: product.images?.[0] || product.image || '',
            backImage: product.images?.[1] || product.backImage || '',
            digitalTwinImage: product.images?.[2] || product.digitalTwinImage || '',
            additionalImages: product.images?.slice(3) || product.additionalImages || [],
            type: product.type || 'Worn',
            shortAtmosphericLine: product.shortAtmosphericLine || ''
        });
        setIsAdding(true);
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you certain you wish to purge this product?')) return;
        try {
            await productService.deleteProduct(id);
            setProducts(prev => prev.filter(p => (p._id || p.id) !== id));
            toast.success('Product purged from database.');
        } catch (error) {
            console.error('Failed to delete product:', error);
            toast.error(error?.response?.data?.message || 'Failed to delete product');
        }
    };

    const StatusWidget = ({ label, value, color = 'primary' }) => (
        <div className="glass border-white/5 p-6 flex flex-col justify-between h-32 relative group overflow-hidden">
            <div className={`absolute top-0 right-0 w-16 h-16 bg-${color}/10 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-${color}/20 transition-all`}></div>
            <span className="text-[10px] font-black uppercase tracking-0.3em text-gray-500">{label}</span>
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
                            { id: 'users', label: 'Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
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
                                    onClick={() => {
                                        setIsAdding(!isAdding);
                                        setEditingProductId(null);
                                        setNewProduct(INITIAL_PRODUCT_STATE);
                                    }}
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
                                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Front Image</label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="w-full bg-white/5 border border-white/10 p-4 text-[10px] text-gray-500 outline-none focus:border-primary transition-all file:border-0 file:bg-primary file:text-white file:px-4 file:py-2 file:text-[10px] file:font-black file:uppercase file:mr-4 cursor-pointer"
                                                        onChange={e => handleImageUpload(e, 'image')}
                                                    />
                                                    {newProduct.image && !newProduct.image.includes('unsplash') && (
                                                        <p className="mt-1 text-[8px] text-accent truncate">Uploaded: {newProduct.image}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Back Image</label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="w-full bg-white/5 border border-white/10 p-4 text-[10px] text-gray-500 outline-none focus:border-primary transition-all file:border-0 file:bg-primary file:text-white file:px-4 file:py-2 file:text-[10px] file:font-black file:uppercase file:mr-4 cursor-pointer"
                                                        onChange={e => handleImageUpload(e, 'backImage')}
                                                    />
                                                    {newProduct.backImage && !newProduct.backImage.includes('unsplash') && (
                                                        <p className="mt-1 text-[8px] text-accent truncate">Uploaded: {newProduct.backImage}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Additional Images (URLs)</label>
                                                        <button
                                                            type="button"
                                                            onClick={() => setNewProduct({ ...newProduct, additionalImages: [...newProduct.additionalImages, ''] })}
                                                            className="text-[9px] font-black text-primary hover:text-accent uppercase transition-colors"
                                                        >
                                                            + Add Image
                                                        </button>
                                                    </div>
                                                    {newProduct.additionalImages.map((imgUrl, index) => (
                                                        <div key={index} className="flex gap-2 mt-2">
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="w-full bg-white/5 border border-white/10 p-4 text-[10px] text-gray-500 outline-none focus:border-primary transition-all file:border-0 file:bg-primary file:text-white file:px-4 file:py-2 file:text-[10px] file:font-black file:uppercase file:mr-4 cursor-pointer"
                                                                onChange={e => handleAdditionalImageUpload(e, index)}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const updatedImages = newProduct.additionalImages.filter((_, i) => i !== index);
                                                                    setNewProduct({ ...newProduct, additionalImages: updatedImages });
                                                                }}
                                                                className="px-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xl font-black"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}
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
                                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Digital Image *Required</label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="w-full bg-white/5 border border-accent/20 p-4 text-[10px] text-gray-500 outline-none focus:border-accent transition-all file:border-0 file:bg-accent file:text-black file:px-4 file:py-2 file:text-[10px] file:font-black file:uppercase file:mr-4 cursor-pointer"
                                                        onChange={e => handleImageUpload(e, 'digitalTwinImage')}
                                                        required
                                                    />
                                                    {newProduct.digitalTwinImage && !newProduct.digitalTwinImage.includes('unsplash') && (
                                                        <p className="mt-1 text-[8px] text-accent truncate">Uploaded: {newProduct.digitalTwinImage}</p>
                                                    )}
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
                                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Type</label>
                                                    <select
                                                        className="w-full bg-black border border-white/10 p-4 text-xs font-bold uppercase tracking-widest text-primary outline-none focus:border-primary"
                                                        value={newProduct.type}
                                                        onChange={e => setNewProduct({ ...newProduct, type: e.target.value })}
                                                    >
                                                        <option value="Worn">Worn</option>
                                                        <option value="Refined">Refined</option>
                                                        <option value="Exalted">Exalted</option>
                                                        <option value="Mythic">Mythic</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <button disabled={isSavingProduct} type="submit" className="w-full py-6 bg-accent text-black font-black uppercase tracking-[0.5em] text-xs hover:bg-white transition-all shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed">
                                            {isSavingProduct ? (editingProductId ? 'Saving...' : 'Publishing...') : (editingProductId ? 'Save Changes' : 'Add Product')}
                                        </button>
                                    </form>
                                </div>
                            )}

                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-[12px] font-black uppercase text-white/50 tracking-widest">Inventory List</h4>
                                <input
                                    type="text"
                                    placeholder="SEARCH PRODUCTS..."
                                    className="bg-black/50 border border-white/10 px-4 py-2 text-[10px] font-mono text-white outline-none focus:border-primary/50 uppercase tracking-widest w-64"
                                    value={productSearch}
                                    onChange={(e) => setProductSearch(e.target.value)}
                                />
                            </div>

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
                                        {products.filter(p => !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase())).map(p => (
                                            <tr key={p._id || p.id} className="group hover:bg-white/5 transition-all">
                                                <td className="py-6 font-mono text-xs text-gray-600">#{(p._id || p.id || '').slice(-6)}</td>
                                                <td className="py-6">
                                                    <div className="flex gap-2">
                                                        <img src={p.images?.[0] || p.image} className="w-10 h-10 object-cover grayscale group-hover:grayscale-0 transition-all border border-white/10" alt="" />
                                                        <img src={p.images?.[2] || p.digitalTwinImage} className="w-10 h-10 object-cover border border-accent/30 p-0.5" alt="" />
                                                    </div>
                                                </td>
                                                <td className="py-6">
                                                    <p className="font-bold uppercase tracking-tight">{p.name}</p>
                                                    <p className="text-accent font-mono text-[10px]">₹{p.price}</p>
                                                </td>
                                                <td className="py-6">
                                                    <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border border-${p.type === 'Mythic' ? 'purple-500' : 'primary'}/30 text-white/70`}>
                                                        {p.type || p.faction}
                                                    </span>
                                                </td>
                                                <td className="py-6 font-mono text-xs">{p.stock || '∞'}</td>
                                                <td className="py-6 text-right space-x-4">
                                                    <button onClick={() => handleEditClick(p)} className="text-gray-500 hover:text-white text-[9px] font-black uppercase">Edit</button>
                                                    <button onClick={() => handleDeleteProduct(p._id || p.id)} className="text-red-500 hover:text-white text-[9px] font-black uppercase">Delete</button>
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
                                    <select
                                        className="bg-black border border-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-primary/50 appearance-none cursor-pointer"
                                        value={orderFilter}
                                        onChange={(e) => setOrderFilter(e.target.value)}
                                    >
                                        <option value="All">All Statuses</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                    </select>
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
                                        {orders.filter(o => orderFilter === 'All' || o.status === orderFilter).length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="py-20 text-center text-gray-600 text-[10px] font-black uppercase tracking-[0.4em]">No orders found</td>
                                            </tr>
                                        ) : (
                                            orders.filter(o => orderFilter === 'All' || o.status === orderFilter).map(o => (
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

                            {/* Header */}
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-4">
                                <div>
                                    <h3 className="text-2xl font-oswald font-bold uppercase tracking-tight">Vault Cards</h3>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em]">Manage collectible vault cards shown to users</p>
                                </div>
                                <button
                                    onClick={() => setIsAddingCard(!isAddingCard)}
                                    className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${isAddingCard ? 'bg-red-500 text-white' : 'bg-accent text-black hover:bg-white'
                                        }`}
                                >
                                    {isAddingCard ? '✕ Cancel' : '+ Add Card'}
                                </button>
                            </div>

                            {/* Add Card Form */}
                            {isAddingCard && (
                                <div className="glass border-primary/20 p-8 mb-10 animate-in slide-in-from-top-4 duration-500 relative">
                                    <div className="absolute top-0 left-0 w-16 h-px bg-accent" />
                                    <div className="absolute top-0 left-0 w-px h-16 bg-accent" />
                                    <h4 className="text-accent font-black uppercase tracking-[0.4em] text-xs mb-8">New Vault Card</h4>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                        {/* Left: Text fields */}
                                        <div className="space-y-5">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Card Name *</label>
                                                <input
                                                    className="w-full bg-white/5 border border-white/10 p-4 text-sm font-bold uppercase tracking-widest text-white outline-none focus:border-accent transition-all"
                                                    placeholder="e.g. PHANTOM STRIKER"
                                                    value={newCard.name}
                                                    onChange={e => setNewCard({ ...newCard, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Description</label>
                                                <textarea
                                                    rows={3}
                                                    className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white/80 outline-none focus:border-accent transition-all resize-none"
                                                    placeholder="Card lore or description..."
                                                    value={newCard.description}
                                                    onChange={e => setNewCard({ ...newCard, description: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Category</label>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {['Silver', 'Gold', 'Diamond', 'Legendary'].map(cat => (
                                                        <button
                                                            key={cat}
                                                            type="button"
                                                            onClick={() => setNewCard({ ...newCard, category: cat })}
                                                            className={`py-3 text-[9px] font-black uppercase tracking-widest transition-all border ${newCard.category === cat
                                                                ? 'text-black'
                                                                : 'border-white/10 text-gray-500 hover:border-white/30'
                                                                }`}
                                                            style={newCard.category === cat ? {
                                                                background: CATEGORY_STYLES[cat]?.border,
                                                                borderColor: CATEGORY_STYLES[cat]?.border,
                                                                color: '#000'
                                                            } : {}}
                                                        >
                                                            {cat}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Image URLs + previews */}
                                        <div className="space-y-5">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Front Image *</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="w-full bg-white/5 border border-white/10 p-4 text-[11px] text-gray-400 outline-none focus:border-primary transition-all file:border-0 file:bg-primary file:text-white file:px-4 file:py-2 file:text-[10px] file:font-black file:uppercase file:mr-4 cursor-pointer"
                                                    onChange={e => handleCardImageUpload(e, 'frontImage')}
                                                />
                                                {newCard.frontImage && (
                                                    <img src={newCard.frontImage} alt="front" className="w-full h-32 object-cover border border-white/10 mt-2" onError={e => e.target.style.display = 'none'} />
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Back Image *</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="w-full bg-white/5 border border-white/10 p-4 text-[11px] text-gray-400 outline-none focus:border-primary transition-all file:border-0 file:bg-primary file:text-white file:px-4 file:py-2 file:text-[10px] file:font-black file:uppercase file:mr-4 cursor-pointer"
                                                    onChange={e => handleCardImageUpload(e, 'backImage')}
                                                />
                                                {newCard.backImage && (
                                                    <img src={newCard.backImage} alt="back" className="w-full h-32 object-cover border border-white/10 mt-2" onError={e => e.target.style.display = 'none'} />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        disabled={cardSaving || !newCard.name || !newCard.frontImage || !newCard.backImage}
                                        onClick={async () => {
                                            setCardSaving(true);
                                            try {
                                                const created = await productService.createVaultCard(newCard);
                                                setVaultCards(prev => [created, ...prev]);
                                                setNewCard({ name: '', description: '', frontImage: '', backImage: '', category: 'Common' });
                                                setIsAddingCard(false);
                                                toast.success('Card added to vault!');
                                            } catch (err) {
                                                toast.error(err?.response?.data?.message || 'Failed to save card');
                                            } finally {
                                                setCardSaving(false);
                                            }
                                        }}
                                        className="w-full py-5 bg-accent text-black font-black uppercase tracking-[0.5em] text-xs hover:bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        {cardSaving ? 'Saving...' : 'Save Card to Vault'}
                                    </button>
                                </div>
                            )}

                            {/* Cards Grid */}
                            {vaultCards.length === 0 ? (
                                <div className="glass border-white/5 py-20 text-center">
                                    <p className="text-gray-700 text-[10px] font-black uppercase tracking-[0.5em]">No cards yet — click + Add Card to create one</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {vaultCards.map(card => {
                                        const style = CATEGORY_STYLES[card.category] || CATEGORY_STYLES.Common;
                                        return (
                                            <div
                                                key={card._id}
                                                className="relative group glass overflow-hidden rounded-lg"
                                                style={{ borderColor: style.border, boxShadow: `0 0 20px ${style.glow}` }}
                                            >
                                                {/* Front image */}
                                                <div className="relative aspect-[3/4] overflow-hidden">
                                                    <img
                                                        src={card.frontImage}
                                                        alt={card.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                    />
                                                    {/* Category badge */}
                                                    <span
                                                        className="absolute top-3 left-3 text-[8px] font-black uppercase tracking-widest px-2 py-1"
                                                        style={{ background: style.border, color: '#000' }}
                                                    >
                                                        {style.label}
                                                    </span>
                                                    {/* Hover: show back image */}
                                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                        <img src={card.backImage} alt="back" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                            <span className="text-[9px] font-mono text-white/60 tracking-widest uppercase">Back View</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Info */}
                                                <div className="p-4">
                                                    <h4 className="font-black uppercase tracking-widest text-sm text-white mb-1 truncate">{card.name}</h4>
                                                    {card.description && (
                                                        <p className="text-[10px] text-gray-500 line-clamp-2">{card.description}</p>
                                                    )}
                                                    <button
                                                        onClick={async () => {
                                                            if (!window.confirm(`Delete "${card.name}"?`)) return;
                                                            try {
                                                                await productService.deleteVaultCard(card._id);
                                                                setVaultCards(prev => prev.filter(c => c._id !== card._id));
                                                                toast.success('Card deleted');
                                                            } catch {
                                                                toast.error('Failed to delete');
                                                            }
                                                        }}
                                                        className="mt-3 text-[8px] font-black uppercase tracking-widest text-red-500 hover:text-white transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="animate-in fade-in duration-500">
                            <div className="mb-10">
                                <h3 className="text-2xl font-oswald font-bold uppercase tracking-tight">Active Operatives</h3>
                                <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em]">Total Registered Users: {users?.length || 0}</p>
                            </div>

                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-[12px] font-black uppercase text-white/50 tracking-widest">Operator List</h4>
                                <input
                                    type="text"
                                    placeholder="SEARCH BY NAME OR EMAIL..."
                                    className="bg-black/50 border border-white/10 px-4 py-2 text-[10px] font-mono text-white outline-none focus:border-primary/50 uppercase tracking-widest w-64"
                                    value={userSearch}
                                    onChange={(e) => setUserSearch(e.target.value)}
                                />
                            </div>

                            <div className="glass border-white/5 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="text-[10px] font-black uppercase tracking-widest text-gray-500 bg-white/5 border-b border-white/10">
                                            <tr>
                                                <th className="py-4 pl-8">User</th>
                                                <th className="py-4">Email</th>
                                                <th className="py-4">Mobile</th>
                                                <th className="py-4">Role</th>
                                                <th className="py-4 pr-8 text-right">Created</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {(users || []).filter(u => {
                                                const searchStr = userSearch.toLowerCase();
                                                const name = (u.username || u.name || 'Operator').toLowerCase();
                                                const email = (u.email || '').toLowerCase();
                                                return !searchStr || name.includes(searchStr) || email.includes(searchStr);
                                            }).map((u) => {
                                                const name = u.username || u.name || 'Operator';
                                                const created = u.createdAt ? new Date(u.createdAt) : null;
                                                return (
                                                    <tr key={u._id || u.id} className="hover:bg-white/5 transition-all">
                                                        <td className="py-6 pl-8">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center">
                                                                    {u.avatar ? (
                                                                        <img src={u.avatar} alt="" className="w-full h-full object-cover grayscale" />
                                                                    ) : (
                                                                        <span className="text-[10px] font-black text-primary">{name.charAt(0).toUpperCase()}</span>
                                                                    )}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="font-bold uppercase text-sm text-white tracking-widest">{name}</span>
                                                                    <span className="text-[9px] font-mono text-gray-600">ID: {(u._id || '').slice(-8).toUpperCase()}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-6">
                                                            <span className="text-[11px] font-mono text-white/70">{u.email}</span>
                                                        </td>
                                                        <td className="py-6">
                                                            <span className="text-[11px] font-mono text-white/70">{u.phone || '-'}</span>
                                                        </td>
                                                        <td className="py-6">
                                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 border ${u.role === 'admin' ? 'border-accent/40 text-accent' : 'border-primary/30 text-white/70'}`}>
                                                                {u.role || 'user'}
                                                            </span>
                                                        </td>
                                                        <td className="py-6 pr-8 text-right">
                                                            <span className="text-[10px] font-mono text-gray-500 uppercase">
                                                                {created ? created.toLocaleDateString() : '-'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {(!users || users.length === 0) && (
                                                <tr>
                                                    <td colSpan={5} className="py-20 text-center text-gray-700 text-[10px] font-black uppercase tracking-[0.5em]">No operatives found</td>
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
            < style > {`
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
            `}</style >
        </div >
    );
};

export default AdminDashboard;
