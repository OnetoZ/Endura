import axios from 'axios';

const resolveApiBaseUrl = () => {
    const envUrl = import.meta.env.VITE_API_URL?.trim();
    if (envUrl) {
        return envUrl.replace(/\/$/, '');
    }

    if (typeof window !== 'undefined') {
        const { hostname } = window.location;
        const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';

        if (!isLocalHost) {
            return 'https://endura-2.onrender.com/api';
        }
    }

    return 'http://localhost:5001/api';
};

const API_BASE_URL = resolveApiBaseUrl();

export const getImageUrl = (path) => {
    // Return placeholder if path is missing to prevent broken link icons
    const placeholder = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800';
    if (!path) return placeholder;

    // If it's already a Base64 string (stored in Mongo), return it as is
    if (typeof path === 'string' && path.startsWith('data:image')) return path;

    // Logical Healing for Absolute URLs
    if (typeof path === 'string' && path.startsWith('http')) {
        // Fix for hardcoded localhost URLs in DB during deployment
        const baseUrl = API_BASE_URL.replace(/\/api$/, '');
        const isProduction = !window.location.hostname.includes('localhost');
        const isLocalPath = path.includes('localhost') || path.includes('127.0.0.1');

        if (isProduction && isLocalPath && path.includes('/uploads/')) {
            const fileName = path.split('/uploads/')[1];
            return `${baseUrl}/uploads/${fileName}`;
        }

        // Standard healing for our own upload paths to match current environment
        if (path.includes('/uploads/')) {
            const fileName = path.split('/uploads/')[1];
            return `${baseUrl}/uploads/${fileName}`;
        }
        return path;
    }

    // Identify frontend public assets (Vite public folder)
    const frontendPrefixes = ['/cart page/', '/factions/', '/logo.png', '/video/', '/hero/'];
    if (typeof path === 'string' && frontendPrefixes.some(prefix => path.startsWith(prefix))) {
        return path;
    }

    // Otherwise, assume it's a relative path from the backend (e.g. 'uploads/...')
    const baseUrl = API_BASE_URL.replace(/\/api$/, '');
    const cleanPath = typeof path === 'string' ? (path.startsWith('/') ? path : `/${path}`) : '';
    
    // Ensure we don't accidentally return 'baseUrl/' if cleanPath is empty or invalid
    if (!cleanPath || cleanPath === '/') return placeholder;
    
    return `${baseUrl}${cleanPath}`;
};

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        const { token } = JSON.parse(userInfo);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Handle token expiration and errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthRoute = error.config?.url?.includes('/auth/login') ||
                            error.config?.url?.includes('/auth/register') ||
                            error.config?.url?.includes('/auth/admin-check') ||
                            error.config?.url?.includes('/auth/admin-verify-2fa') ||
                            error.config?.url?.includes('/auth/google-verify-2fa');
                            
        if (error.response?.status === 401 && !isAuthRoute) {
            // Token expired or invalid
            localStorage.removeItem('userInfo');
            if (window.location.pathname !== '/auth') {
                window.location.href = '/auth';
            }
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data) {
            localStorage.setItem('userInfo', JSON.stringify(response.data));
        }
        return response.data;
    },
    register: async (username, email, password, phone) => {
        const response = await api.post('/auth/register', { username, email, password, phone });
        if (response.data) {
            localStorage.setItem('userInfo', JSON.stringify(response.data));
        }
        return response.data;
    },
    getProfile: async () => {
        const response = await api.get('/auth/profile');
        return response.data;
    },
    updateProfile: async (profileData) => {
        const response = await api.put('/auth/profile', profileData);
        if (response.data) {
            // Update local storage with new info to keep token
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const updatedInfo = { ...userInfo, ...response.data };
            localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
        }
        return response.data;
    },
    getUserOrders: async () => {
        const response = await api.get('/orders/myorders');
        return response.data;
    },
    logout: async () => {
        try {
            // Call backend logout endpoint
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Always remove local storage even if backend call fails
            localStorage.removeItem('userInfo');
        }
    },
};

export const productService = {
    getProducts: async () => {
        const response = await api.get('/products');
        return response.data;
    },
    getProductById: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },
    createProduct: async (productData) => {
        const response = await api.post('/products', productData);
        return response.data;
    },
    updateProduct: async (id, productData) => {
        const response = await api.put(`/products/${id}`, productData);
        return response.data;
    },
    deleteProduct: async (id) => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    },
    getDigitalCars: async () => {
        const response = await api.get('/products?type=digital&category=Digital Car');
        return response.data;
    },
    getPhysicalProducts: async () => {
        const response = await api.get('/products?type=physical');
        return response.data;
    },
    getVaultItems: async () => {
        const response = await api.get('/vault/all');
        return response.data;
    },

    getVaultCards: async () => {
        const response = await api.get('/vault/cards');
        return response.data;
    },
    createVaultCard: async (cardData) => {
        const response = await api.post('/vault/cards', cardData);
        return response.data;
    },
    updateVaultCard: async (id, cardData) => {
        const response = await api.put(`/vault/cards/${id}`, cardData);
        return response.data;
    },
    deleteVaultCard: async (id) => {
        const response = await api.delete(`/vault/cards/${id}`);
        return response.data;
    },
    collectVaultCard: async (id) => {
        const response = await api.post(`/vault/${id}/collect`);
        return response.data;
    },
};

export const orderService = {
    placeOrder: async (orderData) => {
        const response = await api.post('/orders', orderData);
        return response.data;
    },
    getMyOrders: async () => {
        const response = await api.get('/orders/myorders');
        return response.data;
    },
    getAllOrders: async () => {
        const response = await api.get('/orders');
        return response.data;
    },
    getOrderById: async (id) => {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },
    createRazorpayOrder: async (orderData) => {
        const normalizedOrderItems = Array.isArray(orderData?.orderItems)
            ? orderData.orderItems.map((item) => ({
                product: item?.product || item?._id || item?.id,
                quantity: Number(item?.quantity || 0),
            }))
            : [];

        const payload = {
            orderItems: normalizedOrderItems,
            shippingAddress: orderData?.shippingAddress || {},
        };

        const response = await api.post('/payment/create-order', payload);
        return response.data;
    },
    verifyPayment: async (paymentData) => {
        const response = await api.post('/payment/verify', paymentData);
        return response.data;
    },
};

export const cartService = {
    getCart: async () => {
        const response = await api.get('/cart');
        return response.data;
    },
    addToCart: async (productId, quantity) => {
        const response = await api.post('/cart/add', { productId, quantity });
        return response.data;
    },
    updateCart: async (productId, quantity) => {
        const response = await api.put('/cart/update', { productId, quantity });
        return response.data;
    },
};

export const userService = {
    getUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },
    getCurrentUser: async () => {
        const response = await api.get('/auth/profile');
        return response.data;
    },
    getDashboardStats: async () => {
        const response = await api.get('/users/dashboard/stats');
        return response.data;
    },
    getUserOrders: async () => {
        const response = await api.get('/orders/myorders');
        return response.data;
    },
};

export const uploadService = {
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        const response = await api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.url;
    }
};

export const vaultService = {
    getUserVault: async () => {
        const response = await api.get('/vault');
        return response.data;
    },
    redeemCode: async (code) => {
        const response = await api.post('/vault/redeem-code', { code });
        return response.data;
    }
};

export default api;
