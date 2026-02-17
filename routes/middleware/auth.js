const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
// Comment out database dependencies for now
// const User = require('../models/User');
// const auth = require('../middleware/auth');

// =============================================
// TEST ENDPOINTS - NO DATABASE REQUIRED
// =============================================

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (TEST VERSION)
 * @access  Public
 */
router.post('/register', (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Basic validation
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide username, email, and password'
            });
        }

        // Generate test token
        const token = jwt.sign(
            { userId: 'test_user_123', role: 'user' },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully (TEST MODE)',
            token,
            user: {
                _id: 'test_user_123',
                username,
                email,
                role: email && email.includes('admin') ? 'admin' : 'user',
                avatar: 'https://via.placeholder.com/150',
                createdAt: new Date().toISOString()
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user (TEST VERSION)
 * @access  Public
 */
router.post('/login', (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // For testing - any credentials work except specific test cases
        if (email === 'test@example.com' && password === 'wrong') {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate test token
        const token = jwt.sign(
            { 
                userId: 'test_user_' + Date.now(), 
                role: email.includes('admin') ? 'admin' : 'user' 
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful (TEST MODE)',
            token,
            user: {
                _id: 'test_user_' + Date.now(),
                username: email ? email.split('@')[0] : 'user',
                email,
                role: email && email.includes('admin') ? 'admin' : 'user',
                avatar: 'https://via.placeholder.com/150',
                lastLogin: new Date().toISOString()
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile (TEST VERSION)
 * @access  Public (for testing - normally would be private)
 */
router.get('/me', (req, res) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');
        let userData = {
            _id: 'test_user_123',
            username: 'testuser',
            email: 'test@example.com',
            role: 'user',
            avatar: 'https://via.placeholder.com/150'
        };

        // If token provided, try to decode it
        if (authHeader) {
            const token = authHeader.replace('Bearer ', '');
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
                userData = {
                    ...userData,
                    _id: decoded.userId || userData._id,
                    role: decoded.role || userData.role
                };
            } catch (e) {
                // Token invalid - use default user
            }
        }

        res.json({
            success: true,
            user: userData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get user profile',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (TEST VERSION)
 * @access  Public
 */
router.post('/logout', (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

/**
 * @route   PUT /api/auth/update-profile
 * @desc    Update user profile (TEST VERSION)
 * @access  Public
 */
router.put('/update-profile', (req, res) => {
    try {
        const updates = req.body;
        
        res.json({
            success: true,
            message: 'Profile updated successfully (TEST MODE)',
            user: {
                _id: 'test_user_123',
                username: updates.username || 'testuser',
                email: updates.email || 'test@example.com',
                role: 'user',
                avatar: 'https://via.placeholder.com/150',
                updatedAt: new Date().toISOString()
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message
        });
    }
});

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user password (TEST VERSION)
 * @access  Public
 */
router.put('/change-password', (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide current password and new password'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters'
            });
        }

        res.json({
            success: true,
            message: 'Password changed successfully (TEST MODE)'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to change password',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/auth/test
 * @desc    Test endpoint
 * @access  Public
 */
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Auth API is working!',
        timestamp: new Date().toISOString(),
        endpoints: [
            'POST /api/auth/register',
            'POST /api/auth/login',
            'GET /api/auth/me',
            'POST /api/auth/logout',
            'PUT /api/auth/update-profile',
            'PUT /api/auth/change-password',
            'GET /api/auth/test'
        ]
    });
});

module.exports = router;
