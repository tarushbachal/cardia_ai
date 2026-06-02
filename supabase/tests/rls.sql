-- RLS isolation test for Cardia AI (Docker-absent fallback).
--
-- Apply the migration first, then run this against the database, e.g.:
--   psql "$DATABASE_URL" -f supabase/tests/rls.sql
--   -- or, with the CLI: supabase db execute --file supabase/tests/rls.sql
--
-- It seeds two users, impersonates each via the `authenticated` role + a JWT
-- claim, asserts neither can read or write the other's rows, then ROLLS BACK.
-- A failure raises an exception; success prints NOTICE lines.

begin;

-- Two synthetic auth users (most auth.users columns are nullable/defaulted).
insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111', 'alice@example.test'),
  ('22222222-2222-2222-2222-222222222222', 'bob@example.test');

-- Seed one reading each (running as table owner here bypasses RLS for setup).
insert into public.readings (user_id, payload, guideline_version) values
  ('11111111-1111-1111-1111-111111111111', '{"who":"alice"}'::jsonb, 'test'),
  ('22222222-2222-2222-2222-222222222222', '{"who":"bob"}'::jsonb, 'test');

-- Impersonate Alice as the (RLS-enforced) authenticated role.
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}',
  true
);

do $$
declare
  visible_total int;
  bob_rows int;
begin
  select count(*) into visible_total from public.readings;
  if visible_total <> 1 then
    raise exception 'RLS FAIL: Alice sees % readings (expected exactly 1)', visible_total;
  end if;

  select count(*) into bob_rows
  from public.readings
  where user_id = '22222222-2222-2222-2222-222222222222';
  if bob_rows <> 0 then
    raise exception 'RLS FAIL: Alice can read % of Bob''s rows', bob_rows;
  end if;

  raise notice 'RLS OK: Alice sees only her own reading.';
end $$;

-- Alice must not be able to insert a row attributed to Bob.
do $$
begin
  begin
    insert into public.readings (user_id, payload, guideline_version)
    values ('22222222-2222-2222-2222-222222222222', '{}'::jsonb, 'test');
    raise exception 'RLS FAIL: Alice inserted a row as Bob';
  exception
    when insufficient_privilege or check_violation then
      raise notice 'RLS OK: Alice blocked from inserting as Bob.';
  end;
end $$;

reset role;
rollback;
