#!/usr/bin/env node
// scripts/audit.mjs — audits de integridade (SPEC-FINAL-V2 §8).
// Roda no postbuild; QUALQUER falha derruba o build.
//
//   node scripts/audit.mjs fake     → zero número fabricado no código/export
//   node scripts/audit.mjs sitemap  → sitemap único, sem URL com acento/espaço
//   node scripts/audit.mjs raw      → HTML cru tem telefone + "desde 1993"
//
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'out');
const mode = process.argv[2];

function walk(dir, exts, acc = []) {
    if (!fs.existsSync(dir)) return acc;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p, exts, acc);
        else if (exts.some((x) => e.name.endsWith(x))) acc.push(p);
    }
    return acc;
}

function fail(msg) {
    console.error(`\n✗ AUDIT FALHOU: ${msg}\n`);
    process.exit(1);
}

function ok(msg) {
    console.log(`✓ ${msg}`);
}

/* ---------- audit:fake — gate binário de integridade (brief §3.5) ------- */
function auditFake() {
    // Padrões do consenso: sales-utils, 98%, reviews fabricadas, contador
    // de "locações". Escaneia src/ (código) e out/ (HTML exportado).
    const patterns = [
        /sales-utils/,
        /getRentalCount|formatRentalCount/,
        /98%/,
        /"reviewCount"|reviewCount:/,
        /"ratingValue"|ratingValue:/,
        /"aggregateRating"/,
        /locações<\/|locações"/, // label de contador; prosa legítima usa "locação"
    ];

    const files = [
        ...walk(path.join(ROOT, 'src'), ['.ts', '.tsx']),
        ...walk(OUT, ['.html']),
    ];

    const hits = [];
    for (const f of files) {
        const content = fs.readFileSync(f, 'utf8');
        for (const p of patterns) {
            if (p.test(content)) hits.push(`${path.relative(ROOT, f)} ← ${p}`);
        }
    }
    if (hits.length) fail(`número/contador fabricado encontrado:\n  ${hits.join('\n  ')}`);
    ok(`audit:fake — ${files.length} arquivos limpos (zero número fabricado)`);
}

/* ---------- audit:sitemap — 1 dono, URLs ASCII, todas as rotas ---------- */
function auditSitemap() {
    const sitemapPath = path.join(OUT, 'sitemap.xml');
    if (!fs.existsSync(sitemapPath)) fail('out/sitemap.xml não existe');
    if (fs.existsSync(path.join(ROOT, 'public', 'sitemap.xml')))
        fail('public/sitemap.xml ressuscitou — o dono do sitemap é src/app/sitemap.ts');

    const xml = fs.readFileSync(sitemapPath, 'utf8');
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    if (urls.length === 0) fail('sitemap sem URLs');

    const bad = urls.filter((u) => /[^\x20-\x7E]/.test(u) || /%20|\s/.test(u));
    if (bad.length) fail(`URLs com acento/espaço no sitemap:\n  ${bad.join('\n  ')}`);

    const required = ['/', '/catalogo/', '/empresas/', '/como-funciona/', '/sobre/', '/galeria/', '/contato/', '/privacidade/'];
    const missing = required.filter((r) => !urls.some((u) => u.endsWith(`alugueldegames.com.br${r}`)));
    if (missing.length) fail(`rotas obrigatórias fora do sitemap: ${missing.join(', ')}`);

    ok(`audit:sitemap — ${urls.length} URLs, todas ASCII, rotas obrigatórias presentes`);
}

/* ---------- audit:raw — conteúdo-chave existe no HTML servido ----------- */
function auditRaw() {
    const checks = [
        { file: 'index.html', needles: ['(11) 96526-1000', '1993', 'wa.me/5511965261000'] },
        { file: 'empresas/index.html', needles: ['(11) 96526-1000', 'wa.me/5511965261000'] },
        { file: 'contato/index.html', needles: ['(11) 96526-1000'] },
    ];

    for (const c of checks) {
        const p = path.join(OUT, c.file);
        if (!fs.existsSync(p)) fail(`${c.file} não existe no export`);
        const html = fs.readFileSync(p, 'utf8');
        for (const n of c.needles) {
            if (!html.includes(n)) fail(`"${n}" ausente do HTML cru de ${c.file}`);
        }
    }

    // Um template de produto qualquer também precisa ter telefone no HTML
    const productHtml = walk(path.join(OUT, 'catalogo'), ['.html']).find((f) => {
        const html = fs.readFileSync(f, 'utf8');
        return html.includes('Pedir orçamento deste item');
    });
    if (productHtml) {
        const html = fs.readFileSync(productHtml, 'utf8');
        if (!html.includes('(11) 96526-1000'))
            fail(`telefone ausente do HTML de produto (${path.relative(OUT, productHtml)})`);
    }

    ok('audit:raw — telefone, 1993 e wa.me presentes no HTML cru');
}

if (mode === 'fake') auditFake();
else if (mode === 'sitemap') auditSitemap();
else if (mode === 'raw') auditRaw();
else {
    auditFake();
    auditSitemap();
    auditRaw();
}
