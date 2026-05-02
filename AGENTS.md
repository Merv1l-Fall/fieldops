<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:zod-agent-rules -->
# Remember to check the latest info when creating a zod schema.

For example z.string().email() is old standard and you only need z.email()
<!-- END:zod-agent-rules -->

<!-- BEGIN:fieldops-agent-rules -->
# FieldOps — Full Autonomous Build Context

You have full freedom to build, create files, install packages, and make decisions without asking. This is a dev branch with an empty database. Just build.

---

## What is FieldOps
An airsoft field management SaaS. Field owners create and manage game day events. Players register via a public booking link. Built to replace Facebook posts and manual headcounts.

---

## Stack
- **Next.js 16** (App Router, Server Actions, TypeScript strict mode)
- **Supabase** — Postgres + Auth + RLS. Use `@supabase/ssr` for server components and middleware. Use browser client only in client components.
- **Tailwind CSS + shadcn/ui** — New York style, Zinc base color
- **Stripe** — optional, only when event `payment_mode = 'online'`
- **Resend** — transactional email for reminders
- **Vercel** — hosting + cron jobs

---

## Folder structure
src/
├── app/
│   ├── (auth)/               # login, signup
│   ├── (dashboard)/          # field owner views and player dashboard (most of the player dashboard is complete)
│   ├── (public)/             # player-facing booking pages
│   └── api/
│       ├── stripe/webhook/   # POST only
│       └── send-reminders/   # POST only, called by Vercel cron
├── actions/                  # ALL Server Actions go here
├── components/
│   ├── ui/                   # shadcn components
│   └── fieldops/             # app-specific components
├── emails/                   # React Email templates
└── lib/
├── supabase/
│   ├── client.ts         # browser client
│   └── server.ts         # server client
└── stripe.ts

---

## Coding conventions

### Server Actions vs API routes
- **Server Action** = anything triggered by a user in the UI (form submit, button click)
- **API route** = only for external callers: Stripe webhook and Vercel cron
- Never create additional API routes — use Server Actions instead

### Server Actions pattern
```ts
"use server"
import { createServerClient } from "@/lib/supabase/server"

export async function exampleAction(formData: FormData) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")
  // ...
}
```

### Supabase client pattern
```ts
// Server component or action
import { createServerClient } from "@/lib/supabase/server"
const supabase = await createServerClient()

// Client component
import { createBrowserClient } from "@/lib/supabase/client"
const supabase = createBrowserClient()
```

### Money
- Always store as **integer cents** (1500 = 15.00 SEK)
- Never use floats for money
- Display with: `(amount / 100).toFixed(2)`

### Error handling
- Server Actions return `{ error: string } | { data: T }` — never throw to the client
- Use toast notifications for user feedback via shadcn toast

### TypeScript
- Strict mode is on — no `any`, no `!` non-null assertions
- Generate Supabase types from the CLI and import from `@/lib/supabase/types`

---

## Database schema

### profiles
```sql
id uuid PK (matches auth.users.id)
full_name text
email text
role text -- 'owner' or 'player'
avatar_url text
username text
created_at timestamptz
```

### fields
```sql
id uuid PK
owner_id uuid FK → profiles.id
name text
location text
created_at timestamptz
```

### events
```sql
id uuid PK
field_id uuid FK → fields.id
name text
date timestamptz
max_players int4
price_cents int4
status text -- 'draft' | 'published' | 'cancelled'
payment_mode text -- 'online' | 'onsite'
waiver_enabled bool default false
reminder_enabled bool default true
created_at timestamptz
```

### bookings
```sql
id uuid PK
event_id uuid FK → events.id
player_id uuid FK → profiles.id
stripe_session_id text -- nullable, only if payment_mode = online
payment_status text -- 'pending' | 'paid' | 'onsite'
reminder_sent_7d bool default false
reminder_sent_1d bool default false
created_at timestamptz
```

### waivers
```sql
id uuid PK
booking_id uuid FK → bookings.id (1-to-1)
signed bool default false
signed_at timestamptz
ip_address text
```

### notifications
```sql
id uuid PK
user_id uuid FK → profiles.id
type text
message text
read bool default false
created_at timestamptz
```

### favourites
```sql
id uuid PK
player_id uuid FK → profiles.id
field_id uuid FK → fields.id
created_at timestamptz
```

---

## Optional features — read before implementing

### Stripe (optional per event)
- Only wire up Stripe when `event.payment_mode === 'online'`
- Never show payment UI for onsite events
- `createCheckoutSession` is a Server Action, not an API route
- The webhook at `POST /api/stripe/webhook` sets `booking.payment_status = 'paid'`
- Match webhook to booking via `stripe_session_id`

### Waivers (optional per event, not essential right now so skip this)
- Only show waiver flow when `event.waiver_enabled === true`
- Player signs via QR code on arrival → `/sign/[bookingId]`
- Store `signed_at` and `ip_address` as proof

---

## Email reminders
- Sent 7 days and 1 day before event date
- Only when `event.reminder_enabled = true`
- Check `booking.reminder_sent_7d` / `reminder_sent_1d` before sending — never send twice
- Cron hits `POST /api/send-reminders` daily at 08:00
- `vercel.json`:
```json
{
  "crons": [{ "path": "/api/send-reminders", "schedule": "0 8 * * *" }]
}
```

---

## What is already built
- ✅ Auth (login, signup, middleware, Supabase client helpers, profile auto-creation)
- ✅ DB migrations (all tables above)
- ✅ RLS policies

## What needs to be built

- [ ] Field creation flow (owner onboarding)
- [ ] Event creation form + Server Action
- [ ] Owner dashboard (list events, spots, status)
- [ ] Public booking page `/events/[id]`
- [ ] Player registration Server Action
- [ ] Stripe checkout flow (optional, payment_mode = online only)
- [ ] Stripe webhook route
- [ ] Waiver signing flow (optional, waiver_enabled only)
- [ ] Email reminder template (React Email)
- [ ] `/api/send-reminders` cron route
- [ ] Notifications UI
- [ ] Favourites functionality
- [ ] Deploy config (vercel.json with cron)

<!-- END:fieldops-agent-rules -->