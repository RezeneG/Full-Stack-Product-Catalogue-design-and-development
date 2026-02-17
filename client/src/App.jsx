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
import { getCurrentUser, checkAuth, logout } from './services/auth';
import { CartProvider } from './context/CartContext';
import './App.css';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Loading Component
const LoadingScreen = () => (
    <div className="app-loading">
        <div className="spinner"></div>
        <h2>Loading Product Catalogue...</h2>
        <p>Please wait while we prepare your shopping experience</p>
    </div>
);

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false, user, isAdmin }) => {
    if (!user) {
        return <Navigate to="/" />;
    }
    
    if (requireAdmin && !isAdmin) {
        return (
            <div className="access-denied">
                <h2>🔒 Admin Access Required</h2>
                <p>You need administrator privileges to access this page.</p>
                <p>Current role: <strong>{user.role}</strong></p>
                <Link to="/" className="btn-primary">
                    Return to Home
                </Link>
            </div>
        );
    }
    
    return children;
};

// Main App Component
function App() {
    const [user, setUser] = useState(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [cartItemCount, setCartItemCount] = useState(0);

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const authResult = await checkAuth();
                if (authResult.authenticated) {
                    const currentUser = getCurrentUser();
                    setUser(currentUser);
                    setIsAdmin(currentUser?.role === 'admin');
                }
            } catch (error) {
                console.error('Auth check error:', error);
            } finally {
                setLoading(false);
            }
        };

        verifyAuth();
        
        // Check auth status periodically (every 5 minutes)
        const intervalId = setInterval(verifyAuth, 300000);
        
        return () => clearInterval(intervalId);
    }, []);

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        setIsAdmin(userData?.role === 'admin');
        setShowAuthModal(false);
    };

    const handleLogout = async () => {
        try {
            await logout();
            setUser(null);
            setIsAdmin(false);
            // Clear cart on logout
            localStorage.removeItem('cart');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <CartProvider>
            <Elements stripe={stripePromise}>
                <Router>
                    <div className="App">
                        {/* Navigation Bar */}
                        <nav className="navbar">
                            <div className="nav-container">
                                <div className="nav-brand">
                                    <Link to="/" className="brand-link">
                                        <h1>🛍️ Product Catalogue</h1>
                                        <span className="nav-subtitle">MERN Stack Application</span>
                                    </Link>
                                </div>
                                
                                <ul className="nav-menu">
                                    <li className="nav-item">
                                        <Link to="/" className="nav-link">
                                            🏠 Home
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/products" className="nav-link">
                                            📦 Products
                                        </Link>
                                    </li>
                                    {isAdmin && (
                                        <li className="nav-item">
                                            <Link to="/add" className="nav-link">
                                                ➕ Add Product
                                            </Link>
                                        </li>
                                    )}
                                    {user && (
                                        <li className="nav-item">
                                            <Link to="/orders" className="nav-link">
                                                📋 Orders
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                                
                                <div className="nav-actions">
                                    <CartIcon />
                                    
                                    <div className="nav-auth">
                                        {user ? (
                                            <UserMenu 
                                                user={user} 
                                                onLogout={handleLogout} 
                                                isAdmin={isAdmin}
                                            />
                                        ) : (
                                            <button 
                                                className="auth-btn" 
                                                onClick={() => setShowAuthModal(true)}
                                            >
                                                🔑 Login / Register
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </nav>
                        
                        {/* Main Content Area */}
                        <main className="main-content">
                            <Routes>
                                {/* Public Routes */}
                                <Route path="/" element={<HomePage user={user} />} />
                                <Route path="/products" element={
                                    <ViewProductsPage 
                                        user={user} 
                                        isAdmin={isAdmin} 
                                    />
                                } />
                                
                                {/* Protected Routes - Admin Only */}
                                <Route path="/add" element={
                                    <ProtectedRoute 
                                        requireAdmin={true} 
                                        user={user} 
                                        isAdmin={isAdmin}
                                    >
                                        <AddProductPage />
                                    </ProtectedRoute>
                                } />
                                
                                <Route path="/edit/:id" element={
                                    <ProtectedRoute 
                                        requireAdmin={true} 
                                        user={user} 
                                        isAdmin={isAdmin}
                                    >
                                        <AddProductPage isEdit={true} />
                                    </ProtectedRoute>
                                } />
                                
                                {/* Protected Routes - Authenticated Users */}
                                <Route path="/checkout" element={
                                    <ProtectedRoute user={user} isAdmin={isAdmin}>
                                        <CheckoutPage user={user} />
                                    </ProtectedRoute>
                                } />
                                
                                <Route path="/orders" element={
                                    <ProtectedRoute user={user} isAdmin={isAdmin}>
                                        <OrdersPage user={user} />
                                    </ProtectedRoute>
                                } />
                                
                                <Route path="/order/:id" element={
                                    <ProtectedRoute user={user} isAdmin={isAdmin}>
                                        <OrderDetailsPage user={user} />
                                    </ProtectedRoute>
                                } />
                                
                                {/* Checkout Success/Cancel */}
                                <Route path="/checkout/success" element={
                                    <div className="checkout-success-page">
                                        <div className="success-container">
                                            <div className="success-icon">✅</div>
                                            <h1>Payment Successful!</h1>
                                            <p>Thank you for your purchase.</p>
                                            <p>Your order has been confirmed and will be shipped soon.</p>
                                            <div className="success-actions">
                                                <Link to="/orders" className="btn-primary">
                                                    View Orders
                                                </Link>
                                                <Link to="/products" className="btn-secondary">
                                                    Continue Shopping
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                } />
                                
                                <Route path="/checkout/cancel" element={
                                    <div className="checkout-cancel-page">
                                        <div className="cancel-container">
                                            <div className="cancel-icon">❌</div>
                                            <h1>Payment Cancelled</h1>
                                            <p>Your payment was cancelled.</p>
                                            <p>No charges were made to your account.</p>
                                            <div className="cancel-actions">
                                                <Link to="/checkout" className="btn-primary">
                                                    Try Again
                                                </Link>
                                                <Link to="/products" className="btn-secondary">
                                                    Continue Shopping
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                } />
                                
                                {/* Demo Routes */}
                                <Route path="/demo/admin" element={
                                    <ProtectedRoute 
                                        requireAdmin={true} 
                                        user={user} 
                                        isAdmin={isAdmin}
                                    >
                                        <div className="demo-admin">
                                            <h2>👑 Admin Dashboard</h2>
                                            <p>Welcome to the admin demo dashboard</p>
                                            <div className="admin-stats">
                                                <div className="stat">
                                                    <h3>Total Products</h3>
                                                    <p>50+</p>
                                                </div>
                                                <div className="stat">
                                                    <h3>Total Users</h3>
                                                    <p>4</p>
                                                </div>
                                                <div className="stat">
                                                    <h3>Orders Today</h3>
                                                    <p>12</p>
                                                </div>
                                                <div className="stat">
                                                    <h3>Revenue</h3>
                                                    <p>$1,234.56</p>
                                                </div>
                                            </div>
                                            <div className="admin-actions">
                                                <Link to="/add" className="btn-primary">
                                                    Add New Product
                                                </Link>
                                                <Link to="/products" className="btn-secondary">
                                                    Manage Products
                                                </Link>
                                            </div>
                                        </div>
                                    </ProtectedRoute>
                                } />
                                
                                {/* 404 Page */}
                                <Route path="*" element={
                                    <div className="not-found">
                                        <div className="not-found-content">
                                            <h1>404</h1>
                                            <h2>Page Not Found</h2>
                                            <p>The page you're looking for doesn't exist or has been moved.</p>
                                            <Link to="/" className="btn-primary">
                                                Go to Home
                                            </Link>
                                        </div>
                                    </div>
                                } />
                            </Routes>
                        </main>
                        
                        {/* Footer */}
                        <footer className="footer">
                            <div className="footer-content">
                                <div className="footer-section">
                                    <h3>🛍️ Product Catalogue</h3>
                                    <p>Full Stack MERN Application with Stripe Payment Integration</p>
                                    <p className="footer-tech">
                                        Built with: React • Node.js • Express • MongoDB • Stripe
                                    </p>
                                </div>
                                
                                <div className="footer-section">
                                    <h4>Quick Links</h4>
                                    <ul className="footer-links">
                                        <li><Link to="/">Home</Link></li>
                                        <li><Link to="/products">Products</Link></li>
                                        {user && <li><Link to="/orders">My Orders</Link></li>}
                                        {!user && (
                                            <li>
                                                <button 
                                                    className="footer-link-btn"
                                                    onClick={() => setShowAuthModal(true)}
                                                >
                                                    Login/Register
                                                </button>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                
                                <div className="footer-section">
                                    <h4>Demo Credentials</h4>
                                    <p>Admin: admin@example.com / admin123</p>
                                    <p>User: john@example.com / user123</p>
                                    <button 
                                        className="footer-link-btn"
                                        onClick={() => {
                                            alert(
                                                '🎯 Demo Features:\n\n' +
                                                '• Complete CRUD Operations\n' +
                                                '• User Authentication (JWT)\n' +
                                                '• Product Ratings & Reviews\n' +
                                                '• Advanced Filtering & Sorting\n' +
                                                '• Shopping Cart\n' +
                                                '• Stripe Payment Integration\n' +
                                                '• Order History\n' +
                                                '• Responsive Design\n\n' +
                                                '💳 Test Card: 4242 4242 4242 4242\n' +
                                                '📅 Expiry: Any future date\n' +
                                                '🔐 CVC: Any 3 digits'
                                            );
                                        }}
                                    >
                                        🚀 View Features
                                    </button>
                                </div>
                            </div>
                            
                            <div className="footer-bottom">
                                <p>© {new Date().getFullYear()} Product Catalogue. All rights reserved.</p>
                                {user && (
                                    <p className="user-status">
                                        Logged in as: <strong>{user.username}</strong> ({user.role})
                                        {isAdmin && ' 👑'}
                                    </p>
                                )}
                            </div>
                        </footer>
                        
                        {/* Auth Modal */}
                        <AuthModal
                            isOpen={showAuthModal}
                            onClose={() => setShowAuthModal(false)}
                            onLoginSuccess={handleLoginSuccess}
                        />
                        
                        {/* Floating Action Button for Mobile */}
                        <button 
                            className="fab"
                            onClick={() => {
                                if (user) {
                                    handleLogout();
                                } else {
                                    setShowAuthModal(true);
                                }
                            }}
                        >
                            {user ? '🚪' : '🔑'}
                        </button>
                    </div>
                </Router>
            </Elements>
        </CartProvider>
    );
}

export default App;