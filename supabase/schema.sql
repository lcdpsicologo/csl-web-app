create table if not exists public.orientation_records (
  id bigint primary key,
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

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_orientation_records_updated_at on public.orientation_records;

create trigger set_orientation_records_updated_at
before update on public.orientation_records
for each row
execute function public.set_updated_at();

alter table public.orientation_records enable row level security;

drop policy if exists "orientation_records_server_only" on public.orientation_records;

create policy "orientation_records_server_only"
on public.orientation_records
for all
using (false)
with check (false);

insert into public.orientation_records (
  id,
  sem,
  date,
  cycle,
  course,
  action,
  topic,
  status,
  observations,
  evidence_link,
  planning_link
) values
  (1, '18/05 al 22/05 (Semana 12)', '2026-05-19', '1° Ciclo', 'Pre Kinder B', 'Hago las cosas bien', 'Sesión 4', 'Realizado', 'La araña hacendosa', 'https://canva.link/x83vxwd4h45p6gb', 'https://drive.google.com/'),
  (2, '18/05 al 22/05 (Semana 12)', '2026-05-20', '1° Ciclo', 'Pre Kinder C', 'Hago las cosas bien', 'Sesión 4', 'Realizado', 'La araña hacendosa', 'https://canva.link/x83vxwd4h45p6gb', 'https://drive.google.com/'),
  (3, '18/05 al 22/05 (Semana 12)', '2026-05-21', '1° Ciclo', 'Kinder A', 'Hago las cosas bien', 'Sesión 3', 'Pendiente', 'El desorden de Franklin', 'https://canva.link/i4asqi5qao0qr9t', ''),
  (4, '18/05 al 22/05 (Semana 12)', '2026-05-22', '1° Ciclo', 'Kinder C', 'Intervención Formativa', 'Sesión 1', 'Realizado', 'Kinder C juega con cuidado y buen trato', 'https://canva.link/la4qtzcfajo6rcc', 'https://drive.google.com/'),
  (5, '18/05 al 22/05 (Semana 12)', '2026-05-18', '1° Ciclo', '1° Básico A', 'Intervención Formativa', 'Sesión 1', 'Realizado', 'Devolución de prueba DIA socioemocional', 'https://canva.link/y860v75hqwkhdd4p', 'https://drive.google.com/'),
  (6, '18/05 al 22/05 (Semana 12)', '2026-05-22', '1° Ciclo', '2° Básico A', 'Intervención Formativa', 'Sesión 1', 'Pendiente', 'Devolución de prueba DIA socioemocional', 'https://canva.link/e75srmdmto1vsms', ''),
  (7, '18/05 al 22/05 (Semana 12)', '2026-05-18', '1° Ciclo', '4° Básico A', 'Intervención Formativa', 'Sesión 1', 'Realizado', 'Devolución de prueba DIA socioemocional. Durante la clase acompaña Subdirectora Valeska, Profesora Catalina y Orientador.', 'https://canva.link/irg9u9ntpra8vyp', 'https://drive.google.com/')
on conflict (id) do nothing;
