import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { FurvoLogo, FurvoMark } from '@/components/primitives';

// Decorative fake standings for the hero mockup (desktop only)
const MOCK_STANDINGS = [
  { pos: 1, name: 'El Cuñado', pts: 47, color: 'oklch(0.82 0.16 88)',  bg: 'oklch(0.22 0.07 88)'  },
  { pos: 2, name: 'María G.',  pts: 38, color: 'oklch(0.78 0.05 240)', bg: 'oklch(0.22 0.04 240)' },
  { pos: 3, name: 'Tú',        pts: 33, color: 'oklch(0.78 0.19 148)', bg: 'oklch(0.28 0.11 148)' },
  { pos: 4, name: 'Pepe',      pts: 28, color: 'var(--fv-muted)',       bg: 'var(--fv-surface-2)'  },
  { pos: 5, name: 'Lucía',     pts: 21, color: 'var(--fv-muted)',       bg: 'var(--fv-surface-2)'  },
];

export default async function RootPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: memberships } = await supabase
      .from('league_members')
      .select('league_id, leagues(invite_code)')
      .eq('user_id', user.id)
      .limit(1);
    if (memberships && memberships.length > 0) {
      const code = (memberships[0] as any).leagues?.invite_code;
      redirect(`/liga/${code}`);
    }
    redirect('/onboarding');
  }

  return (
    <div style={{ minHeight: '100dvh', overflowX: 'hidden' }}>

      {/* ── TOP NAV ── */}
      <div className="fv-landing-wrap">
        <nav style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 0',
          borderBottom: '1px solid var(--fv-line)',
        }}>
          <FurvoLogo size={28} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link href="/login" style={{
              fontFamily: 'var(--fv-mono)', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--fv-muted)', padding: '8px 14px',
              border: '1px solid var(--fv-line)', borderRadius: 999,
            }}>
              Entrar
            </Link>
            <Link href="/onboarding" style={{
              fontFamily: 'var(--fv-sans)', fontSize: 13, fontWeight: 700,
              color: '#0a1a12', padding: '8px 18px',
              background: 'var(--fv-accent)', borderRadius: 999,
              display: 'none',  // shown via desktop-only class below
            }} className="fv-desktop-only">
              Empezar →
            </Link>
          </div>
        </nav>
      </div>

      {/* ── HERO ── */}
      <div className="fv-landing-wrap" style={{ padding: '52px 40px 48px' }}>
        <div className="fv-landing-hero" style={{ gap: 64 }}>

          {/* Left: text + CTAs */}
          <div>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '5px 12px 5px 8px', borderRadius: 999,
              background: 'var(--fv-flash-soft)',
              border: '1px solid color-mix(in oklch, var(--fv-flash) 25%, transparent)',
              marginBottom: 28,
            }}>
              <span style={{ fontSize: 13 }}>⚽</span>
              <span style={{
                fontFamily: 'var(--fv-mono)', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fv-flash)',
              }}>
                Mundial 2026 · 32 equipos · 64 partidos
              </span>
            </div>

            <h1 style={{
              fontFamily: 'var(--fv-serif)', fontSize: 'clamp(42px, 5vw, 62px)',
              letterSpacing: '-0.03em', lineHeight: 1.0,
              color: 'var(--fv-ink)', margin: '0 0 12px',
            }}>
              ¿Quién manda<br />
              <span style={{ color: 'var(--fv-accent)', fontStyle: 'italic' }}>en el grupo?</span>
            </h1>

            <p style={{
              fontFamily: 'var(--fv-serif)', fontSize: 18,
              color: 'var(--fv-secondary)', lineHeight: 1.55,
              margin: '0 0 8px', maxWidth: 400,
            }}>
              La porra del Mundial&#39;26. Para que tus amigos
              te guarden rencor los próximos cuatro años.
            </p>
            <p style={{
              fontFamily: 'var(--fv-mono)', fontSize: 10,
              color: 'var(--fv-muted)', letterSpacing: '0.08em',
              marginBottom: 40,
            }}>
              De nada.
            </p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link href="/onboarding" style={{
                display: 'inline-block', padding: '14px 28px',
                borderRadius: 999, background: 'var(--fv-accent)',
                color: '#0a1a12', fontFamily: 'var(--fv-sans)',
                fontSize: 15, fontWeight: 800, letterSpacing: '-0.02em',
              }}>
                Empezar gratis →
              </Link>
              <Link href="/login" style={{
                display: 'inline-block', padding: '14px 24px',
                borderRadius: 999, border: '1px solid var(--fv-line)',
                color: 'var(--fv-muted)', fontFamily: 'var(--fv-sans)',
                fontSize: 14, fontWeight: 600,
              }}>
                Ya tengo cuenta
              </Link>
            </div>
          </div>

          {/* Right: decorative app mockup (desktop only) */}
          <div className="fv-desktop-only" style={{
            background: 'var(--fv-surface)',
            border: '1px solid var(--fv-line)',
            borderRadius: 24, padding: '22px 20px',
            display: 'flex', flexDirection: 'column', gap: 0,
          }}>
            {/* Mini header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 14, paddingBottom: 12,
              borderBottom: '1px solid var(--fv-line)',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fv-muted)' }}>
                  Fase de grupos · MD1
                </div>
                <div style={{ fontFamily: 'var(--fv-serif)', fontSize: 18, marginTop: 2 }}>Clasificación</div>
              </div>
              <div style={{
                fontFamily: 'var(--fv-mono)', fontSize: 8, fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'var(--fv-flash)', background: 'var(--fv-flash-soft)',
                borderRadius: 999, padding: '3px 8px',
              }}>
                En vivo
              </div>
            </div>

            {/* Standings */}
            {MOCK_STANDINGS.map((row, i) => (
              <div key={row.pos} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 0',
                borderBottom: i < MOCK_STANDINGS.length - 1 ? '1px solid var(--fv-line)' : 'none',
              }}>
                <div style={{
                  fontFamily: 'var(--fv-mono)', fontSize: 11, fontWeight: 700,
                  color: row.color, width: 14, flexShrink: 0, textAlign: 'center',
                }}>
                  {row.pos}
                </div>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                  background: row.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--fv-serif)', fontSize: 12, color: row.color,
                }}>
                  {row.name[0]}
                </div>
                <div style={{
                  flex: 1, fontFamily: 'var(--fv-sans)', fontSize: 13, lineHeight: 1,
                  color: row.pos === 3 ? 'var(--fv-accent)' : 'var(--fv-ink)',
                  fontWeight: row.pos === 3 ? 600 : 400,
                }}>
                  {row.name}{row.pos === 3 ? ' · tú' : ''}
                </div>
                <div style={{
                  fontFamily: 'var(--fv-mono)', fontSize: 16, fontWeight: 800,
                  color: row.color, flexShrink: 0,
                }}>
                  {row.pts}
                </div>
              </div>
            ))}

            {/* Progress dots */}
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--fv-line)' }}>
              <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 8, color: 'var(--fv-muted)', marginBottom: 6, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Porra jornada 1 · 18/24
              </div>
              <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                {Array.from({ length: 24 }, (_, i) => (
                  <div key={i} style={{
                    width: 5, height: 5, borderRadius: 2.5,
                    background: i < 18 ? 'var(--fv-accent)' : 'var(--fv-surface-2)',
                  }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--fv-line)' }} />

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: 'clamp(32px, 5vw, 56px) 0' }}>
        <div className="fv-landing-wrap">
          <div style={{
            fontFamily: 'var(--fv-mono)', fontSize: 10, fontWeight: 600,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: 'var(--fv-muted)', marginBottom: 20, textAlign: 'center',
          }}>
            Cómo funciona
          </div>

          <div className="fv-landing-steps" style={{ gap: 16 }}>
            {[
              {
                n: '01', emoji: '🏆',
                title: 'Crea tu liga',
                body: 'Ponle un nombre épico. Invita a los de siempre. Y al pesado que se cree que lo sabe todo — que también puede pagar cuando pierda.',
              },
              {
                n: '02', emoji: '⚡',
                title: 'Pon tu porra',
                body: '1, X o 2. Como llevas haciendo mentalmente en el bar desde los 12. Pero ahora queda por escrito. Sin el "yo lo había dicho".',
              },
              {
                n: '03', emoji: '😭',
                title: 'Sufre en directo',
                body: 'Los puntos no mienten. Tus amigos, sí. El marcador, tampoco. Y el cuadro de clasificación es implacable.',
              },
            ].map(step => (
              <div key={step.n} style={{
                padding: '20px',
                borderRadius: 18, background: 'var(--fv-surface)',
                border: '1px solid var(--fv-line)',
                display: 'flex', gap: 16, alignItems: 'flex-start',
              }}>
                <div style={{
                  fontFamily: 'var(--fv-mono)', fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.1em', color: 'var(--fv-accent)',
                  marginTop: 3, flexShrink: 0, minWidth: 22,
                }}>
                  {step.n}
                </div>
                <div>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{step.emoji}</div>
                  <div style={{
                    fontFamily: 'var(--fv-serif)', fontSize: 20, lineHeight: 1.1,
                    color: 'var(--fv-ink)', marginBottom: 7,
                  }}>
                    {step.title}
                  </div>
                  <div style={{
                    fontFamily: 'var(--fv-sans)', fontSize: 14, lineHeight: 1.6,
                    color: 'var(--fv-muted)',
                  }}>
                    {step.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ borderTop: '1px solid var(--fv-line)' }} />

      {/* ── POINTS SYSTEM ── */}
      <section style={{ padding: 'clamp(32px, 5vw, 56px) 0' }}>
        <div className="fv-landing-wrap">
          <div style={{
            fontFamily: 'var(--fv-mono)', fontSize: 10, fontWeight: 600,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: 'var(--fv-muted)', marginBottom: 8, textAlign: 'center',
          }}>
            El sistema de puntos
          </div>
          <p style={{
            fontFamily: 'var(--fv-serif)', fontSize: 17, color: 'var(--fv-secondary)',
            textAlign: 'center', lineHeight: 1.5, marginBottom: 24,
          }}>
            Simple. Justo. Despiadado.
          </p>

          <div className="fv-landing-pts" style={{ gap: 12 }}>
            {[
              {
                pts: '+1', label: 'Resultado correcto',
                sub: '1, X o 2. El ABC del fútbol.',
                color: 'var(--fv-accent)',
              },
              {
                pts: '+3', label: 'Marcador exacto',
                sub: 'Si aciertas 2–1, eres un dios. O un adivino. O las dos.',
                color: 'var(--fv-flash)',
              },
              {
                pts: '×2', label: 'Partido doble',
                sub: 'Te la juegas. Si fallas: −1. Piénsatelo bien.',
                color: 'oklch(0.72 0.14 260)',
              },
            ].map(row => (
              <div key={row.pts} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                padding: '18px', borderRadius: 14,
                background: 'var(--fv-surface)', border: '1px solid var(--fv-line)',
              }}>
                <div style={{
                  fontFamily: 'var(--fv-mono)', fontSize: 24, fontWeight: 800,
                  color: row.color, flexShrink: 0, lineHeight: 1, minWidth: 40,
                }}>
                  {row.pts}
                </div>
                <div>
                  <div style={{
                    fontFamily: 'var(--fv-sans)', fontSize: 14, fontWeight: 700,
                    color: 'var(--fv-ink)', lineHeight: 1, marginBottom: 5,
                  }}>
                    {row.label}
                  </div>
                  <div style={{
                    fontFamily: 'var(--fv-sans)', fontSize: 12,
                    color: 'var(--fv-muted)', lineHeight: 1.5,
                  }}>
                    {row.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ borderTop: '1px solid var(--fv-line)' }} />

      {/* ── FOMO CALLOUT ── */}
      <section style={{ padding: 'clamp(32px, 5vw, 56px) 0' }}>
        <div className="fv-landing-wrap">
          <div style={{
            padding: 'clamp(28px, 4vw, 48px)',
            borderRadius: 20,
            background: 'var(--fv-accent-soft)',
            border: '1px solid color-mix(in oklch, var(--fv-accent) 30%, transparent)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>🕵️</div>
            <div style={{
              fontFamily: 'var(--fv-serif)', fontSize: 'clamp(22px, 3vw, 32px)',
              lineHeight: 1.2, color: 'var(--fv-ink)', marginBottom: 10,
            }}>
              Tu cuñado ya se ha registrado.
            </div>
            <div style={{
              fontFamily: 'var(--fv-sans)', fontSize: 15, lineHeight: 1.6,
              color: 'var(--fv-secondary)', marginBottom: 6,
            }}>
              Y ya ha predicho que España gana el Mundial.
            </div>
            <div style={{
              fontFamily: 'var(--fv-mono)', fontSize: 11,
              color: 'var(--fv-muted)', letterSpacing: '0.06em',
              marginBottom: 28,
            }}>
              No le dejes que se lo eche en cara.
            </div>
            <Link href="/onboarding" style={{
              display: 'inline-block', padding: '14px 28px',
              borderRadius: 999, background: 'var(--fv-accent)',
              color: '#0a1a12', fontFamily: 'var(--fv-sans)',
              fontSize: 15, fontWeight: 800, letterSpacing: '-0.02em',
            }}>
              Unirme antes de que gane él →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid var(--fv-line)', padding: '28px 0 40px' }}>
        <div className="fv-landing-wrap" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <FurvoMark size={32} />
            <div style={{
              fontFamily: 'var(--fv-mono)', fontSize: 9,
              color: 'var(--fv-muted)', letterSpacing: '0.1em',
              textTransform: 'uppercase', lineHeight: 1.8,
            }}>
              Furvo · Porra del Mundial 2026<br />
              Hecho con ❤️ y mucho pique
            </div>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link href="/login" style={{
              fontFamily: 'var(--fv-mono)', fontSize: 10,
              letterSpacing: '0.08em', color: 'var(--fv-muted)',
            }}>
              Entrar
            </Link>
            <Link href="/onboarding" style={{
              fontFamily: 'var(--fv-mono)', fontSize: 10,
              letterSpacing: '0.08em', color: 'var(--fv-muted)',
            }}>
              Registrarse
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
