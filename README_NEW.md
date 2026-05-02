# FieldOps: Airsoft Event Management Platform

FieldOps is a complete booking and management system for airsoft field operators and players.

- **Field owners** create and manage events
- **Players** browse events and book spots
- **Automated** email reminders and payment processing
- **Optional** waiver signing and Stripe integration

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase project
- (Optional) Stripe account for online payments
- (Optional) Resend account for emails

### Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment template:
```bash
cp .env.example .env.local
```

3. Fill in your environment variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_key
# ... other variables
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

```
app/
├── (auth)/              # Login & signup pages
├── (dashboard)/         # Dashboard & management pages
│   ├── dashboard/       # Player dashboard
│   ├── owner/          # Owner dashboard
│   ├── create-field/   # Field creation flow
│   └── create-event/   # Event creation form
├── (public)/           # Public pages
│   ├── events/[id]/    # Public event details & booking
│   ├── sign/[id]/      # Waiver signing page
│   └── booking/        # Booking confirmation
├── api/
│   ├── stripe/webhook/ # Stripe payment webhook
│   └── send-reminders/ # Email reminder cron job
└── actions/            # Server Actions
```

## Features

### ✅ Implemented

- **Authentication** - Email/password with Supabase Auth
- **Field Management** - Create and manage airsoft fields
- **Event Creation** - Set up events with pricing, capacity, date/time
- **Event Booking** - Players can book spots with capacity checking
- **Payment** - Optional Stripe integration for online payments
- **Waivers** - Optional waiver signing on event arrival
- **Email Reminders** - 7-day and 1-day automated reminders
- **Favourites** - Players can favourite fields
- **Notifications** - In-app notification system
- **Owner Dashboard** - Manage events and bookings
- **Public Pages** - Browse and book events

## Configuration

All features are configurable per event:
- **Payment Mode**: Online (Stripe) or On-site
- **Pricing**: Set custom prices per event
- **Capacity**: Limit max players
- **Waivers**: Require/skip waiver signing
- **Reminders**: Enable/disable email reminders

## Technology Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Supabase** - PostgreSQL + Auth
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Stripe** - Payment processing
- **Resend** - Email service
- **React Email** - Email templates

## Deployment

See [SETUP.md](./SETUP.md) for complete deployment guide.

### Quick Deploy to Vercel

1. Push code to GitHub
2. Connect repo to Vercel
3. Add environment variables
4. Deploy

The cron job for email reminders is configured in `vercel.json`.

## API Routes

### Public Routes
- `POST /auth/callback` - Supabase OAuth callback

### Protected Routes
- `GET /api/send-reminders` - Email reminder cron (Vercel scheduled)
- `POST /api/stripe/webhook` - Stripe payment webhook

## Environment Variables

Required:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Optional (for full functionality):
```
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
RESEND_API_KEY
CRON_SECRET
NEXT_PUBLIC_APP_URL
```

See `.env.example` for template.

## Database

Uses Supabase PostgreSQL with tables:
- `profiles` - User profiles with roles
- `fields` - Airsoft fields/venues
- `events` - Game day events
- `bookings` - Player bookings
- `waivers` - Event waivers
- `notifications` - In-app notifications
- `favourites` - Favourite fields

All tables have Row Level Security (RLS) enforced.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

## License

MIT
