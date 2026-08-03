-- Cierra el acceso directo de los usuarios autenticados a los datos del colegio.
--
-- Problema: la política anterior permitía a cualquier persona con perfil leer
-- todo app_records de su institución. Como la llave pública (anon) viaja en el
-- navegador, bastaba con autenticarse y consultar la tabla directamente para
-- obtener las 1.030 fichas completas —con alertas de salud, antecedentes y
-- datos de apoderados— saltándose por completo el filtrado por cargo que hace
-- /api/records.
--
-- Solución: los datos del colegio se leen únicamente a través de las rutas de
-- servidor, que usan la llave de servicio y aplican los permisos según el
-- cargo (ver src/lib/access-control.ts). Para el rol `authenticated` no queda
-- ninguna política de lectura, así que RLS deniega todo por defecto.
--
-- Marco legal: Ley 19.628 y Ley 21.719 — los datos de salud de menores son
-- datos sensibles y exigen acceso restringido al mínimo necesario.

-- app_records: sin política = sin acceso directo. La llave de servicio no pasa
-- por RLS, así que las rutas del servidor siguen funcionando igual.
drop policy if exists "app_records_read_own_institution" on public.app_records;

-- Los registros de orientación antiguos siguen la misma regla.
drop policy if exists "orientation_records_read_own_institution" on public.orientation_records;

-- La bitácora de auditoría no debe ser legible por quien es auditado.
drop policy if exists "audit_logs_read_own_institution" on public.audit_logs;

-- Cada persona sí puede leer su propio perfil (lo necesita para saber su cargo)
-- pero no el de los demás, y en ningún caso puede modificarlo: cambiarse el
-- cargo sería escalar privilegios.
drop policy if exists "profiles_read_own" on public.profiles;
create policy "profiles_read_own"
on public.profiles for select
using (auth.uid() = id);

-- Sin políticas de insert/update/delete para `authenticated`: el cargo sólo lo
-- asigna el servidor a partir de la nómina oficial de funcionarios.

-- Refuerzo explícito: RLS se aplica también al dueño de las tablas.
alter table public.app_records force row level security;
alter table public.profiles force row level security;
alter table public.audit_logs force row level security;
alter table public.orientation_records force row level security;

-- Quita permisos de tabla al rol público y autenticado. Aunque RLS ya deniega,
-- esto evita que una política futura mal escrita reabra el acceso.
revoke all on public.app_records from anon, authenticated;
revoke all on public.audit_logs from anon, authenticated;
revoke all on public.orientation_records from anon, authenticated;
revoke all on public.institutions from anon, authenticated;
revoke insert, update, delete on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
