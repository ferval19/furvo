import { createClient } from '@/lib/supabase/server';
import { JornadaClient } from './jornada-client';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jornada',
  robots: { index: false, follow: false },
};

export type JornadaMeta = {
  number: number;
  phase: string;
  total: number;
  finished: number;
  hasLive: boolean;
};

export default async function JornadaPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { j?: string };
}) {
  const supabase = createClient();
  const [{ data: { user } }, { data: league }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from('leagues').select('id').eq('invite_code', params.id).single(),
  ]);
  if (!user) redirect('/login');
  if (!league) notFound();

  // All jornadas metadata (minimal query)
  const { data: allMatches } = await supabase
    .from('matches')
    .select('jornada_number, phase, status')
    .order('jornada_number', { ascending: true });

  if (!allMatches || allMatches.length === 0) notFound();

  // Aggregate per jornada
  const metaMap: Record<number, JornadaMeta> = {};
  for (const m of allMatches) {
    const n = m.jornada_number;
    if (!metaMap[n]) metaMap[n] = { number: n, phase: m.phase, total: 0, finished: 0, hasLive: false };
    metaMap[n].total++;
    if (m.status === 'finished') metaMap[n].finished++;
    if (m.status === 'live')     metaMap[n].hasLive = true;
  }
  const jornadasMeta: JornadaMeta[] = Object.values(metaMap).sort((a, b) => a.number - b.number);

  // Resolve selected jornada: URL param → first non-completed → first
  const requestedJ = searchParams.j ? parseInt(searchParams.j) : null;
  const defaultJ   = jornadasMeta.find(j => j.finished < j.total)?.number ?? jornadasMeta[0]?.number;
  const selectedJ  = requestedJ && metaMap[requestedJ] ? requestedJ : defaultJ;
  if (!selectedJ) notFound();

  // Full match data for selected jornada
  const { data: matches } = await supabase
    .from('matches')
    .select(`
      *,
      home:teams!matches_home_team_fkey(code, name, flag, group_letter),
      away:teams!matches_away_team_fkey(code, name, flag, group_letter)
    `)
    .eq('jornada_number', selectedJ)
    .order('kickoff_at', { ascending: true });

  if (!matches || matches.length === 0) notFound();

  const { data: existing } = await supabase
    .from('predictions')
    .select('*')
    .eq('user_id', user.id)
    .eq('league_id', league.id)
    .in('match_id', matches.map(m => m.id));

  const predictionsMap = Object.fromEntries(
    (existing ?? []).map(p => [p.match_id, p])
  );

  return (
    <JornadaClient
      leagueId={league.id}
      leagueCode={params.id}
      matches={matches as any}
      initialPredictions={predictionsMap}
      jornadaNum={selectedJ}
      phase={metaMap[selectedJ].phase}
      jornadasMeta={jornadasMeta}
    />
  );
}
