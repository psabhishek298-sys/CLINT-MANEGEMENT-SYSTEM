-- TRUQEN CRM initial schema. Run in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  company_name text not null,
  mobile_number text not null,
  normalized_mobile text generated always as (regexp_replace(regexp_replace(mobile_number, '[^0-9]', '', 'g'), '^0+', '')) stored,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint clients_owner_phone_unique unique (owner_id, normalized_mobile)
);

create index if not exists clients_owner_created_idx on public.clients(owner_id, created_at desc);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  activity_type text not null,
  description text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists activities_owner_created_idx on public.activities(owner_id, created_at desc);
create index if not exists activities_client_created_idx on public.activities(client_id, created_at desc);

create table if not exists public.business_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

insert into public.business_categories (name) values
  ('Aluminium Fabrication'),
  ('Waterproofing'),
  ('Wedding Stage Work')
on conflict (name) do nothing;

alter table public.clients enable row level security;
alter table public.activities enable row level security;
alter table public.business_categories enable row level security;

drop policy if exists "Owners can read their clients" on public.clients;
drop policy if exists "Owners can create their clients" on public.clients;
drop policy if exists "Owners can update their clients" on public.clients;
drop policy if exists "Owners can delete their clients" on public.clients;
drop policy if exists "Owners can read their activities" on public.activities;
drop policy if exists "Owners can create their activities" on public.activities;
drop policy if exists "Owners can update their activities" on public.activities;
drop policy if exists "Owners can delete their activities" on public.activities;
drop policy if exists "Authenticated users can read categories" on public.business_categories;
drop policy if exists "Authenticated users can create categories" on public.business_categories;
drop policy if exists "Authenticated users can update categories" on public.business_categories;
drop policy if exists "Authenticated users can delete categories" on public.business_categories;

create policy "Owners can read their clients" on public.clients for select to authenticated using (auth.uid() = owner_id);
create policy "Owners can create their clients" on public.clients for insert to authenticated with check (auth.uid() = owner_id);
create policy "Owners can update their clients" on public.clients for update to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "Owners can delete their clients" on public.clients for delete to authenticated using (auth.uid() = owner_id);

create policy "Owners can read their activities" on public.activities for select to authenticated using (auth.uid() = owner_id);
create policy "Owners can create their activities" on public.activities for insert to authenticated with check (auth.uid() = owner_id);
create policy "Owners can update their activities" on public.activities for update to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "Owners can delete their activities" on public.activities for delete to authenticated using (auth.uid() = owner_id);

create policy "Authenticated users can read categories" on public.business_categories for select to authenticated using (true);
create policy "Authenticated users can create categories" on public.business_categories for insert to authenticated with check (true);
create policy "Authenticated users can update categories" on public.business_categories for update to authenticated using (true) with check (true);
create policy "Authenticated users can delete categories" on public.business_categories for delete to authenticated using (true);
