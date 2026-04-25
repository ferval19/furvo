'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function IconHome() {
  return (
    <svg width="21" height="21" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5L11 3l8 7.5V19a1 1 0 01-1 1H4a1 1 0 01-1-1v-8.5z" />
      <path d="M8.5 20v-7h5v7" />
    </svg>
  );
}

function IconBall() {
  return (
    <svg width="21" height="21" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8.5" />
      <path d="M11 2.5l-3.5 3.5 1.5 5.5h4l1.5-5.5L11 2.5z" />
      <path d="M2.5 11h5M14.5 11h5M5.5 16.5l3-4.5M13.5 12l3 4.5" />
    </svg>
  );
}

function IconPodium() {
  return (
    <svg width="21" height="21" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="9" width="6" height="10" rx="1" />
      <rect x="2" y="13" width="5.5" height="6" rx="1" />
      <rect x="14.5" y="11" width="5.5" height="8" rx="1" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="21" height="21" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="8" r="3.5" />
      <path d="M4 19.5c0-3.866 3.134-6 7-6s7 2.134 7 6" />
    </svg>
  );
}

const ICONS = { home: IconHome, ball: IconBall, podium: IconPodium, user: IconUser };

export function TabBar({ leagueId, hasLive = false }: { leagueId?: string; hasLive?: boolean }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY;

        if (y < 80) {
          setVisible(true);
        } else if (delta > 6) {
          setVisible(false);
        } else if (delta < -3) {
          setVisible(true);
        }

        lastY = y;
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const tabs = [
    { href: leagueId ? `/liga/${leagueId}`         : '/liga',          key: '/liga',          label: 'Liga',    icon: 'home'   as const },
    { href: leagueId ? `/jornada/${leagueId}`       : '/jornada',       key: '/jornada',       label: 'Jornada', icon: 'ball'   as const },
    { href: leagueId ? `/clasificacion/${leagueId}` : '/clasificacion', key: '/clasificacion', label: 'Tabla',   icon: 'podium' as const },
    { href: '/perfil',                                                   key: '/perfil',        label: 'Perfil',  icon: 'user'   as const },
  ];

  return (
    <nav
      className="fv-tabbar"
      style={{
        position: 'fixed',
        bottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
        left: 16, right: 16,
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        padding: '5px 6px',
        borderRadius: 30,
        background: 'color-mix(in oklch, var(--fv-surface) 82%, transparent)',
        backdropFilter: 'blur(32px) saturate(220%)',
        WebkitBackdropFilter: 'blur(32px) saturate(220%)',
        border: '1px solid var(--fv-line)',
        borderTop: '1px solid rgba(255,255,255,0.11)',
        zIndex: 50,
        willChange: 'transform',
        transform: visible ? 'translateY(0)' : 'translateY(calc(100% + 20px))',
        transition: visible
          ? 'transform 0.44s cubic-bezier(0.34, 1.56, 0.64, 1)'
          : 'transform 0.22s ease-in',
      }}
    >
      {tabs.map(t => {
        const active = pathname.startsWith(t.key);
        const Icon = ICONS[t.icon];
        const showLiveDot = hasLive && t.icon === 'ball';
        return (
          <Link
            key={t.key}
            href={t.href as any}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 3, padding: '8px 6px', borderRadius: 22,
              background: active ? 'var(--fv-accent-soft)' : 'transparent',
              color: active ? 'var(--fv-accent)' : 'var(--fv-muted)',
              minHeight: 52,
              transition: 'background 0.18s, color 0.18s',
            }}
          >
            {/* Icon with optional live dot badge */}
            <div style={{ position: 'relative', display: 'inline-flex' }}>
              <Icon />
              {showLiveDot && (
                <span className="fv-live-dot" style={{
                  position: 'absolute', top: -1, right: -2,
                  width: 7, height: 7,
                }} />
              )}
            </div>
            <span style={{
              fontFamily: 'var(--fv-mono)', fontSize: 9,
              letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700,
            }}>
              {t.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
