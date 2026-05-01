-- ═══════════════════════════════════════════════════════════════════
-- FURVO — Fix: get_standings con security definer
--
-- Problema: la función get_standings no era security definer,
-- por lo que heredaba el contexto RLS del usuario que la llamaba.
-- La policy "read league predictions (post-kickoff)" bloquea la
-- lectura de predicciones ajenas si el partido aún no ha empezado,
-- haciendo que sum(points) de otros usuarios sea NULL → 0.
--
-- Solución: security definer + set search_path para que la función
-- lea TODOS los puntos de la liga (no los picks, solo los puntos),
-- con la única condición de seguridad que ya tiene: is_league_member.
-- ═══════════════════════════════════════════════════════════════════

create or replace function public.get_standings(league_uuid uuid)
returns table (
  user_id           uuid,
  handle            text,
  name              text,
  avatar_color      text,
  total_points      bigint,
  hits              bigint,
  predictions_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    pr.id            as user_id,
    pr.handle,
    pr.name,
    pr.avatar_color,
    coalesce(sum(p.points), 0)                        as total_points,
    count(*) filter (where coalesce(p.points, 0) > 0) as hits,
    count(p.id)                                       as predictions_count
  from public.league_members lm
  join public.profiles pr
    on pr.id = lm.user_id
  left join public.predictions p
    on  p.user_id   = lm.user_id
    and p.league_id = lm.league_id
  where lm.league_id = league_uuid
  group by pr.id, pr.handle, pr.name, pr.avatar_color
  order by total_points desc, hits desc;
$$;
