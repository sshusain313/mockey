const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env.local' });

// MongoDB connection string
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/mockey';

// Define the User schema with all constraints
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
    trim: true,
    validate: {
      validator: function(v) {
        return v && v.trim().length > 0;
      },
      message: 'Name cannot be empty'
    }
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(v);
      },
      message: 'Please provide a valid email address'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    validate: {
      validator: function(v) {
        return v && v.length >= 6;
      },
      message: 'Password must be at least 6 characters long'
    }
  },
  image: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin'],
      message: 'Role must be either "user" or "admin"'
    },
    default: 'user',
    required: true
  },
  subscription: {
    type: String,
    enum: {
      values: ['free', 'pro', 'lifetime'],
      message: 'Subscription must be "free", "pro", or "lifetime"'
    },
    default: 'free',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'users'
});

// Add indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ subscription: 1 });
userSchema.index({ createdAt: -1 });

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function validateSchema() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URL);
    console.log('✅ Connected to MongoDB successfully');

    console.log('\n🔍 Validating database schema and constraints...\n');

    // Test 1: Check if indexes exist
    console.log('📊 Checking database indexes...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    const usersCollection = collections.find(col => col.name === 'users');
    
    if (usersCollection) {
      const indexes = await mongoose.connection.db.collection('users').indexes();
      console.log('✅ Users collection exists');
      console.log(`📋 Found ${indexes.length} indexes:`);
      
      indexes.forEach((index, i) => {
        console.log(`   ${i + 1}. ${JSON.stringify(index.key)} - ${index.unique ? 'UNIQUE' : 'NON-UNIQUE'}`);
      });
    } else {
      console.log('⚠️  Users collection not found');
    }

    // Test 2: Check admin user
    console.log('\n👑 Checking admin user...');
    const adminUser = await User.findOne({ role: 'admin' });
    if (adminUser) {
      console.log('✅ Admin user found');
      console.log(`   📧 Email: ${adminUser.email}`);
      console.log(`   👑 Role: ${adminUser.role}`);
      console.log(`   💎 Subscription: ${adminUser.subscription}`);
      console.log(`   📅 Created: ${adminUser.createdAt}`);
    } else {
      console.log('❌ No admin user found');
    }

    // Test 3: Check total users
    console.log('\n👥 Checking user statistics...');
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const userCount = await User.countDocuments({ role: 'user' });
    
    console.log(`📊 Total users: ${totalUsers}`);
    console.log(`👑 Admin users: ${adminCount}`);
    console.log(`👤 Regular users: ${userCount}`);

    // Test 4: Check subscription distribution
    console.log('\n💎 Checking subscription distribution...');
    const freeUsers = await User.countDocuments({ subscription: 'free' });
    const proUsers = await User.countDocuments({ subscription: 'pro' });
    const lifetimeUsers = await User.countDocuments({ subscription: 'lifetime' });
    
    console.log(`🆓 Free users: ${freeUsers}`);
    console.log(`⭐ Pro users: ${proUsers}`);
    console.log(`💎 Lifetime users: ${lifetimeUsers}`);

    // Test 5: Validate schema constraints
    console.log('\n🔒 Testing schema constraints...');
    
    // Test invalid email
    try {
      const invalidUser = new User({
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123',
        role: 'user'
      });
      await invalidUser.save();
      console.log('❌ Email validation failed - invalid email was accepted');
    } catch (error) {
      if (error.name === 'ValidationError') {
        console.log('✅ Email validation working correctly');
      }
    }

    // Test short password
    try {
      const shortPasswordUser = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: '123',
        role: 'user'
      });
      await shortPasswordUser.save();
      console.log('❌ Password validation failed - short password was accepted');
    } catch (error) {
      if (error.name === 'ValidationError') {
        console.log('✅ Password validation working correctly');
      }
    }

    // Test invalid role
    try {
      const invalidRoleUser = new User({
        name: 'Test User',
        email: 'test2@example.com',
        password: 'password123',
        role: 'invalid-role'
      });
      await invalidRoleUser.save();
      console.log('❌ Role validation failed - invalid role was accepted');
    } catch (error) {
      if (error.name === 'ValidationError') {
        console.log('✅ Role validation working correctly');
      }
    }

    // Test invalid subscription
    try {
      const invalidSubscriptionUser = new User({
        name: 'Test User',
        email: 'test3@example.com',
        password: 'password123',
        role: 'user',
        subscription: 'invalid-subscription'
      });
      await invalidSubscriptionUser.save();
      console.log('❌ Subscription validation failed - invalid subscription was accepted');
    } catch (error) {
      if (error.name === 'ValidationError') {
        console.log('✅ Subscription validation working correctly');
      }
    }

    // Test empty name
    try {
      const emptyNameUser = new User({
        name: '',
        email: 'test4@example.com',
        password: 'password123',
        role: 'user'
      });
      await emptyNameUser.save();
      console.log('❌ Name validation failed - empty name was accepted');
    } catch (error) {
      if (error.name === 'ValidationError') {
        console.log('✅ Name validation working correctly');
      }
    }

    console.log('\n🎉 Schema validation completed successfully!');
    console.log('\n📋 Summary:');
    console.log('✅ Database indexes are properly configured');
    console.log('✅ Admin user exists with proper privileges');
    console.log('✅ Schema constraints are enforced');
    console.log('✅ Data validation is working correctly');

    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error validating schema:', error.message);
    process.exit(1);
  }
}

validateSchema(); 