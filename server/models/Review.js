const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Review must belong to a product']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user']
    },
    rating: {
        type: Number,
        required: [true, 'Please provide a rating'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
    },
    title: {
        type: String,
        required: [true, 'Please provide a review title'],
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    comment: {
        type: String,
        required: [true, 'Please provide a review comment'],
        maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    helpful: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent duplicate reviews
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Update product ratings when a review is saved
reviewSchema.post('save', async function() {
    await this.constructor.calculateAverageRating(this.product);
});

// Static method to calculate average rating
reviewSchema.statics.calculateAverageRating = async function(productId) {
    const stats = await this.aggregate([
        { $match: { product: productId } },
        {
            $group: {
                _id: '$product',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' },
                breakdown: {
                    $push: '$rating'
                }
            }
        }
    ]);

    if (stats.length > 0) {
        const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        stats[0].breakdown.forEach(rating => {
            breakdown[rating] = (breakdown[rating] || 0) + 1;
        });

        await mongoose.model('Product').findByIdAndUpdate(productId, {
            'ratings.average': stats[0].avgRating,
            'ratings.count': stats[0].nRating,
            'ratings.breakdown': breakdown
        });
    } else {
        await mongoose.model('Product').findByIdAndUpdate(productId, {
            'ratings.average': 0,
            'ratings.count': 0,
            'ratings.breakdown': { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        });
    }
};

reviewSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Review', reviewSchema);
