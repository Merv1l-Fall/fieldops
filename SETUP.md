# FieldOps Setup Guide

This guide outlines all the configuration and setup needed to get FieldOps running in production.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Supabase
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

### Stripe (Optional - for online payments)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Resend (Email)
```
RESEND_API_KEY=re_...
```

### Vercel Cron (for email reminders)
```
CRON_SECRET=your_random_secret
```

### App URL
```
NEXT_PUBLIC_APP_URL=http://localhost:3000 # or your domain in production
```

## Database Setup

The database migrations are already set up in Supabase. Tables created:
- profiles
- fields
- events
- bookings
- waivers
- notifications
- favourites

### RLS Policies
All Row Level Security policies have been configured. Verify in Supabase dashboard that:
- Players can only see their own bookings
- Owners can only manage their own fields and events
- Public events are visible to all authenticated users

## Stripe Setup (if using online payments)

1. Create a Stripe account at stripe.com
2. Go to Settings > API Keys and copy your keys
3. Create a webhook endpoint pointing to: `https://your-domain.com/api/stripe/webhook`
4. Copy the webhook signing secret
5. Add all three secrets to `.env.local`

## Vercel Cron Setup

The cron job for sending email reminders is configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/send-reminders",
      "schedule": "0 8 * * *"
    }
  ]
}
```

This runs daily at 08:00 UTC. When deployed to Vercel, set the `CRON_SECRET` environment variable.

## Resend Email Setup

1. Create a Resend account at resend.com
2. Create a domain (required for production emails)
3. Copy your API key to `RESEND_API_KEY` in `.env.local`
4. Update the email template to use your domain in `.env.local`: `NEXT_PUBLIC_APP_URL`

## Features Implemented

✅ **Authentication**
- Email/password registration and login
- Supabase Auth with automatic profile creation
- Role-based access (owner/player)

✅ **Field Management**
- Create and manage fields (owners only)
- Field creation onboarding flow

✅ **Event Management**
- Create events with date, time, capacity, pricing
- Event status tracking (open/full/cancelled)
- Payment mode selection (online/onsite)
- Optional waivers and reminders

✅ **Player Booking**
- Browse public events
- Book events with capacity checking
- Payment integration (Stripe - optional)
- Waiver signing on arrival (optional)
- Email reminders 7 days and 1 day before

✅ **Email Reminders**
- Automated 7-day and 1-day event reminders
- React Email templates
- Vercel Cron scheduling

✅ **Favourites**
- Players can favourite fields
- Favourite button component

✅ **Notifications**
- Notification bell UI component
- In-app notifications system

✅ **Admin/Owner Dashboard**
- View all owned fields and events
- Manage events (edit, view bookings)
- See upcoming and past events

## Testing Checklist

- [ ] Register as owner and player accounts
- [ ] Create a field
- [ ] Create an event with test data
- [ ] Browse public events as player
- [ ] Book an event (test payment if enabled)
- [ ] Test waiver signing
- [ ] Check email reminders (use Resend test API)
- [ ] Test Stripe webhook locally with stripe-cli

## Deployment

### Prerequisites
- Vercel account (for hosting)
- Supabase project
- Stripe account (if using payments)
- Resend account (for emails)

### Steps
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel project settings
4. Deploy
5. Update Stripe webhook URL to production domain
6. Update CORS origins in Supabase for production domain

## Security Notes

1. Never commit `.env.local` to version control
2. Use different keys for development and production
3. Stripe webhook secret should only be on server
4. Supabase RLS policies enforce authorization
5. Server Actions handle sensitive operations

## Customization

### Email Templates
Located in `/app/emails/`. Modify `EventReminder.tsx` to customize email design.

### Payment
To customize payment behavior:
1. Edit `lib/stripe.ts` for checkout parameters
2. Modify webhook handling in `app/api/stripe/webhook/route.ts`
3. Update booking response in `EventBookingClient.tsx`

### UI Theme
- Use shadcn/ui components from `/components/ui/`
- Tailwind CSS configuration in `tailwind.config.ts`
- Color scheme: Zinc base with blue accents

## Troubleshooting

### Emails not sending
- Check RESEND_API_KEY is correct
- Verify domain is configured in Resend
- Check Vercel Cron logs in Vercel dashboard

### Stripe errors
- Verify webhook secret is correct
- Check Stripe API version in `lib/stripe.ts`
- Test with Stripe test keys first

### Database errors
- Verify Supabase credentials are correct
- Check RLS policies are enabled
- Ensure tables exist with correct schema

## Next Steps

1. Customize branding and colors
2. Add admin analytics dashboard
3. Implement player team/squad functionality
4. Add event photos/media upload
5. Implement in-app chat for field discussions
6. Add equipment rental system
