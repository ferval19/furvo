-- ═══════════════════════════════════════════════════════════════════
-- FURVO — Simulación Jornada 1
--
-- Ejecutar en el SQL Editor de Supabase (en orden, en una sola vez)
--
-- Qué hace:
--   1. Inserta predicciones aleatorias para todos los miembros
--      de todas las ligas (saltando el bloqueo de kickoff)
--   2. Registra los 24 resultados de la J1
--      → el trigger on_match_result recalcula puntos solo
--   3. Muestra la clasificación final por liga
-- ═══════════════════════════════════════════════════════════════════


-- ── PASO 1: Predicciones simuladas ───────────────────────────────────
-- Deshabilitamos el trigger de kickoff para poder insertar después del inicio

alter table public.predictions disable trigger no_late_predictions;

do $$
declare
  r_match  record;
  r_member record;
  picks    text[] := array['1','X','2'];
  r_idx    int;
  c_pick   text;
  c_home   int;
  c_away   int;
begin
  for r_match in
    select id, special
    from public.matches
    where jornada_number = 1
    order by kickoff_at
  loop
    for r_member in
      select distinct user_id, league_id
      from public.league_members
    loop
      -- Pick aleatorio
      r_idx  := 1 + (floor(random() * 3))::int;
      c_pick := picks[r_idx];
      c_home := null;
      c_away := null;

      -- Para partidos 'exact': genera marcador aleatorio (0-3) y ajusta pick
      if r_match.special = 'exact' then
        c_home := (floor(random() * 4))::int;
        c_away := (floor(random() * 4))::int;
        c_pick := case
          when c_home > c_away then '1'
          when c_home < c_away then '2'
          else 'X'
        end;
      end if;

      insert into public.predictions (user_id, league_id, match_id, pick, exact_home, exact_away)
      values (r_member.user_id, r_member.league_id, r_match.id, c_pick, c_home, c_away)
      on conflict (user_id, league_id, match_id) do nothing;
    end loop;
  end loop;
end $$;

alter table public.predictions enable trigger no_late_predictions;


-- ── PASO 2: Resultados J1 ────────────────────────────────────────────
-- El trigger on_match_result se dispara en cada update y recalcula puntos.
--
-- Resultados simulados (con criterio: favoritos ganan, alguna sorpresa)
--
-- ESPECIALES:
--   'exact'  → g_MEX_RSA, g_USA_PAR, g_ENG_CRO
--   'double' → g_QAT_SUI, g_BRA_MAR, g_CIV_ECU, g_FRA_SEN, g_ARG_ALG

-- ── Grupo A ──────────────────────────────────────────────────────────
update public.matches set home_score=2, away_score=1, status='finished' where id='g_MEX_RSA';   -- MEX gana en casa (exact)
update public.matches set home_score=1, away_score=1, status='finished' where id='g_KOR_CZE';   -- Empate

-- ── Grupo B / D ───────────────────────────────────────────────────────
update public.matches set home_score=1, away_score=0, status='finished' where id='g_CAN_BIH';   -- CAN gana en casa
update public.matches set home_score=2, away_score=0, status='finished' where id='g_USA_PAR';   -- USA gana (exact)
update public.matches set home_score=0, away_score=1, status='finished' where id='g_AUS_TUR';   -- TUR sorpresa

-- ── Grupo B / C ───────────────────────────────────────────────────────
update public.matches set home_score=0, away_score=2, status='finished' where id='g_QAT_SUI';   -- SUI domina (double)
update public.matches set home_score=3, away_score=1, status='finished' where id='g_BRA_MAR';   -- BRA golea (double)
update public.matches set home_score=0, away_score=3, status='finished' where id='g_HAI_SCO';   -- SCO fácil

-- ── Grupo E / F ───────────────────────────────────────────────────────
update public.matches set home_score=3, away_score=0, status='finished' where id='g_GER_CUW';   -- GER arrasa
update public.matches set home_score=2, away_score=1, status='finished' where id='g_NED_JPN';   -- NED gana
update public.matches set home_score=1, away_score=1, status='finished' where id='g_CIV_ECU';   -- Empate (double)
update public.matches set home_score=1, away_score=0, status='finished' where id='g_SWE_TUN';   -- SWE apurada

-- ── Grupo G / H / J ──────────────────────────────────────────────────
update public.matches set home_score=4, away_score=0, status='finished' where id='g_ESP_CPV';   -- ESP golea
update public.matches set home_score=2, away_score=0, status='finished' where id='g_BEL_EGY';   -- BEL cómoda
update public.matches set home_score=0, away_score=1, status='finished' where id='g_KSA_URU';   -- URU sorpresa
update public.matches set home_score=0, away_score=1, status='finished' where id='g_IRN_NZL';   -- NZL sorpresa
update public.matches set home_score=2, away_score=0, status='finished' where id='g_AUT_JOR';   -- AUT gana

-- ── Grupo I / J ───────────────────────────────────────────────────────
update public.matches set home_score=2, away_score=0, status='finished' where id='g_FRA_SEN';   -- FRA gana (double)
update public.matches set home_score=0, away_score=2, status='finished' where id='g_IRQ_NOR';   -- NOR gana
update public.matches set home_score=3, away_score=0, status='finished' where id='g_ARG_ALG';   -- ARG arrasa (double)

-- ── Grupo K / L ───────────────────────────────────────────────────────
update public.matches set home_score=3, away_score=0, status='finished' where id='g_POR_COD';   -- POR golea
update public.matches set home_score=2, away_score=1, status='finished' where id='g_ENG_CRO';   -- ENG gana (exact)
update public.matches set home_score=1, away_score=1, status='finished' where id='g_GHA_PAN';   -- Empate
update public.matches set home_score=0, away_score=2, status='finished' where id='g_UZB_COL';   -- COL gana


-- ── PASO 3: Clasificación por liga ───────────────────────────────────
-- Resumen de puntos ganados en J1

select
  l.name                                           as "Liga",
  pr.name                                          as "Jugador",
  coalesce(sum(p.points), 0)                       as "Pts J1",
  count(*) filter (where coalesce(p.points,0) > 0) as "Aciertos",
  count(p.id)                                      as "Predicciones"
from public.leagues l
join public.league_members lm on lm.league_id = l.id
join public.profiles pr       on pr.id = lm.user_id
left join public.predictions p
  on  p.user_id   = lm.user_id
  and p.league_id = lm.league_id
  and p.match_id  in (select id from public.matches where jornada_number = 1)
group by l.name, pr.name
order by l.name, "Pts J1" desc;
