-- Amplía las entidades permitidas en app_records para incluir las reuniones
-- (GP), el personal y la configuración, además de las ya existentes.
alter table public.app_records
  drop constraint if exists app_records_entity_check;

alter table public.app_records
  add constraint app_records_entity_check check (
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
  );
