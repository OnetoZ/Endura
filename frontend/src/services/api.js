import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

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
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

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
    logout: () => {
        localStorage.removeItem('userInfo');
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
    getDashboardStats: async () => {
        const response = await api.get('/users/dashboard/stats');
        return response.data;
    },
};

export default api;
