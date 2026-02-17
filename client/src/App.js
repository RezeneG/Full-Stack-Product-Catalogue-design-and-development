import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import HomePage from './pages/HomePage';
import AddProductPage from './pages/AddProductPage';
import ViewProductsPage from './pages/ViewProductsPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import AuthModal from './components/AuthModal';
import UserMenu from './components/UserMenu';
import CartIcon from './components/CartIcon';
import { getCurrentUser, checkAuth } from './services/auth';
import { CartProvider } from './context/CartContext';
import './App.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function App() {
    const [user, setUser] = useState(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const authResult = await checkAuth();
                if (authResult.authenticated) {
                    setUser(getCurrentUser());
                }
            } catch (error) {
                console.error('Auth error:', error);
            } finally {
                setLoading(false);
            }
        };
        verifyAuth();
    }, []);

    if (loading) {
        return (
            <div className="app-loading">
                <div className="spinner"></div>
                <h2>Loading Product Catalogue...</h2>
            </div>
        );
    }

    return (
        <CartProvider>
            <Elements stripe={stripePromise}>
                <Router>
                    <div className="App">
                        <nav className="navbar">
                            <div className="nav-container">
                                <Link to="/" className="brand-link">
                                    <h1>🛍️ Product Catalogue</h1>
                                </Link>
                                
                                <ul className="nav-menu">
                                    <li className="nav-item">
                                        <Link to="/" className="nav-link">🏠 Home</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/products" className="nav-link">📦 Products</Link>
                                    </li>
                                    {user?.role === 'admin' && (
                                        <li className="nav-item">
                                            <Link to="/add" className="nav-link">➕ Add Product</Link>
                                        </li>
                                    )}
                                    {user && (
                                        <li className="nav-item">
                                            <Link to="/orders" className="nav-link">📋 Orders</Link>
                                        </li>
                                    )}
                                </ul>
                                
                                <div className="nav-actions">
                                    <CartIcon />
                                    {user ? (
                                        <UserMenu user={user} onLogout={() => setUser(null)} />
                                    ) : (
                                        <button className="auth-btn" onClick={() => setShowAuthModal(true)}>
                                            🔑 Login
                                        </button>
                                    )}
                                </div>
                            </div>
                        </nav>
                        
                        <main className="main-content">
                            <Routes>
                                <Route path="/" element={<HomePage user={user} />} />
                                <Route path="/products" element={<ViewProductsPage />} />
                                <Route path="/add" element={
                                    user?.role === 'admin' ? <AddProductPage /> : <Navigate to="/" />
                                } />
                                <Route path="/checkout" element={
                                    user ? <CheckoutPage user={user} /> : <Navigate to="/" />
                                } />
                                <Route path="/orders" element={
                                    user ? <OrdersPage /> : <Navigate to="/" />
                                } />
                                <Route path="/order/:id" element={
                                    user ? <OrderDetailsPage /> : <Navigate to="/" />
                                } />
                            </Routes>
                        </main>
                        
                        <AuthModal 
                            isOpen={showAuthModal} 
                            onClose={() => setShowAuthModal(false)} 
                            onLoginSuccess={setUser} 
                        />
                    </div>
                </Router>
            </Elements>
        </CartProvider>
    );
}

export default App;
