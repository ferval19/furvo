import { createClient } from '@/lib/supabase/server';
import { TabBar } from '@/components/tab-bar';
import { FurvoWordmark, GlassCard, EyebrowLabel, Avatar } from '@/components/primitives';
import { CopyCode } from '@/components/copy-code';
import { RulesCheck } from '@/components/rules-check';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = createClient();
  const { data: league } = await supabase
    .from('leagues')
    .select('name')
    .eq('invite_code', params.id)
    .single();
  const name = league?.name ?? 'Liga privada';
  return {
    title: name,
    description: `Clasificación y predicciones de ${name} · Porra del Mundial 2026`,
    robots: { index: false, follow: false },
  };
}

const RANK_COLOR = ['oklch(0.82 0.16 88)', 'oklch(0.78 0.05 240)', 'oklch(0.70 0.12 50)'];

function phaseLabel(phase: string, jornada: number) {
  if (phase === 'grupos') {
    const md = jornada <= 3 ? `MD${jornada}` : '?';
    return `Fase de Grupos · ${md}`;
  }
  if (phase === 'r32') return 'Ronda de 32';
  if (phase === 'r16') return 'Octavos de Final';
  if (phase === 'qf') return 'Cuartos de Final';
  if (phase === 'sf') return 'Semifinales';
  if (phase === 'final') return 'Final';
  return `Jornada ${jornada}`;
}

export default async function LigaPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const [{ data: league }, { data: { user } }] = await Promise.all([
    supabase.from('leagues').select('*').eq('invite_code', params.id).single(),
    supabase.auth.getUser(),
  ]);

  if (!league) notFound();

  const msLeft = new Date('2026-06-11T00:00:00Z').getTime() - Date.now();
  const daysLeft = Math.max(0, Math.floor(msLeft / 86_400_000));

  const { data: activeJornadaRow } = await supabase
    .from('matches')
    .select('jornada_number, phase')
    .neq('status', 'finished')
    .order('jornada_number', { ascending: true })
    .limit(1)
    .single();

  const jornadaNum = activeJornadaRow?.jornada_number ?? null;
  const phase = activeJornadaRow?.phase ?? 'grupos';

  const { data: jornadaMatches } = jornadaNum
    ? await supabase.from('matches').select('id').eq('jornada_number', jornadaNum)
    : { data: [] as { id: string }[] };

  const totalInJornada = jornadaMatches?.length ?? 0;

  const { data: myPreds } = (jornadaNum && user && totalInJornada > 0)
    ? await supabase.from('predictions')
        .select('match_id')
        .eq('user_id', user.id)
        .eq('league_id', league.id)
        .in('match_id', (jornadaMatches ?? []).map(m => m.id))
    : { data: [] as { match_id: string }[] };

  const predCount = myPreds?.length ?? 0;
  const remaining = totalInJornada - predCount;

  const { data: standings } = await supabase.rpc('get_standings', { league_uuid: league.id });

  const { count: liveCount } = await supabase
    .from('matches')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'live');

  return (
    <div className="fv-page" style={{ paddingBottom: 120, minHeight: '100vh' }}>
      <RulesCheck ligaId={params.id} />
      {/* ── Mobile header ── */}
      <div className="fv-mobile-only" style={{ padding: '28px 20px 0', display: 'flex', justifyContent: 'center' }}>
        <FurvoWordmark size={22} />
      </div>

      <div style={{ padding: '16px 20px 0' }}>
        <EyebrowLabel>Liga privada</EyebrowLabel>
        <div style={{
          fontFamily: 'var(--fv-serif)', fontSize: 36,
          letterSpacing: '-0.03em', lineHeight: 1.0,
          color: 'var(--fv-ink)', marginTop: 4,
        }}>
          {league.name}
        </div>
      </div>

      {/* ── Live banner ── */}
      {(liveCount ?? 0) > 0 && (
        <div className="fv-fade-in" style={{ padding: '12px 20px 0' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 16px', borderRadius: 14,
            background: 'var(--fv-live-soft)',
            border: '1px solid color-mix(in oklch, var(--fv-live) 30%, transparent)',
          }}>
            <span className="fv-live-dot" style={{ width: 8, height: 8, flexShrink: 0 }} />
            <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fv-live)' }}>
              {liveCount} partido{(liveCount ?? 0) > 1 ? 's' : ''} en vivo ahora
            </div>
          </div>
        </div>
      )}

      {/* ── Desktop 2-col / Mobile single-col ── */}
      <div className="fv-liga-grid fv-fade-in" style={{ padding: '18px 20px 0' }}>

        {/* Left: jornada + quick links + invite */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Hero jornada */}
          <div style={{
            borderRadius: 22, overflow: 'hidden',
            background: 'var(--fv-surface)',
            border: '1px solid var(--fv-line)',
            padding: '22px 22px 20px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <EyebrowLabel>{jornadaNum ? phaseLabel(phase, jornadaNum) : 'Sin jornadas'}</EyebrowLabel>
                <div style={{
                  fontFamily: 'var(--fv-sans)', fontSize: 34, fontWeight: 700,
                  letterSpacing: '-0.04em', lineHeight: 1, marginTop: 6,
                }}>
                  {jornadaNum ? `J${jornadaNum}` : '—'}
                </div>
              </div>
              <div style={{
                fontFamily: 'var(--fv-mono)', fontSize: 9, fontWeight: 700,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                color: 'var(--fv-flash)', background: 'var(--fv-flash-soft)',
                borderRadius: 999, padding: '4px 10px',
              }}>
                Mundial &#39;26
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <div style={{ fontFamily: 'var(--fv-sans)', fontSize: 20, fontWeight: 600, letterSpacing: '-0.025em' }}>
                  {remaining > 0
                    ? <><span style={{ color: 'var(--fv-accent)', fontWeight: 700 }}>{remaining}</span> sin predecir</>
                    : <span style={{ color: 'var(--fv-accent)' }}>¡Todo listo! ✓</span>
                  }
                </div>
                <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 10, color: 'var(--fv-muted)' }}>
                  {predCount}/{totalInJornada}
                </div>
              </div>
              <div style={{ height: 3, borderRadius: 3, background: 'var(--fv-surface-2)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 3,
                  background: 'var(--fv-accent)',
                  width: totalInJornada > 0 ? `${Math.round((predCount / totalInJornada) * 100)}%` : '0%',
                  opacity: predCount === totalInJornada ? 1 : 0.65,
                }} />
              </div>
            </div>

            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
              <Link href={`/jornada/${params.id}`} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '11px 20px', borderRadius: 999,
                background: remaining > 0 ? 'var(--fv-accent)' : 'var(--fv-surface-2)',
                color: remaining > 0 ? '#0a1a12' : 'var(--fv-muted)',
                fontFamily: 'var(--fv-sans)', fontSize: 14, fontWeight: 700,
              }}>
                {remaining > 0 ? 'Completar porra →' : 'Ver porra →'}
              </Link>
              {daysLeft > 0 && (
                <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 10, color: 'var(--fv-flash)', letterSpacing: '0.06em' }}>
                  {daysLeft}d para el inicio
                </div>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href={`/grupos/${params.id}`} className="fv-card-link" style={{
              flex: 1, padding: '14px 16px', borderRadius: 14,
              background: 'var(--fv-surface)', border: '1px solid var(--fv-line)',
              display: 'flex', flexDirection: 'column', gap: 6,
            }}>
              <div style={{ fontSize: 20 }}>🌍</div>
              <div style={{ fontFamily: 'var(--fv-serif)', fontSize: 16, color: 'var(--fv-ink)', lineHeight: 1 }}>Grupos</div>
              <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 9, color: 'var(--fv-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Mundial 2026
              </div>
            </Link>
            <Link href={`/resultados/${params.id}`} className="fv-card-link" style={{
              flex: 1, padding: '14px 16px', borderRadius: 14,
              background: 'var(--fv-surface)', border: '1px solid var(--fv-line)',
              display: 'flex', flexDirection: 'column', gap: 6,
            }}>
              <div style={{ fontSize: 20 }}>📊</div>
              <div style={{ fontFamily: 'var(--fv-serif)', fontSize: 16, color: 'var(--fv-ink)', lineHeight: 1 }}>Resultados</div>
              <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 9, color: 'var(--fv-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Mis predicciones
              </div>
            </Link>
          </div>

          {/* Invite code */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', borderRadius: 14,
            background: 'var(--fv-surface)', border: '1px solid var(--fv-line)',
          }}>
            <CopyCode code={league.invite_code} />
            <div style={{
              fontFamily: 'var(--fv-mono)', fontSize: 9, color: 'var(--fv-muted)',
              textAlign: 'right', letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1.7,
            }}>
              Toca para<br />copiar
            </div>
          </div>
        </div>

        {/* Right: standings */}
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <EyebrowLabel>Clasificación</EyebrowLabel>
              <div style={{ fontFamily: 'var(--fv-serif)', fontSize: 28, letterSpacing: '-0.02em', lineHeight: 1, marginTop: 5 }}>
                Top 5
              </div>
            </div>
            <Link href={`/clasificacion/${params.id}`} style={{
              fontFamily: 'var(--fv-mono)', fontSize: 9, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--fv-muted)',
            }}>
              Ver todo →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {(standings ?? []).slice(0, 5).map((s, i) => (
              <GlassCard key={s.user_id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    fontFamily: 'var(--fv-mono)', fontSize: 12, fontWeight: 700,
                    width: 20, textAlign: 'center', flexShrink: 0,
                    color: i < 3 ? RANK_COLOR[i] : 'var(--fv-muted)',
                  }}>
                    {i + 1}
                  </div>
                  <Avatar name={s.name} color={s.avatar_color} size={34} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'var(--fv-serif)', fontSize: 17, lineHeight: 1,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {s.name}
                    </div>
                    <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 9, color: 'var(--fv-muted)', marginTop: 2, letterSpacing: '0.08em' }}>
                      {s.hits} aciertos · {s.predictions_count} pred.
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 20, fontWeight: 700, flexShrink: 0 }}>
                    {s.total_points}
                  </div>
                </div>
              </GlassCard>
            ))}
            {(!standings || standings.length === 0) && (
              <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: 'var(--fv-mono)', color: 'var(--fv-muted)', fontSize: 11 }}>
                Sé el primero en predecir
              </div>
            )}
          </div>
        </div>
      </div>

      <TabBar leagueId={params.id} hasLive={(liveCount ?? 0) > 0} />
    </div>
  );
}
