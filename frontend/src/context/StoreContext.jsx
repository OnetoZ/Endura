
import React, { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext(undefined);

const INITIAL_PRODUCTS = [
    { id: '1', name: 'Alpha Core Tee', price: 2499, category: 'Apparel', type: 'physical', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800', description: 'Engineered for performance. 100% premium heavy-duty cotton.', stock: 50 },
    { id: '2', name: 'Cyberpunk Skin Pack', price: 899, category: 'Digital', type: 'digital', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800', description: 'Exclusive in-game assets for Project Endura universe.' },
    { id: '3', name: 'Endura Cargo 01', price: 4500, category: 'Apparel', type: 'physical', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800', description: 'Tactical aesthetics with high durability zippers.', stock: 30 },
    { id: '4', name: 'Vortex Hoodie', price: 3200, category: 'Apparel', type: 'physical', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800', description: 'Oversized fit with reflective print.', stock: 20 },
    { id: '5', name: 'Music Asset Pack Vol 1', price: 1200, category: 'Digital', type: 'digital', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800', description: 'Professional grade synthwave tracks for creators.' },
];

export const AppProvider = ({ children }) => {
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [currentUser, setCurrentUser] = useState(() => {
        const saved = localStorage.getItem('endura_user');
        return saved ? JSON.parse(saved) : null;
    });
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('endura_cart');
        return saved ? JSON.parse(saved) : [];
    });
    const [orders, setOrders] = useState([]);
    const [vaultItems, setVaultItems] = useState(() => {
        const saved = localStorage.getItem('endura_vault');
        return saved ? JSON.parse(saved) : [
            { id: 'v1', name: 'Neon Samurai Skin', locked: true, image: 'https://images.unsplash.com/photo-1614728263952-84ea206f2c41?auto=format&fit=crop&q=80&w=800', code: 'ENDURA2026' },
            { id: 'v2', name: 'Void Walker Cape', locked: true, image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800', code: 'VOID99' },
        ];
    });

    // Subscriptions for updates (Sync state across tabs if needed, though mostly for set state logic)
    useEffect(() => {
        if (currentUser) localStorage.setItem('endura_user', JSON.stringify(currentUser));
        else localStorage.removeItem('endura_user');
    }, [currentUser]);

    useEffect(() => {
        localStorage.setItem('endura_cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('endura_vault', JSON.stringify(vaultItems));
    }, [vaultItems]);

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
            products, currentUser, cart, orders, vaultItems,
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
