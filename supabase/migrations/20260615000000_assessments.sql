-- Cardia AI — Phase 2.1: anonymous encrypted assessment capture.
-- No accounts/auth. The browser never touches this table: all access is via the
-- service role from the server. Sensitive values live encrypted in `ciphertext`;
-- de-identified categories live in plaintext for analytics (no raw values).

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique,            -- client-generated; idempotency key
  anon_id uuid,                                   -- stable pseudonymous browser id (nullable)
  ciphertext text not null,                       -- AES-256-GCM packed blob (values + age/sex)
  enc_version smallint not null default 1,        -- key/algorithm version (rotation)
  -- de-identified plaintext for analytics (NO raw values, NO exact age):
  sex text check (sex in ('male', 'female')),
  age_band text,                                  -- '18-29','30-39',...,'70-79','80+'
  markers_entered smallint not null,
  within_range smallint not null,
  composite_signal text check (composite_signal in ('steady', 'mixed', 'review')),
  tiers jsonb not null default '{}'::jsonb,        -- { ldl:'optimal', hdl:'attention', ... } categories only
  guideline_version text not null,
  created_at timestamptz not null default now()
);

create index if not exists assessments_anon_created_idx
  on public.assessments (anon_id, created_at desc);
create index if not exists assessments_created_idx
  on public.assessments (created_at desc);
create index if not exists assessments_signal_idx
  on public.assessments (composite_signal);

-- RLS enabled with NO policies → the table is reachable ONLY by the service role.
-- The anon key (and therefore any browser/client) can neither read nor write it.
alter table public.assessments enable row level security;
