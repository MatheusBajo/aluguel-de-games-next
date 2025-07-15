# AGENTS.md

Este guia resume a estrutura e as principais tarefas do projeto **Aluguel de Games**.
Ele serve como referência para fluxos futuros de automação com o Codex.

## Como rodar o projeto

1. Tenha **Node.js 20** ou superior instalado.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Durante o desenvolvimento utilize:
   ```bash
   npm run dev
   ```
4. Para gerar o build e export estático (incluindo `sitemap.xml`):
   ```bash
   npm run build && npm run postbuild
   ```

### Lint

Execute `npm run lint` antes de abrir qualquer PR.
Não há testes automatizados no momento.

## Estrutura do projeto

```
src/
  app/            Páginas e rotas do Next.js
  components/     Componentes de interface
  hooks/          Hooks React reutilizáveis
  lib/            Funções de utilidade e acesso a dados
  types/          Tipagens globais
public/           Assets estáticos (incluindo catálogo em `Organizado`)
scripts/          Scripts auxiliares em Node
```

### Arquivos principais

- `src/app/layout.tsx` – Layout raiz e definição de metadados básicos.
- `src/app/page.tsx` – Página inicial com carregamento do catálogo.
- `src/app/catalogo/[...slug]/page.tsx` – Rota dinâmica para cada produto.
- `src/app/robots.ts` – Gera `robots.txt`.
- `src/app/sitemap.ts` – Constrói o `sitemap.xml`.
- `src/lib/site.config.ts` – Função `getSiteUrl()` e informações globais do site.
- `src/lib/slug-utils.ts` – Utilidades para criar slugs e gerar URLs de produtos.
- `src/lib/generateMetaTags.ts` – Helper para meta tags padronizadas (OG, Twitter etc.).
- `scripts/migrate-categories.ts` – Migra categorias a partir da pasta `public/Organizado`.
- `scripts/fix-order.ts` – Ajusta a ordem de exibição; descomente a chamada no final do script ao usar.

## Observações adicionais

- Prefira usar `generateProductUrl()` ao criar links de produtos.
- Centralize o domínio chamando `getSiteUrl()` quando precisar gerar URLs absolutas.
- O arquivo `next.config.ts` está configurado para `output: 'export'`.

