import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
};

export const getToken = () => {
    return localStorage.getItem('token');
};

export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

export const isAdmin = () => {
    const user = getCurrentUser();
    return user && user.role === 'admin';
};

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });
        
        if (response.data.success) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return { success: true, data: response.data };
        }
        return { success: false, message: response.data.message };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Login failed. Please try again.'
        };
    }
};

export const register = async (username, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, {
            username,
            email,
            password
        });
        
        if (response.data.success) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return { success: true, data: response.data };
        }
        return { success: false, message: response.data.message };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Registration failed. Please try again.'
        };
    }
};

export const logout = async () => {
    const token = getToken();
    
    if (token) {
        try {
            await axios.post(`${API_URL}/auth/logout`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const checkAuth = async () => {
    const token = getToken();
    
    if (!token) {
        return { authenticated: false };
    }
    
    try {
        const response = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
            return { authenticated: true, user: response.data.user };
        }
        return { authenticated: false };
    } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return { authenticated: false };
    }
};