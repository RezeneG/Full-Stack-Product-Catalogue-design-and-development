const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');

// Import middleware
const { auth } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });
        
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
        
        // Connection events
        mongoose.connection.on('connected', () => {
            console.log('🎉 Mongoose connected to DB');
        });
        
        mongoose.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose disconnected');
        });
        
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Check MONGODB_URI in .env file');
        console.log('2. Check if MongoDB is running');
        console.log('3. Check network connection');
        
        if (process.env.NODE_ENV !== 'production') {
            // For development, try to reconnect after 5 seconds
            console.log('🔄 Retrying connection in 5 seconds...');
            setTimeout(connectDB, 5000);
        } else {
            process.exit(1);
        }
    }
};

// Connect to database
connectDB();

// Health check endpoint
app.get('/api/health', (req, res) => {
    const dbState = mongoose.connection.readyState;
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };
    
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: states[dbState] || 'unknown',
        nodeVersion: process.version,
        memoryUsage: process.memoryUsage()
    });
});

// API Documentation
app.get('/api', (req, res) => {
    res.json({
        message: 'Product Catalogue API',
        version: '1.0.0',
        documentation: {
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login',
                logout: 'POST /api/auth/logout',
                profile: 'GET /api/auth/me',
                updateProfile: 'PUT /api/auth/update-profile',
                changePassword: 'PUT /api/auth/change-password'
            },
            products: {
                getAll: 'GET /api/products',
                getOne: 'GET /api/products/:id',
                create: 'POST /api/products (Admin only)',
                update: 'PUT /api/products/:id (Admin only)',
                delete: 'DELETE /api/products/:id (Admin only)',
                byCategory: 'GET /api/products/category/:category',
                search: 'GET /api/products/search/:query'
            }
        }
    });
});

// Admin dashboard (protected)
app.get('/api/admin/dashboard', auth(['admin']), (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to Admin Dashboard',
        user: req.user,
        timestamp: new Date().toISOString(),
        stats: {
            totalUsers: 'Check /api/admin/stats for real stats',
            totalProducts: 'Check /api/admin/stats for real stats',
            recentActivity: 'Last 24 hours'
        }
    });
});

// Admin stats (protected)
app.get('/api/admin/stats', auth(['admin']), async (req, res) => {
    try {
        const Product = require('./models/Product');
        const User = require('./models/User');
        
        const [totalProducts, totalUsers, totalAdmins] = await Promise.all([
            Product.countDocuments(),
            User.countDocuments(),
            User.countDocuments({ role: 'admin' })
        ]);
        
        res.json({
            success: true,
            stats: {
                totalProducts,
                totalUsers,
                totalAdmins,
                regularUsers: totalUsers - totalAdmins
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching stats'
        });
    }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// 404 handler for undefined routes
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', err.stack);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    res.status(statusCode).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    
    if (process.env.NODE_ENV === 'production') {
        // Close server & exit process
        server.close(() => process.exit(1));
    }
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`🌐 Server URL: http://localhost:${PORT}`);
    console.log(`📚 API Docs: http://localhost:${PORT}/api`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🔒 JWT Secret: ${process.env.JWT_SECRET ? 'Set' : 'Not set'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        mongoose.connection.close(false, () => {
            console.log('Database connection closed');
            process.exit(0);
        });
    });
});
