
// StoreContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, cartService, userService } from '../services/api';

const StoreContext = createContext(undefined);

const INITIAL_PRODUCTS = [
    { id: '1', name: 'Ghost Core Tee', price: 2499, category: 'Apparel', type: 'physical', subcategory: 'T-Shirt', image: '/collections img/Ghost_Boxy_Oversized_Tshirt_front.webp', description: 'Engineered for performance. 100% premium heavy-duty cotton.', stock: 50 },
    { id: '2', name: 'Cyberpunk Skin Pack', price: 899, category: 'Digital', type: 'digital', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800', description: 'Exclusive in-game assets for Project Endura universe.' },
    { id: '3', name: 'Dracon Cargo 01', price: 4500, category: 'Apparel', type: 'physical', subcategory: 'Pants', image: '/collections img/Dracon_Unisex_Straight_Fit_Baggy_Pants_front.webp', description: 'Tactical aesthetics with high durability zippers.', stock: 30 },
    { id: '4', name: 'Pierce Black Hoodie', price: 3200, category: 'Apparel', type: 'physical', subcategory: 'Hoodie', image: '/collections img/Pierce_Black_Boxy-Oversized_Hoodie_front.webp', description: 'Oversized fit with reflective print.', stock: 20 },
    { id: '5', name: 'Music Asset Pack Vol 1', price: 1200, category: 'Digital', type: 'digital', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800', description: 'Professional grade synthwave tracks for creators.' },
    { id: '6', name: 'Dissect Armor Vest', price: 5500, category: 'Apparel', type: 'physical', subcategory: 'Vest', image: '/collections img/Dissect_Black_Boxy_Unisex_Vest_front.webp', description: 'Lightweight tactical boxy vest.', stock: 15 },
    { id: '7', name: 'Gnarl Tactical Vest', price: 5200, category: 'Apparel', type: 'physical', subcategory: 'Vest', image: '/collections img/Gnarl_Red_Boxy_Unisex_Vest_front.webp', description: 'Red accent tactical vest.', stock: 25 },
];

export const AppProvider = ({ children }) => {
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [currentUser, setCurrentUser] = useState(null);
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);
    const [vaultItems, setVaultItems] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Initial sync
    useEffect(() => {
        const init = async () => {
            const userInfoRaw = localStorage.getItem('userInfo');
            if (userInfoRaw) {
                const parsed = JSON.parse(userInfoRaw);
                setCurrentUser(parsed);
                await loadCart();

                // If we only have a token (common after OAuth redirect), hydrate full profile.
                const hasIdentity = Boolean(parsed?.email || parsed?.username || parsed?._id);
                if (!hasIdentity && parsed?.token) {
                    try {
                        const fresh = await authService.getProfile();
                        setCurrentUser(fresh);
                        localStorage.setItem('userInfo', JSON.stringify(fresh));
                    } catch (e) {
                        console.error('Failed to hydrate user profile:', e);
                        localStorage.removeItem('userInfo');
                        setCurrentUser(null);
                    }
                }
            }
            setIsLoading(false);
        };

        init();
    }, []);

    // Load users list for admin
    useEffect(() => {
        const syncAdminUsers = async () => {
            if (!currentUser || currentUser.role !== 'admin') {
                setUsers([]);
                return;
            }

            try {
                const data = await userService.getUsers();
                setUsers(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error('Failed to load users:', e);
                setUsers([]);
            }
        };

        syncAdminUsers();
    }, [currentUser?.role, currentUser?.token]);

    const loadCart = async () => {
        try {
            const data = await cartService.getCart();
            setCart(data.items || []);
        } catch (error) {
            console.error('Failed to load cart:', error);
        }
    };

    const login = async (email, password) => {
        try {
            const data = await authService.login(email, password);
            setCurrentUser(data);
            await loadCart();
            return data;
        } catch (error) {
            throw error.response?.data?.message || 'Login failed';
        }
    };

    const register = async (username, email, password, phone) => {
        try {
            const data = await authService.register(username, email, password, phone);
            setCurrentUser(data);
            await loadCart();
            return data;
        } catch (error) {
            throw error.response?.data?.message || 'Registration failed';
        }
    };

    const loginWithToken = async (userData) => {
        setCurrentUser(userData);
        if (userData) localStorage.setItem('userInfo', JSON.stringify(userData));
        await loadCart();
    };

    const logout = () => {
        authService.logout();
        setCurrentUser(null);
        setCart([]);
        localStorage.removeItem('userInfo');
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
            login, loginWithToken, logout, register, addToCart, removeFromCart, updateCartQuantity, clearCart, placeOrder,
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

