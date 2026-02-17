const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const demoUsers = [
    {
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
    },
    {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'user123',
        role: 'user'
    },
    {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: 'user123',
        role: 'user'
    },
    {
        username: 'manager',
        email: 'manager@example.com',
        password: 'manager123',
        role: 'admin'
    }
];

async function seedUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('🌱 Seeding demo users...');
        
        // Clear existing users
        await User.deleteMany({});
        console.log('🧹 Cleared existing users');
        
        // Hash passwords and insert users
        for (let user of demoUsers) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
        
        await User.insertMany(demoUsers);
        console.log(`✅ Added ${demoUsers.length} demo users`);
        
        console.log('\n📋 Demo Credentials:');
        console.log('========================================');
        console.log('👑 ADMIN USERS (Full Access):');
        console.log('Email: admin@example.com');
        console.log('Password: admin123');
        console.log('\nEmail: manager@example.com');
        console.log('Password: manager123');
        console.log('\n👤 REGULAR USERS (View Only):');
        console.log('Email: john@example.com');
        console.log('Password: user123');
        console.log('\nEmail: jane@example.com');
        console.log('Password: user123');
        console.log('========================================');
        
        // Display created users
        const users = await User.find().select('-password');
        console.log('\n📊 Users in database:', users.length);
        users.forEach(user => {
            console.log(`- ${user.username} (${user.email}) - ${user.role}`);
        });
        
        await mongoose.connection.close();
        console.log('\n✅ User seeding completed!');
        
    } catch (error) {
        console.error('❌ Error seeding users:', error);
        process.exit(1);
    }
}

seedUsers();
