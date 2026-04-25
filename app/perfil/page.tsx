'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { FurvoWordmark, EyebrowLabel, Avatar } from '@/components/primitives';
import { TabBar } from '@/components/tab-bar';
import Link from 'next/link';

type Profile = { id: string; handle: string; name: string; avatar_color: string | null };
type LeagueMembership = { league_id: string; leagues: { name: string; invite_code: string } };

const COLORS = [
  { key: 'green',  label: 'Verde',   swatch: 'oklch(0.78 0.19 148)' },
  { key: 'yellow', label: 'Amarillo',swatch: 'oklch(0.90 0.20 105)' },
  { key: 'blue',   label: 'Azul',    swatch: 'oklch(0.72 0.14 260)' },
  { key: 'red',    label: 'Rojo',    swatch: 'oklch(0.72 0.18 28)'  },
  { key: 'purple', label: 'Morado',  swatch: 'oklch(0.72 0.14 300)' },
  { key: 'orange', label: 'Naranja', swatch: 'oklch(0.78 0.18 50)'  },
  { key: 'cyan',   label: 'Cyan',    swatch: 'oklch(0.72 0.14 200)' },
  { key: 'pink',   label: 'Rosa',    swatch: 'oklch(0.78 0.14 340)' },
];

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 0',
  border: 'none', borderBottom: '1px solid var(--fv-line)',
  background: 'transparent', color: 'var(--fv-ink)',
  fontFamily: 'var(--fv-serif)', fontSize: 22,
  outline: 'none',
};

export default function PerfilPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [leagues, setLeagues] = useState<LeagueMembership[]>([]);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ name: '', handle: '', avatar_color: 'green' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/login'); return; }
      supabase
        .from('profiles').select('*').eq('id', user.id).single()
        .then(({ data }) => {
          if (data) setProfile(data);
        });
      supabase
        .from('league_members')
        .select('league_id, leagues(name, invite_code)')
        .eq('user_id', user.id)
        .then(({ data }) => setLeagues((data as any) ?? []));
    });
  }, [router]);

  function startEdit() {
    if (!profile) return;
    setDraft({ name: profile.name, handle: profile.handle, avatar_color: profile.avatar_color ?? 'green' });
    setError('');
    setEditing(true);
  }

  async function saveProfile() {
    if (!profile) return;
    const trimName = draft.name.trim();
    const trimHandle = draft.handle.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!trimName) { setError('El nombre no puede estar vacío'); return; }
    if (trimHandle.length < 3) { setError('El handle debe tener al menos 3 caracteres'); return; }

    setSaving(true);
    setError('');
    const supabase = createClient();
    const { error: err } = await supabase
      .from('profiles')
      .update({ name: trimName, handle: trimHandle, avatar_color: draft.avatar_color })
      .eq('id', profile.id);
    setSaving(false);

    if (err) {
      setError(err.message.includes('unique') ? 'Ese handle ya está en uso' : err.message);
      return;
    }
    setProfile(p => p ? { ...p, name: trimName, handle: trimHandle, avatar_color: draft.avatar_color } : p);
    setEditing(false);
  }

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  }

  if (!profile) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'var(--fv-mono)', color: 'var(--fv-muted)', fontSize: 11, letterSpacing: '0.12em' }}>
          Cargando…
        </div>
      </div>
    );
  }

  return (
    <div className="fv-page" style={{ paddingBottom: 120, minHeight: '100vh' }}>
      <div className="fv-mobile-only" style={{ padding: '28px 20px 0', display: 'flex', justifyContent: 'center' }}>
        <FurvoWordmark size={22} />
      </div>

      {/* Hero perfil */}
      <div style={{ padding: '28px 20px 0', display: 'flex', alignItems: 'center', gap: 18 }}>
        <Avatar name={editing ? draft.name || profile.name : profile.name} color={editing ? draft.avatar_color : profile.avatar_color} size={64} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--fv-serif)', fontSize: 28, letterSpacing: '-0.025em', lineHeight: 1 }}>
            {profile.name}
          </div>
          <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 11, color: 'var(--fv-muted)', marginTop: 4, letterSpacing: '0.1em' }}>
            @{profile.handle}
          </div>
        </div>
        {!editing && (
          <button onClick={startEdit} style={{
            background: 'var(--fv-surface)', border: '1px solid var(--fv-line)',
            borderRadius: 999, padding: '8px 14px', cursor: 'pointer',
            fontFamily: 'var(--fv-mono)', fontSize: 10, fontWeight: 600,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'var(--fv-muted)', flexShrink: 0,
          }}>
            Editar
          </button>
        )}
      </div>

      {/* Formulario de edición */}
      {editing && (
        <div style={{ padding: '24px 20px 0' }}>
          <div style={{
            padding: '20px', borderRadius: 18,
            background: 'var(--fv-surface)', border: '1px solid var(--fv-line)',
            display: 'flex', flexDirection: 'column', gap: 20,
          }}>
            {/* Nombre */}
            <div>
              <EyebrowLabel>Nombre</EyebrowLabel>
              <input
                value={draft.name}
                onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                placeholder="Tu nombre"
                maxLength={40}
                style={{ ...inputStyle, marginTop: 6 }}
              />
            </div>

            {/* Handle */}
            <div>
              <EyebrowLabel>Handle</EyebrowLabel>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, borderBottom: '1px solid var(--fv-line)', paddingBottom: 12, marginTop: 6 }}>
                <span style={{ fontFamily: 'var(--fv-mono)', fontSize: 18, color: 'var(--fv-muted)' }}>@</span>
                <input
                  value={draft.handle}
                  onChange={e => setDraft(d => ({ ...d, handle: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
                  placeholder="tu_handle"
                  maxLength={20}
                  style={{ ...inputStyle, flex: 1, fontFamily: 'var(--fv-mono)', fontSize: 20, borderBottom: 'none', padding: '0 0 0 2px' }}
                />
              </div>
            </div>

            {/* Color del avatar */}
            <div>
              <EyebrowLabel>Color del avatar</EyebrowLabel>
              <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
                {COLORS.map(c => (
                  <button
                    key={c.key}
                    onClick={() => setDraft(d => ({ ...d, avatar_color: c.key }))}
                    aria-label={c.label}
                    style={{
                      width: 38, height: 38, borderRadius: '50%',
                      background: c.swatch, border: 'none', cursor: 'pointer',
                      outline: draft.avatar_color === c.key ? `3px solid ${c.swatch}` : '3px solid transparent',
                      outlineOffset: 3,
                      transform: draft.avatar_color === c.key ? 'scale(1.18)' : 'scale(1)',
                      transition: 'transform 0.15s, outline 0.15s',
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 11, color: 'var(--fv-bad)', letterSpacing: '0.06em' }}>
                {error}
              </div>
            )}

            {/* Acciones */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={saveProfile}
                disabled={saving}
                style={{
                  flex: 1, padding: '12px', borderRadius: 999, border: 'none',
                  background: 'var(--fv-accent)', color: '#0a1a12',
                  fontFamily: 'var(--fv-sans)', fontSize: 14, fontWeight: 700,
                  cursor: 'pointer', opacity: saving ? 0.5 : 1,
                }}
              >
                {saving ? 'Guardando…' : 'Guardar cambios'}
              </button>
              <button
                onClick={() => { setEditing(false); setError(''); }}
                style={{
                  padding: '12px 16px', borderRadius: 999,
                  background: 'transparent', border: '1px solid var(--fv-line)',
                  color: 'var(--fv-muted)', fontFamily: 'var(--fv-sans)', fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats rápidas */}
      <div style={{ padding: '20px 20px 0', display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, padding: '14px 16px', borderRadius: 14, background: 'var(--fv-surface)', border: '1px solid var(--fv-line)' }}>
          <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fv-muted)' }}>Ligas</div>
          <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 24, fontWeight: 700, marginTop: 4 }}>
            {leagues.length}
          </div>
        </div>
        <div style={{ flex: 2, padding: '14px 16px', borderRadius: 14, background: 'var(--fv-surface)', border: '1px solid var(--fv-line)' }}>
          <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fv-muted)' }}>Mundial</div>
          <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 14, fontWeight: 600, marginTop: 4, color: 'var(--fv-flash)', letterSpacing: '0.06em' }}>
            Edición &#39;26
          </div>
        </div>
      </div>

      {/* Mis ligas */}
      {leagues.length > 0 && (
        <div style={{ padding: '28px 20px 0' }}>
          <EyebrowLabel>Mis ligas</EyebrowLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
            {leagues.map((m) => (
              <Link key={m.league_id} href={`/liga/${m.leagues?.invite_code}`} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 16px', borderRadius: 14,
                background: 'var(--fv-surface)', border: '1px solid var(--fv-line)',
              }}>
                <div style={{ fontFamily: 'var(--fv-serif)', fontSize: 18 }}>{m.leagues?.name}</div>
                <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 13, color: 'var(--fv-accent)', letterSpacing: '0.2em', fontWeight: 700 }}>
                  {m.leagues?.invite_code}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Unirse a otra liga */}
      <div style={{ padding: '12px 20px 0' }}>
        <Link href="/onboarding" style={{
          display: 'block', padding: '14px 16px', borderRadius: 14,
          background: 'transparent', border: '1px dashed var(--fv-line)',
          fontFamily: 'var(--fv-sans)', fontSize: 14, color: 'var(--fv-muted)',
          textAlign: 'center',
        }}>
          + Crear o unirse a otra liga
        </Link>
      </div>

      {/* Reglas */}
      <div style={{ padding: '12px 20px 0' }}>
        <Link href="/reglas" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px', borderRadius: 14,
          background: 'var(--fv-surface)', border: '1px solid var(--fv-line)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 18 }}>📋</span>
            <div>
              <div style={{ fontFamily: 'var(--fv-sans)', fontSize: 14, fontWeight: 600, color: 'var(--fv-ink)' }}>
                Reglas del juego
              </div>
              <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 9, color: 'var(--fv-muted)', letterSpacing: '0.08em', marginTop: 2 }}>
                Sistema de puntos · estructura del torneo
              </div>
            </div>
          </div>
          <span style={{ fontFamily: 'var(--fv-mono)', fontSize: 12, color: 'var(--fv-muted)' }}>→</span>
        </Link>
      </div>

      {/* Logout */}
      <div style={{ padding: '12px 20px 0' }}>
        <button onClick={logout} style={{
          width: '100%', padding: '14px 20px', borderRadius: 14,
          background: 'transparent', border: '1px solid var(--fv-line)',
          color: 'var(--fv-muted)', fontFamily: 'var(--fv-sans)', fontSize: 14, fontWeight: 600,
          cursor: 'pointer', textAlign: 'left',
        }}>
          Cerrar sesión →
        </button>
      </div>

      <TabBar />
    </div>
  );
}
