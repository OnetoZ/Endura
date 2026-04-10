import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { assetService, userService, uploadService, getImageUrl, orderService, vaultService } from '../services/api';
import { toast } from 'react-hot-toast';
import { useStore } from '../context/StoreContext';
import Collections from './Collections';

const CATEGORY_STYLES = {
    common: { border: '#a3a3a3', glow: '#a3a3a355', label: 'COMMON' },
    rare: { border: '#3b82f6', glow: '#3b82f655', label: 'RARE' },
    epic: { border: '#eab308', glow: '#eab30855', label: 'EPIC' },
    legendary: { border: '#a855f7', glow: '#a855f755', label: 'LEGENDARY' },
};



const INITIAL_PRODUCT_STATE = {
    name: '',
    description: '',
    price: '',
    stock: '',
    image: '',
    backImage: '',
    additionalImages: [],
    digitalTwinImage: '',
    type: 'Common', // Default remains 'Common' for backward compatibility
    shortAtmosphericLine: '',
    sizes: { S: 0, M: 0, L: 0, XL: 0 }
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { currentUser, setCurrentUser, products, setAssets } = useStore();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isAdding, setIsAdding] = useState(false);
    const [isSavingProduct, setIsSavingProduct] = useState(false);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [vaultItems, setVaultItems] = useState([]);

    // ── Vault Cards ────────────────────────────────────────────────────────
    const [vaultCards, setVaultCards] = useState([]);
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [cardSaving, setCardSaving] = useState(false);
    const [editingCardId, setEditingCardId] = useState(null);
    const [newCard, setNewCard] = useState({
        name: '', description: '', frontImage: '', backImage: '', tier: 'common'
    });

    // ── Order Details ──────────────────────────────────────────────────────
    const [viewingOrder, setViewingOrder] = useState(null);

    // ── Filters & Search ───────────────────────────────────────────────────
    const [userSearch, setUserSearch] = useState('');
    const [productSearch, setProductSearch] = useState('');
    const [orderFilter, setOrderFilter] = useState('All');



    useEffect(() => {
        if (viewingOrder) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [viewingOrder]);

    const verifyAndLoad = useCallback(async () => {
        console.log('🚀 [ADMIN] Initializing Security Clearance...');

        // Phase 1: Verify current user profile (Quickest)
        try {
            const userData = await userService.getCurrentUser();
            setCurrentUser(userData);
            setIsAuthLoading(false); // Clear loading screen as soon as we have a profile
        } catch (error) {
            console.error('❌ [ADMIN] Auth Failure:', error);
            setIsAuthLoading(false); // Clear screen anyway to show 'Access Denied' if needed
        }

        // Phase 2: Hydrate background data
        const loadData = async () => {
            try {
                const [productsData, ordersData, usersData, cardsData, vaultData] = await Promise.all([
                    assetService.getAssets().catch(e => ({ products: [] })),
                    orderService.getAllOrders().catch(e => []),
                    userService.getUsers().catch(e => []),
                    vaultService.getVaultCards().catch(e => []),
                    vaultService.getVaultItems().catch(e => [])
                ]);

                setAssets(Array.isArray(productsData) ? productsData : (productsData.products || []));
                setOrders(ordersData || []);
                setUsers(usersData || []);
                setVaultCards(cardsData || []);
                setVaultItems(vaultData || []);
            } catch (error) {
                console.error('❌ [ADMIN] Background Hydration Failure:', error);
            }
        };

        await loadData();
    }, [setCurrentUser]);

    // Initial load + Global Sync Listener
    useEffect(() => {
        verifyAndLoad();

        const handleGlobalRefresh = () => verifyAndLoad();
        window.addEventListener('endura_admin_refresh', handleGlobalRefresh);
        return () => window.removeEventListener('endura_admin_refresh', handleGlobalRefresh);
    }, [verifyAndLoad]);

    // ── Products ──────────────────────────────────────────────────────────
    const [newProduct, setNewProduct] = useState(INITIAL_PRODUCT_STATE);
    const [editingProductId, setEditingProductId] = useState(null);

    // ── Recent Activity Logic ──────────────────────────────────────────────
    const recentActivities = useMemo(() => {
        const activities = [];

        // Products
        products.forEach(p => {
            activities.push({
                type: 'product',
                action: 'Product Added',
                time: new Date(p.createdAt || Date.now()),
                detail: p.name,
                id: p._id || p.id
            });
        });

        // Orders
        orders.forEach(o => {
            activities.push({
                type: 'order',
                action: o.status === 'Processing' ? 'New Order' : `Order ${o.status}`,
                time: new Date(o.createdAt || Date.now()),
                detail: `Order #${(o._id || o.id || '').slice(-6)} - ₹${o.totalAmount}`,
                id: o._id || o.id
            });
        });

        // Users
        users.forEach(u => {
            activities.push({
                type: 'user',
                action: 'User Joined',
                time: new Date(u.createdAt || Date.now()),
                detail: u.username || u.email,
                id: u._id || u.id
            });
        });

        return activities
            .filter(a => a.time)
            .sort((a, b) => b.time - a.time)
            .slice(0, 10);
    }, [products, orders, users]);


    // Show premium loader while profile is being fetched
    if (isAuthLoading) {
        return (
            <div className="fixed inset-0 z-[300] bg-black/20 backdrop-blur-md flex flex-col items-center justify-center gap-8">
                <div className="relative w-32 h-32">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-4 border border-accent/30 rounded-full animate-[ping_2s_infinite]"></div>
                    <div className="absolute inset-0 flex items-center justify-center font-oswald text-4xl font-bold text-primary">E</div>
                </div>
                <div className="text-center">
                    <p className="text-[12px] font-black uppercase tracking-[0.5em] text-white mb-2">Verifying Protocol Clearance</p>
                    <div className="h-1 w-48 bg-white/5 rounded-full overflow-hidden mx-auto">
                        <div className="h-full bg-primary w-1/2 animate-[shimmer_2s_infinite_ease-in-out]"></div>
                    </div>
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
            const totalStock = Object.values(newProduct.sizes || { S: 0, M: 0, L: 0, XL: 0 })
                .reduce((acc, val) => acc + (Number(val) || 0), 0);
                
            const productData = {
                ...newProduct,
                images: [newProduct.image, newProduct.backImage, newProduct.digitalTwinImage, ...newProduct.additionalImages],
                price: Number(newProduct.price),
                stock: totalStock > 0 ? totalStock : Number(newProduct.stock)
            };

            if (editingProductId) {
                const updated = await assetService.updateAsset(editingProductId, productData);
                setAssets(prev => prev.map(p => {
                    const idToMatch = p._id || p.id;
                    const resultId = updated._id || updated.id || updated.product?._id || updated.product?.id;
                    return idToMatch === editingProductId ? (updated.product || updated) : p;
                }));
                toast.success('Product updated successfully!');
            } else {
                const created = await assetService.createAsset(productData);
                setAssets(prev => [created.product || created, ...prev]);
                toast.success('Product added successfully!');
            }

            // Reload removed since state is updated manually for seamless UX
            // setTimeout(() => window.location.reload(), 1500);

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
            type: product.type || 'Common',
            shortAtmosphericLine: product.shortAtmosphericLine || ''
        });
        setIsAdding(true);
    };

    const handleResetForm = () => {
        setNewProduct(INITIAL_PRODUCT_STATE);
        setEditingProductId(null);
        setIsAdding(false);
    };

    const handleVaultCardSave = async (e) => {
        e.preventDefault();
        if (!newCard.frontImage || !newCard.backImage) {
            toast.error('Both images are required');
            return;
        }
        setCardSaving(true);
        try {
            if (editingCardId) {
                const updated = await vaultService.updateVaultCard(editingCardId, newCard);
                setVaultCards(prev => prev.map(c => (c._id === editingCardId ? updated : c)));
                toast.success('Card updated!');
            } else {
                const created = await vaultService.createVaultCard(newCard);
                setVaultCards(prev => [created, ...prev]);
                toast.success('Card created!');
            }
            setNewCard({ name: '', description: '', frontImage: '', backImage: '', tier: 'common' });
            setEditingCardId(null);
            setIsAddingCard(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save card');
        } finally {
            setCardSaving(false);
        }
    };

    const handleDeleteCard = async (id) => {
        if (!window.confirm('Confirm deletion of this archived asset?')) return;
        try {
            await vaultService.deleteVaultCard(id);
            setVaultCards(prev => prev.filter(c => c._id !== id));
            toast.success('Asset purged from archive');
        } catch (error) {
            toast.error('Purge failed');
        }
    };

    const handleEditCard = (card) => {
        setNewCard({
            name: card.name,
            description: card.description || '',
            frontImage: card.frontImage,
            backImage: card.backImage,
            tier: card.tier || 'common'
        });
        setEditingCardId(card._id);
        setIsAddingCard(true);
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you certain you wish to purge this product?')) return;
        try {
            await assetService.deleteAsset(id);
            setAssets(prev => prev.filter(p => (p._id || p.id) !== id));
            toast.success('Product purged from database.');
        } catch (error) {
            console.error('Failed to delete product:', error);
            toast.error(error?.response?.data?.message || 'Failed to delete product');
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await orderService.updateOrderStatus(orderId, newStatus);
            setOrders(prev => prev.map(o => (o._id || o.id) === orderId ? { ...o, status: newStatus } : o));
            if (viewingOrder && (viewingOrder._id || viewingOrder.id) === orderId) {
                setViewingOrder(prev => ({ ...prev, status: newStatus }));
            }
            toast.success(`Order status updated to ${newStatus}`);
        } catch (error) {
            console.error('Failed to update status:', error);
            toast.error('Failed to update status');
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
            {/* Order Details Modal Overlay */}
            {viewingOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setViewingOrder(null)}></div>
                    <div className="relative w-full max-w-4xl max-h-[90vh] bg-neutral-900 border border-white/10 overflow-y-auto animate-in fade-in zoom-in-95 duration-300">
                        {/* Header */}
                        <div className="sticky top-0 z-10 glass border-b border-white/10 p-6 flex justify-between items-center bg-neutral-900/80 backdrop-blur-xl">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1 block">Protocol: Detailed Intel</span>
                                <h2 className="text-2xl font-oswald font-bold uppercase tracking-tight">Order #{(viewingOrder._id || viewingOrder.id || '').slice(-8)}</h2>
                            </div>
                            <button
                                onClick={() => setViewingOrder(null)}
                                className="w-10 h-10 flex items-center justify-center border border-white/10 text-gray-500 hover:text-white hover:border-white/30 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-8 space-y-12">
                            {/* Top Grid: User & Status */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 border-b border-white/5 pb-2">Customer Identity</h4>
                                    <div className="space-y-3">
                                        <p className="text-lg font-bold uppercase tracking-tight">{viewingOrder.user?.username || viewingOrder.shippingAddress?.name || 'Unknown'}</p>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-xs">
                                                <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                <span className="text-primary font-bold lowercase">{viewingOrder.user?.email || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs">
                                                <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded font-mono text-white text-[11px]">
                                                    {viewingOrder.shippingAddress?.phone || viewingOrder.user?.phone || 'NO_CONTACT_DATA'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 border-b border-white/5 pb-2">Shipping Intel</h4>
                                    <div className="text-xs text-gray-400 space-y-1 font-medium leading-relaxed uppercase">
                                        <p className="text-white font-bold">{viewingOrder.shippingAddress?.address}</p>
                                        <p>{viewingOrder.shippingAddress?.city}, {viewingOrder.shippingAddress?.postalCode}</p>
                                        <p>{viewingOrder.shippingAddress?.country}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 border-b border-white/5 pb-2">Order Lifecycle</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[9px] font-bold text-gray-600 uppercase">Current Status</span>
                                            <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border ${viewingOrder.status === 'Confirmed' ? 'border-primary/50 text-primary' : 'border-yellow-500/50 text-yellow-500'}`}>
                                                {viewingOrder.status}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'].map(status => (
                                                <button
                                                    key={status}
                                                    onClick={() => handleUpdateStatus(viewingOrder._id || viewingOrder.id, status)}
                                                    className={`px-3 py-1.5 text-[8px] font-black uppercase tracking-widest transition-all border ${viewingOrder.status === status ? 'bg-white text-black border-white' : 'border-white/10 text-gray-500 hover:border-white/30'}`}
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Section */}
                            <div className="glass border-white/5 p-6 bg-white/[0.02]">
                                <div className="flex flex-wrap items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Financial Clearance</p>
                                            <p className="text-sm font-bold uppercase">{viewingOrder.paymentMethod} // {viewingOrder.paymentStatus || 'UNPAID'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Total Transaction</p>
                                        <p className="text-2xl font-oswald font-bold text-accent tracking-tighter">₹{viewingOrder.totalAmount}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Items List */}
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 border-b border-white/5 pb-2">Acquired Assets</h4>
                                <div className="space-y-4">
                                    {viewingOrder.items?.map((item, idx) => (
                                        <div key={idx} className="flex flex-col md:flex-row items-center gap-6 p-4 border border-white/5 hover:bg-white/[0.02] transition-all group">
                                            <div className="w-20 h-20 bg-neutral-800 border border-white/10 shrink-0 overflow-hidden">
                                                <img
                                                    src={getImageUrl(item.image)}
                                                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800' }}
                                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                                    alt={item.name}
                                                />
                                            </div>
                                            <div className="flex-1 text-center md:text-left">
                                                <p className="text-sm font-black uppercase tracking-widest group-hover:text-primary transition-colors">{item.name}</p>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-tight mt-1">Edition: #{item.editionNumber || 'GENESIS'} {item.size ? `// Size: ${item.size}` : ''}</p>
                                            </div>
                                            <div className="flex gap-12 text-center md:text-right">
                                                <div>
                                                    <p className="text-[10px] text-gray-600 uppercase font-black mb-1">Unit Val</p>
                                                    <p className="text-sm font-bold">₹{item.price}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-600 uppercase font-black mb-1">Qty</p>
                                                    <p className="text-sm font-bold">x{item.quantity}</p>
                                                </div>
                                                <div className="hidden md:block">
                                                    <p className="text-[10px] text-primary uppercase font-black mb-1">Subtotal</p>
                                                    <p className="text-sm font-bold text-primary">₹{item.price * item.quantity}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="sticky bottom-0 z-10 glass border-t border-white/10 p-6 flex justify-end bg-neutral-900/80 backdrop-blur-xl">
                            <button
                                onClick={() => setViewingOrder(null)}
                                className="px-10 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary transition-all"
                            >
                                Close Intel
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
                            { id: 'collections', label: 'Collections', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
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
                            <div className="lg:col-span-3 glass border-white/5 p-8 mt-4 overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                <h3 className="text-xl font-oswald font-bold uppercase mb-8 flex items-center gap-3 relative z-10">
                                    <span className="w-1.5 h-6 bg-primary"></span>
                                    Recent Activity
                                </h3>
                                <div className="space-y-4 relative z-10">
                                    {recentActivities.length === 0 ? (
                                        <div className="py-10 text-center text-gray-600 text-[10px] font-black uppercase tracking-widest">No recent activity detected</div>
                                    ) : (
                                        recentActivities.map((log, i) => {
                                            const typeColors = {
                                                product: 'text-blue-400',
                                                order: 'text-primary',
                                                user: 'text-purple-400'
                                            };
                                            const typeGlows = {
                                                product: 'group-hover:border-blue-500/50',
                                                order: 'group-hover:border-primary/50',
                                                user: 'group-hover:border-purple-500/50'
                                            };

                                            return (
                                                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between py-5 border-b border-white/5 hover:bg-white/[0.02] px-4 transition-all group">
                                                    <div className="flex items-center gap-6 mb-2 md:mb-0">
                                                        <div className={`flex flex-col items-center justify-center min-w-[70px] py-2 px-3 bg-white/5 border border-white/10 ${typeGlows[log.type] || 'group-hover:border-primary/30'} transition-colors`}>
                                                            <span className="text-[14px] font-black text-white leading-none">{new Date(log.time).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                                                            <span className={`text-[8px] font-bold ${typeColors[log.type] || 'text-primary'} uppercase tracking-tighter mt-1`}>{new Date(log.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className={`text-[12px] font-black uppercase text-white tracking-widest ${typeColors[log.type] ? `group-hover:${typeColors[log.type]}` : 'group-hover:text-primary'} transition-colors`}>{log.action}</span>
                                                            <span className="text-[10px] text-gray-500 uppercase tracking-tight">{log.detail}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-[9px] font-mono text-gray-600 uppercase">
                                                            {(() => {
                                                                const diff = (new Date() - new Date(log.time)) / 1000;
                                                                if (diff < 60) return 'Just now';
                                                                if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
                                                                if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
                                                                return `${Math.floor(diff / 86400)}d ago`;
                                                            })()}
                                                        </span>
                                                        <div className={`w-8 h-px bg-white/10 group-hover:w-16 transition-all hidden md:block ${typeColors[log.type] ? `group-hover:bg-${typeColors[log.type].replace('text-', '')}` : 'group-hover:bg-primary'}`}></div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
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
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Global Stock</label>
                                                        <input
                                                            type="number"
                                                            className="w-full bg-white/5 border border-white/10 p-4 text-sm font-bold uppercase tracking-widest text-white outline-none focus:border-primary transition-all opacity-50"
                                                            value={Object.values(newProduct.sizes || {}).reduce((acc, val) => acc + (Number(val) || 0), 0) || newProduct.stock}
                                                            readOnly
                                                            placeholder="TOTAL_QUANTITY"
                                                        />
                                                    </div>
                                                    <div className="space-y-3 pt-2">
                                                        <label className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Inventory By Size</label>
                                                        <div className="grid grid-cols-4 gap-3">
                                                            {['S', 'M', 'L', 'XL'].map(size => (
                                                                <div key={size} className="space-y-1.5 text-center">
                                                                    <div className="text-[8px] font-black text-gray-500 uppercase">{size}</div>
                                                                    <input
                                                                        type="number"
                                                                        className="w-full bg-white/5 border border-white/10 p-2 text-center text-xs font-bold text-white outline-none focus:border-primary transition-all"
                                                                        value={newProduct.sizes?.[size] || 0}
                                                                        onChange={e => setNewProduct({
                                                                            ...newProduct,
                                                                            sizes: { ...newProduct.sizes, [size]: e.target.value }
                                                                        })}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
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
                                                        className="w-full bg-black border border-white/10 p-4 text-xs font-bold uppercase tracking-widest text-primary outline-none focus:border-primary transition-all"
                                                        value={newProduct.type}
                                                        onChange={e => setNewProduct({ ...newProduct, type: e.target.value })}
                                                    >
                                                        <option value="Common">Common</option>
                                                        <option value="Rare">Rare</option>
                                                        <option value="Epic">Epic</option>
                                                        <option value="Legendary">Legendary</option>
                                                        <option value="Physical">Physical</option>
                                                        <option value="Digital Twin">Digital Twin</option>
                                                        <option value="Digital">Digital</option>
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
                                        {products.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="py-20 text-center text-gray-600 text-[10px] font-black uppercase tracking-[0.4em]">No products detected in archive</td>
                                            </tr>
                                        ) : (
                                            products.filter(p => {
                                                if (!productSearch) return true;
                                                const name = p.name || '';
                                                return name.toLowerCase().includes(productSearch.toLowerCase());
                                            }).map(p => (
                                                <tr key={p._id || p.id} className="group hover:bg-white/5 transition-all">
                                                    <td className="py-6 font-mono text-xs text-gray-600">#{(p._id || p.id || '').slice(-6)}</td>
                                                    <td className="py-6">
                                                        <div className="flex gap-4 items-center">
                                                            <div className="flex flex-col items-center gap-1">
                                                                <img
                                                                    src={getImageUrl(p.images?.[0] || p.image)}
                                                                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800' }}
                                                                    className="w-10 h-10 object-cover grayscale group-hover:grayscale-0 transition-all border border-white/10"
                                                                    alt="Physical"
                                                                />
                                                                <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest">Physical</span>
                                                            </div>
                                                            <div className="flex flex-col items-center gap-1">
                                                                <img
                                                                    src={getImageUrl(p.images?.[2] || p.digitalTwinImage)}
                                                                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800' }}
                                                                    className="w-10 h-10 object-cover border border-accent/30 p-0.5"
                                                                    alt="Digital Twin"
                                                                />
                                                                <span className="text-[8px] text-accent uppercase font-black tracking-widest">Digital Twin</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-6">
                                                        <p className="font-bold uppercase tracking-tight">{p.name}</p>
                                                        <p className="text-accent font-mono text-[10px]">₹{p.price}</p>
                                                    </td>
                                                    <td className="py-6">
                                                        <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border border-${p.type === 'Legendary' ? 'purple-500' : 'primary'}/30 text-white/70`}>
                                                            {p.type || p.faction}
                                                        </span>
                                                    </td>
                                                    <td className="py-6 font-mono text-xs">{p.stock || '∞'}</td>
                                                    <td className="py-6 text-right space-x-4">
                                                        <button onClick={() => handleEditClick(p)} className="text-gray-500 hover:text-white text-[9px] font-black uppercase">Edit</button>
                                                        <button onClick={() => handleDeleteProduct(p._id || p.id)} className="text-red-500 hover:text-white text-[9px] font-black uppercase">Delete</button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
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
                                        <option value="Pending">Pending</option>
                                        <option value="Confirmed">Confirmed</option>
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
                                                <tr key={o._id || o.id} className="group hover:bg-white/5 transition-all">
                                                    <td className="py-6 font-mono text-xs text-gray-500">#{(o._id || o.id || '').slice(-6)}</td>
                                                    <td className="py-6 uppercase font-bold text-xs">
                                                        {o.user?.username || 'Unknown'} <br />
                                                        <span className="text-[8px] text-gray-500 font-normal lowercase">{o.user?.email}</span>
                                                    </td>
                                                    <td className="py-6">
                                                        {o.items?.map((item, i) => (
                                                            <p key={i} className="text-[10px] text-gray-400 uppercase font-black">{item.name} {item.size ? `[${item.size}]` : ''} x{item.quantity}</p>
                                                        ))}
                                                        <p className="text-[10px] text-accent mt-1 font-mono">₹{o.totalAmount}</p>
                                                    </td>
                                                    <td className="py-6">
                                                        <span className={`font-mono text-[10px] px-2 py-1 border ${o.paymentStatus === 'paid' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                                                            {o.paymentMethod}: {o.paymentStatus?.toUpperCase() || 'PENDING'}
                                                        </span>
                                                    </td>
                                                    <td className="py-6">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${o.status === 'Confirmed' || o.status === 'Delivered' ? 'bg-primary' : 'bg-yellow-500'}`}></div>
                                                            <span className="text-[9px] font-black uppercase tracking-widest">{o.status}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-6 text-right">
                                                        <button
                                                            onClick={() => setViewingOrder(o)}
                                                            className="px-4 py-2 bg-primary/20 text-primary text-[8px] font-black uppercase hover:bg-primary hover:text-black transition-all"
                                                        >
                                                            View Details
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'collections' && (
                        <div className="animate-in fade-in duration-500">
                             <Collections />
                        </div>
                    )}

                    {activeTab === 'vault' && (
                        <div className="animate-in fade-in duration-500">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-4">
                                <div>
                                    <h3 className="text-2xl font-oswald font-bold uppercase tracking-tight">Vault Management</h3>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em]">Configure administrative collectible templates</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsAddingCard(!isAddingCard);
                                        if (!isAddingCard) {
                                            setNewCard({ name: '', description: '', frontImage: '', backImage: '', category: 'common' });
                                            setEditingCardId(null);
                                        }
                                    }}
                                    className={`px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${isAddingCard ? 'bg-white text-black' : 'bg-primary text-white shadow-lg shadow-primary/20'}`}
                                >
                                    {isAddingCard ? 'Cancel Action' : 'Deploy New Asset'}
                                </button>
                            </div>

                            {/* Add/Edit Form */}
                            <AnimatePresence>
                                {isAddingCard && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden mb-12"
                                    >
                                        <div className="glass border-primary/20 p-8 bg-primary/[0.02]">
                                            <form onSubmit={handleVaultCardSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                                <div className="space-y-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Asset Name</label>
                                                        <input
                                                            className="w-full bg-black/50 border border-white/10 p-4 text-sm font-bold uppercase text-white outline-none focus:border-primary"
                                                            value={newCard.name}
                                                            onChange={e => setNewCard({ ...newCard, name: e.target.value })}
                                                            placeholder="ASSET_IDENTIFIER"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Asset Class</label>
                                                        <select
                                                            className="w-full bg-black/50 border border-white/10 p-4 text-sm font-bold uppercase text-white outline-none focus:border-primary"
                                                            value={newCard.tier}
                                                            onChange={e => setNewCard({ ...newCard, tier: e.target.value })}
                                                        >
                                                            <option value="common">Common</option>
                                                            <option value="rare">Rare</option>
                                                            <option value="epic">Epic</option>
                                                            <option value="legendary">Legendary</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Front Image (Tarot)</label>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="w-full bg-black/50 border border-white/10 p-4 text-[10px] text-gray-500 file:bg-primary file:border-0 file:text-white file:px-4 file:py-1 file:uppercase file:font-black file:text-[9px] cursor-pointer"
                                                            onChange={e => handleCardImageUpload(e, 'frontImage')}
                                                        />
                                                        {newCard.frontImage && <p className="text-[8px] text-accent mt-1 uppercase">Link: {newCard.frontImage.slice(-20)}</p>}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Back Image (Product)</label>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="w-full bg-black/50 border border-white/10 p-4 text-[10px] text-gray-500 file:bg-primary file:border-0 file:text-white file:px-4 file:py-1 file:uppercase file:font-black file:text-[9px] cursor-pointer"
                                                            onChange={e => handleCardImageUpload(e, 'backImage')}
                                                        />
                                                        {newCard.backImage && <p className="text-[8px] text-accent mt-1 uppercase">Link: {newCard.backImage.slice(-20)}</p>}
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Description</label>
                                                        <textarea
                                                            className="w-full bg-black/50 border border-white/10 p-4 text-sm font-bold uppercase text-white outline-none focus:border-primary h-[85px]"
                                                            value={newCard.description}
                                                            onChange={e => setNewCard({ ...newCard, description: e.target.value })}
                                                            placeholder="ATMOSPHERIC_INTEL"
                                                        />
                                                    </div>
                                                    <button
                                                        disabled={cardSaving}
                                                        type="submit"
                                                        className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all"
                                                    >
                                                        {cardSaving ? 'Syncing...' : (editingCardId ? 'Update Asset' : 'Commit to Archive')}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Cards List */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {vaultCards.length === 0 ? (
                                    <div className="col-span-full py-20 text-center text-gray-600 text-[10px] font-black uppercase tracking-[0.4em] glass border-white/5">
                                        No assets detected in archive
                                    </div>
                                ) : (
                                    vaultCards.map(card => (
                                        <div key={card._id} className="glass border-white/10 overflow-hidden group">
                                            <div className="aspect-[3/4] relative overflow-hidden">
                                                <img
                                                    src={getImageUrl(card.frontImage)}
                                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                                    alt={card.name}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                                                <div className="absolute top-4 right-4">
                                                    <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest border border-white/20 bg-black/40 backdrop-blur-md text-white`}>
                                                        {card.tier || 'COMMON'}
                                                    </span>
                                                </div>
                                                <div className="absolute bottom-4 left-4 right-4">
                                                    <p className="text-sm font-black uppercase tracking-widest text-white truncate">{card.name}</p>
                                                    <p className="text-[8px] text-gray-400 uppercase tracking-tighter mt-1 truncate">{card.description || 'SECURE_ASSET'}</p>
                                                </div>
                                            </div>
                                            <div className="p-4 flex justify-between border-t border-white/5 bg-white/[0.02]">
                                                <button
                                                    onClick={() => handleEditCard(card)}
                                                    className="text-[9px] font-black uppercase text-gray-400 hover:text-primary transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCard(card._id)}
                                                    className="text-[9px] font-black uppercase text-red-500/50 hover:text-red-500 transition-colors"
                                                >
                                                    Purge
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
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
