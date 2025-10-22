require('dotenv').config({ path: '../../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcrypt');

async function createAdmin() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI environment variable is not defined');
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        // Admin details
        const adminData = {
          name: 'Charan',
          email: 'charan@gmail.com',
          password: 'admin#12345', // Will be hashed automatically
          role: 'admin'
        };
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
          console.log('❌ Admin user already exists!');
          process.exit(1);
        }
        // Create admin user
        const admin = await User.create(adminData);
        console.log('✅ Admin user created successfully!');
        process.exit(0);
        } catch (error) {
        console.error('❌ Error creating admin:', error);
        } finally {
            await mongoose.connection.close();
        }
}

createAdmin();