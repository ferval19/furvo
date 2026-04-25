-- ═══════════════════════════════════════════════════════════════════
-- FURVO — Mundial 2026 · Fixture completo
-- 48 equipos · 72 partidos de grupos
--
-- Grupos A-L: VERIFICADOS (calendario oficial FIFA)
-- Tiempos: originalmente en hora peruana (UTC-5) → convertidos a UTC
--
-- Estructura de jornadas:
--   J1  → MD1 de todos los grupos   (24 partidos · Jun 11–17)
--   J2  → MD2 de todos los grupos   (24 partidos · Jun 18–23)
--   J3  → MD3 simultáneos           (24 partidos · Jun 24–27)
--   J4  → Dieciseisavos (R32)       (16 partidos · Jun 28 – Jul 3)
--   J5  → Octavos de final (R16)    ( 8 partidos · Jul  4–7)
--   J6  → Cuartos de final (QF)     ( 4 partidos · Jul  9–11)
--   J7  → Semifinales               ( 2 partidos · Jul 14–15)
--   J8  → 3er puesto + Final        ( 2 partidos · Jul 18–19)
--
-- Ejecutar DESPUÉS de schema.sql
-- ═══════════════════════════════════════════════════════════════════

-- ── LIMPIEZA ─────────────────────────────────────────────────────────────────
-- Orden: predicciones → partidos → equipos (respetar FK)
delete from public.predictions
where match_id in (select id from public.matches where phase = 'grupos');

delete from public.matches where phase = 'grupos';

-- Borrar TODOS los equipos para re-insertar limpios (los partidos de grupos
-- ya fueron eliminados, por lo que no quedan FK activas sobre teams)
delete from public.teams;


-- ── EQUIPOS ────────────────────────────────────────────────────────

insert into public.teams (code, name, flag, group_letter) values

  -- ── GRUPO A ──────────────────────────────────────────────────────
  ('MEX', 'México',              '🇲🇽', 'A'),
  ('RSA', 'Sudáfrica',           '🇿🇦', 'A'),
  ('KOR', 'Corea del Sur',       '🇰🇷', 'A'),
  ('CZE', 'Rep. Checa',          '🇨🇿', 'A'),

  -- ── GRUPO B ──────────────────────────────────────────────────────
  ('CAN', 'Canadá',              '🇨🇦', 'B'),
  ('BIH', 'Bosnia-Herz.',        '🇧🇦', 'B'),
  ('QAT', 'Qatar',               '🇶🇦', 'B'),
  ('SUI', 'Suiza',               '🇨🇭', 'B'),

  -- ── GRUPO C ──────────────────────────────────────────────────────
  ('BRA', 'Brasil',              '🇧🇷', 'C'),
  ('MAR', 'Marruecos',           '🇲🇦', 'C'),
  ('HAI', 'Haití',               '🇭🇹', 'C'),
  ('SCO', 'Escocia',             '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'C'),

  -- ── GRUPO D ──────────────────────────────────────────────────────
  ('USA', 'Estados Unidos',      '🇺🇸', 'D'),
  ('PAR', 'Paraguay',            '🇵🇾', 'D'),
  ('AUS', 'Australia',           '🇦🇺', 'D'),
  ('TUR', 'Turquía',             '🇹🇷', 'D'),

  -- ── GRUPO E ──────────────────────────────────────────────────────
  ('GER', 'Alemania',            '🇩🇪', 'E'),
  ('CUW', 'Curazao',             '🇨🇼', 'E'),
  ('CIV', 'Costa de Marfil',     '🇨🇮', 'E'),
  ('ECU', 'Ecuador',             '🇪🇨', 'E'),

  -- ── GRUPO F ──────────────────────────────────────────────────────
  ('NED', 'Países Bajos',        '🇳🇱', 'F'),
  ('JPN', 'Japón',               '🇯🇵', 'F'),
  ('SWE', 'Suecia',              '🇸🇪', 'F'),
  ('TUN', 'Túnez',               '🇹🇳', 'F'),

  -- ── GRUPO G ──────────────────────────────────────────────────────
  ('BEL', 'Bélgica',             '🇧🇪', 'G'),
  ('EGY', 'Egipto',              '🇪🇬', 'G'),
  ('IRN', 'Irán',                '🇮🇷', 'G'),
  ('NZL', 'Nueva Zelanda',       '🇳🇿', 'G'),

  -- ── GRUPO H ──────────────────────────────────────────────────────
  ('ESP', 'España',              '🇪🇸', 'H'),
  ('CPV', 'Cabo Verde',          '🇨🇻', 'H'),
  ('KSA', 'Arabia Saudita',      '🇸🇦', 'H'),
  ('URU', 'Uruguay',             '🇺🇾', 'H'),

  -- ── GRUPO I ──────────────────────────────────────────────────────
  ('FRA', 'Francia',             '🇫🇷', 'I'),
  ('SEN', 'Senegal',             '🇸🇳', 'I'),
  ('IRQ', 'Irak',                '🇮🇶', 'I'),
  ('NOR', 'Noruega',             '🇳🇴', 'I'),

  -- ── GRUPO J ──────────────────────────────────────────────────────
  ('ARG', 'Argentina',           '🇦🇷', 'J'),
  ('ALG', 'Argelia',             '🇩🇿', 'J'),
  ('AUT', 'Austria',             '🇦🇹', 'J'),
  ('JOR', 'Jordania',            '🇯🇴', 'J'),

  -- ── GRUPO K ──────────────────────────────────────────────────────
  ('POR', 'Portugal',            '🇵🇹', 'K'),
  ('COD', 'RD Congo',            '🇨🇩', 'K'),
  ('UZB', 'Uzbekistán',          '🇺🇿', 'K'),
  ('COL', 'Colombia',            '🇨🇴', 'K'),

  -- ── GRUPO L ──────────────────────────────────────────────────────
  ('ENG', 'Inglaterra',          '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'L'),
  ('CRO', 'Croacia',             '🇭🇷', 'L'),
  ('GHA', 'Ghana',               '🇬🇭', 'L'),
  ('PAN', 'Panamá',              '🇵🇦', 'L')

on conflict (code) do update set
  name         = excluded.name,
  flag         = excluded.flag,
  group_letter = excluded.group_letter;


-- ── PARTIDOS ─────────────────────────────────────────────────────────────────
--
-- Horario fuente: hora peruana (UTC-5)
-- Conversión: UTC = hora peruana + 5h
--   11h  Peru → 16:00 UTC       7pm Peru → 00:00 UTC (día+1)
--   12h  Peru → 17:00 UTC       8pm Peru → 01:00 UTC (día+1)
--    2pm Peru → 19:00 UTC       9pm Peru → 02:00 UTC (día+1)
--    3pm Peru → 20:00 UTC      10pm Peru → 03:00 UTC (día+1)
--  3:30pm Peru → 20:30 UTC     11pm Peru → 04:00 UTC (día+1)
--    4pm Peru → 21:00 UTC
--    5pm Peru → 22:00 UTC
--    6pm Peru → 23:00 UTC
--  6:30pm Peru → 23:30 UTC
-- ─────────────────────────────────────────────────────────────────────────────

insert into public.matches
  (id, jornada_number, phase, home_team, away_team, kickoff_at, venue, special)
values

-- ══════════════════════════════════════════════════════════════════
-- JORNADA 1 · MD1 de todos los grupos
-- Jun 11 (jue) – Jun 17 (mié)
-- ══════════════════════════════════════════════════════════════════

-- Jue 11 Jun · Grupo A
('g_MEX_RSA', 1,'grupos','MEX','RSA','2026-06-11 19:00:00+00','Estadio Azteca, Ciudad de México',       'exact'),
('g_KOR_CZE', 1,'grupos','KOR','CZE','2026-06-12 02:00:00+00','Estadio AKRON, Guadalajara',              null),

-- Vie 12 Jun · Grupos B y D
('g_CAN_BIH', 1,'grupos','CAN','BIH','2026-06-12 19:00:00+00','BMO Field, Toronto',                     null),
('g_USA_PAR', 1,'grupos','USA','PAR','2026-06-13 01:00:00+00','SoFi Stadium, Los Ángeles',               'exact'),
('g_AUS_TUR', 1,'grupos','AUS','TUR','2026-06-13 04:00:00+00','BC Place, Vancouver',                     null),

-- Sáb 13 Jun · Grupos B y C
('g_QAT_SUI', 1,'grupos','QAT','SUI','2026-06-13 19:00:00+00','Levi''s Stadium, San Francisco',          'double'),
('g_BRA_MAR', 1,'grupos','BRA','MAR','2026-06-13 22:00:00+00','MetLife Stadium, Nueva Jersey',           'double'),
('g_HAI_SCO', 1,'grupos','HAI','SCO','2026-06-14 01:00:00+00','Gillette Stadium, Boston',                null),

-- Dom 14 Jun · Grupos E y F
('g_GER_CUW', 1,'grupos','GER','CUW','2026-06-14 17:00:00+00','NRG Stadium, Houston',                    null),
('g_NED_JPN', 1,'grupos','NED','JPN','2026-06-14 20:00:00+00','AT&T Stadium, Dallas',                    null),
('g_CIV_ECU', 1,'grupos','CIV','ECU','2026-06-14 23:00:00+00','Lincoln Financial Field, Filadelfia',    'double'),
('g_SWE_TUN', 1,'grupos','SWE','TUN','2026-06-15 02:00:00+00','Estadio BBVA, Monterrey',                 null),

-- Lun 15 Jun · Grupos G, H y J
('g_ESP_CPV', 1,'grupos','ESP','CPV','2026-06-15 16:00:00+00','Mercedes-Benz Stadium, Atlanta',          null),
('g_BEL_EGY', 1,'grupos','BEL','EGY','2026-06-15 19:00:00+00','Lumen Field, Seattle',                   null),
('g_KSA_URU', 1,'grupos','KSA','URU','2026-06-15 22:00:00+00','Hard Rock Stadium, Miami',               null),
('g_IRN_NZL', 1,'grupos','IRN','NZL','2026-06-16 01:00:00+00','SoFi Stadium, Los Ángeles',               null),
('g_AUT_JOR', 1,'grupos','AUT','JOR','2026-06-16 04:00:00+00','Levi''s Stadium, San Francisco',          null),

-- Mar 16 Jun · Grupos I y J
('g_FRA_SEN', 1,'grupos','FRA','SEN','2026-06-16 19:00:00+00','MetLife Stadium, Nueva Jersey',           'double'),
('g_IRQ_NOR', 1,'grupos','IRQ','NOR','2026-06-16 22:00:00+00','Gillette Stadium, Boston',                null),
('g_ARG_ALG', 1,'grupos','ARG','ALG','2026-06-17 01:00:00+00','Arrowhead Stadium, Kansas City',          'double'),

-- Mié 17 Jun · Grupos K y L
('g_POR_COD', 1,'grupos','POR','COD','2026-06-17 17:00:00+00','NRG Stadium, Houston',                    null),
('g_ENG_CRO', 1,'grupos','ENG','CRO','2026-06-17 20:00:00+00','AT&T Stadium, Dallas',                    'exact'),
('g_GHA_PAN', 1,'grupos','GHA','PAN','2026-06-17 23:00:00+00','BMO Field, Toronto',                      null),
('g_UZB_COL', 1,'grupos','UZB','COL','2026-06-18 02:00:00+00','Estadio Azteca, Ciudad de México',        null),


-- ══════════════════════════════════════════════════════════════════
-- JORNADA 2 · MD2 de todos los grupos
-- Jun 18 (jue) – Jun 23 (mar)
-- ══════════════════════════════════════════════════════════════════

-- Jue 18 Jun · Grupos A y B
('g_CZE_RSA', 2,'grupos','CZE','RSA','2026-06-18 16:00:00+00','Mercedes-Benz Stadium, Atlanta',          null),
('g_SUI_BIH', 2,'grupos','SUI','BIH','2026-06-18 19:00:00+00','SoFi Stadium, Los Ángeles',               'double'),
('g_CAN_QAT', 2,'grupos','CAN','QAT','2026-06-18 22:00:00+00','BC Place, Vancouver',                     null),
('g_MEX_KOR', 2,'grupos','MEX','KOR','2026-06-19 01:00:00+00','Estadio AKRON, Guadalajara',               null),
('g_TUR_PAR', 2,'grupos','TUR','PAR','2026-06-19 04:00:00+00','Levi''s Stadium, San Francisco',           null),

-- Vie 19 Jun · Grupos C y D
('g_USA_AUS', 2,'grupos','USA','AUS','2026-06-19 19:00:00+00','Lumen Field, Seattle',                    'double'),
('g_SCO_MAR', 2,'grupos','SCO','MAR','2026-06-19 22:00:00+00','Gillette Stadium, Boston',                null),
('g_BRA_HAI', 2,'grupos','BRA','HAI','2026-06-20 01:00:00+00','Lincoln Financial Field, Filadelfia',    null),
('g_TUN_JPN', 2,'grupos','TUN','JPN','2026-06-20 04:00:00+00','Estadio BBVA, Monterrey',                 null),

-- Sáb 20 Jun · Grupos E y F
('g_NED_SWE', 2,'grupos','NED','SWE','2026-06-20 17:00:00+00','NRG Stadium, Houston',                    null),
('g_GER_CIV', 2,'grupos','GER','CIV','2026-06-20 20:00:00+00','BMO Field, Toronto',                      'double'),
('g_ECU_CUW', 2,'grupos','ECU','CUW','2026-06-21 00:00:00+00','Arrowhead Stadium, Kansas City',           null),

-- Dom 21 Jun · Grupos G y H
('g_ESP_KSA', 2,'grupos','ESP','KSA','2026-06-21 16:00:00+00','Mercedes-Benz Stadium, Atlanta',          'double'),
('g_BEL_IRN', 2,'grupos','BEL','IRN','2026-06-21 19:00:00+00','SoFi Stadium, Los Ángeles',               null),
('g_URU_CPV', 2,'grupos','URU','CPV','2026-06-21 22:00:00+00','Hard Rock Stadium, Miami',               null),
('g_NZL_EGY', 2,'grupos','NZL','EGY','2026-06-22 01:00:00+00','BC Place, Vancouver',                     null),

-- Lun 22 Jun · Grupos I y J
('g_ARG_AUT', 2,'grupos','ARG','AUT','2026-06-22 17:00:00+00','AT&T Stadium, Dallas',                    null),
('g_FRA_IRQ', 2,'grupos','FRA','IRQ','2026-06-22 21:00:00+00','Lincoln Financial Field, Filadelfia',    null),
('g_NOR_SEN', 2,'grupos','NOR','SEN','2026-06-23 00:00:00+00','MetLife Stadium, Nueva Jersey',           null),
('g_JOR_ALG', 2,'grupos','JOR','ALG','2026-06-23 03:00:00+00','Levi''s Stadium, San Francisco',           null),

-- Mar 23 Jun · Grupos K y L
('g_POR_UZB', 2,'grupos','POR','UZB','2026-06-23 17:00:00+00','NRG Stadium, Houston',                    null),
('g_ENG_GHA', 2,'grupos','ENG','GHA','2026-06-23 20:00:00+00','Gillette Stadium, Boston',                null),
('g_PAN_CRO', 2,'grupos','PAN','CRO','2026-06-23 23:00:00+00','BMO Field, Toronto',                      null),
('g_COL_COD', 2,'grupos','COL','COD','2026-06-24 02:00:00+00','Estadio AKRON, Guadalajara',               null),


-- ══════════════════════════════════════════════════════════════════
-- JORNADA 3 · MD3 simultáneos
-- Jun 24 (mié) – Jun 27 (sáb)
-- Los dos partidos de cada grupo se juegan a la misma hora
-- ══════════════════════════════════════════════════════════════════

-- Mié 24 Jun · Grupos A, B y C
('g_CZE_MEX', 3,'grupos','CZE','MEX','2026-06-25 01:00:00+00','Estadio Azteca, Ciudad de México',        null),   -- 8pm Peru Jun 24
('g_RSA_KOR', 3,'grupos','RSA','KOR','2026-06-25 01:00:00+00','Estadio BBVA, Monterrey',                  null),   -- 8pm Peru Jun 24 (sim.)
('g_SUI_CAN', 3,'grupos','SUI','CAN','2026-06-24 19:00:00+00','BC Place, Vancouver',                      null),   -- 2pm Peru Jun 24
('g_BIH_QAT', 3,'grupos','BIH','QAT','2026-06-24 19:00:00+00','Lumen Field, Seattle',                    null),   -- 2pm Peru Jun 24 (sim.)
('g_BRA_SCO', 3,'grupos','BRA','SCO','2026-06-24 22:00:00+00','Hard Rock Stadium, Miami',                 'double'), -- 5pm Peru Jun 24
('g_MAR_HAI', 3,'grupos','MAR','HAI','2026-06-24 22:00:00+00','Mercedes-Benz Stadium, Atlanta',           null),   -- 5pm Peru Jun 24 (sim.)

-- Jue 25 Jun · Grupos D, E y F
('g_TUR_USA', 3,'grupos','TUR','USA','2026-06-26 02:00:00+00','SoFi Stadium, Los Ángeles',                null),   -- 9pm Peru Jun 25
('g_PAR_AUS', 3,'grupos','PAR','AUS','2026-06-26 02:00:00+00','Levi''s Stadium, San Francisco',           null),   -- 9pm Peru Jun 25 (sim.)
('g_ECU_GER', 3,'grupos','ECU','GER','2026-06-25 20:00:00+00','MetLife Stadium, Nueva Jersey',            'double'), -- 3pm Peru Jun 25
('g_CUW_CIV', 3,'grupos','CUW','CIV','2026-06-25 20:00:00+00','Lincoln Financial Field, Filadelfia',    null),   -- 3pm Peru Jun 25 (sim.)
('g_JPN_SWE', 3,'grupos','JPN','SWE','2026-06-25 23:00:00+00','AT&T Stadium, Dallas',                    null),   -- 6pm Peru Jun 25
('g_TUN_NED', 3,'grupos','TUN','NED','2026-06-25 23:00:00+00','Arrowhead Stadium, Kansas City',            null),   -- 6pm Peru Jun 25 (sim.)

-- Vie 26 Jun · Grupos G, H y I
('g_EGY_IRN', 3,'grupos','EGY','IRN','2026-06-27 03:00:00+00','Lumen Field, Seattle',                    null),   -- 10pm Peru Jun 26
('g_NZL_BEL', 3,'grupos','NZL','BEL','2026-06-27 03:00:00+00','BC Place, Vancouver',                     null),   -- 10pm Peru Jun 26 (sim.)
('g_CPV_KSA', 3,'grupos','CPV','KSA','2026-06-27 00:00:00+00','NRG Stadium, Houston',                    null),   -- 7pm Peru Jun 26
('g_URU_ESP', 3,'grupos','URU','ESP','2026-06-27 00:00:00+00','Estadio AKRON, Guadalajara',               'exact'), -- 7pm Peru Jun 26 (sim.)
('g_NOR_FRA', 3,'grupos','NOR','FRA','2026-06-26 19:00:00+00','Gillette Stadium, Boston',                 null),   -- 2pm Peru Jun 26
('g_SEN_IRQ', 3,'grupos','SEN','IRQ','2026-06-26 19:00:00+00','BMO Field, Toronto',                       null),   -- 2pm Peru Jun 26 (sim.)

-- Sáb 27 Jun · Grupos J, K y L
('g_JOR_ARG', 3,'grupos','JOR','ARG','2026-06-28 02:00:00+00','AT&T Stadium, Dallas',                    null),   -- 9pm Peru Jun 27
('g_ALG_AUT', 3,'grupos','ALG','AUT','2026-06-28 02:00:00+00','Arrowhead Stadium, Kansas City',           null),   -- 9pm Peru Jun 27 (sim.)
('g_COL_POR', 3,'grupos','COL','POR','2026-06-27 23:30:00+00','Hard Rock Stadium, Miami',                 'double'), -- 6:30pm Peru Jun 27
('g_COD_UZB', 3,'grupos','COD','UZB','2026-06-27 23:30:00+00','Mercedes-Benz Stadium, Atlanta',           null),   -- 6:30pm Peru Jun 27 (sim.)
('g_PAN_ENG', 3,'grupos','PAN','ENG','2026-06-27 21:00:00+00','MetLife Stadium, Nueva Jersey',            null),   -- 4pm Peru Jun 27
('g_CRO_GHA', 3,'grupos','CRO','GHA','2026-06-27 21:00:00+00','Lincoln Financial Field, Filadelfia',    null)    -- 4pm Peru Jun 27 (sim.)

on conflict (id) do update set
  jornada_number = excluded.jornada_number,
  phase          = excluded.phase,
  home_team      = excluded.home_team,
  away_team      = excluded.away_team,
  kickoff_at     = excluded.kickoff_at,
  venue          = excluded.venue,
  special        = excluded.special;


-- ══════════════════════════════════════════════════════════════════
-- JORNADAS 4–8: RONDAS ELIMINATORIAS
-- ══════════════════════════════════════════════════════════════════
--
-- Los 32 partidos de eliminatorias se insertan cuando se conozcan
-- los clasificados de la fase de grupos.
--
--   J4 · R32 (Dieciseisavos)  · 16 partidos · Jun 28 – Jul 3
--   J5 · R16 (Octavos)        ·  8 partidos · Jul 4–7
--   J6 · QF  (Cuartos)        ·  4 partidos · Jul 9–11
--   J7 · SF  (Semifinales)    ·  2 partidos · Jul 14–15
--   J8 · 3er + Final          ·  2 partidos · Jul 18–19
--
-- Ejemplo de insert:
--   insert into public.matches (id, jornada_number, phase, home_team, away_team, kickoff_at, venue)
--   values ('r32_01', 4, 'r32', '1A', '2B', '2026-06-28 19:00:00+00', 'SoFi Stadium, Los Ángeles');
--
-- phases: 'grupos' | 'r32' | 'r16' | 'qf' | 'sf' | 'final'
