-- Cardia — billing: subscription state on the user profile.
-- The webhook (service role) writes these; the user can read their own row via
-- the existing profiles_select_own RLS policy.

alter table public.profiles
  add column if not exists stripe_customer_id text unique,
  add column if not exists plan text not null default 'free',
  add column if not exists subscription_status text,
  add column if not exists current_period_end timestamptz;

create index if not exists profiles_stripe_customer_idx
  on public.profiles (stripe_customer_id);
