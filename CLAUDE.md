# Critical Workflow

## MANDATORY: Run After ANY File Modification
**ALWAYS run `npx tsc --noEmit` after editing, creating, or deleting ANY file.**

This is non-negotiable. Do not skip this step.

## Before Committing
1. **TypeScript Check**: `npx tsc --noEmit`
2. **Build Check**: `npm run build`

## Development Commands
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run lint` - Run ESLint
- `pnpm payload generate:types` - Regenerate Payload types after collection changes

## Project Structure
```
src/app/
├── (frontend)/     ← Public website routes
│   ├── layout.tsx  ← Frontend layout (Header, Footer)
│   ├── page.tsx    ← Home page
│   ├── about/
│   ├── contact/
│   └── projects/
├── (payload)/      ← Payload CMS admin (isolated layout)
│   ├── layout.tsx
│   └── admin/
└── globals.css
```

## Important Notes
- `(frontend)` and `(payload)` are Next.js route groups with isolated layouts
- Do NOT create a root `app/layout.tsx` - it will cause hydration errors with Payload
- Payload CMS requires React 19 and Next.js 15+
