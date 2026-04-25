-- ═══════════════════════════════════════════════════════════════════
-- FURVO — Supabase schema
-- Pegar en SQL Editor de tu proyecto Supabase y ejecutar
-- ═══════════════════════════════════════════════════════════════════

-- ── TEAMS ──────────────────────────────────────────────────────
create table public.teams (
  code text primary key,
  name text not null,
  flag text,
  group_letter text
);

-- ── MATCHES ────────────────────────────────────────────────────
create table public.matches (
  id text primary key,
  jornada_number int not null,
  phase text not null default 'grupos',
  home_team text not null references public.teams(code),
  away_team text not null references public.teams(code),
  kickoff_at timestamptz not null,
  venue text,
  home_score int,
  away_score int,
  status text not null default 'scheduled'
    check (status in ('scheduled', 'live', 'finished')),
  special text check (special in (null, 'double', 'exact')),
  created_at timestamptz not null default now()
);

create index matches_jornada_idx on public.matches (jornada_number);
create index matches_kickoff_idx on public.matches (kickoff_at);

-- ── PROFILES (extiende auth.users) ─────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text unique not null,
  name text not null,
  avatar_color text default 'red',
  created_at timestamptz not null default now()
);

-- Auto-crear profile al registrarse
create or replace function public.handle_new_user()
returns trigger security definer set search_path = public
language plpgsql as $$
begin
  insert into public.profiles (id, handle, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'handle', 'user_' || substr(new.id::text, 1, 6)),
    coalesce(new.raw_user_meta_data->>'name', 'Nuevo jugador')
  );
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── LEAGUES ────────────────────────────────────────────────────
create table public.leagues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text unique not null
    default upper(substr(md5(random()::text), 1, 6)),
  owner_id uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.league_members (
  league_id uuid references public.leagues(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (league_id, user_id)
);

create index league_members_user_idx on public.league_members (user_id);

-- ── PREDICTIONS ────────────────────────────────────────────────
create table public.predictions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  league_id uuid not null references public.leagues(id) on delete cascade,
  match_id text not null references public.matches(id),
  pick text check (pick in ('1', 'X', '2')),
  exact_home int,
  exact_away int,
  submitted_at timestamptz default now(),
  points int,
  unique (user_id, league_id, match_id)
);

create index predictions_league_match_idx on public.predictions (league_id, match_id);
create index predictions_user_league_idx on public.predictions (user_id, league_id);

-- ── NOTIFICATIONS ──────────────────────────────────────────────
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  league_id uuid references public.leagues(id) on delete cascade,
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_user_idx on public.notifications (user_id, read_at);

-- ═══════════════════════════════════════════════════════════════════
-- TRIGGERS DE NEGOCIO
-- ═══════════════════════════════════════════════════════════════════

-- Bloquear predicciones tras el kickoff
create or replace function public.prevent_late_predictions()
returns trigger language plpgsql as $$
begin
  if exists (
    select 1 from public.matches
    where id = new.match_id and kickoff_at <= now()
  ) then
    raise exception 'El partido ya ha comenzado';
  end if;
  return new;
end $$;

create trigger no_late_predictions
  before insert or update on public.predictions
  for each row execute function public.prevent_late_predictions();

-- Auto-añadir owner como miembro al crear liga
create or replace function public.add_owner_as_member()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.league_members (league_id, user_id)
  values (new.id, new.owner_id);
  return new;
end $$;

create trigger auto_join_owner
  after insert on public.leagues
  for each row execute function public.add_owner_as_member();

-- Recalcular puntos al actualizar resultado
create or replace function public.recalc_points_for_match()
returns trigger language plpgsql as $$
declare
  real_pick text;
begin
  if new.home_score is null or new.away_score is null then return new; end if;

  real_pick := case
    when new.home_score > new.away_score then '1'
    when new.home_score < new.away_score then '2'
    else 'X'
  end;

  update public.predictions p
  set points = case
    -- Partido exacto: acierta 1X2 → +1, acierta marcador exacto → +3, falla → 0 ó -1
    when new.special = 'exact' then
      case
        when p.pick = real_pick and p.exact_home = new.home_score and p.exact_away = new.away_score then 3
        when p.pick = real_pick then 1
        else 0
      end
    -- Partido doble: acierta → +2, falla → -1
    when new.special = 'double' then
      case when p.pick = real_pick then 2 else -1 end
    -- Normal: acierta → +1
    else
      case when p.pick = real_pick then 1 else 0 end
  end
  where p.match_id = new.id;

  return new;
end $$;

create trigger on_match_result
  after update of home_score, away_score, status on public.matches
  for each row execute function public.recalc_points_for_match();

-- ═══════════════════════════════════════════════════════════════════
-- FUNCIONES RPC (para usar desde el cliente)
-- ═══════════════════════════════════════════════════════════════════

-- Crear liga (evita problemas de RLS con auth.uid())
create or replace function public.create_league(league_name text)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  new_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  insert into public.leagues (name, owner_id)
  values (league_name, auth.uid())
  returning id into new_id;
  return new_id;
end $$;

-- Unirse a una liga por código
create or replace function public.join_league_by_code(code text)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  target_league_id uuid;
begin
  select id into target_league_id from public.leagues where invite_code = upper(code);
  if target_league_id is null then
    raise exception 'Código de liga inválido';
  end if;
  insert into public.league_members (league_id, user_id)
    values (target_league_id, auth.uid())
    on conflict do nothing;
  return target_league_id;
end $$;

-- Clasificación de una liga
create or replace function public.get_standings(league_uuid uuid)
returns table (
  user_id uuid,
  handle text,
  name text,
  avatar_color text,
  total_points bigint,
  hits bigint,
  predictions_count bigint
) language sql stable as $$
  select
    pr.id as user_id,
    pr.handle,
    pr.name,
    pr.avatar_color,
    coalesce(sum(p.points), 0) as total_points,
    count(*) filter (where p.points > 0) as hits,
    count(p.id) as predictions_count
  from public.league_members lm
  join public.profiles pr on pr.id = lm.user_id
  left join public.predictions p on p.user_id = lm.user_id and p.league_id = lm.league_id
  where lm.league_id = league_uuid
  group by pr.id, pr.handle, pr.name, pr.avatar_color
  order by total_points desc, hits desc;
$$;

-- ═══════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════════

alter table public.profiles enable row level security;
alter table public.leagues enable row level security;
alter table public.league_members enable row level security;
alter table public.predictions enable row level security;
alter table public.notifications enable row level security;
alter table public.teams enable row level security;
alter table public.matches enable row level security;

-- Teams / matches son públicos (lectura)
create policy "teams read all" on public.teams for select using (true);
create policy "matches read all" on public.matches for select using (true);

-- Profiles
create policy "profiles readable" on public.profiles for select using (true);
create policy "profiles update self" on public.profiles for update
  using (auth.uid() = id);

-- Leagues: solo miembros leen
create policy "leagues readable by members" on public.leagues for select
  using (public.is_league_member(id));
create policy "leagues create" on public.leagues for insert
  with check (auth.uid() = owner_id);

-- Helper que comprueba membresía sin activar RLS (evita recursión infinita)
create or replace function public.is_league_member(p_league_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.league_members
    where league_id = p_league_id and user_id = auth.uid()
  );
$$;

-- League members: los miembros se ven entre sí
create policy "members visible to members" on public.league_members for select
  using (public.is_league_member(league_id));

-- Predictions
create policy "own predictions full" on public.predictions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
create policy "read league predictions (post-kickoff)" on public.predictions for select
  using (
    public.is_league_member(league_id)
    and exists (
      select 1 from public.matches
      where id = predictions.match_id and kickoff_at <= now()
    )
  );

-- Notifications: solo tuyas
create policy "own notifications" on public.notifications for all
  using (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════
-- REALTIME (para live updates)
-- ═══════════════════════════════════════════════════════════════════
alter publication supabase_realtime add table public.predictions;
alter publication supabase_realtime add table public.matches;
alter publication supabase_realtime add table public.notifications;
