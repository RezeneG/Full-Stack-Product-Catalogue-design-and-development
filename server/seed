const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

// Function to generate random ratings
const generateRandomRating = () => {
    const avg = (Math.random() * 3 + 2).toFixed(1); // Random between 2.0 and 5.0
    const count = Math.floor(Math.random() * 50) + 5; // Random between 5 and 55
    
    // Generate breakdown based on average
    const total = count;
    let breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    if (avg >= 4.5) {
        // Excellent product: mostly 5 stars
        breakdown[5] = Math.floor(total * 0.7);
        breakdown[4] = Math.floor(total * 0.2);
        breakdown[3] = Math.floor(total * 0.08);
        breakdown[2] = Math.floor(total * 0.02);
        breakdown[1] = total - breakdown[5] - breakdown[4] - breakdown[3] - breakdown[2];
    } else if (avg >= 4.0) {
        // Very good product: mix of 5 and 4 stars
        breakdown[5] = Math.floor(total * 0.4);
        breakdown[4] = Math.floor(total * 0.4);
        breakdown[3] = Math.floor(total * 0.15);
        breakdown[2] = Math.floor(total * 0.04);
        breakdown[1] = total - breakdown[5] - breakdown[4] - breakdown[3] - breakdown[2];
    } else if (avg >= 3.5) {
        // Good product: mostly 4 and 3 stars
        breakdown[4] = Math.floor(total * 0.3);
        breakdown[3] = Math.floor(total * 0.4);
        breakdown[2] = Math.floor(total * 0.2);
        breakdown[1] = Math.floor(total * 0.05);
        breakdown[5] = total - breakdown[4] - breakdown[3] - breakdown[2] - breakdown[1];
    } else if (avg >= 3.0) {
        // Average product: mostly 3 stars
        breakdown[3] = Math.floor(total * 0.4);
        breakdown[2] = Math.floor(total * 0.3);
        breakdown[4] = Math.floor(total * 0.2);
        breakdown[1] = Math.floor(total * 0.08);
        breakdown[5] = total - breakdown[3] - breakdown[2] - breakdown[4] - breakdown[1];
    } else {
        // Below average: more 2 and 1 stars
        breakdown[2] = Math.floor(total * 0.4);
        breakdown[1] = Math.floor(total * 0.3);
        breakdown[3] = Math.floor(total * 0.2);
        breakdown[4] = Math.floor(total * 0.08);
        breakdown[5] = total - breakdown[2] - breakdown[1] - breakdown[3] - breakdown[4];
    }
    
    return {
        average: parseFloat(avg),
        count: total,
        breakdown
    };
};

// Generate sample products with ratings
const sampleProducts = [
    // ========== ELECTRONICS (15 products) ==========
    {
        name: "iPhone 15 Pro",
        description: "Latest Apple smartphone with A17 Pro chip, titanium design, and advanced camera system",
        price: 999.99,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400",
        stock: 45
    },
    {
        name: "MacBook Air M2",
        description: "Lightweight laptop with Apple M2 chip, 13.6-inch Liquid Retina display, up to 18 hours battery",
        price: 1199.99,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400",
        stock: 28
    },
    {
        name: "Sony WH-1000XM5",
        description: "Premium noise-cancelling wireless headphones with 30-hour battery and exceptional sound quality",
        price: 399.99,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        stock: 75
    },
    {
        name: "Samsung Galaxy Watch 6",
        description: "Advanced smartwatch with health monitoring, sleep tracking, and LTE connectivity",
        price: 329.99,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        stock: 52
    },
    {
        name: "DJI Mini 3 Pro Drone",
        description: "Compact drone with 4K camera, 3-axis gimbal, and 34-minute flight time",
        price: 759.99,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400",
        stock: 23
    },
    {
        name: "Apple iPad Pro 12.9",
        description: "Professional tablet with M2 chip, Liquid Retina XDR display, and Apple Pencil support",
        price: 1099.99,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
        stock: 34
    },
    {
        name: "Bose SoundLink Revolve",
        description: "360-degree portable Bluetooth speaker with deep, loud, and immersive sound",
        price: 199.99,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400",
        stock: 67
    },
    {
        name: "PlayStation 5",
        description: "Next-generation gaming console with ultra-high speed SSD and immersive 4K gaming",
        price: 499.99,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400",
        stock: 15
    },
    {
        name: "Kindle Paperwhite",
        description: "Waterproof e-reader with 6.8-inch glare-free display and adjustable warm light",
        price: 139.99,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
        stock: 89
    },
    {
        name: "GoPro HERO12 Black",
        description: "Action camera with 5.3K video, HyperSmooth 6.0 stabilization, and waterproof design",
        price: 399.99,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400",
        stock: 42
    },
    {
        name: "Dell XPS 15 Laptop",
        description: "Premium Windows laptop with Intel i9 processor, 4K OLED display, and RTX graphics",
        price: 2499.99,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        stock: 18
    },
    {
        name: "Samsung 85\" QLED TV",
        description: "4K Smart TV with Quantum HDR, Object Tracking Sound, and Gaming Hub",
        price: 2299.99,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
        stock: 12
    },
    {
        name: "Nintendo Switch OLED",
        description: "Gaming console with 7-inch OLED screen, enhanced audio, and 64GB internal storage",
        price: 349.99,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400",
        stock: 37
    },
    {
        name: "Fitbit Charge 6",
        description: "Advanced fitness tracker with Google apps, ECG sensor, and 7-day battery",
        price: 159.99,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1576243336143-ca84f6a7f8d6?w=400",
        stock: 94
    },
    {
        name: "Logitech MX Master 3S",
        description: "Wireless mouse with ultra-fast scrolling, 8K DPI sensor, and multi-device flow",
        price: 99.99,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400",
        stock: 125
    },

    // ========== CLOTHING (12 products) ==========
    {
        name: "Leather Jacket",
        description: "Genuine leather jacket with zip closure and multiple pockets",
        price: 199.99,
        category: "Clothing",
        imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
        stock: 35
    },
    {
        name: "Cotton T-Shirt",
        description: "100% cotton comfortable t-shirt available in multiple colors and sizes",
        price: 24.99,
        category: "Clothing",
        imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        stock: 240
    },
    {
        name: "Denim Jeans",
        description: "Classic straight-fit jeans made from premium denim with stretch comfort",
        price: 89.99,
        category: "Clothing",
        imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
        stock: 78
    },
    {
        name: "Wool Winter Coat",
        description: "Warm winter coat with wool blend, waterproof exterior, and detachable hood",
        price: 299.99,
        category: "Clothing",
        imageUrl: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400",
        stock: 42
    },
    {
        name: "Running Shoes",
        description: "Lightweight running shoes with cushioning technology and breathable mesh",
        price: 129.99,
        category: "Clothing",
        imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
        stock: 56
    },
    {
        name: "Casual Blazer",
        description: "Modern-fit blazer suitable for office and casual occasions",
        price: 149.99,
        category: "Clothing",
        imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400",
        stock: 31
    },
    {
        name: "Yoga Pants",
        description: "High-waist yoga pants with four-way stretch and moisture-wicking fabric",
        price: 59.99,
        category: "Clothing",
        imageUrl: "https://images.unsplash.com/photo-1588117260148-b47818741c74?w=400",
        stock: 93
    },
    {
        name: "Silk Scarf",
        description: "100% silk scarf with printed pattern, perfect for accessorizing",
        price: 45.99,
        category: "Clothing",
        imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
        stock: 67
    },
    {
        name: "Men's Dress Shirt",
        description: "Formal dress shirt with non-iron cotton and classic fit",
        price: 79.99,
        category: "Clothing",
        imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400",
        stock: 84
    },
    {
        name: "Women's Summer Dress",
        description: "Floral print summer dress with flowy design and comfortable fabric",
        price: 89.99,
        category: "Clothing",
        imageUrl: "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=400",
        stock: 46
    },
    {
        name: "Wool Sweater",
        description: "Knit wool sweater with crew neck and ribbed cuffs for cold weather",
        price: 119.99,
        category: "Clothing",
        imageUrl: "https://images.unsplash.com/photo-1574180045827-681f8a1a9622?w=400",
        stock: 58
    },
    {
        name: "Athletic Shorts",
        description: "Quick-dry athletic shorts with pockets and adjustable waistband",
        price: 39.99,
        category: "Clothing",
        imageUrl: "https://images.unsplash.com/photo-1598554747436-cf1d5d5c5daf?w=400",
        stock: 112
    },

    // ========== BOOKS (10 products) ==========
    {
        name: "The Great Gatsby",
        description: "Classic novel by F. Scott Fitzgerald about the American Dream in the Jazz Age",
        price: 12.99,
        category: "Books",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
        stock: 156
    },
    {
        name: "JavaScript: The Definitive Guide",
        description: "Comprehensive guide to JavaScript programming, covering ES6 and modern web development",
        price: 49.99,
        category: "Books",
        imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
        stock: 87
    },
    {
        name: "Atomic Habits",
        description: "Practical guide to building good habits and breaking bad ones by James Clear",
        price: 18.99,
        category: "Books",
        imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
        stock: 203
    },
    {
        name: "The Hobbit",
        description: "Fantasy novel by J.R.R. Tolkien about Bilbo Baggins' adventure with dwarves",
        price: 14.99,
        category: "Books",
        imageUrl: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400",
        stock: 94
    },
    {
        name: "Python Crash Course",
        description: "Hands-on introduction to Python programming with practical projects",
        price: 39.99,
        category: "Books",
        imageUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400",
        stock: 76
    },
    {
        name: "To Kill a Mockingbird",
        description: "Harper Lee's classic novel about racial injustice in the American South",
        price: 13.99,
        category: "Books",
        imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400",
        stock: 124
    },
    {
        name: "React Up and Running",
        description: "Building web applications with React, Hooks, and modern tooling",
        price: 44.99,
        category: "Books",
        imageUrl: "https://images.unsplash.com/photo-1497636577773-f1231844b336?w=400",
        stock: 53
    },
    {
        name: "The Alchemist",
        description: "Philosophical novel by Paulo Coelho about following one's dreams",
        price: 16.99,
        category: "Books",
        imageUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400",
        stock: 178
    },
    {
        name: "Node.js Design Patterns",
        description: "Master Node.js through practical design patterns and best practices",
        price: 52.99,
        category: "Books",
        imageUrl: "https://images.unsplash.com/photo-1514897575457-c4db467cf78e?w=400",
        stock: 41
    },
    {
        name: "1984",
        description: "George Orwell's dystopian novel about totalitarianism and surveillance",
        price: 11.99,
        category: "Books",
        imageUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
        stock: 165
    },

    // ========== HOME (8 products) ==========
    {
        name: "Coffee Maker",
        description: "Programmable coffee maker with thermal carafe and built-in grinder",
        price: 129.99,
        category: "Home",
        imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
        stock: 67
    },
    {
        name: "Air Fryer",
        description: "Digital air fryer with multiple cooking functions and easy-clean basket",
        price: 99.99,
        category: "Home",
        imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400",
        stock: 82
    },
    {
        name: "Vacuum Cleaner",
        description: "Cordless stick vacuum with powerful suction and multiple attachments",
        price: 299.99,
        category: "Home",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        stock: 38
    },
    {
        name: "Memory Foam Mattress",
        description: "Queen size memory foam mattress with cooling gel and pressure relief",
        price: 699.99,
        category: "Home",
        imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400",
        stock: 24
    },
    {
        name: "Stand Mixer",
        description: "Professional stand mixer with multiple attachments for baking",
        price: 399.99,
        category: "Home",
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
        stock: 31
    },
    {
        name: "Smart Thermostat",
        description: "Wi-Fi enabled thermostat with learning capabilities and energy savings",
        price: 249.99,
        category: "Home",
        imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400",
        stock: 56
    },
    {
        name: "Food Processor",
        description: "Multi-function food processor with multiple blades and attachments",
        price: 149.99,
        category: "Home",
        imageUrl: "https://images.unsplash.com/photo-1572714635644-bc6f3a8c8c80?w=400",
        stock: 47
    },
    {
        name: "Robot Vacuum",
        description: "Smart robot vacuum with mapping technology and app control",
        price: 499.99,
        category: "Home",
        imageUrl: "https://images.unsplash.com/photo-1558618666-36d3844ee565?w=400",
        stock: 19
    },

    // ========== OTHER (5 products) ==========
    {
        name: "Yoga Mat",
        description: "Non-slip yoga mat with carrying strap and alignment markers",
        price: 34.99,
        category: "Other",
        imageUrl: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400",
        stock: 142
    },
    {
        name: "Dumbbell Set",
        description: "Adjustable dumbbell set with weight plates and storage rack",
        price: 199.99,
        category: "Other",
        imageUrl: "https://images.unsplash.com/photo-1534367507877-0edd93bd013b?w=400",
        stock: 36
    },
    {
        name: "Backpack",
        description: "Water-resistant backpack with laptop compartment and multiple pockets",
        price: 79.99,
        category: "Other",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
        stock: 89
    },
    {
        name: "Gardening Tool Set",
        description: "Complete gardening tool set with gloves and carrying case",
        price: 59.99,
        category: "Other",
        imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400",
        stock: 54
    },
    {
        name: "Camping Tent",
        description: "4-person waterproof tent with rainfly and carry bag",
        price: 129.99,
        category: "Other",
        imageUrl: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=400",
        stock: 27
    }
];

// Add ratings to all products
const productsWithRatings = sampleProducts.map(product => ({
    ...product,
    ratings: generateRandomRating()
}));

async function seedDatabase() {
    try {
        console.log('🌱 Seeding database with 50+ products including ratings...');
        
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/product-catalogue', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('✅ Connected to database');
        
        // Clear existing products
        await Product.deleteMany({});
        console.log('🧹 Cleared existing products');
        
        // Insert sample products with ratings
        await Product.insertMany(productsWithRatings);
        console.log(`✅ Added ${productsWithRatings.length} products with ratings`);
        
        // Calculate statistics
        const products = await Product.find();
        const stats = {
            total: products.length,
            byCategory: {},
            totalValue: 0,
            totalStock: 0,
            ratingStats: {
                average: 0,
                totalReviews: 0,
                byRating: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
            }
        };
        
        products.forEach(product => {
            // Count by category
            stats.byCategory[product.category] = (stats.byCategory[product.category] || 0) + 1;
            
            // Calculate total value
            stats.totalValue += product.price * product.stock;
            
            // Total stock
            stats.totalStock += product.stock;
            
            // Rating statistics
            if (product.ratings) {
                stats.ratingStats.average += product.ratings.average;
                stats.ratingStats.totalReviews += product.ratings.count;
                
                // Sum breakdowns
                Object.keys(product.ratings.breakdown).forEach(key => {
                    stats.ratingStats.byRating[key] += product.ratings.breakdown[key];
                });
            }
        });
        
        // Calculate average rating
        stats.ratingStats.average = stats.ratingStats.average / products.length;
        
        // Display statistics
        console.log('\n📊 DATABASE STATISTICS:');
        console.log('='.repeat(50));
        console.log(`📦 Total Products: ${stats.total}`);
        console.log(`💰 Total Inventory Value: $${stats.totalValue.toFixed(2)}`);
        console.log(`📈 Total Items in Stock: ${stats.totalStock}`);
        console.log(`⭐ Average Product Rating: ${stats.ratingStats.average.toFixed(2)}/5`);
        console.log(`📝 Total Reviews: ${stats.ratingStats.totalReviews}`);
        
        console.log('\n🏷️ Products by Category:');
        console.log('-'.repeat(30));
        for (const [category, count] of Object.entries(stats.byCategory)) {
            console.log(`${category}: ${count} products`);
        }
        
        console.log('\n⭐ Rating Distribution:');
        console.log('-'.repeat(30));
        Object.entries(stats.ratingStats.byRating)
            .sort(([a], [b]) => b - a)
            .forEach(([rating, count]) => {
                const percentage = ((count / stats.ratingStats.totalReviews) * 100).toFixed(1);
                const bar = '█'.repeat(Math.round(percentage / 5));
                console.log(`${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}: ${count.toString().padStart(4)} (${percentage}%) ${bar}`);
            });
        
        console.log('\n🏆 TOP 5 PRODUCTS BY RATING:');
        console.log('-'.repeat(40));
        const topRated = products
            .filter(p => p.ratings.count > 10) // Only products with significant reviews
            .sort((a, b) => b.ratings.average - a.ratings.average)
            .slice(0, 5);
        
        topRated.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name}`);
            console.log(`   Rating: ${product.ratings.average.toFixed(2)}/5 (${product.ratings.count} reviews)`);
            console.log(`   Price: $${product.price.toFixed(2)} | Stock: ${product.stock}`);
        });
        
        console.log('\n🔥 LOW STOCK ALERT (<10 items):');
        console.log('-'.repeat(35));
        const lowStock = products.filter(p => p.stock < 10);
        if (lowStock.length > 0) {
            lowStock.forEach(product => {
                console.log(`⚠️  ${product.name} - Only ${product.stock} left! (Category: ${product.category})`);
            });
        } else {
            console.log('✅ All products have sufficient stock');
        }
        
        console.log('\n💸 MOST EXPENSIVE PRODUCTS:');
        console.log('-'.repeat(35));
        const expensiveProducts = products
            .sort((a, b) => b.price - a.price)
            .slice(0, 3);
        
        expensiveProducts.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name} - $${product.price.toFixed(2)}`);
        });
        
        // Close connection
        await mongoose.connection.close();
        
        console.log('\n' + '='.repeat(50));
        console.log('✅ Database seeding completed successfully! 🎉');
        console.log('='.repeat(50));
        
        console.log('\n💡 DEMO TIPS:');
        console.log('1. Products now have realistic ratings and review counts');
        console.log('2. Use the rating filter to find highly-rated products');
        console.log('3. Sort products by rating to see the best products first');
        console.log('4. Login as admin@example.com / admin123 for full access');
        console.log('5. Test the search functionality with different queries');
        
        console.log('\n🔧 For frontend rating display, add the StarRating component:');
        console.log('```javascript');
        console.log('// Add to product card:');
        console.log('<div className="product-rating">');
        console.log('  <StarRating rating={product.ratings?.average || 0} />');
        console.log('  <span className="rating-count">');
        console.log('    ({product.ratings?.count || 0} reviews)');
        console.log('  </span>');
        console.log('</div>');
        console.log('```');
        
    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

seedDatabase();
