import { NextRequest, NextResponse } from 'next/server';
export default async function middleware(req) {

    const token = req.cookies.get('jwt')?.value;
    const adminToken = req.cookies.get('jwtAdmin')?.value;
    const updateCookie = req.cookies.get('updatePass')?.value;

    const tokenExists = token || adminToken
    const { pathname } = req.nextUrl;

    // setTimeout(() => {

      if (pathname.startsWith('/login/forgotPass') && !updateCookie) {
        return NextResponse.redirect(new URL('/login/generateOtp', req.url));
      }
      if (pathname.startsWith('/dashboard') && !tokenExists) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
      if (pathname.startsWith('/dashboard/profile') && !tokenExists) {
        return NextResponse.redirect(new URL('/login', req.url));
      }

      if ((pathname.startsWith('/login') || (pathname.startsWith('/register'))) && tokenExists) {
        return NextResponse.redirect(new URL('/dashboard/profile', req.url));
      }

      if ((pathname.startsWith('/dashboard/manageUsers') || (pathname.startsWith('/dashboard/manageProducts'))) && !adminToken) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    // }, 100);
  
    return NextResponse.next();
  }
  
  export const config = {
    matcher: ['/login', '/login/:path*', '/register', '/dashboard', '/dashboard/:path*'],
  };