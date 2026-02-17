import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000
});

// Request interceptor - add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

// Product API
export const productAPI = {
    getAllProducts: () => api.get('/products'),
    getProductById: (id) => api.get(`/products/${id}`),
    createProduct: (productData) => api.post('/products', productData),
    updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
    deleteProduct: (id) => api.delete(`/products/${id}`),
    getProductsByCategory: (category) => api.get(`/products/category/${category}`),
    searchProducts: (query) => api.get(`/products/search/${query}`)
};

// Review API
export const reviewAPI = {
    getProductReviews: (productId) => api.get(`/products/${productId}/reviews`),
    addReview: (productId, reviewData) => api.post(`/products/${productId}/reviews`, reviewData),
    markHelpful: (reviewId) => api.put(`/reviews/${reviewId}/helpful`)
};

export default api;
