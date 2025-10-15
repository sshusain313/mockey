import mongoose from 'mongoose';

// Define a default MongoDB URL in case the environment variable is not available
// For local development, use a local MongoDB instance
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/mockey';

// Use MongoDB Atlas URL for cloud database
// Format: mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/mockey
// Use the same connection string for both local and Atlas to ensure consistency
const MONGODB_ATLAS_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/mockey';

// Determine which MongoDB URL to use
// If local connection fails, we'll try the Atlas URL
let currentMongoURL = MONGODB_URL;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */

// Define a type for our mongoose connection cache
interface MongooseCache {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
}

// Declare the global variable with the correct type
declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true, // Allow buffering commands before connection is complete
    };

    // Check if we have a MongoDB Atlas URL (starts with mongodb+srv://)
    const isAtlasURL = MONGODB_URL.startsWith('mongodb+srv://');
    
    if (isAtlasURL) {
      // If we have an Atlas URL, use it directly
      console.log('Attempting to connect to MongoDB Atlas...');
      cached.promise = mongoose.connect(MONGODB_URL, opts)
        .then((mongoose) => {
          console.log('Connected to MongoDB Atlas!');
          currentMongoURL = MONGODB_URL;
          return mongoose;
        })
        .catch((error) => {
          console.error('MongoDB Atlas connection error:', error);
          cached.promise = null;
          throw error;
        });
    } else {
      // Try local MongoDB first, then fallback to Atlas
      console.log('Attempting to connect to local MongoDB with URL:', MONGODB_URL);
      
      cached.promise = mongoose.connect(MONGODB_URL, opts)
        .then((mongoose) => {
          console.log('Connected to local MongoDB!');
          currentMongoURL = MONGODB_URL;
          return mongoose;
        })
        .catch((error) => {
          console.error('Local MongoDB connection error:', error);
          console.log('Attempting to connect to MongoDB Atlas...');
          
          // If local connection fails, try MongoDB Atlas
          return mongoose.connect(MONGODB_ATLAS_URL, opts)
            .then((mongoose) => {
              console.log('Connected to MongoDB Atlas!');
              currentMongoURL = MONGODB_ATLAS_URL;
              return mongoose;
            })
            .catch((atlasError) => {
              console.error('MongoDB Atlas connection error:', atlasError);
              cached.promise = null;
              throw atlasError;
            });
        });
    }
  }
  
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('MongoDB connection error in dbConnect:', error);
    // Reset the promise on error
    cached.promise = null;
    
    // Provide more helpful error message
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED')) {
        console.error('Could not connect to MongoDB. Please check if your MongoDB server is running or if your connection string is correct.');
        console.error('For local development, make sure MongoDB is installed and running.');
        console.error('For MongoDB Atlas, check your connection string in the MONGODB_URL environment variable.');
      } else if (error.message.includes('ENOTFOUND')) {
        console.error('Could not resolve MongoDB hostname. Please check your connection string format and ensure your cluster name is correct.');
      } else if (error.message.includes('AuthenticationFailed')) {
        console.error('MongoDB authentication failed. Please check your username and password in the connection string.');
      }
    }
    
    throw error; // Throw the error to be handled by the caller
  }
}

export default dbConnect;
