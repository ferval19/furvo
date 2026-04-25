'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { FurvoWordmark, EyebrowLabel } from '@/components/primitives';

export default function OnboardingPage() {
  const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function createLeague() {
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { data, error } = await supabase.rpc('create_league', { league_name: name });
    setLoading(false);
    if (error) { setError(error.message); return; }
    if (data) {
      const { data: lc } = await supabase.from('leagues').select('invite_code').eq('id', data).single();
      router.push(`/reglas?next=/liga/${lc?.invite_code ?? data}`);
    }
  }

  async function joinLeague() {
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { data, error } = await supabase.rpc('join_league_by_code', { code });
    setLoading(false);
    if (error) { setError('Código inválido o liga no encontrada'); return; }
    if (data) {
      const { data: lc } = await supabase.from('leagues').select('invite_code').eq('id', data).single();
      router.push(`/reglas?next=/liga/${lc?.invite_code ?? data}`);
    }
  }

  return (
    <div style={{ minHeight: '100vh', padding: '52px 28px', maxWidth: 440, margin: '0 auto' }}>
      <FurvoWordmark size={36} edition />

      <div style={{
        fontFamily: 'var(--fv-serif)', fontSize: 44,
        lineHeight: 0.95, letterSpacing: '-0.03em', marginTop: 36,
      }}>
        Tu liga<br />
        <em style={{ fontStyle: 'italic', color: 'var(--fv-accent)' }}>privada.</em>
      </div>

      {mode === 'choose' && (
        <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={() => setMode('create')} style={{
            textAlign: 'left', padding: '20px 18px', borderRadius: 16,
            background: 'var(--fv-ink)', color: 'var(--fv-bg)',
            border: 'none', cursor: 'pointer',
          }}>
            <div style={{ fontFamily: 'var(--fv-serif)', fontSize: 22 }}>Crear una liga</div>
            <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 10, opacity: 0.55, marginTop: 5, letterSpacing: '0.1em' }}>
              Hasta 12 amigos · código privado
            </div>
          </button>
          <button onClick={() => setMode('join')} style={{
            textAlign: 'left', padding: '20px 18px', borderRadius: 16,
            background: 'var(--fv-surface)', color: 'var(--fv-ink)',
            border: '1px solid var(--fv-line)', cursor: 'pointer',
          }}>
            <div style={{ fontFamily: 'var(--fv-serif)', fontSize: 22 }}>Unirse con código</div>
            <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 10, color: 'var(--fv-muted)', marginTop: 5, letterSpacing: '0.1em' }}>
              ¿Te invitaron? Teclea el código
            </div>
          </button>
        </div>
      )}

      {mode === 'create' && (
        <div style={{ marginTop: 36 }}>
          <button onClick={() => setMode('choose')} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--fv-mono)', fontSize: 10, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--fv-muted)', marginBottom: 20,
            padding: 0,
          }}>← Volver</button>
          <EyebrowLabel>Nombre de la liga</EyebrowLabel>
          <input
            value={name} onChange={e => setName(e.target.value)}
            placeholder="Pichichis del WhatsApp"
            onKeyDown={e => e.key === 'Enter' && name && createLeague()}
            style={{
              width: '100%', padding: '14px 0',
              border: 'none', borderBottom: '1px solid var(--fv-line)',
              background: 'transparent', color: 'var(--fv-ink)',
              fontFamily: 'var(--fv-serif)', fontSize: 22, outline: 'none', marginTop: 8,
            }}
          />
          {error && (
            <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 11, color: 'var(--fv-bad)', marginTop: 10 }}>{error}</div>
          )}
          <button onClick={createLeague} disabled={loading || !name} style={{
            marginTop: 24, padding: '14px 24px', borderRadius: 999, border: 'none',
            background: 'var(--fv-accent)', color: '#0a1a12',
            fontFamily: 'var(--fv-sans)', fontSize: 15, fontWeight: 700,
            opacity: loading || !name ? 0.45 : 1, cursor: 'pointer',
          }}>
            {loading ? 'Creando…' : 'Crear liga →'}
          </button>
        </div>
      )}

      {mode === 'join' && (
        <div style={{ marginTop: 36 }}>
          <button onClick={() => setMode('choose')} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--fv-mono)', fontSize: 10, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--fv-muted)', marginBottom: 20,
            padding: 0,
          }}>← Volver</button>
          <EyebrowLabel>Código de invitación</EyebrowLabel>
          <input
            value={code} onChange={e => setCode(e.target.value.toUpperCase())}
            placeholder="ABC123" maxLength={6}
            style={{
              width: '100%', padding: '14px 0',
              border: 'none', borderBottom: '1px solid var(--fv-line)',
              background: 'transparent', color: 'var(--fv-ink)',
              fontFamily: 'var(--fv-mono)', fontSize: 32,
              letterSpacing: '0.25em', outline: 'none', marginTop: 8,
            }}
          />
          {error && (
            <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 11, color: 'var(--fv-bad)', marginTop: 10 }}>{error}</div>
          )}
          <button onClick={joinLeague} disabled={loading || code.length !== 6} style={{
            marginTop: 24, padding: '14px 24px', borderRadius: 999, border: 'none',
            background: 'var(--fv-accent)', color: '#0a1a12',
            fontFamily: 'var(--fv-sans)', fontSize: 15, fontWeight: 700,
            opacity: loading || code.length !== 6 ? 0.45 : 1, cursor: 'pointer',
          }}>
            {loading ? 'Uniéndose…' : 'Unirse →'}
          </button>
        </div>
      )}
    </div>
  );
}
