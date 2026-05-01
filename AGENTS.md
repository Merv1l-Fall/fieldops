<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!--> BEGIN:zod-agent-rules -->
# remember to check the latest info when creating a zod schema.

for example z.string().email() is old standard and you only need z.email()
<!-- END:zod-agent-rules -->

<!-- BEGIN:fieldops-agent-rules -->
# FieldOps — Project Context

FieldOps is an airsoft field management SaaS. Field owners manage game day events, players register via a public booking link.

## Stack
- **Next.js 16** (App Router, Server Actions, TypeScript)
- **Supabase** (Postgres + Auth + RLS) — use `@supabase/ssr` for server components and middleware, browser client for client components
- **Tailwind CSS + shadcn/ui** (New York style, Zinc base)
- **Stripe** — optional per event, only when `payment_mode = 'online'`
- **Resend** — email reminders via `/api/send-reminders` cron route

## Key conventions
- All user-triggered mutations → **Server Actions** in `/src/actions/`
- Only two API routes: `POST /api/stripe/webhook` and `POST /api/send-reminders`
- Route groups: `(auth)` for login/signup, `(dashboard)` for owners, `(public)` for player-facing booking pages
- Email templates live in `/src/emails/` as React Email components

## Database tables
`profiles`, `fields`, `events`, `bookings`, `waivers`, `notifications`, `favourites`
- Money is always stored as **integers in cents** (e.g. 1500 = 15.00 SEK)
- `events` has: `payment_mode` (online/onsite), `waiver_enabled` (bool), `reminder_enabled` (bool)
- `bookings` has: `reminder_sent_7d` and `reminder_sent_1d` to prevent duplicate sends

## Optional features
- **Stripe payments** — only active when `payment_mode = 'online'`, never assume it's enabled
- **Waivers** — only shown/enforced when `waiver_enabled = true` on the event

## RLS
Row Level Security is enforced at the DB level. Never fetch data without respecting the authenticated user's role (owner vs player).
<!-- END:fieldops-agent-rules -->