import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define protected routes that require authentication
  const protectedRoutes = [
    '/admin',
    '/admin/dashboard',
  ];

  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));

  if (isProtectedRoute) {
    // Get the token from the request
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
    });

    // If the user is not authenticated or not an admin, redirect to the login page
    if (!token || token.role !== 'admin') {
      // Create the URL to redirect to
      const url = new URL('/auth/signin', request.url);
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      
      // Return the response with redirect
      return NextResponse.redirect(url);
    }
  }

  // Continue with the request if the user is authenticated or the route is not protected
  return NextResponse.next();
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
