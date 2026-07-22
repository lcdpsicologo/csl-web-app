create extension if not exists "pgcrypto";

create table if not exists public.attendance_cart_rewards (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  name text not null,
  description text not null default '',
  ticket_cost smallint not null check (ticket_cost in (1, 4, 8)),
  minimum_stock integer not null default 3 check (minimum_stock >= 0),
  active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.attendance_cart_redemptions (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  student_record_id text not null,
  student_name text not null,
  course text not null,
  reward_id uuid not null references public.attendance_cart_rewards(id) on delete restrict,
  reward_name text not null,
  tickets_spent smallint not null check (tickets_spent in (1, 4, 8)),
  note text not null default '',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.attendance_cart_ticket_ledger (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  student_record_id text not null,
  student_name text not null,
  course text not null,
  delta integer not null check (delta <> 0),
  kind text not null check (kind in ('award', 'redemption', 'adjustment')),
  week_start date,
  redemption_id uuid references public.attendance_cart_redemptions(id) on delete restrict,
  note text not null default '',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create unique index if not exists attendance_cart_one_weekly_ticket
  on public.attendance_cart_ticket_ledger (institution_id, student_record_id, week_start)
  where kind = 'award';

create table if not exists public.attendance_cart_inventory_ledger (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  reward_id uuid not null references public.attendance_cart_rewards(id) on delete restrict,
  delta integer not null check (delta <> 0),
  kind text not null check (kind in ('initial', 'purchase', 'redemption', 'loss', 'adjustment')),
  redemption_id uuid references public.attendance_cart_redemptions(id) on delete restrict,
  note text not null default '',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists attendance_cart_ticket_student_idx
  on public.attendance_cart_ticket_ledger (institution_id, student_record_id, created_at desc);
create index if not exists attendance_cart_inventory_reward_idx
  on public.attendance_cart_inventory_ledger (institution_id, reward_id, created_at desc);
create index if not exists attendance_cart_redemptions_created_idx
  on public.attendance_cart_redemptions (institution_id, created_at desc);

drop trigger if exists set_attendance_cart_rewards_updated_at on public.attendance_cart_rewards;
create trigger set_attendance_cart_rewards_updated_at
before update on public.attendance_cart_rewards
for each row execute function public.set_updated_at();

alter table public.attendance_cart_rewards enable row level security;
alter table public.attendance_cart_redemptions enable row level security;
alter table public.attendance_cart_ticket_ledger enable row level security;
alter table public.attendance_cart_inventory_ledger enable row level security;

drop policy if exists "attendance_cart_rewards_read_own" on public.attendance_cart_rewards;
create policy "attendance_cart_rewards_read_own" on public.attendance_cart_rewards for select
using (institution_id in (select institution_id from public.profiles where id = auth.uid()));

drop policy if exists "attendance_cart_redemptions_read_own" on public.attendance_cart_redemptions;
create policy "attendance_cart_redemptions_read_own" on public.attendance_cart_redemptions for select
using (institution_id in (select institution_id from public.profiles where id = auth.uid()));

drop policy if exists "attendance_cart_tickets_read_own" on public.attendance_cart_ticket_ledger;
create policy "attendance_cart_tickets_read_own" on public.attendance_cart_ticket_ledger for select
using (institution_id in (select institution_id from public.profiles where id = auth.uid()));

drop policy if exists "attendance_cart_inventory_read_own" on public.attendance_cart_inventory_ledger;
create policy "attendance_cart_inventory_read_own" on public.attendance_cart_inventory_ledger for select
using (institution_id in (select institution_id from public.profiles where id = auth.uid()));

create or replace function public.redeem_attendance_cart_reward(
  p_institution_id uuid,
  p_actor_id uuid,
  p_student_record_id text,
  p_student_name text,
  p_course text,
  p_reward_id uuid,
  p_note text default ''
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reward public.attendance_cart_rewards%rowtype;
  v_balance integer;
  v_stock integer;
  v_redemption_id uuid;
begin
  select * into v_reward
  from public.attendance_cart_rewards
  where id = p_reward_id and institution_id = p_institution_id and active = true
  for update;

  if not found then raise exception 'PREMIO_NO_DISPONIBLE'; end if;

  select coalesce(sum(delta), 0) into v_balance
  from public.attendance_cart_ticket_ledger
  where institution_id = p_institution_id and student_record_id = p_student_record_id;

  if v_balance < v_reward.ticket_cost then raise exception 'TICKETS_INSUFICIENTES'; end if;

  select coalesce(sum(delta), 0) into v_stock
  from public.attendance_cart_inventory_ledger
  where institution_id = p_institution_id and reward_id = p_reward_id;

  if v_stock < 1 then raise exception 'PREMIO_AGOTADO'; end if;

  insert into public.attendance_cart_redemptions (
    institution_id, student_record_id, student_name, course, reward_id,
    reward_name, tickets_spent, note, created_by
  ) values (
    p_institution_id, p_student_record_id, p_student_name, p_course, p_reward_id,
    v_reward.name, v_reward.ticket_cost, coalesce(p_note, ''), p_actor_id
  ) returning id into v_redemption_id;

  insert into public.attendance_cart_ticket_ledger (
    institution_id, student_record_id, student_name, course, delta, kind,
    redemption_id, note, created_by
  ) values (
    p_institution_id, p_student_record_id, p_student_name, p_course,
    -v_reward.ticket_cost, 'redemption', v_redemption_id, coalesce(p_note, ''), p_actor_id
  );

  insert into public.attendance_cart_inventory_ledger (
    institution_id, reward_id, delta, kind, redemption_id, note, created_by
  ) values (
    p_institution_id, p_reward_id, -1, 'redemption', v_redemption_id,
    p_student_name || ' · ' || p_course, p_actor_id
  );

  return v_redemption_id;
end;
$$;

revoke all on function public.redeem_attendance_cart_reward(uuid, uuid, text, text, text, uuid, text) from public;
grant execute on function public.redeem_attendance_cart_reward(uuid, uuid, text, text, text, uuid, text) to service_role;
