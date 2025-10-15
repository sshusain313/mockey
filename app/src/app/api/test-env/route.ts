import { NextResponse } from 'next/server';

export async function GET() {
  // Log all environment variables for debugging
  console.log('Environment Variables:');
  console.log('MONGODB_URL:', process.env.MONGODB_URL);
  console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
  console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET);
  console.log('AUTH_SECRET:', process.env.AUTH_SECRET);
  
  return NextResponse.json({
    mongodb_url: process.env.MONGODB_URL ? 'defined' : 'undefined',
    nextauth_url: process.env.NEXTAUTH_URL,
    auth_secret: process.env.AUTH_SECRET ? 'defined' : 'undefined',
  });
}
