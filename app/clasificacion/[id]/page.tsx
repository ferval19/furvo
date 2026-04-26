import { createClient } from '@/lib/supabase/server';
import { TabBar } from '@/components/tab-bar';
import { EyebrowLabel, Avatar } from '@/components/primitives';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clasificación',
  robots: { index: false, follow: false },
};

const RANK: { color: string; label: string; bg: string }[] = [
  { color: 'oklch(0.82 0.16 88)',  label: '1', bg: 'oklch(0.22 0.07 88)'  },
  { color: 'oklch(0.78 0.05 240)', label: '2', bg: 'oklch(0.22 0.04 240)' },
  { color: 'oklch(0.70 0.12 50)',  label: '3', bg: 'oklch(0.22 0.06 50)'  },
];

export default async function ClasificacionPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const [{ data: league }, { data: { user } }] = await Promise.all([
    supabase.from('leagues').select('*').eq('invite_code', params.id).single(),
    supabase.auth.getUser(),
  ]);

  if (!league) notFound();

  const [{ data: standings }, { data: members }] = await Promise.all([
    supabase.rpc('get_standings', { league_uuid: league.id }),
    supabase.from('league_members').select('user_id, profiles(avatar_url)').eq('league_id', league.id),
  ]);

  const avatarMap: Record<string, string | null> = {};
  for (const m of members ?? []) {
    avatarMap[(m as any).user_id] = (m as any).profiles?.avatar_url ?? null;
  }

  const top3 = (standings ?? []).slice(0, 3);
  const rest = (standings ?? []).slice(3);
  const myPosition = (standings ?? []).findIndex(s => s.user_id === user?.id);
  const myRow = myPosition >= 3 ? (standings ?? [])[myPosition] : null;

  return (
    <div className="fv-page" style={{ paddingBottom: 120, minHeight: '100vh' }}>
      {/* Sticky glass header */}
      <div className="fv-page-header" style={{ padding: '12px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fv-ink)' }}>
            Clasificación
          </div>
          <div style={{ fontFamily: 'var(--fv-serif)', fontSize: 15, color: 'var(--fv-muted)', fontStyle: 'italic' }}>
            {league.name}
          </div>
        </div>
      </div>

      {/* Mi posición (si estoy fuera del top 3) */}
      {myRow && (
        <div style={{ padding: '0 20px 12px' }}>
          <div style={{
            padding: '14px 18px', borderRadius: 16,
            background: 'var(--fv-accent-soft)',
            border: '1px solid color-mix(in oklch, var(--fv-accent) 30%, transparent)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fv-accent)', flex: 1 }}>
              Tu posición · #{myPosition + 1}
            </div>
            <div style={{ fontFamily: 'var(--fv-serif)', fontSize: 17, color: 'var(--fv-accent)' }}>{myRow.name}</div>
            <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 20, fontWeight: 800, color: 'var(--fv-accent)' }}>
              {myRow.total_points}
            </div>
          </div>
        </div>
      )}

      {/* Podio top 3 — stacked on mobile, 3-col on desktop */}
      {top3.length > 0 && (
        <div className="fv-3col" style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {top3.map((s, i) => {
            const rank = RANK[i];
            const isMe = s.user_id === user?.id;
            return (
              <div key={s.user_id} style={{
                padding: '16px 18px', borderRadius: 18,
                background: rank.bg,
                border: `1px solid color-mix(in oklch, ${rank.color} 20%, transparent)`,
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <div style={{
                  fontFamily: 'var(--fv-mono)', fontSize: 22, fontWeight: 800,
                  color: rank.color, width: 28, flexShrink: 0, textAlign: 'center',
                }}>
                  {rank.label}
                </div>
                <Avatar name={s.name} color={s.avatar_color} avatarUrl={avatarMap[s.user_id]} size={42} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'var(--fv-serif)', fontSize: 20, lineHeight: 1,
                    color: isMe ? rank.color : 'var(--fv-ink)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {s.name}{isMe ? ' · tú' : ''}
                  </div>
                  <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 10, color: 'var(--fv-muted)', marginTop: 4, letterSpacing: '0.06em' }}>
                    @{s.handle} · {s.hits} aciertos de {s.predictions_count}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 28, fontWeight: 800, color: rank.color, lineHeight: 1 }}>
                    {s.total_points}
                  </div>
                  <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 8, color: 'var(--fv-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 3 }}>
                    pts
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Resto */}
      {rest.length > 0 && (
        <div style={{ padding: '12px 20px 0', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {rest.map((s, idx) => {
            const i = idx + 3;
            const isMe = s.user_id === user?.id;
            return (
              <div key={s.user_id} className={isMe ? undefined : 'glass'} style={{
                padding: '12px 16px', borderRadius: 14,
                display: 'flex', alignItems: 'center', gap: 12,
                background: isMe
                  ? 'color-mix(in oklch, var(--fv-accent-soft) 60%, var(--fv-surface))'
                  : undefined,
                border: isMe ? '1px solid color-mix(in oklch, var(--fv-accent) 25%, transparent)' : undefined,
              }}>
                <div style={{
                  fontFamily: 'var(--fv-mono)', fontSize: 12, fontWeight: 700,
                  color: 'var(--fv-muted)', width: 22, textAlign: 'center', flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <Avatar name={s.name} color={s.avatar_color} avatarUrl={avatarMap[s.user_id]} size={30} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'var(--fv-serif)', fontSize: 16,
                    color: isMe ? 'var(--fv-accent)' : 'var(--fv-ink)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {s.name}
                  </div>
                  <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 9, color: 'var(--fv-muted)', marginTop: 1, letterSpacing: '0.06em' }}>
                    @{s.handle} · {s.hits} aciertos
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 18, fontWeight: 700, flexShrink: 0 }}>
                  {s.total_points}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {(!standings || standings.length === 0) && (
        <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'var(--fv-mono)', color: 'var(--fv-muted)', fontSize: 11, letterSpacing: '0.1em' }}>
          Aún no hay predicciones
        </div>
      )}

      <TabBar leagueId={params.id} />
    </div>
  );
}
