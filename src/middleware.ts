// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();

    // Forçar www (opcional - descomente se preferir)
    // if (!url.host.startsWith('www.')) {
    //   url.host = `www.${url.host}`;
    //   return NextResponse.redirect(url, 301);
    // }

    // Remover trailing slashes (exceto para root)
    // if (url.pathname !== '/' && url.pathname.endsWith('/')) {
    //     url.pathname = url.pathname.slice(0, -1);
    //     return NextResponse.redirect(url, 301);
    // }

    // Forçar lowercase nas URLs para evitar duplicação
    // Forçar lowercase nas URLs para evitar duplicação, ignorando arquivos estáticos
    const hasExtension = url.pathname.includes('.')
    if (!hasExtension && url.pathname !== url.pathname.toLowerCase()) {
        url.pathname = url.pathname.toLowerCase();
        return NextResponse.redirect(url, 301);
    }

    // Headers de segurança e SEO
    const response = NextResponse.next();

    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};