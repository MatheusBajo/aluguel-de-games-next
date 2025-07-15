// src/lib/session-store.ts
// Armazenamento de sessões em memória
// Em produção, considere usar Redis ou um banco de dados

export interface Session {
    username: string;
    expiresAt: number;
}

// Map global para armazenar sessões
export const sessions = new Map<string, Session>();

// Limpar sessões expiradas periodicamente (a cada 5 minutos)
if (typeof global !== 'undefined' && !global.sessionCleanupInterval) {
    global.sessionCleanupInterval = setInterval(() => {
        const now = Date.now();
        for (const [token, session] of sessions.entries()) {
            if (session.expiresAt < now) {
                sessions.delete(token);
            }
        }
    }, 5 * 60 * 1000);
}