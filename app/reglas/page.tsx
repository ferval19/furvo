'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { FurvoWordmark } from '@/components/primitives';
import { Suspense } from 'react';
import Link from 'next/link';

const POINTS = [
  {
    pts: '+1',
    label: 'Resultado correcto',
    desc: 'Aciertas quién gana o si hay empate (1 / X / 2). El ABC de la porra.',
    color: 'var(--fv-accent)',
    bg: 'var(--fv-accent-soft)',
  },
  {
    pts: '+3',
    label: 'Marcador exacto',
    desc: 'En partidos especiales debes predecir el marcador exacto. Aciertas score → +3 pts. Si fallas el score pero aciertas resultado → +1 pt.',
    color: 'var(--fv-flash)',
    bg: 'var(--fv-flash-soft)',
  },
  {
    pts: '0',
    label: 'Sin predicción / fallo',
    desc: 'Si no predices antes del pitido inicial, obtienes 0 puntos. No hay opción de cambiar después de que empiece el partido.',
    color: 'var(--fv-muted)',
    bg: 'var(--fv-surface-2)',
  },
];

const PHASES = [
  { icon: '🌍', label: 'Fase de grupos', sub: '3 jornadas · 12 grupos · 48 partidos' },
  { icon: '⚔️', label: 'Ronda de 32', sub: '32 equipos · eliminación directa' },
  { icon: '🔥', label: 'Octavos a Final', sub: 'R16 → QF → Semis → Final' },
];

const RULES = [
  {
    icon: '⏱',
    title: 'Cierre antes del pitido',
    body: 'Las predicciones se cierran en el momento en que arranca el partido. Pasado ese instante no podrás ni añadir ni modificar tu apuesta para ese partido.',
  },
  {
    icon: '⚖️',
    title: 'Igualdad de condiciones',
    body: 'Todos los participantes predicen el mismo tipo de resultado para cada partido. En partidos de marcador exacto, todos ponen el score — no hay ventajas.',
  },
  {
    icon: '🏆',
    title: 'Liga privada',
    body: 'La clasificación es solo entre los miembros de tu liga. Invita a quien quieras con el código de seis letras. Nadie más puede ver ni unirse.',
  },
  {
    icon: '📲',
    title: 'Predicciones en Jornada',
    body: 'Accede a la pestaña "Jornada" para ver los partidos de cada jornada y poner tus apuestas. El indicador de progreso te avisa de cuántas te faltan.',
  },
];

function ReglasContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/perfil';
  const isOnboarding = next.startsWith('/liga/');

  function handleDone() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('furvo_rules_seen', '1');
    }
    router.push(next);
  }

  return (
    <div style={{ minHeight: '100dvh', paddingBottom: 40 }}>

      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'color-mix(in oklch, var(--fv-bg) 90%, transparent)',
        backdropFilter: 'blur(24px) saturate(200%)',
        WebkitBackdropFilter: 'blur(24px) saturate(200%)',
        borderBottom: '1px solid color-mix(in oklch, var(--fv-line) 55%, transparent)',
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <FurvoWordmark size={20} />
        {isOnboarding ? (
          <Link
            href={next}
            style={{
              fontFamily: 'var(--fv-mono)', fontSize: 10, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--fv-muted)', textDecoration: 'none',
            }}
          >
            Saltar →
          </Link>
        ) : (
          <button
            onClick={() => router.back()}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--fv-mono)', fontSize: 10, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--fv-muted)', padding: 0,
            }}
          >
            ← Volver
          </button>
        )}
      </div>

      <div style={{ maxWidth: 540, margin: '0 auto', padding: '0 20px' }}>

        {/* Hero */}
        <div style={{ padding: '32px 0 8px' }}>
          {isOnboarding && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '4px 12px 4px 8px', borderRadius: 999,
              background: 'var(--fv-accent-soft)',
              border: '1px solid color-mix(in oklch, var(--fv-accent) 25%, transparent)',
              marginBottom: 16,
            }}>
              <span style={{ fontSize: 12 }}>👋</span>
              <span style={{
                fontFamily: 'var(--fv-mono)', fontSize: 9, fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fv-accent)',
              }}>
                Antes de empezar
              </span>
            </div>
          )}
          <div style={{
            fontFamily: 'var(--fv-serif)', fontSize: 'clamp(34px, 8vw, 44px)',
            lineHeight: 1.0, letterSpacing: '-0.03em', color: 'var(--fv-ink)',
          }}>
            Reglas<br />
            <span style={{ color: 'var(--fv-accent)', fontStyle: 'italic' }}>del juego.</span>
          </div>
          <div style={{
            fontFamily: 'var(--fv-sans)', fontSize: 15, color: 'var(--fv-secondary)',
            lineHeight: 1.55, marginTop: 12,
          }}>
            Dos minutos de lectura. Cuatro años de ventaja sobre tu cuñado.
          </div>
        </div>

        {/* Puntuación */}
        <section style={{ marginTop: 36 }}>
          <div style={{
            fontFamily: 'var(--fv-mono)', fontSize: 9, fontWeight: 700,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: 'var(--fv-muted)', marginBottom: 12,
          }}>
            Sistema de puntos
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {POINTS.map(p => (
              <div key={p.pts} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                padding: '16px 18px', borderRadius: 16,
                background: p.bg,
                border: `1px solid color-mix(in oklch, ${p.color} 20%, transparent)`,
              }}>
                <div style={{
                  fontFamily: 'var(--fv-mono)', fontSize: 22, fontWeight: 800,
                  color: p.color, flexShrink: 0, lineHeight: 1, minWidth: 36,
                }}>
                  {p.pts}
                </div>
                <div>
                  <div style={{
                    fontFamily: 'var(--fv-sans)', fontSize: 14, fontWeight: 700,
                    color: 'var(--fv-ink)', lineHeight: 1, marginBottom: 5,
                  }}>
                    {p.label}
                  </div>
                  <div style={{
                    fontFamily: 'var(--fv-sans)', fontSize: 13,
                    color: 'var(--fv-muted)', lineHeight: 1.5,
                  }}>
                    {p.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Estructura del torneo */}
        <section style={{ marginTop: 36 }}>
          <div style={{
            fontFamily: 'var(--fv-mono)', fontSize: 9, fontWeight: 700,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: 'var(--fv-muted)', marginBottom: 12,
          }}>
            Estructura del torneo
          </div>
          <div style={{
            borderRadius: 16, overflow: 'hidden',
            background: 'var(--fv-surface)', border: '1px solid var(--fv-line)',
          }}>
            {PHASES.map((ph, i) => (
              <div key={ph.label} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 18px',
                borderBottom: i < PHASES.length - 1 ? '1px solid var(--fv-line)' : 'none',
              }}>
                <div style={{ fontSize: 20, flexShrink: 0 }}>{ph.icon}</div>
                <div>
                  <div style={{ fontFamily: 'var(--fv-serif)', fontSize: 16, lineHeight: 1, color: 'var(--fv-ink)' }}>
                    {ph.label}
                  </div>
                  <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 9, color: 'var(--fv-muted)', marginTop: 3, letterSpacing: '0.08em' }}>
                    {ph.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reglas generales */}
        <section style={{ marginTop: 36 }}>
          <div style={{
            fontFamily: 'var(--fv-mono)', fontSize: 9, fontWeight: 700,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: 'var(--fv-muted)', marginBottom: 12,
          }}>
            A tener en cuenta
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {RULES.map(r => (
              <div key={r.icon} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                padding: '16px 18px', borderRadius: 14,
                background: 'var(--fv-surface)', border: '1px solid var(--fv-line)',
              }}>
                <div style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{r.icon}</div>
                <div>
                  <div style={{
                    fontFamily: 'var(--fv-sans)', fontSize: 14, fontWeight: 700,
                    color: 'var(--fv-ink)', lineHeight: 1, marginBottom: 5,
                  }}>
                    {r.title}
                  </div>
                  <div style={{
                    fontFamily: 'var(--fv-sans)', fontSize: 13,
                    color: 'var(--fv-muted)', lineHeight: 1.5,
                  }}>
                    {r.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div style={{ marginTop: 40, paddingBottom: 20 }}>
          <button
            onClick={handleDone}
            style={{
              width: '100%', padding: '16px 24px',
              borderRadius: 999, border: 'none',
              background: 'var(--fv-accent)', color: '#0a1a12',
              fontFamily: 'var(--fv-sans)', fontSize: 16, fontWeight: 800,
              letterSpacing: '-0.02em', cursor: 'pointer',
            }}
          >
            {isOnboarding ? 'Entendido, ¡a jugar! →' : '← Volver'}
          </button>
          {isOnboarding && (
            <div style={{
              fontFamily: 'var(--fv-mono)', fontSize: 9, color: 'var(--fv-muted)',
              textAlign: 'center', marginTop: 12, letterSpacing: '0.08em',
            }}>
              Siempre disponible desde tu perfil
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function ReglasPage() {
  return (
    <Suspense>
      <ReglasContent />
    </Suspense>
  );
}
