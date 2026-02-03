
import React, { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext(undefined);

const INITIAL_PRODUCTS = [
    { id: '1', name: 'Alpha Core Tee', price: 2499, category: 'Apparel', type: 'physical', image: 'https://picsum.photos/seed/tee1/600/800', description: 'Engineered for performance. 100% premium heavy-duty cotton.', stock: 50 },
    { id: '2', name: 'Cyberpunk Skin Pack', price: 899, category: 'Digital', type: 'digital', image: 'https://picsum.photos/seed/digital1/600/800', description: 'Exclusive in-game assets for Project Endura universe.' },
    { id: '3', name: 'Endura Cargo 01', price: 4500, category: 'Apparel', type: 'physical', image: 'https://picsum.photos/seed/cargo/600/800', description: 'Tactical aesthetics with high durability zippers.', stock: 30 },
    { id: '4', name: 'Vortex Hoodie', price: 3200, category: 'Apparel', type: 'physical', image: 'https://picsum.photos/seed/hoodie/600/800', description: 'Oversized fit with reflective print.', stock: 20 },
    { id: '5', name: 'Music Asset Pack Vol 1', price: 1200, category: 'Digital', type: 'digital', image: 'https://picsum.photos/seed/music/600/800', description: 'Professional grade synthwave tracks for creators.' },
];

export const AppProvider = ({ children }) => {
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [currentUser, setCurrentUser] = useState(null);
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);

    // Local storage persistence simulation
    useEffect(() => {
        const savedUser = localStorage.getItem('endura_user');
        if (savedUser) setCurrentUser(JSON.parse(savedUser));

        const savedCart = localStorage.getItem('endura_cart');
        if (savedCart) setCart(JSON.parse(savedCart));
    }, []);

    const login = (email, role) => {
        const user = { id: Math.random().toString(36).substr(2, 9), email, name: email.split('@')[0], role, credits: 500 };
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
        const creditsEarned = Math.floor(total * 0.1); // 10% cash back in points

        const newOrder = {
            id: `ORD-${Date.now()}`,
            userId: currentUser.id,
            items: [...cart],
            total,
            status: 'completed',
            creditsEarned,
            creditsUsed: creditsToUse,
            createdAt: new Date().toISOString(),
        };

        setOrders([newOrder, ...orders]);

        // Update user credits
        const updatedUser = {
            ...currentUser,
            credits: currentUser.credits - creditsToUse + creditsEarned
        };
        setCurrentUser(updatedUser);
        localStorage.setItem('endura_user', JSON.stringify(updatedUser));
        clearCart();
    };

    const addProduct = (p) => setProducts(prev => [p, ...prev]);
    const removeProduct = (id) => setProducts(prev => prev.filter(p => p.id !== id));

    const updateUserCredits = (userId, amount) => {
        if (currentUser?.id === userId) {
            setCurrentUser(prev => prev ? { ...prev, credits: prev.credits + amount } : null);
        }
    };

    return (
        <StoreContext.Provider value={{
            products, currentUser, cart, orders,
            login, logout, addToCart, removeFromCart, updateCartQuantity, clearCart, placeOrder,
            addProduct, removeProduct, updateUserCredits
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
