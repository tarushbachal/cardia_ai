-- Cardia AI — initial schema (§5.2).
-- Tables: profiles, readings. RLS is default-deny once enabled; precise policies
-- keyed to auth.uid() then allow a user to touch only their own rows (§5.1).

-- ── profiles ────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ── readings ────────────────────────────────────────────────────────────────
-- Full assessment snapshot (inputs + results + composite) stored as JSONB so a
-- saved reading stays interpretable after a guideline-version bump.
create table if not exists public.readings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  payload jsonb not null,
  guideline_version text not null,
  created_at timestamptz not null default now()
);

create index if not exists readings_user_id_created_at_idx
  on public.readings (user_id, created_at desc);

-- ── Row Level Security ───────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.readings enable row level security;

-- profiles: a user may read and maintain only their own profile row
create policy "profiles_select_own"
  on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own"
  on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own"
  on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- readings: a user may CRUD only their own readings
create policy "readings_select_own"
  on public.readings for select using (auth.uid() = user_id);
create policy "readings_insert_own"
  on public.readings for insert with check (auth.uid() = user_id);
create policy "readings_update_own"
  on public.readings for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "readings_delete_own"
  on public.readings for delete using (auth.uid() = user_id);

-- ── Auto-provision a profile on signup (Phase 2 convenience) ─────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, nullif(new.raw_user_meta_data ->> 'display_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
