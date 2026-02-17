// models/User.js - Complete User Model with Authentication
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username cannot exceed 30 characters'],
        lowercase: true,
        match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't return password in queries by default
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user'
    },
    firstName: {
        type: String,
        trim: true,
        maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
        type: String,
        trim: true,
        maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    avatar: {
        type: String,
        default: 'https://via.placeholder.com/150'
    },
    phone: {
        type: String,
        trim: true,
        match: [/^[0-9\-\+]{9,15}$/, 'Please enter a valid phone number']
    },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        country: {
            type: String,
            default: 'US'
        },
        postalCode: String
    },
    billingAddress: {
        street: String,
        city: String,
        state: String,
        country: {
            type: String,
            default: 'US'
        },
        postalCode: String
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    phoneVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    preferences: {
        newsletter: {
            type: Boolean,
            default: true
        },
        emailNotifications: {
            type: Boolean,
            default: true
        },
        smsNotifications: {
            type: Boolean,
            default: false
        },
        theme: {
            type: String,
            enum: ['light', 'dark', 'auto'],
            default: 'light'
        }
    },
    stats: {
        totalOrders: {
            type: Number,
            default: 0
        },
        totalSpent: {
            type: Number,
            default: 0
        },
        lastOrderDate: Date
    },
    guestConverted: {
        type: Boolean,
        default: false
    },
    guestId: {
        type: String // For linking guest orders
    },
    socialAccounts: [{
        provider: {
            type: String,
            enum: ['google', 'facebook', 'github']
        },
        providerId: String,
        accessToken: String,
        refreshToken: String
    }],
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },
    twoFactorSecret: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
});

// Virtual for orders
userSchema.virtual('orders', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'user'
});

// Virtual for reviews
userSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'user'
});

// ==================== MIDDLEWARE ====================

// Hash password before saving
userSchema.pre('save', async function(next) {
    // Only hash the password if it's modified (or new)
    if (!this.isModified('password')) return next();
    
    try {
        // Generate salt
        const salt = await bcrypt.genSalt(10);
        // Hash password
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Update passwordChangedAt when password is modified
userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000; // Subtract 1 second for token timing
    next();
});

// Update updatedAt timestamp
userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// ==================== INSTANCE METHODS ====================

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function() {
    return jwt.sign(
        {
            userId: this._id,
            role: this.role,
            email: this.email
        },
        process.env.JWT_SECRET || 'your-secret-key-change-this',
        {
            expiresIn: process.env.JWT_EXPIRE || '7d'
        }
    );
};

// Generate refresh token
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        { userId: this._id },
        process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-this',
        { expiresIn: '30d' }
    );
};

// Check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

// Generate password reset token
userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    return resetToken;
};

// Generate email verification token
userSchema.methods.createEmailVerificationToken = function() {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    this.emailVerificationToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');
    
    this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    
    return verificationToken;
};

// Check if account is locked
userSchema.methods.isLocked = function() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Increment login attempts
userSchema.methods.incLoginAttempts = function() {
    // If we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        });
    }
    
    // Otherwise increment
    const updates = { $inc: { loginAttempts: 1 } };
    
    // Lock the account if we've reached max attempts and it's not locked already
    if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
        updates.$set = { lockUntil: Date.now() + 60 * 60 * 1000 }; // 1 hour
    }
    
    return this.updateOne(updates);
};

// Reset login attempts on successful login
userSchema.methods.resetLoginAttempts = function() {
    return this.updateOne({
        $set: { loginAttempts: 0 },
        $unset: { lockUntil: 1 }
    });
};

// Get profile info (public data)
userSchema.methods.getProfile = function() {
    return {
        _id: this._id,
        username: this.username,
        email: this.email,
        role: this.role,
        firstName: this.firstName,
        lastName: this.lastName,
        avatar: this.avatar,
        phone: this.phone,
        shippingAddress: this.shippingAddress,
        emailVerified: this.emailVerified,
        preferences: this.preferences,
        stats: this.stats,
        createdAt: this.createdAt,
        fullName: this.fullName
    };
};

// ==================== STATIC METHODS ====================

// Find by email or username
userSchema.statics.findByEmailOrUsername = function(identifier) {
    return this.findOne({
        $or: [
            { email: identifier },
            { username: identifier }
        ]
    }).select('+password');
};

// Find by guest ID
userSchema.statics.findByGuestId = function(guestId) {
    return this.findOne({ guestId });
};

// Get user stats
userSchema.statics.getUserStats = async function() {
    const stats = await this.aggregate([
        {
            $group: {
                _id: null,
                totalUsers: { $sum: 1 },
                activeUsers: { 
                    $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
                },
                admins: { 
                    $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] }
                },
                verifiedUsers: { 
                    $sum: { $cond: [{ $eq: ['$emailVerified', true] }, 1, 0] }
                },
                avgOrders: { $avg: '$stats.totalOrders' },
                totalSpent: { $sum: '$stats.totalSpent' }
            }
        }
    ]);
    
    return stats[0] || {
        totalUsers: 0,
        activeUsers: 0,
        admins: 0,
        verifiedUsers: 0,
        avgOrders: 0,
        totalSpent: 0
    };
};

// ==================== INDEXES ====================

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ 'stats.totalSpent': -1 });
userSchema.index({ guestId: 1 });
userSchema.index({ emailVerificationToken: 1 });
userSchema.index({ passwordResetToken: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
