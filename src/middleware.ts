// src/middleware.ts - Redirecionamentos e canonicalização
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();

    // Forçar lowercase nas URLs para evitar duplicação
    if (url.pathname !== url.pathname.toLowerCase()) {
        url.pathname = url.pathname.toLowerCase();
        return NextResponse.redirect(url);
    }

    // Adicionar trailing slash se necessário
    if (!url.pathname.endsWith('/') && !url.pathname.includes('.')) {
        url.pathname = `${url.pathname}/`;
        return NextResponse.redirect(url, 301);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};