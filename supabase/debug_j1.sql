-- ═══════════════════════════════════════════════════════════════════
-- FURVO — Diagnóstico + Fix J1
-- Ejecuta PRIMERO el bloque de diagnóstico para ver qué pasó,
-- luego ejecuta el fix que corresponda.
-- ═══════════════════════════════════════════════════════════════════


-- ── DIAGNÓSTICO ──────────────────────────────────────────────────────
-- Ejecuta estas queries para entender el estado actual

-- 1. ¿Cuántas predicciones tiene cada usuario en J1?
--    Si algún usuario sale con 0 predicciones → el DO block no los incluyó
--    Si salen con predicciones pero puntos NULL → el trigger no disparó bien

select
  pr.name                                             as jugador,
  count(p.id)                                         as predicciones_j1,
  count(*) filter (where p.points is not null)        as puntuadas,
  count(*) filter (where p.points is null)            as sin_puntuar,
  coalesce(sum(p.points), 0)                         as puntos_total
from public.profiles pr
left join public.predictions p
  on  p.user_id  = pr.id
  and p.match_id in (select id from public.matches where jornada_number = 1)
group by pr.id, pr.name
order by puntos_total desc;


-- 2. ¿Los resultados de J1 están guardados?
select id, home_score, away_score, status, special
from public.matches
where jornada_number = 1
order by kickoff_at;


-- ═══════════════════════════════════════════════════════════════════
-- FIX A: si otros usuarios tienen 0 predicciones en J1
-- (el DO block no los insertó porque no estaban en league_members aún,
--  o la inserción falló)
-- ═══════════════════════════════════════════════════════════════════

-- Vuelve a insertar predicciones para usuarios sin predicciones en J1
-- (no necesita disable trigger porque los kickoffs son en junio 2026, futuro)

do $$
declare
  r_match  record;
  r_member record;
  picks    text[] := array['1','X','2'];
  c_pick   text;
  c_home   int;
  c_away   int;
begin
  for r_match in
    select id, special, home_score, away_score
    from public.matches
    where jornada_number = 1
    order by kickoff_at
  loop
    for r_member in
      select distinct lm.user_id, lm.league_id
      from public.league_members lm
      where not exists (
        select 1 from public.predictions p
        where p.user_id   = lm.user_id
          and p.league_id = lm.league_id
          and p.match_id  = r_match.id
      )
    loop
      c_pick := picks[1 + (floor(random() * 3))::int];
      c_home := null;
      c_away := null;

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
      values (r_member.user_id, r_member.league_id, r_match.id, c_pick, c_home, c_away);
    end loop;
  end loop;
end $$;


-- ═══════════════════════════════════════════════════════════════════
-- FIX B: si tienen predicciones pero puntos = NULL o incorrectos
-- (el trigger no disparó correctamente o disparó antes de que
--  existieran las predicciones)
--
-- Recalcula puntos de TODOS los partidos de J1 directamente,
-- sin depender del trigger.
-- ═══════════════════════════════════════════════════════════════════

update public.predictions p
set points = case
  when m.special = 'exact' then
    case
      when p.pick = (case when m.home_score > m.away_score then '1'
                          when m.home_score < m.away_score then '2'
                          else 'X' end)
           and p.exact_home = m.home_score
           and p.exact_away = m.away_score then 3
      when p.pick = (case when m.home_score > m.away_score then '1'
                          when m.home_score < m.away_score then '2'
                          else 'X' end) then 1
      else 0
    end
  when m.special = 'double' then
    case
      when p.pick = (case when m.home_score > m.away_score then '1'
                          when m.home_score < m.away_score then '2'
                          else 'X' end) then 2
      else -1
    end
  else
    case
      when p.pick = (case when m.home_score > m.away_score then '1'
                          when m.home_score < m.away_score then '2'
                          else 'X' end) then 1
      else 0
    end
end
from public.matches m
where p.match_id      = m.id
  and m.jornada_number = 1
  and m.status         = 'finished'
  and m.home_score    is not null
  and m.away_score    is not null;


-- ── Clasificación final J1 ───────────────────────────────────────────
select
  l.name                                            as "Liga",
  pr.name                                           as "Jugador",
  coalesce(sum(p.points), 0)                        as "Pts J1",
  count(*) filter (where coalesce(p.points,0) > 0)  as "Aciertos",
  count(p.id)                                       as "Predicciones"
from public.leagues l
join public.league_members lm on lm.league_id = l.id
join public.profiles pr       on pr.id = lm.user_id
left join public.predictions p
  on  p.user_id   = lm.user_id
  and p.league_id = lm.league_id
  and p.match_id  in (select id from public.matches where jornada_number = 1)
group by l.name, pr.name
order by l.name, "Pts J1" desc;
