-- ═══════════════════════════════════════════════════════════════════
-- FURVO — Seed data (ejecutar DESPUÉS de schema.sql)
-- ═══════════════════════════════════════════════════════════════════

-- Algunas selecciones de ejemplo (añade las 48 del Mundial 2026)
insert into public.teams (code, name, flag, group_letter) values
  ('ESP', 'España', '🇪🇸', 'A'),
  ('ARG', 'Argentina', '🇦🇷', 'B'),
  ('FRA', 'Francia', '🇫🇷', 'C'),
  ('BRA', 'Brasil', '🇧🇷', 'D'),
  ('ALE', 'Alemania', '🇩🇪', 'B'),
  ('ING', 'Inglaterra', '🇬🇧', 'E'),
  ('URY', 'Uruguay', '🇺🇾', 'A'),
  ('CAN', 'Canadá', '🇨🇦', 'C'),
  ('JPN', 'Japón', '🇯🇵', 'D'),
  ('MEX', 'México', '🇲🇽', 'F'),
  ('USA', 'Estados Unidos', '🇺🇸', 'F'),
  ('POR', 'Portugal', '🇵🇹', 'E')
on conflict (code) do nothing;

-- Ejemplo de jornada 4
insert into public.matches (id, jornada_number, home_team, away_team, kickoff_at, special) values
  ('m_esp_ury_j4', 4, 'ESP', 'URY', now() + interval '2 days', null),
  ('m_arg_ale_j4', 4, 'ARG', 'ALE', now() + interval '2 days 3 hours', 'double'),
  ('m_fra_can_j4', 4, 'FRA', 'CAN', now() + interval '3 days', null),
  ('m_bra_jpn_j4', 4, 'BRA', 'JPN', now() + interval '3 days 3 hours', 'exact'),
  ('m_ing_por_j4', 4, 'ING', 'POR', now() + interval '4 days', 'double'),
  ('m_mex_usa_j4', 4, 'MEX', 'USA', now() + interval '4 days 3 hours', null)
on conflict (id) do nothing;
