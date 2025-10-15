const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env.local' });

// MongoDB connection string - make sure this matches the one in your app
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/mockey';

// Admin user details - you can change these as needed
const adminUser = {
  name: 'Admin User',
  email: 'shabahatsyed101@gmail.com',
  password: 'hello123', // This will be hashed before saving
  role: 'admin',
  subscription: 'lifetime' // Give admin lifetime subscription
};

// Define the User schema with proper constraints (must match your actual User model)
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
    immutable: true // Cannot be changed after creation
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt
  collection: 'users' // Explicitly set collection name
});

// Add indexes for better performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ subscription: 1 });
userSchema.index({ createdAt: -1 });

// Pre-save middleware to update updatedAt
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Static method to find admin users
userSchema.statics.findAdmins = function() {
  return this.find({ role: 'admin' });
};

// Create the User model
const User = mongoose.models.User || mongoose.model('User', userSchema);

async function createAdminUser() {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB successfully');

    // Validate admin user data
    console.log('🔍 Validating admin user data...');
    
    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminUser.email)) {
      throw new Error('Invalid email format');
    }

    // Check password length
    if (adminUser.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Check name length
    if (adminUser.name.length > 60) {
      throw new Error('Name cannot be more than 60 characters');
    }

    console.log('✅ Admin user data validation passed');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: adminUser.email });
    
    if (existingAdmin) {
      console.log('⚠️  User with email', adminUser.email, 'already exists');
      
      if (existingAdmin.role !== 'admin') {
        // Update role to admin if it's not already
        await User.updateOne(
          { email: adminUser.email }, 
          { 
            role: 'admin',
            subscription: 'lifetime',
            updatedAt: new Date()
          }
        );
        console.log('✅ Updated existing user to admin role');
        console.log('📧 Email:', adminUser.email);
        console.log('🔑 Password: [UNCHANGED] (use existing password)');
        console.log('👑 Role: admin');
        console.log('💎 Subscription: lifetime');
      } else {
        console.log('✅ User already has admin privileges');
        console.log('📧 Email:', adminUser.email);
        console.log('🔑 Password: [UNCHANGED] (use existing password)');
        console.log('👑 Role: admin');
        console.log('💎 Subscription: lifetime');
      }
      
      console.log('\n🔐 Please use these credentials to log in to the admin dashboard');
    } else {
      // Create new admin user
      console.log('👤 Creating new admin user...');
      
      const newAdmin = await User.create({
        ...adminUser,
        subscription: 'lifetime' // Ensure admin gets lifetime subscription
      });

      console.log('✅ Admin user created successfully');
      console.log('📧 Email:', adminUser.email);
      console.log('🔑 Password:', adminUser.password);
      console.log('👑 Role: admin');
      console.log('💎 Subscription: lifetime');
      console.log('🆔 User ID:', newAdmin._id);
      console.log('📅 Created at:', newAdmin.createdAt);
      console.log('\n🔐 Please use these credentials to log in to the admin dashboard');
    }

    // Verify admin user exists
    const adminCount = await User.countDocuments({ role: 'admin' });
    console.log(`\n📊 Total admin users in database: ${adminCount}`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
    console.log('\n🎉 Admin user setup completed successfully!');
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    
    if (error.code === 11000) {
      console.error('💡 This email is already registered. Try a different email or update the existing user.');
    } else if (error.name === 'ValidationError') {
      console.error('💡 Validation error. Please check the admin user data.');
      console.error('Details:', error.message);
    } else if (error.name === 'MongooseServerSelectionError') {
      console.error('💡 Cannot connect to MongoDB. Please check your connection string and ensure MongoDB is running.');
    }
    
    process.exit(1);
  }
}

// Run the function
createAdminUser();
