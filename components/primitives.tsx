import React from 'react';

// Pentagon crest badge with italic "F"
export function FurvoMark({ size = 36 }: { size?: number }) {
  const pts = "20,2 37.1,14.4 30.6,34.6 9.4,34.6 2.9,14.4";
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <polygon points={pts} fill="var(--fv-accent)" />
        <polygon points={pts} fill="none" stroke="oklch(0.55 0.18 148)" strokeWidth={1.2} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        paddingBottom: size * 0.04,
        fontFamily: '"Instrument Serif", Georgia, serif',
        fontSize: size * 0.56, fontWeight: 400,
        fontStyle: 'italic', color: '#0a1a12', lineHeight: 1,
        userSelect: 'none',
      }}>
        F
      </div>
    </div>
  );
}

// Full logo: pentagon mark + wordmark
export function FurvoLogo({ size = 32 }: { size?: number }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: Math.round(size * 0.3) }}>
      <FurvoMark size={size} />
      <div>
        <div style={{
          fontFamily: '"Instrument Serif", Georgia, serif',
          fontWeight: 400, fontStyle: 'italic',
          fontSize: Math.round(size * 0.78),
          letterSpacing: '-0.03em', lineHeight: 1,
          color: 'var(--fv-ink)',
        }}>
          Furvo
        </div>
        <div style={{
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontSize: Math.max(7, Math.round(size * 0.22)),
          letterSpacing: '0.18em', lineHeight: 1,
          color: 'var(--fv-muted)', marginTop: 3,
          textTransform: 'uppercase',
        }}>
          Mundial &#39;26
        </div>
      </div>
    </div>
  );
}

export function FurvoWordmark({
  size = 20,
  color = 'var(--fv-ink)',
  edition = false,
}: {
  size?: number;
  color?: string;
  edition?: boolean;
}) {
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <div style={{
        fontFamily: '"Instrument Serif", Georgia, serif',
        fontSize: size, fontWeight: 400,
        fontStyle: 'italic',
        color, letterSpacing: '-0.02em', lineHeight: 1,
        userSelect: 'none',
      }}>
        Furvo
      </div>
      {edition && (
        <div style={{
          fontFamily: 'var(--fv-mono)',
          fontSize: Math.max(9, Math.round(size * 0.24)),
          fontWeight: 600,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--fv-muted)',
          marginTop: Math.round(size * 0.16),
        }}>
          Edición Mundial &#39;26
        </div>
      )}
    </div>
  );
}

export function GlassCard({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <div onClick={onClick} className="glass" style={{
      padding: '14px 16px', borderRadius: 16,
      cursor: onClick ? 'pointer' : 'default',
    }}>{children}</div>
  );
}

export function EyebrowLabel({ children, color }: { children: React.ReactNode; color?: string }) {
  return <div style={{
    fontFamily: 'var(--fv-mono)', fontSize: 10, fontWeight: 500,
    letterSpacing: '0.12em', textTransform: 'uppercase',
    color: color ?? 'var(--fv-muted)',
  }}>{children}</div>;
}

export function SectionHeader({ eyebrow, title, action }: { eyebrow?: string; title: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div style={{ padding: '28px 20px 12px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
      <div>
        {eyebrow && <EyebrowLabel>{eyebrow}</EyebrowLabel>}
        <div style={{ fontFamily: 'var(--fv-serif)', fontSize: 32, letterSpacing: '-0.02em', lineHeight: 1, color: 'var(--fv-ink)', marginTop: 6 }}>{title}</div>
      </div>
      {action}
    </div>
  );
}

export function TeamLine({
  code, name, flag, align = 'left',
}: {
  code: string;
  name?: string | null;
  flag?: string | null;
  align?: 'left' | 'right';
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      flexDirection: align === 'right' ? 'row-reverse' : 'row',
      flex: 1,
    }}>
      <div style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }}>{flag}</div>
      <div style={{ textAlign: align === 'right' ? 'right' : 'left' }}>
        <div style={{ fontFamily: 'var(--fv-sans)', fontSize: 15, fontWeight: 700, lineHeight: 1, color: 'var(--fv-ink)' }}>{code}</div>
        {name && (
          <div style={{ fontFamily: 'var(--fv-sans)', fontSize: 10, color: 'var(--fv-muted)', marginTop: 2, lineHeight: 1 }}>
            {name}
          </div>
        )}
      </div>
    </div>
  );
}

export function PickToggle({ value, onChange }: { value: '1' | 'X' | '2' | null; onChange: (v: '1' | 'X' | '2') => void }) {
  return (
    <div style={{ display: 'inline-flex', background: 'var(--fv-surface-2)', borderRadius: 999, padding: 3, flexShrink: 0 }}>
      {(['1', 'X', '2'] as const).map(p => (
        <button key={p} onClick={() => onChange(p)} style={{
          minWidth: 44, minHeight: 44, padding: '0 10px', borderRadius: 999, border: 'none',
          background: value === p ? 'var(--fv-accent)' : 'transparent',
          color: value === p ? '#0a1a12' : 'var(--fv-ink)',
          fontFamily: 'var(--fv-mono)', fontSize: 14, fontWeight: 700,
          transition: 'background 0.15s, transform 0.28s cubic-bezier(0.34,1.56,0.64,1)',
          transform: value === p ? 'scale(1.12)' : 'scale(1)',
        }}>{p}</button>
      ))}
    </div>
  );
}

export function ExactScoreInput({
  home, away, onChange, label,
}: {
  home: number | null;
  away: number | null;
  onChange: (home: number | null, away: number | null) => void;
  label?: string;
}) {
  const inputStyle: React.CSSProperties = {
    width: 56, textAlign: 'center', padding: '8px 4px',
    borderRadius: 10, border: '1px solid var(--fv-line)',
    background: 'var(--fv-surface-2)', color: 'var(--fv-ink)',
    fontFamily: 'var(--fv-mono)', fontSize: 22, fontWeight: 700,
    outline: 'none', minHeight: 44,
  };
  return (
    <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--fv-line)' }}>
      <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fv-flash)', marginBottom: 8, textAlign: 'center' }}>
        {label ?? 'Marcador exacto · +2 pts bonus'}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
        <input
          type="number" min={0} max={20}
          value={home ?? ''}
          onChange={e => onChange(e.target.value === '' ? null : Number(e.target.value), away)}
          style={inputStyle}
        />
        <span style={{ fontFamily: 'var(--fv-mono)', fontSize: 18, color: 'var(--fv-muted)', fontWeight: 700 }}>–</span>
        <input
          type="number" min={0} max={20}
          value={away ?? ''}
          onChange={e => onChange(home, e.target.value === '' ? null : Number(e.target.value))}
          style={inputStyle}
        />
      </div>
    </div>
  );
}

// ── MatchCard ──────────────────────────────���────────────────────────────────��─
// FotMob-style horizontal match display. Used in resultados (server) and
// jornada (via children slot for prediction controls).

type MatchCardStatus = 'upcoming' | 'live' | 'finished';

export function MatchCard({
  homeCode, homeName, homeFlag,
  awayCode, awayName, awayFlag,
  status, kickoffAt,
  homeScore, awayScore, liveMinute,
  special, saved,
  myPick, myPickHit, points,
  children,
}: {
  homeCode: string; homeName: string; homeFlag: string | null;
  awayCode: string; awayName: string; awayFlag: string | null;
  status: MatchCardStatus;
  kickoffAt: string;
  homeScore?: number | null; awayScore?: number | null; liveMinute?: number | null;
  special?: string | null; saved?: boolean;
  myPick?: '1' | 'X' | '2' | null; myPickHit?: boolean | null; points?: number | null;
  children?: React.ReactNode;
}) {
  const isLive     = status === 'live';
  const isFinished = status === 'finished' && homeScore !== null && homeScore !== undefined;
  const date = new Date(kickoffAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', timeZone: 'America/Mexico_City' });
  const time = new Date(kickoffAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Mexico_City' });

  const borderColor = isLive
    ? 'var(--fv-live)'
    : saved || isFinished
      ? myPickHit ? 'var(--fv-win)' : myPickHit === false ? 'var(--fv-loss)' : 'var(--fv-accent)'
      : 'transparent';

  return (
    <div className="glass fv-tappable" style={{
      borderRadius: 18, overflow: 'hidden',
      borderLeft: `3px solid ${borderColor}`,
      transition: 'border-color 0.2s',
    }}>
      {/* Top meta row */}
      <div style={{
        padding: '10px 14px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        {/* Date/time or live indicator */}
        {isLive ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="fv-live-dot" />
            <span style={{ fontFamily: 'var(--fv-mono)', fontSize: 10, fontWeight: 700, color: 'var(--fv-live)', letterSpacing: '0.08em' }}>
              EN VIVO{liveMinute ? ` · ${liveMinute}'` : ''}
            </span>
          </div>
        ) : (
          <span style={{ fontFamily: 'var(--fv-mono)', fontSize: 10, color: 'var(--fv-muted)', letterSpacing: '0.04em' }}>
            {date} · {time}
          </span>
        )}

        {/* Right badge */}
        {special ? (
          <div style={{
            fontFamily: 'var(--fv-mono)', fontSize: 8, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: 999, padding: '3px 8px',
            color: special === 'exact' ? 'var(--fv-flash)' : 'var(--fv-accent)',
            background: special === 'exact' ? 'var(--fv-flash-soft)' : 'var(--fv-accent-soft)',
          }}>
            {special === 'double' ? '×2 Doble' : '★ Exacto +3'}
          </div>
        ) : saved ? (
          <span style={{ fontFamily: 'var(--fv-mono)', fontSize: 9, color: 'var(--fv-accent)', letterSpacing: '0.06em' }}>✓ guardado</span>
        ) : null}
      </div>

      {/* Teams + score row — FotMob horizontal layout */}
      <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Home */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, minWidth: 0 }}>
          <span style={{ fontSize: 28, lineHeight: 1 }}>{homeFlag}</span>
          <span style={{
            fontFamily: 'var(--fv-sans)', fontSize: 13, fontWeight: 700,
            color: 'var(--fv-ink)', textAlign: 'right',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%',
          }}>{homeName}</span>
          <span style={{ fontFamily: 'var(--fv-mono)', fontSize: 9, color: 'var(--fv-tertiary)', letterSpacing: '0.06em' }}>{homeCode}</span>
        </div>

        {/* Center: score or time */}
        <div style={{ flexShrink: 0, width: 72, textAlign: 'center' }}>
          {isFinished || isLive ? (
            <div style={{
              fontFamily: 'var(--fv-mono)', fontWeight: 800,
              fontSize: isLive ? 24 : 26,
              color: isLive ? 'var(--fv-live)' : 'var(--fv-ink)',
              letterSpacing: '-0.02em', lineHeight: 1,
            }}>
              {homeScore ?? 0} – {awayScore ?? 0}
            </div>
          ) : (
            <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 13, fontWeight: 600, color: 'var(--fv-tertiary)', letterSpacing: '0.06em' }}>
              vs
            </div>
          )}

          {/* My pick badge — shown in results context */}
          {myPick && isFinished && (
            <div style={{
              marginTop: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              gap: 4, padding: '2px 8px', borderRadius: 999,
              background: myPickHit ? 'var(--fv-win-soft)' : 'var(--fv-loss-soft)',
              border: `1px solid ${myPickHit ? 'color-mix(in oklch, var(--fv-win) 30%, transparent)' : 'color-mix(in oklch, var(--fv-loss) 30%, transparent)'}`,
            }}>
              <span style={{ fontFamily: 'var(--fv-mono)', fontSize: 11, fontWeight: 700, color: myPickHit ? 'var(--fv-win)' : 'var(--fv-loss)' }}>
                {myPick}
              </span>
              {points !== null && points !== undefined && (
                <span style={{ fontFamily: 'var(--fv-mono)', fontSize: 10, fontWeight: 800, color: myPickHit ? 'var(--fv-win)' : 'var(--fv-loss)' }}>
                  {points > 0 ? `+${points}` : points}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Away */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3, minWidth: 0 }}>
          <span style={{ fontSize: 28, lineHeight: 1 }}>{awayFlag}</span>
          <span style={{
            fontFamily: 'var(--fv-sans)', fontSize: 13, fontWeight: 700,
            color: 'var(--fv-ink)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%',
          }}>{awayName}</span>
          <span style={{ fontFamily: 'var(--fv-mono)', fontSize: 9, color: 'var(--fv-tertiary)', letterSpacing: '0.06em' }}>{awayCode}</span>
        </div>
      </div>

      {/* Slot for prediction controls (PickToggle / ExactScoreInput) */}
      {children && (
        <div style={{ padding: '0 14px 12px' }}>
          {children}
        </div>
      )}
    </div>
  );
}

export function Avatar({
  name, color, size = 44, avatarUrl,
}: {
  name: string;
  color?: string | null;
  size?: number;
  avatarUrl?: string | null;
}) {
  if (avatarUrl) {
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%',
        flexShrink: 0, overflow: 'hidden', background: 'var(--fv-surface-2)',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarUrl}
          alt={name}
          referrerPolicy="no-referrer"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>
    );
  }

  const palette: Record<string, { bg: string; fg: string }> = {
    red:    { bg: 'oklch(0.28 0.14 28)',  fg: 'oklch(0.78 0.18 28)' },
    green:  { bg: 'var(--fv-accent-soft)', fg: 'var(--fv-accent)' },
    blue:   { bg: 'oklch(0.24 0.12 260)', fg: 'oklch(0.72 0.14 260)' },
    yellow: { bg: 'var(--fv-flash-soft)', fg: 'var(--fv-flash)' },
    purple: { bg: 'oklch(0.24 0.12 300)', fg: 'oklch(0.72 0.14 300)' },
    orange: { bg: 'oklch(0.26 0.14 50)',  fg: 'oklch(0.78 0.18 50)' },
    cyan:   { bg: 'oklch(0.24 0.12 200)', fg: 'oklch(0.72 0.14 200)' },
    pink:   { bg: 'oklch(0.26 0.12 340)', fg: 'oklch(0.78 0.14 340)' },
  };
  const { bg, fg } = palette[color ?? 'green'] ?? palette.green;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--fv-serif)', fontSize: Math.round(size * 0.46),
      color: fg, lineHeight: 1,
    }}>
      {name?.[0]?.toUpperCase() ?? '?'}
    </div>
  );
}
