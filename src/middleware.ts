import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
  '/:locale/sell/new',
  '/:locale/buy/new',
  '/:locale/profile',
  '/:locale/listing/(.*)/edit',
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect();
  }
  return intlMiddleware(req);
});

export const config = {
  matcher: [
    '/',
    '/(ru|en|kz)/:path*',
    '/((?!_next|_vercel|.*\\..*).*)'
  ]
};