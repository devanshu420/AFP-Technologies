// middleware.js  (Root folder par rakhna hai)
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('machina_admin_session')?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    if (!token) {
      const loginUrl = new URL('/admin', request.url);
      loginUrl.searchParams.set('auth', 'required');
      
      if (pathname === '/admin') {
        return NextResponse.next();
      }

      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};