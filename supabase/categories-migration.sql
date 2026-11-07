-- Run this in Supabase SQL Editor if the app reports that
-- public.business_categories is missing from the schema cache.
create extension if not exists pgcrypto;

create table if not exists public.business_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

alter table public.business_categories enable row level security;

drop policy if exists "Authenticated users can read categories" on public.business_categories;
drop policy if exists "Authenticated users can create categories" on public.business_categories;
drop policy if exists "Authenticated users can update categories" on public.business_categories;
drop policy if exists "Authenticated users can delete categories" on public.business_categories;

create policy "Authenticated users can read categories"
  on public.business_categories for select to authenticated using (true);
create policy "Authenticated users can create categories"
  on public.business_categories for insert to authenticated with check (true);
create policy "Authenticated users can update categories"
  on public.business_categories for update to authenticated using (true) with check (true);
create policy "Authenticated users can delete categories"
  on public.business_categories for delete to authenticated using (true);

insert into public.business_categories (name) values
  ('Aluminium Fabrication'),
  ('Waterproofing'),
  ('Wedding Stage Work')
on conflict (name) do nothing;

notify pgrst, 'reload schema';
