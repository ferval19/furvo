'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FurvoLogo } from '@/components/primitives';

function IcHome() {
  return (
    <svg width="16" height="16" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5L11 3l8 7.5V19a1 1 0 01-1 1H4a1 1 0 01-1-1v-8.5z" />
      <path d="M8.5 20v-7h5v7" />
    </svg>
  );
}

function IcBall() {
  return (
    <svg width="16" height="16" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8.5" />
      <path d="M11 2.5l-3.5 3.5 1.5 5.5h4l1.5-5.5L11 2.5z" />
      <path d="M2.5 11h5M14.5 11h5M5.5 16.5l3-4.5M13.5 12l3 4.5" />
    </svg>
  );
}

function IcPodium() {
  return (
    <svg width="16" height="16" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="9" width="6" height="10" rx="1" />
      <rect x="2" y="13" width="5.5" height="6" rx="1" />
      <rect x="14.5" y="11" width="5.5" height="8" rx="1" />
    </svg>
  );
}

function IcUser() {
  return (
    <svg width="16" height="16" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="8" r="3.5" />
      <path d="M4 19.5c0-3.866 3.134-6 7-6s7 2.134 7 6" />
    </svg>
  );
}

// Pages where sidebar should NOT appear
const NO_SIDEBAR = ['/', '/login', '/onboarding'];

export function SidebarShell() {
  const pathname = usePathname();
  if (NO_SIDEBAR.some(p => pathname === p)) return null;

  const idMatch = pathname.match(/\/(?:liga|jornada|clasificacion|resultados|grupos)\/([^/]+)/);
  const leagueId = idMatch?.[1];

  return <Sidebar leagueId={leagueId} />;
}

export function Sidebar({ leagueId }: { leagueId?: string }) {
  const pathname = usePathname();

  const tabs = [
    { href: leagueId ? `/liga/${leagueId}`          : '/liga',          key: '/liga',          label: 'Liga',          Icon: IcHome   },
    { href: leagueId ? `/jornada/${leagueId}`        : '/jornada',       key: '/jornada',       label: 'Jornada',       Icon: IcBall   },
    { href: leagueId ? `/clasificacion/${leagueId}`  : '/clasificacion', key: '/clasificacion', label: 'Clasificación', Icon: IcPodium },
    { href: '/perfil',                                                    key: '/perfil',        label: 'Perfil',        Icon: IcUser   },
  ];

  return (
    <aside
      className="fv-desktop-only"
      style={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        width: 'var(--fv-sidebar-w)',
        background: 'var(--fv-surface)',
        borderRight: '1px solid var(--fv-line)',
        display: 'flex', flexDirection: 'column',
        padding: '20px 10px 20px',
        zIndex: 100,
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '4px 8px', marginBottom: 28 }}>
        <Link href="/">
          <FurvoLogo size={22} />
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {tabs.map(({ href, key, label, Icon }) => {
          const active = pathname.startsWith(key);
          return (
            <Link
              key={key}
              href={href as any}
              style={{
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '9px 10px', borderRadius: 10,
                background: active ? 'var(--fv-accent-soft)' : 'transparent',
                color: active ? 'var(--fv-accent)' : 'var(--fv-muted)',
                fontFamily: 'var(--fv-sans)', fontSize: 13,
                fontWeight: active ? 600 : 400,
                letterSpacing: '-0.01em',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              <Icon />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '12px 10px 0',
        borderTop: '1px solid var(--fv-line)',
        fontFamily: 'var(--fv-mono)', fontSize: 8,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: 'var(--fv-tertiary)', lineHeight: 1.8,
      }}>
        Furvo<br />
        <span style={{ color: 'var(--fv-flash)' }}>Mundial &#39;26</span>
      </div>
    </aside>
  );
}
