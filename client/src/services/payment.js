import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

export const paymentAPI = {
    createPaymentIntent: (items, shippingAddress) => 
        axios.post(`${API_URL}/payments/create-payment-intent`, { items, shippingAddress }),
    
    createCheckoutSession: (items, shippingAddress) =>
        axios.post(`${API_URL}/payments/create-checkout-session`, { items, shippingAddress }),
    
    getOrders: () => axios.get(`${API_URL}/payments/orders`),
    
    getOrder: (id) => axios.get(`${API_URL}/payments/orders/${id}`),
    
    getStripe: () => stripePromise
};

export const validateCard = {
    cardNumber: (number) => {
        const cleaned = number.replace(/\s/g, '');
        return /^\d{16}$/.test(cleaned);
    },
    
    expiryDate: (date) => {
        const [month, year] = date.split('/');
        if (!month || !year) return false;
        
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        
        const expMonth = parseInt(month);
        const expYear = parseInt(year);
        
        if (expYear < currentYear) return false;
        if (expYear === currentYear && expMonth < currentMonth) return false;
        if (expMonth < 1 || expMonth > 12) return false;
        
        return true;
    },
    
    cvc: (cvc) => /^\d{3,4}$/.test(cvc)
};