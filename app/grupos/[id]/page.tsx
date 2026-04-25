import { createClient } from '@/lib/supabase/server';
import { TabBar } from '@/components/tab-bar';
import { FurvoWordmark, EyebrowLabel } from '@/components/primitives';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';

type Team = { code: string; name: string; flag: string | null; group_letter: string | null };
type Match = { home_team: string; away_team: string; home_score: number | null; away_score: number | null; status: string };

type Row = {
  code: string; name: string; flag: string | null;
  pts: number; pj: number; pg: number; pe: number; pp: number;
  gf: number; ga: number; dif: number;
};

function calcGroups(matches: Match[], teams: Team[]): Record<string, Row[]> {
  const stats: Record<string, Row> = {};
  for (const t of teams) {
    stats[t.code] = { code: t.code, name: t.name, flag: t.flag, pts: 0, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, ga: 0, dif: 0 };
  }

  for (const m of matches) {
    if (m.status !== 'finished' || m.home_score === null || m.away_score === null) continue;
    const h = stats[m.home_team];
    const a = stats[m.away_team];
    if (!h || !a) continue;

    h.pj++; a.pj++;
    h.gf += m.home_score; h.ga += m.away_score;
    a.gf += m.away_score; a.ga += m.home_score;

    if (m.home_score > m.away_score) {
      h.pg++; h.pts += 3; a.pp++;
    } else if (m.home_score < m.away_score) {
      a.pg++; a.pts += 3; h.pp++;
    } else {
      h.pe++; h.pts++; a.pe++; a.pts++;
    }
    h.dif = h.gf - h.ga;
    a.dif = a.gf - a.ga;
  }

  const groups: Record<string, Row[]> = {};
  for (const t of teams) {
    const g = t.group_letter ?? '?';
    if (!groups[g]) groups[g] = [];
    groups[g].push(stats[t.code]);
  }
  for (const g of Object.keys(groups)) {
    groups[g].sort((a, b) => b.pts - a.pts || b.dif - a.dif || b.gf - a.gf);
  }
  return groups;
}

const COL: React.CSSProperties = {
  fontFamily: 'var(--fv-mono)', fontSize: 11, fontWeight: 600,
  textAlign: 'center', width: 26, flexShrink: 0, color: 'var(--fv-muted)',
};

const HEAD: React.CSSProperties = {
  ...COL, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
};

export default async function GruposPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: league } = await supabase.from('leagues').select('name').eq('invite_code', params.id).single();
  if (!league) notFound();

  const [{ data: teams }, { data: matches }] = await Promise.all([
    supabase.from('teams').select('*').order('group_letter').order('name'),
    supabase.from('matches')
      .select('home_team, away_team, home_score, away_score, status')
      .eq('phase', 'grupos'),
  ]);

  const groups = calcGroups(matches ?? [], teams ?? []);
  const sortedLetters = Object.keys(groups).sort();
  const playedCount = (matches ?? []).filter(m => m.status === 'finished').length;

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
            Grupos
          </div>
          <span className="fv-mobile-only"><FurvoWordmark size={18} /></span>
        </div>
        {playedCount > 0 && (
          <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 9, color: 'var(--fv-muted)', marginTop: 4, letterSpacing: '0.08em', textAlign: 'center' }}>
            {playedCount} partido{playedCount !== 1 ? 's' : ''} jugado{playedCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div className="fv-groups-grid" style={{ padding: '16px 20px 0' }}>
        {sortedLetters.map(letter => {
          const rows = groups[letter];
          return (
            <div key={letter} style={{
              borderRadius: 16, overflow: 'hidden',
              background: 'var(--fv-surface)', border: '1px solid var(--fv-line)',
            }}>
              {/* Group header */}
              <div style={{
                padding: '9px 14px',
                background: 'var(--fv-surface-2)',
                borderBottom: '1px solid var(--fv-line)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fv-ink)' }}>
                  Grupo {letter}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {['PJ', 'G', 'E', 'P', 'GD', 'PTS'].map(h => (
                    <div key={h} style={HEAD}>{h}</div>
                  ))}
                </div>
              </div>

              {/* Team rows — FotMob zone borders */}
              {rows.map((row, i) => {
                // Pos 1-2 → R32 (green), pos 3 → possible best 3rd (yellow), pos 4 → out
                const zoneColor = i < 2
                  ? 'var(--fv-accent)'
                  : i === 2 ? 'var(--fv-flash)'
                  : 'transparent';
                const zoneBg = i < 2 && row.pj > 0
                  ? 'color-mix(in oklch, var(--fv-accent-soft) 25%, transparent)'
                  : 'transparent';

                return (
                  <div key={row.code} style={{
                    padding: '9px 14px',
                    paddingLeft: 11,
                    borderBottom: i < rows.length - 1 ? '1px solid var(--fv-line)' : 'none',
                    borderLeft: `3px solid ${zoneColor}`,
                    display: 'flex', alignItems: 'center',
                    background: zoneBg,
                    transition: 'background 0.2s',
                  }}>
                    {/* Team */}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{row.flag}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: 'var(--fv-sans)', fontSize: 13, fontWeight: 600, color: 'var(--fv-ink)', lineHeight: 1 }}>
                          {row.name}
                        </div>
                        <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 9, color: 'var(--fv-muted)', marginTop: 1 }}>
                          {row.code}
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <div style={COL}>{row.pj}</div>
                      <div style={COL}>{row.pg}</div>
                      <div style={COL}>{row.pe}</div>
                      <div style={COL}>{row.pp}</div>
                      <div style={{ ...COL, color: row.dif > 0 ? 'var(--fv-accent)' : row.dif < 0 ? 'var(--fv-bad)' : 'var(--fv-muted)' }}>
                        {row.dif > 0 ? '+' : ''}{row.dif}
                      </div>
                      <div style={{ ...COL, fontWeight: 800, fontSize: 13, color: row.pts > 0 ? 'var(--fv-ink)' : 'var(--fv-muted)', width: 28 }}>
                        {row.pts}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ padding: '14px 20px 0', display: 'flex', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: 'var(--fv-accent)', flexShrink: 0 }} />
          <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 9, color: 'var(--fv-muted)', letterSpacing: '0.06em' }}>Top 2 → R32</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: 'var(--fv-flash)', flexShrink: 0 }} />
          <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 9, color: 'var(--fv-muted)', letterSpacing: '0.06em' }}>3.º mejor</div>
        </div>
      </div>

      <TabBar leagueId={params.id} />
    </div>
  );
}
