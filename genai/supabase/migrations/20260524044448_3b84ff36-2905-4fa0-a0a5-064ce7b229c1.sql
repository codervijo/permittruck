
create table public.permits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  city text not null,
  business_name text not null,
  permit_number text,
  issued_date date,
  expires_date date,
  status text not null default 'active',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.permits enable row level security;

create policy "users select own permits" on public.permits
  for select to authenticated using (auth.uid() = user_id);
create policy "users insert own permits" on public.permits
  for insert to authenticated with check (auth.uid() = user_id);
create policy "users update own permits" on public.permits
  for update to authenticated using (auth.uid() = user_id);
create policy "users delete own permits" on public.permits
  for delete to authenticated using (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger permits_set_updated_at
before update on public.permits
for each row execute function public.set_updated_at();
