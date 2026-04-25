import { createClient } from '@/lib/supabase/server';
import { TabBar } from '@/components/tab-bar';
import { FurvoWordmark, EyebrowLabel, MatchCard } from '@/components/primitives';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';

type Match = {
  id: string; jornada_number: number; phase: string;
  kickoff_at: string; status: string; special: string | null;
  home_score: number | null; away_score: number | null;
  home_team: string; away_team: string;
  home: { code: string; name: string; flag: string | null };
  away: { code: string; name: string; flag: string | null };
};

type Prediction = {
  match_id: string; pick: '1' | 'X' | '2' | null;
  exact_home: number | null; exact_away: number | null; points: number | null;
};

function phaseLabel(phase: string, jornada: number) {
  if (phase === 'grupos') return `Fase de Grupos · MD${jornada}`;
  if (phase === 'r32') return 'Ronda de 32';
  if (phase === 'r16') return 'Octavos de Final';
  if (phase === 'qf') return 'Cuartos de Final';
  if (phase === 'sf') return 'Semifinales';
  if (phase === 'final') return 'Final';
  return phase;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'short',
    timeZone: 'America/Mexico_City',
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('es-ES', {
    hour: '2-digit', minute: '2-digit',
    timeZone: 'America/Mexico_City',
  });
}

function realPick(homeScore: number, awayScore: number): '1' | 'X' | '2' {
  if (homeScore > awayScore) return '1';
  if (homeScore < awayScore) return '2';
  return 'X';
}

export default async function ResultadosPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: league } = await supabase.from('leagues').select('name, id').eq('invite_code', params.id).single();
  if (!league) notFound();

  const [{ data: rawMatches }, { data: rawPreds }] = await Promise.all([
    supabase
      .from('matches')
      .select(`
        *,
        home:teams!matches_home_team_fkey(code, name, flag),
        away:teams!matches_away_team_fkey(code, name, flag)
      `)
      .order('kickoff_at', { ascending: true }),
    supabase
      .from('predictions')
      .select('match_id, pick, exact_home, exact_away, points')
      .eq('user_id', user.id)
      .eq('league_id', league!.id),
  ]);

  const matches = (rawMatches ?? []) as unknown as Match[];
  const predsMap = Object.fromEntries((rawPreds ?? []).map(p => [p.match_id, p as Prediction]));

  // Group by jornada
  const byJornada: Record<number, Match[]> = {};
  for (const m of matches) {
    if (!byJornada[m.jornada_number]) byJornada[m.jornada_number] = [];
    byJornada[m.jornada_number].push(m);
  }
  const jornadas = Object.keys(byJornada).map(Number).sort((a, b) => a - b);

  // Separate past vs active/future
  const now = new Date();
  const jornadasPast = jornadas.filter(j => byJornada[j].every(m => m.status === 'finished'));
  const jornadasActive = jornadas.filter(j => !jornadasPast.includes(j));

  // Total points across all leagues jornadas
  const totalPts = Object.values(predsMap).reduce((s, p) => s + (p.points ?? 0), 0);
  const totalHits = Object.values(predsMap).filter(p => (p.points ?? 0) > 0).length;

  return (
    <div className="fv-page" style={{ paddingBottom: 120, minHeight: '100vh' }}>
      {/* Sticky glass header */}
      <div className="fv-page-header" style={{ padding: '12px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href={`/liga/${params.id}`} style={{
            fontFamily: 'var(--fv-mono)', fontSize: 9, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--fv-muted)',
          }}>
            ← Liga
          </Link>
          <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fv-ink)' }}>
            Resultados
          </div>
          <span className="fv-mobile-only"><FurvoWordmark size={18} /></span>
        </div>
      </div>

      {/* Resumen global */}
      {jornadasPast.length > 0 && (
        <div style={{ padding: '16px 20px 0', display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, padding: '14px 16px', borderRadius: 14, background: 'var(--fv-surface)', border: '1px solid var(--fv-line)' }}>
            <EyebrowLabel>Total pts</EyebrowLabel>
            <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 28, fontWeight: 800, marginTop: 4, color: 'var(--fv-accent)' }}>
              {totalPts}
            </div>
          </div>
          <div style={{ flex: 1, padding: '14px 16px', borderRadius: 14, background: 'var(--fv-surface)', border: '1px solid var(--fv-line)' }}>
            <EyebrowLabel>Aciertos</EyebrowLabel>
            <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 28, fontWeight: 800, marginTop: 4 }}>
              {totalHits}
            </div>
          </div>
          <div style={{ flex: 1, padding: '14px 16px', borderRadius: 14, background: 'var(--fv-surface)', border: '1px solid var(--fv-line)' }}>
            <EyebrowLabel>Predicciones</EyebrowLabel>
            <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 28, fontWeight: 800, marginTop: 4 }}>
              {Object.keys(predsMap).length}
            </div>
          </div>
        </div>
      )}

      {/* Jornadas con partidos futuros/activos */}
      {jornadasActive.length > 0 && (
        <div style={{ padding: '28px 20px 8px' }}>
          <EyebrowLabel>Próximas jornadas</EyebrowLabel>
        </div>
      )}
      {jornadasActive.map(j => {
        const ms = byJornada[j];
        const pred = ms.filter(m => predsMap[m.id]?.pick).length;
        const firstPhase = ms[0]?.phase ?? 'grupos';
        const firstKickoff = ms.find(m => m.status !== 'finished')?.kickoff_at;
        return (
          <div key={j} style={{ padding: '0 20px 8px' }}>
            <div style={{
              padding: '14px 16px', borderRadius: 14,
              background: 'var(--fv-surface)', border: '1px solid var(--fv-line)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <EyebrowLabel>{phaseLabel(firstPhase, j)}</EyebrowLabel>
                <div style={{ fontFamily: 'var(--fv-serif)', fontSize: 20, marginTop: 3 }}>Jornada {j}</div>
                {firstKickoff && (
                  <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 10, color: 'var(--fv-muted)', marginTop: 3 }}>
                    Desde {formatDate(firstKickoff)}
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 18, fontWeight: 700 }}>
                  {pred}/{ms.length}
                </div>
                <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 9, color: 'var(--fv-muted)', letterSpacing: '0.1em', marginTop: 2 }}>
                  predicciones
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Jornadas terminadas */}
      {jornadasPast.length > 0 && (
        <div style={{ padding: '20px 20px 8px' }}>
          <EyebrowLabel>Jornadas completadas</EyebrowLabel>
        </div>
      )}

      {jornadasPast.map(j => {
        const ms = byJornada[j];
        const firstPhase = ms[0]?.phase ?? 'grupos';
        const jPts = ms.reduce((s, m) => s + (predsMap[m.id]?.points ?? 0), 0);
        const jHits = ms.filter(m => (predsMap[m.id]?.points ?? 0) > 0).length;
        const jPreds = ms.filter(m => predsMap[m.id]?.pick).length;

        return (
          <div key={j} style={{ padding: '0 20px 20px' }}>
            {/* Jornada header */}
            <div style={{
              padding: '12px 16px', borderRadius: '14px 14px 0 0',
              background: 'var(--fv-surface-2)',
              border: '1px solid var(--fv-line)', borderBottom: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fv-muted)' }}>
                  {phaseLabel(firstPhase, j)}
                </div>
                <div style={{ fontFamily: 'var(--fv-serif)', fontSize: 20, marginTop: 2 }}>Jornada {j}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 22, fontWeight: 800, color: 'var(--fv-accent)', lineHeight: 1 }}>
                  +{jPts}
                </div>
                <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 9, color: 'var(--fv-muted)', marginTop: 2 }}>
                  {jHits}/{jPreds} aciertos
                </div>
              </div>
            </div>

            {/* Match cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              {ms.map(m => {
                const pred = predsMap[m.id];
                const finished = m.status === 'finished' && m.home_score !== null && m.away_score !== null;
                const real = finished ? realPick(m.home_score!, m.away_score!) : null;
                const hit = pred?.pick && real ? pred.pick === real : null;
                return (
                  <MatchCard
                    key={m.id}
                    homeCode={m.home.code} homeName={m.home.name} homeFlag={m.home.flag}
                    awayCode={m.away.code} awayName={m.away.name} awayFlag={m.away.flag}
                    status={m.status === 'live' ? 'live' : finished ? 'finished' : 'upcoming'}
                    kickoffAt={m.kickoff_at}
                    homeScore={m.home_score} awayScore={m.away_score}
                    special={m.special}
                    myPick={pred?.pick ?? null}
                    myPickHit={hit}
                    points={pred?.points ?? null}
                  />
                );
              })}
            </div>
          </div>
        );
      })}

      {matches.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'var(--fv-mono)', color: 'var(--fv-muted)', fontSize: 11 }}>
          Todavía no hay partidos
        </div>
      )}

      <TabBar leagueId={params.id} />
    </div>
  );
}
