'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { FurvoWordmark, PickToggle, EyebrowLabel, ExactScoreInput, MatchCard } from '@/components/primitives';
import { TabBar } from '@/components/tab-bar';
import type { JornadaMeta } from './page';

type TeamInfo = { code: string; name: string; flag: string | null; group_letter: string | null };
type Match = {
  id: string; jornada_number: number; phase: string; kickoff_at: string; special: string | null;
  home_team: string; away_team: string;
  home: TeamInfo; away: TeamInfo;
};
type Prediction = {
  match_id: string; pick: '1' | 'X' | '2' | null;
  exact_home: number | null; exact_away: number | null;
};

function phaseLabel(phase: string, jornada: number) {
  if (phase === 'grupos') return `Fase de Grupos · MD${jornada}`;
  if (phase === 'r32') return 'Ronda de 32';
  if (phase === 'r16') return 'Octavos de Final';
  if (phase === 'qf') return 'Cuartos de Final';
  if (phase === 'sf') return 'Semifinales';
  if (phase === 'final') return 'Final';
  return `Jornada ${jornada}`;
}


function groupMatches(matches: Match[], phase: string): { label: string; slug: string; matches: Match[] }[] {
  if (phase === 'grupos') {
    const byGroup: Record<string, Match[]> = {};
    for (const m of matches) {
      const g = m.home.group_letter ?? '?';
      if (!byGroup[g]) byGroup[g] = [];
      byGroup[g].push(m);
    }
    return Object.entries(byGroup)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([g, ms]) => ({ label: `Grupo ${g}`, slug: `grupo-${g}`, matches: ms }));
  }
  return [{ label: phaseLabel(phase, matches[0]?.jornada_number ?? 0), slug: 'jornada', matches }];
}

function pickFromScore(h: number | null, a: number | null): '1' | 'X' | '2' | null {
  if (h === null || a === null) return null;
  if (h > a) return '1';
  if (a > h) return '2';
  return 'X';
}

function isMatchDone(m: Match, pred: Prediction | undefined): boolean {
  if (m.special === 'exact') return pred?.exact_home !== null && pred?.exact_home !== undefined && pred?.exact_away !== null && pred?.exact_away !== undefined;
  return !!pred?.pick;
}

function pillLabel(meta: JornadaMeta): string {
  if (meta.phase === 'grupos') return `J${meta.number}`;
  if (meta.phase === 'r32')    return 'R32';
  if (meta.phase === 'r16')    return 'R16';
  if (meta.phase === 'qf')     return 'QF';
  if (meta.phase === 'sf')     return 'SF';
  if (meta.phase === 'final')  return 'FIN';
  return `J${meta.number}`;
}

export function JornadaClient({
  leagueId, leagueCode, matches, initialPredictions, jornadaNum, phase, jornadasMeta,
}: {
  leagueId: string;
  leagueCode: string;
  matches: Match[];
  initialPredictions: Record<string, Prediction>;
  jornadaNum: number;
  phase: string;
  jornadasMeta: JornadaMeta[];
}) {
  const router = useRouter();
  const [predictions, setPredictions] = useState(initialPredictions);

  // Auto-scroll active pill into view
  const activePillRef = useCallback((node: HTMLButtonElement | null) => {
    node?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [jornadaNum]); // eslint-disable-line react-hooks/exhaustive-deps
  const groups = groupMatches(matches, phase);
  const filled = matches.filter(m => isMatchDone(m, predictions[m.id])).length;
  const allDone = filled === matches.length;

  async function updatePick(matchId: string, pick: '1' | 'X' | '2') {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const existing = predictions[matchId];
    const next: Prediction = { match_id: matchId, pick, exact_home: existing?.exact_home ?? null, exact_away: existing?.exact_away ?? null };
    setPredictions(p => ({ ...p, [matchId]: next }));
    await supabase.from('predictions').upsert({
      user_id: user.id, league_id: leagueId, match_id: matchId,
      pick, exact_home: next.exact_home, exact_away: next.exact_away,
    }, { onConflict: 'user_id,league_id,match_id' });
  }

  async function updateExact(matchId: string, exactHome: number | null, exactAway: number | null) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const existing = predictions[matchId];
    const match = matches.find(m => m.id === matchId);
    const isExactOnly = match?.special === 'exact';

    if (isExactOnly) {
      // Derive pick from the score — only save to DB when both scores are set
      const derivedPick = pickFromScore(exactHome, exactAway);
      const next: Prediction = { match_id: matchId, pick: derivedPick, exact_home: exactHome, exact_away: exactAway };
      setPredictions(p => ({ ...p, [matchId]: next }));
      if (exactHome !== null && exactAway !== null) {
        await supabase.from('predictions').upsert({
          user_id: user.id, league_id: leagueId, match_id: matchId,
          pick: derivedPick, exact_home: exactHome, exact_away: exactAway,
        }, { onConflict: 'user_id,league_id,match_id' });
      }
    } else {
      if (!existing?.pick) return;
      setPredictions(p => ({ ...p, [matchId]: { ...existing, exact_home: exactHome, exact_away: exactAway } }));
      await supabase.from('predictions').upsert({
        user_id: user.id, league_id: leagueId, match_id: matchId,
        pick: existing.pick, exact_home: exactHome, exact_away: exactAway,
      }, { onConflict: 'user_id,league_id,match_id' });
    }
  }

  function jumpToGroup(slug: string) {
    document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function jumpToNext() {
    const unpicked = matches.find(m => !isMatchDone(m, predictions[m.id]));
    if (!unpicked) return;
    const group = groups.find(g => g.matches.some(m => m.id === unpicked.id));
    if (group) jumpToGroup(group.slug);
  }

  return (
    <div className="fv-page" style={{ paddingBottom: 'calc(140px + env(safe-area-inset-bottom, 0px))', minHeight: '100vh' }}>
      {/* Logo — mobile only */}
      <div className="fv-mobile-only" style={{ padding: '28px 20px 0', display: 'flex', justifyContent: 'center' }}>
        <FurvoWordmark size={22} />
      </div>

      {/* ── Jornada Navigator — sticky FotMob-style ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: 'color-mix(in oklch, var(--fv-bg) 88%, transparent)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--fv-line)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div className="fv-scroll-x" style={{ display: 'flex', gap: 4, padding: '10px 16px' }}>
          {jornadasMeta.map(meta => {
            const isCurrent  = meta.number === jornadaNum;
            const isPast     = meta.finished === meta.total;
            const isLive     = meta.hasLive;
            const isFuture   = meta.finished === 0 && !isLive && !isCurrent;

            const bg = isCurrent
              ? isLive ? 'var(--fv-live-soft)' : 'var(--fv-accent-soft)'
              : 'transparent';
            const color = isCurrent
              ? isLive ? 'var(--fv-live)' : 'var(--fv-accent)'
              : isPast ? 'var(--fv-tertiary)'
              : isFuture ? 'oklch(0.35 0.01 150)'
              : 'var(--fv-muted)';
            const border = isCurrent
              ? `1px solid ${isLive ? 'color-mix(in oklch, var(--fv-live) 35%, transparent)' : 'color-mix(in oklch, var(--fv-accent) 35%, transparent)'}`
              : '1px solid transparent';

            return (
              <button
                key={meta.number}
                ref={isCurrent ? activePillRef : undefined}
                onClick={() => router.push(`/jornada/${leagueCode}?j=${meta.number}`)}
                style={{
                  flexShrink: 0,
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '6px 12px', borderRadius: 999,
                  background: bg, border, cursor: 'pointer',
                  fontFamily: 'var(--fv-mono)', fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.06em', color,
                  transition: 'background 0.15s, color 0.15s',
                  opacity: isFuture ? 0.45 : 1,
                }}
              >
                {isLive && <span className="fv-live-dot" style={{ width: 6, height: 6 }} />}
                {pillLabel(meta)}
                {isPast && !isCurrent && (
                  <span style={{ fontSize: 9, opacity: 0.7 }}>✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Page title + counter */}
      <div style={{ padding: '16px 20px 0' }}>
        <EyebrowLabel>{phaseLabel(phase, jornadaNum)}</EyebrowLabel>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 4 }}>
          <div style={{ fontFamily: 'var(--fv-serif)', fontSize: 32, letterSpacing: '-0.03em', lineHeight: 1 }}>
            Jornada {jornadaNum}
          </div>
          <div style={{
            fontFamily: 'var(--fv-mono)', fontSize: 13, fontWeight: 700,
            color: allDone ? 'var(--fv-accent)' : 'var(--fv-muted)',
          }}>
            {filled}/{matches.length}
          </div>
        </div>
      </div>

      {/* Group jump navigation */}
      {groups.length > 1 && (
        <div className="fv-scroll-x" style={{ padding: '14px 20px 0', display: 'flex', gap: 6 }}>
          {groups.map(g => {
            const gFilled = g.matches.filter(m => isMatchDone(m, predictions[m.id])).length;
            const gDone = gFilled === g.matches.length;
            const letter = g.label.replace('Grupo ', '');
            return (
              <button
                key={g.slug}
                onClick={() => jumpToGroup(g.slug)}
                style={{
                  flexShrink: 0, padding: '7px 13px', borderRadius: 999, border: 'none',
                  background: gDone ? 'var(--fv-accent-soft)' : 'var(--fv-surface-2)',
                  color: gDone ? 'var(--fv-accent)' : 'var(--fv-muted)',
                  fontFamily: 'var(--fv-mono)', fontSize: 11, fontWeight: 700,
                  cursor: 'pointer', letterSpacing: '0.06em',
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                {letter}{gDone ? ' ✓' : ` ${gFilled}/${g.matches.length}`}
              </button>
            );
          })}
        </div>
      )}

      {/* Match groups */}
      <div style={{ padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: 28 }}>
        {groups.map(group => (
          <div key={group.slug} id={group.slug} style={{ scrollMarginTop: 20 }}>
            <div style={{
              fontFamily: 'var(--fv-mono)', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              color: 'var(--fv-muted)', marginBottom: 8,
              paddingBottom: 6, borderBottom: '1px solid var(--fv-line)',
              display: 'flex', justifyContent: 'space-between',
            }}>
              <span>{group.label}</span>
              <span style={{ color: group.matches.every(m => isMatchDone(m, predictions[m.id])) ? 'var(--fv-accent)' : 'var(--fv-tertiary)' }}>
                {group.matches.filter(m => isMatchDone(m, predictions[m.id])).length}/{group.matches.length}
              </span>
            </div>

            <div className="fv-match-grid">
              {group.matches.map(m => {
                const pred = predictions[m.id];
                const isExact = m.special === 'exact';
                const hasPick = isMatchDone(m, pred);

                return (
                  <MatchCard
                    key={m.id}
                    homeCode={m.home.code} homeName={m.home.name} homeFlag={m.home.flag}
                    awayCode={m.away.code} awayName={m.away.name} awayFlag={m.away.flag}
                    status="upcoming"
                    kickoffAt={m.kickoff_at}
                    special={m.special}
                    saved={hasPick}
                  >
                    {isExact ? (
                      <ExactScoreInput
                        home={pred?.exact_home ?? null}
                        away={pred?.exact_away ?? null}
                        onChange={(h, a) => updateExact(m.id, h, a)}
                        label="Resultado exacto · ★ +3 pts"
                      />
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 4 }}>
                        <PickToggle value={pred?.pick ?? null} onChange={p => updatePick(m.id, p)} />
                      </div>
                    )}
                  </MatchCard>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Floating progress bar */}
      <div className="fv-progress-float" style={{
        position: 'fixed',
        bottom: 'calc(88px + env(safe-area-inset-bottom, 0px))',
        left: 20, right: 20,
        zIndex: 40,
        padding: '10px 14px',
        borderRadius: 16,
        background: 'color-mix(in oklch, var(--fv-surface) 92%, transparent)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--fv-line)',
        display: 'flex', alignItems: 'center', gap: 10,
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}>
        {/* Mini dots */}
        <div style={{ display: 'flex', gap: 2, flex: 1, flexWrap: 'wrap' }}>
          {matches.map(m => (
            <div key={m.id} style={{
              width: 6, height: 6, borderRadius: 3, flexShrink: 0,
              background: isMatchDone(m, predictions[m.id]) ? 'var(--fv-accent)' : 'var(--fv-surface-2)',
              transition: 'background 0.2s',
            }} />
          ))}
        </div>

        {allDone ? (
          <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 11, fontWeight: 700, color: 'var(--fv-accent)', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
            ✓ Todo listo
          </div>
        ) : (
          <button
            onClick={jumpToNext}
            style={{
              flexShrink: 0, padding: '6px 12px', borderRadius: 999, border: 'none',
              background: 'var(--fv-accent)', color: '#0a1a12',
              fontFamily: 'var(--fv-mono)', fontSize: 10, fontWeight: 700,
              cursor: 'pointer', whiteSpace: 'nowrap', letterSpacing: '0.06em',
            }}
          >
            {filled}/{matches.length} · Siguiente →
          </button>
        )}
      </div>

      <TabBar leagueId={leagueCode} />
    </div>
  );
}
