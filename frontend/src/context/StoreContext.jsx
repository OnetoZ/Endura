
import React, { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext(undefined);

const INITIAL_PRODUCTS = [
    { id: '1', name: 'Ghost Core Tee', price: 2499, category: 'Apparel', type: 'physical', subcategory: 'T-Shirt', image: '/collections img/Ghost_Boxy_Oversized_Tshirt_front.webp', description: 'Engineered for performance. 100% premium heavy-duty cotton.', stock: 50 },
    { id: '2', name: 'Cyberpunk Skin Pack', price: 899, category: 'Digital', type: 'digital', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800', description: 'Exclusive in-game assets for Project Endura universe.' },
    { id: '3', name: 'Dracon Cargo 01', price: 4500, category: 'Apparel', type: 'physical', subcategory: 'Pants', image: '/collections img/Dracon_Unisex_Straight_Fit_Baggy_Pants_front.webp', description: 'Tactical aesthetics with high durability zippers.', stock: 30 },
    { id: '4', name: 'Pierce Black Hoodie', price: 3200, category: 'Apparel', type: 'physical', subcategory: 'Hoodie', image: '/collections img/Pierce_Black_Boxy-Oversized_Hoodie_front.webp', description: 'Oversized fit with reflective print.', stock: 20 },
    { id: '5', name: 'Music Asset Pack Vol 1', price: 1200, category: 'Digital', type: 'digital', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800', description: 'Professional grade synthwave tracks for creators.' },
    { id: '6', name: 'Dissect Armor Vest', price: 5500, category: 'Apparel', type: 'physical', subcategory: 'Vest', image: '/collections img/Dissect_Black_Boxy_Unisex_Vest_front.webp', description: 'Lightweight tactical vest with modular attachments.', stock: 15 },
    { id: '7', name: 'Gnarl Tactical Vest', price: 5200, category: 'Apparel', type: 'physical', subcategory: 'Vest', image: '/collections img/Gnarl_Red_Boxy_Unisex_Vest_front.webp', description: 'Red accent tactical vest for high visibility operations.', stock: 25 },
    { id: '8', name: 'Blade Training Shorts', price: 1800, category: 'Apparel', type: 'physical', subcategory: 'Shorts', image: '/collections img/Blade_Black_Unisex_Shorts_front.webp', description: 'Breathable mesh shorts designed for high-intensity training.', stock: 40 },
    { id: '9', name: 'Zyra Stealth Shorts', price: 1950, category: 'Apparel', type: 'physical', subcategory: 'Shorts', image: '/collections img/Zyra_Black_Unisex_Shorts_front.webp', description: 'Deep black stealth shorts with reinforced stitching.', stock: 60 },
    { id: '10', name: 'Lean Alpha Hoodie', price: 3800, category: 'Apparel', type: 'physical', subcategory: 'Hoodie', image: '/collections img/Lean_Black_Boxy_Oversized_Hoodie_front.webp', description: 'Minimalist boxy hoodie for a sharp silhouette.', stock: 20 },
    { id: '11', name: 'Kayla Boxy Vest', price: 4800, category: 'Apparel', type: 'physical', subcategory: 'Vest', image: '/collections img/Kayla_Unisex_White_Boxy_Vest_front.webp', description: 'Premium white boxy vest with tactical webbing.', stock: 15 },
    { id: '12', name: 'Obsess Grey Vest', price: 4900, category: 'Apparel', type: 'physical', subcategory: 'Vest', image: '/collections img/Obsess_Grey_Unisex_Boxy_Vest_front.webp', description: 'Tonal grey vest for urban camouflage.', stock: 15 },
    { id: '13', name: 'Zenith Tech Tee', price: 2600, category: 'Apparel', type: 'physical', subcategory: 'T-Shirt', image: '/collections img/Whisk_6c9b9a0f7c33940bdb14af3dc5b5ca60dr.png', description: 'High-tech synthetic fabric for ultimate comfort.', stock: 35 },
];

export const AppProvider = ({ children }) => {
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [currentUser, setCurrentUser] = useState(null);
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([
        {
            id: 'ORD-1723467',
            userId: 'user_001',
            items: [
                { name: 'Ghost Core Tee', quantity: 2, price: 2499 },
                { name: 'Cyberpunk Skin Pack', quantity: 1, price: 899 }
            ],
            total: 5897,
            status: 'paid',
            trackingStatus: 'In Transit - Dimension Gate Alpha',
            creditsEarned: 589,
            creditsUsed: 200,
            createdAt: '2026-02-15T10:30:00Z'
        },
        {
            id: 'ORD-1723468',
            userId: 'user_002',
            items: [
                { name: 'Dracon Cargo 01', quantity: 1, price: 4500 },
                { name: 'Pierce Black Hoodie', quantity: 1, price: 3200 }
            ],
            total: 7700,
            status: 'processing',
            trackingStatus: 'Scanning Dimension...',
            creditsEarned: 770,
            creditsUsed: 500,
            createdAt: '2026-02-16T14:22:00Z'
        },
        {
            id: 'ORD-1723469',
            userId: 'user_003',
            items: [
                { name: 'Music Asset Pack Vol 1', quantity: 2, price: 1200 },
                { name: 'Dissect Armor Vest', quantity: 1, price: 5500 }
            ],
            total: 7900,
            status: 'paid',
            trackingStatus: 'Delivered - Quantum Node 7',
            creditsEarned: 790,
            creditsUsed: 300,
            createdAt: '2026-02-14T09:15:00Z'
        },
        {
            id: 'ORD-1723470',
            userId: 'user_004',
            items: [
                { name: 'Gnarl Tactical Vest', quantity: 1, price: 5200 }
            ],
            total: 5200,
            status: 'processing',
            trackingStatus: 'Packaging - Zero-G Facility',
            creditsEarned: 520,
            creditsUsed: 150,
            createdAt: '2026-02-17T08:45:00Z'
        }
    ]);
    const [vaultItems, setVaultItems] = useState([
        { id: 'v1', name: 'Neon Samurai Skin', locked: true, image: 'https://images.unsplash.com/photo-1614728263952-84ea206f2c41?auto=format&fit=crop&q=80&w=800', code: 'ENDURA2026' },
        { id: 'v2', name: 'Void Walker Cape', locked: true, image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800', code: 'VOID99' },
        { id: 'v3', name: 'Quantum Blade', locked: false, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800', code: 'QUANTUM42' },
        { id: 'v4', name: 'Plasma Shield', locked: false, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800', code: 'SHIELD77' }
    ]);
    const [users, setUsers] = useState([
        { id: 'user_001', name: 'Alex Chen', email: 'alex.chen@endura.com', role: 'user' },
        { id: 'user_002', name: 'Sarah Williams', email: 'sarah.w@endura.com', role: 'user' },
        { id: 'user_003', name: 'Marcus Johnson', email: 'marcus.j@endura.com', role: 'user' },
        { id: 'user_004', name: 'Elena Rodriguez', email: 'elena.r@endura.com', role: 'user' },
        { id: 'user_005', name: 'David Kim', email: 'david.kim@endura.com', role: 'user' },
        { id: 'user_006', name: 'Zara Ahmed', email: 'zara.a@endura.com', role: 'user' },
        { id: 'user_007', name: 'Tom Wilson', email: 'tom.w@endura.com', role: 'user' },
        { id: 'user_008', name: 'Lisa Park', email: 'lisa.p@endura.com', role: 'user' }
    ]);

    // Local storage persistence simulation
    useEffect(() => {
        const savedUser = localStorage.getItem('endura_user');
        if (savedUser) setCurrentUser(JSON.parse(savedUser));

        const savedCart = localStorage.getItem('endura_cart');
        if (savedCart) setCart(JSON.parse(savedCart));

        const savedVault = localStorage.getItem('endura_vault');
        if (savedVault) setVaultItems(JSON.parse(savedVault));
    }, []);

    const login = (email, role, name = null) => {
        const user = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            name: name || email.split('@')[0],
            role,
            credits: 500,
            operatorRank: role === 'admin' ? 'Master' : 'Initiate'
        };
        setCurrentUser(user);
        localStorage.setItem('endura_user', JSON.stringify(user));
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('endura_user');
    };

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            const newCart = [...prev, { ...product, quantity: 1 }];
            localStorage.setItem('endura_cart', JSON.stringify(newCart));
            return newCart;
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => {
            const newCart = prev.filter(item => item.id !== productId);
            localStorage.setItem('endura_cart', JSON.stringify(newCart));
            return newCart;
        });
    };

    const updateCartQuantity = (productId, delta) => {
        setCart(prev => {
            const newCart = prev.map(item => {
                if (item.id === productId) {
                    const newQty = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQty };
                }
                return item;
            });
            localStorage.setItem('endura_cart', JSON.stringify(newCart));
            return newCart;
        });
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('endura_cart');
    };

    const placeOrder = (creditsToUse) => {
        if (!currentUser) return;
        const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const total = subtotal - creditsToUse;
        const creditsEarned = Math.floor(total * 0.1);

        const newOrder = {
            id: `ORD-${Date.now()}`,
            userId: currentUser.id,
            items: [...cart],
            total,
            status: 'processing',
            trackingStatus: 'Scanning Dimension...',
            creditsEarned,
            creditsUsed: creditsToUse,
            createdAt: new Date().toISOString(),
        };

        const updatedOrders = [newOrder, ...orders];
        setOrders(updatedOrders);

        // Update user credits
        const updatedUser = {
            ...currentUser,
            credits: currentUser.credits - creditsToUse + creditsEarned
        };
        setCurrentUser(updatedUser);
        localStorage.setItem('endura_user', JSON.stringify(updatedUser));
        clearCart();
    };

    const unlockVaultItem = (id, code) => {
        const item = vaultItems.find(i => i.id === id);
        if (item && item.code === code) {
            const updatedVault = vaultItems.map(i => i.id === id ? { ...i, locked: false } : i);
            setVaultItems(updatedVault);
            localStorage.setItem('endura_vault', JSON.stringify(updatedVault));
            return true;
        }
        return false;
    };

    const addProduct = (p) => setProducts(prev => [p, ...prev]);
    const removeProduct = (id) => setProducts(prev => prev.filter(p => p.id !== id));

    return (
        <StoreContext.Provider value={{
            products, currentUser, cart, orders, vaultItems, users,
            login, logout, addToCart, removeFromCart, updateCartQuantity, clearCart, placeOrder,
            addProduct, removeProduct, unlockVaultItem
        }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) throw new Error('useStore must be used within AppProvider');
    return context;
};
