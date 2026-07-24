create extension if not exists "pgcrypto";

create table if not exists public.institutions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  institution_id uuid references public.institutions(id) on delete set null,
  full_name text default '',
  role text not null default 'orientacion',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_records (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  entity text not null check (
    entity in (
      'students',
      'courses',
      'cases',
      'logs',
      'interviews',
      'protocols',
      'orientation',
      'workshops',
      'personnel',
      'documents',
      'meetings',
      'settings'
    )
  ),
  record_id text not null,
  data jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (institution_id, entity, record_id)
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid references public.institutions(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.orientation_records (
  id bigint primary key,
  institution_id uuid references public.institutions(id) on delete cascade,
  sem text default '',
  date date not null,
  cycle text not null,
  course text not null,
  action text not null,
  topic text default '',
  status text not null default 'Pendiente',
  observations text default '',
  evidence_link text default '',
  planning_link text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.orientation_records
  add column if not exists institution_id uuid references public.institutions(id) on delete cascade,
  add column if not exists date date,
  add column if not exists cycle text default '',
  add column if not exists course text default '',
  add column if not exists action text default '',
  add column if not exists status text default 'Pendiente',
  add column if not exists sem text default '',
  add column if not exists topic text default '',
  add column if not exists observations text default '',
  add column if not exists evidence_link text default '',
  add column if not exists planning_link text default '',
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_institutions_updated_at on public.institutions;
create trigger set_institutions_updated_at
before update on public.institutions
for each row execute function public.set_updated_at();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_app_records_updated_at on public.app_records;
create trigger set_app_records_updated_at
before update on public.app_records
for each row execute function public.set_updated_at();

drop trigger if exists set_orientation_records_updated_at on public.orientation_records;
create trigger set_orientation_records_updated_at
before update on public.orientation_records
for each row execute function public.set_updated_at();

alter table public.institutions enable row level security;
alter table public.profiles enable row level security;
alter table public.app_records enable row level security;
alter table public.audit_logs enable row level security;
alter table public.orientation_records enable row level security;

drop policy if exists "profiles_read_own" on public.profiles;
create policy "profiles_read_own"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "institutions_read_own" on public.institutions;
create policy "institutions_read_own"
on public.institutions for select
using (
  id in (
    select institution_id
    from public.profiles
    where profiles.id = auth.uid()
  )
);

drop policy if exists "app_records_read_own_institution" on public.app_records;
create policy "app_records_read_own_institution"
on public.app_records for select
using (
  institution_id in (
    select institution_id
    from public.profiles
    where profiles.id = auth.uid()
  )
);

drop policy if exists "audit_logs_read_own_institution" on public.audit_logs;
create policy "audit_logs_read_own_institution"
on public.audit_logs for select
using (
  institution_id in (
    select institution_id
    from public.profiles
    where profiles.id = auth.uid()
  )
);

drop policy if exists "orientation_records_read_own_institution" on public.orientation_records;
create policy "orientation_records_read_own_institution"
on public.orientation_records for select
using (
  institution_id in (
    select institution_id
    from public.profiles
    where profiles.id = auth.uid()
  )
);

insert into public.institutions (name, slug)
values ('Colegio San Lucas', 'colegio-san-lucas')
on conflict (slug) do nothing;
