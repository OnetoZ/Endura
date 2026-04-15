
// StoreContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, cartService, userService, assetService } from '../services/api';

const StoreContext = createContext(undefined);

export const AppProvider = ({ children }) => {
    const [products, setAssets] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [cart, setCart] = useState(() => {
        // Only restore cart from localStorage if user is logged in
        const userInfoRaw = localStorage.getItem('userInfo');
        if (userInfoRaw) {
            const saved = localStorage.getItem('endura_cart');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });
    const [orders, setOrders] = useState([]);
    const [vaultItems, setVaultItems] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Initial sync
    useEffect(() => {
        const init = async () => {
            try {
                // Fetch real products from backend
                const productsData = await assetService.getAssets();
                console.log('📦 [StoreContext] Raw products data:', productsData);
                const items = Array.isArray(productsData) ? productsData : (productsData?.products || []);
                console.log('📦 [StoreContext] Resolved products:', items);
                setAssets(items);
            } catch (err) {
                console.error('Failed to load products from backend:', err);
            }

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
            const { getImageUrl } = await import('../services/api');
            const data = await cartService.getCart();
            // Backend Cart model populates 'items.asset' (not 'items.product')
            const mappedItems = (data.items || [])
                .filter(item => {
                    const prod = item.asset || item.product;
                    return prod && (prod.name || prod._id);
                })
                .map(item => {
                    const prod = item.asset || item.product;
                    return {
                        id: prod._id || prod.id,
                        _id: prod._id || prod.id,
                        name: prod.name,
                        price: prod.price,
                        image: getImageUrl(prod.images?.[0] || prod.frontImage || prod.image),
                        category: prod.category,
                        quantity: item.quantity,
                        selectedSize: item.selectedSize || item.size || '',
                    };
                });
            setCart(mappedItems);
            localStorage.setItem('endura_cart', JSON.stringify(mappedItems));
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
        localStorage.removeItem('endura_cart');
    };

    const addToCart = async (product, qty = 1, size = null) => {
        // Require login to add items to cart
        if (!currentUser) {
            console.warn('User must be logged in to add items to cart');
            return { requiresLogin: true };
        }

        // Guard against invalid products
        if (!product || (!product.name && !product._id && !product.id)) {
            console.error('Refusing to add invalid product to cart:', product);
            return;
        }

        const { getImageUrl } = await import('../services/api');
        // Optimistic local update
        const productWithImage = {
            ...product,
            image: getImageUrl(product.images?.[0] || product.image || product.frontImage),
            id: product.id || product._id,
            selectedSize: size
        };

        setCart(prev => {
            const existing = prev.find(item => item.id === productWithImage.id && item.selectedSize === size);
            let nextCart;
            if (existing) {
                nextCart = prev.map(item => (item.id === productWithImage.id && item.selectedSize === size) ? { ...item, quantity: item.quantity + qty } : item);
            } else {
                nextCart = [...prev, { ...productWithImage, quantity: qty }];
            }
            localStorage.setItem('endura_cart', JSON.stringify(nextCart));
            return nextCart;
        });

        // Backend sync if logged in
        if (currentUser) {
            try {
                await cartService.addToCart(productWithImage.id, qty);
            } catch (error) {
                console.error('Failed to sync addToCart to backend:', error);
            }
        }
    };

    const removeFromCart = async (productId, size = null) => {
        setCart(prev => {
            const newCart = prev.filter(item => !(item.id === productId && item.selectedSize === size));
            localStorage.setItem('endura_cart', JSON.stringify(newCart));
            return newCart;
        });

        if (currentUser) {
            try {
                // Assuming updateCart with 0 quantity or specific remove endpoint
                await cartService.updateCart(productId, 0);
                await loadCart(); // Re-sync
            } catch (error) {
                console.error('Failed to sync removeFromCart to backend:', error);
            }
        }
    };

    const updateCartQuantity = async (productId, delta, size = null) => {
        setCart(prev => {
            const newCart = prev.map(item => {
                if (item.id === productId && item.selectedSize === size) {
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

    const placeOrder = async (orderPayload) => {
        if (!currentUser) return null;
        try {
            const { orderService } = await import('../services/api');
            const order = await orderService.placeOrder(orderPayload);
            setOrders(prev => [order, ...prev]);
            // Clear cart after successful order
            setCart([]);
            localStorage.removeItem('endura_cart');
            return order;
        } catch (error) {
            console.error('Failed to place order:', error);
            throw error.response?.data?.message || error.message || 'Failed to place order';
        }
    };

    const placeRazorpayOrder = async (orderPayload) => {
        if (!currentUser) return null;
        try {
            const { orderService } = await import('../services/api');
            const response = await orderService.createRazorpayOrder(orderPayload);
            return response;
        } catch (error) {
            console.error('Failed to create Razorpay order:', error);
            throw error.response?.data?.message || error.message || 'Failed to create Razorpay order';
        }
    };

    const verifyRazorpayPayment = async (verifyData) => {
        try {
            const { orderService } = await import('../services/api');
            const response = await orderService.verifyPayment(verifyData);
            // Clear cart after successful verification
            setCart([]);
            localStorage.removeItem('endura_cart');
            return response;
        } catch (error) {
            console.error('Failed to verify payment:', error);
            throw error.response?.data?.message || error.message || 'Payment verification failed';
        }
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

    const addProduct = (p) => setAssets(prev => [p, ...prev]);
    const removeProduct = (id) => setAssets(prev => prev.filter(p => p.id !== id));

    return (
        <StoreContext.Provider value={{
            products, currentUser, cart, orders, vaultItems, users, isLoading,
            login, loginWithToken, logout, register, addToCart, removeFromCart, updateCartQuantity, clearCart, placeOrder,
            placeRazorpayOrder, verifyRazorpayPayment,
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

