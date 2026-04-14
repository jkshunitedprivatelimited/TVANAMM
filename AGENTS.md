# T Vanamm Project Rules

## READ FIRST

Before doing ANYTHING in this project, read PROJECT_CONTEXT.md in the project
root. It is the single source of truth.

## Critical Rules — Never Violate

1. Tech stack is fixed — Next.js 14, TypeScript, Tailwind, Sanity, Supabase, Resend,
   Upstash, Cloudflare Turnstile. Never suggest or use alternatives.
2. Never mention JKSH United anywhere except footer copyright line.
3. Never hardcode content — everything goes through Sanity CMS.
4. Never use raw <img> tags — always use Next.js Image component.
5. All forms must have Zod + Cloudflare Turnstile + Upstash — all 3.
6. TypeScript strict mode — no any types ever.
7. All API routes are server-side only — no secrets on client.
8. WhatsApp float button must exist on every single page.
9. Mobile-first design — test at 375px, 768px, 1280px.
10. No Lorem Ipsum — all placeholder text must be real T Vanamm content.

## Code Style

- Always use TypeScript with strict mode
- Use named exports for components
- Use server components by default, client components only when needed
- Always handle loading and error states in UI
- Comment complex logic

## Before Every Task

1. Re-read PROJECT_CONTEXT.md
2. Use Planning Mode — show plan before executing
3. Wait for approval before writing code
4. Execute one phase at a time
