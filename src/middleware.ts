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

    // Anteriormente forçávamos todas as URLs para lowercase a fim de evitar
    // duplicação. Contudo, isso causava erro 404 quando as pastas possuíam
    // letras maiúsculas ou caracteres especiais (ex.: /catalogo/Air%20Games).
    // Por isso, removemos essa conversão e mantemos o case original da URL,
    // permitindo o acesso correto a pastas com espaços ou acentuação.

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