import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/mongodb";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";

// Use environment variable for NEXTAUTH_URL, fallback to localhost:3008
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || 'http://localhost:3008';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          redirect_uri: `${NEXTAUTH_URL}/api/auth/callback/google`
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing email or password");
          return null;
        }

        try {
          const db = await dbConnect();
          if (!db) {
            console.error("MongoDB connection failed");
            return null;
          }
          
          // Find user by email
          const user = await UserModel.findOne({ email: credentials.email });
          console.log("Found user:", user ? "Yes" : "No");
          
          // Check if user exists and password matches
          if (user && credentials.password) {
            // If user has a password
            if (user.password) {
              const isValid = await bcrypt.compare(credentials.password, user.password);
              console.log("Password valid:", isValid ? "Yes" : "No");
              
              if (isValid) {
                return {
                  id: user._id.toString(),
                  name: user.name,
                  email: user.email,
                  image: user.image || null,
                  role: user.role || 'user'
                };
              }
            }
          }
          
          console.log("Authentication failed");
          return null;
        } catch (error) {
          console.error("Error in authorize:", error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // For Google login, we need to create or update the user in our database
      if (account?.provider === 'google' && profile?.email) {
        try {
          await dbConnect();
          
          // Check if user exists
          let dbUser = await UserModel.findOne({ email: profile.email });
          
          if (!dbUser) {
            // Create new user if they don't exist
            dbUser = await UserModel.create({
              name: profile.name || profile.email,
              email: profile.email,
              image: profile.image || null,
              role: 'user'
            });
          }
          
          return true;
        } catch (error) {
          console.error("Error creating/updating user:", error);
          return false;
        }
      }
      
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 