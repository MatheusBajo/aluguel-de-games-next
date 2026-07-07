# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server with turbo and on all interfaces (--hostname 0.0.0.0)
- `npm run build` - Build the project for production
- `npm run postbuild` - Generate sitemap after build (runs next-sitemap)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint (must be run before PRs)

### Build Process
The project uses Next.js with static export configuration. The complete build process is:
```bash
npm run build && npm run postbuild
```

## Architecture Overview

### Project Structure
- **Next.js 15** with React 19 and TypeScript
- **Static export** configuration (`output: 'export'` in next.config.ts)
- **File-based catalog system** using metadata.json files in `public/Organizado/`
- **Component-driven architecture** with strict separation of server/client components

### Key Directories
- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - Reusable UI components organized by domain
- `src/lib/` - Server-side utilities and data access functions
- `src/hooks/` - Client-side React hooks
- `public/Organizado/` - File-based catalog with nested categories and products

### Catalog System Architecture
The project uses a unique file-based catalog system:

1. **Structure**: Products are organized in `public/Organizado/` with nested folder structure
2. **Metadata**: Each product folder contains `metadata.json` with product information
3. **Server functions**: `src/lib/catalog.server.ts` provides data access with case-insensitive matching
4. **URL generation**: `src/lib/slug-utils.ts` converts folder names to URL-friendly slugs
5. **Dynamic routing**: `src/app/catalogo/[...slug]/page.tsx` handles all product pages

### Core Libraries & Dependencies
- **UI**: Radix UI primitives with Tailwind CSS and shadcn/ui components
- **Animations**: Framer Motion and GSAP
- **Images**: Sharp for optimization (unoptimized: true in config)
- **Drag & Drop**: @dnd-kit for admin interfaces
- **Forms**: React Hook Form patterns
- **Styling**: Tailwind CSS with custom theme configuration

### Key Configuration Files
- `next.config.ts` - Static export, security headers, image optimization disabled
- `src/lib/site.config.ts` - Centralized site configuration and URL generation
- `src/app/layout.tsx` - Root layout with dark theme default and GTM integration

### Important Patterns
- Use `generateProductUrl()` from slug-utils.ts for all product links
- Use `getSiteUrl()` from site.config.ts for absolute URLs
- Server components are marked with 'server-only' imports
- All catalog data access goes through catalog.server.ts functions
- Meta tags generation uses generateMetaTags.ts helper

### Development Notes
- ESLint is configured to ignore during builds
- No automated tests currently implemented
- Uses WhatsApp integration for customer contact
- SEO-optimized with structured data and comprehensive meta tags
- Dark theme is default and enforced