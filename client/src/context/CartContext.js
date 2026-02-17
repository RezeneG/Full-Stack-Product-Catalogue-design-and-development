import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    
    // Load cart from localStorage on initial render
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (error) {
                console.error('Error loading cart:', error);
            }
        }
    }, []);
    
    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);
    
    const addToCart = (product, quantity = 1) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product._id);
            if (existing) {
                return prev.map(item =>
                    item.id === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, {
                id: product._id,
                name: product.name,
                price: product.price,
                image: product.imageUrl || 'https://via.placeholder.com/300',
                quantity,
                stock: product.stock
            }];
        });
    };
    
    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };
    
    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) {
            removeFromCart(productId);
        } else {
            setCart(prev => prev.map(item =>
                item.id === productId ? { ...item, quantity } : item
            ));
        }
    };
    
    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('cart');
    };
    
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const shippingCost = cartTotal > 0 ? 5.99 : 0;
    const grandTotal = cartTotal + shippingCost;
    
    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            itemCount,
            shippingCost,
            grandTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};
