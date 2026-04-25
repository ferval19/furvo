'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { FurvoWordmark } from '@/components/primitives';

type Mode = 'signin' | 'signup';

function translateError(msg: string): string {
  if (msg.includes('Invalid login credentials')) return 'Email o contraseña incorrectos';
  if (msg.includes('Email not confirmed'))        return 'Confirma tu email antes de entrar';
  if (msg.includes('User already registered'))    return 'Ya existe una cuenta con ese email';
  if (msg.includes('Password should be at least')) return 'La contraseña debe tener mínimo 6 caracteres';
  if (msg.includes('Unable to validate'))         return 'Email o contraseña incorrectos';
  return 'Algo salió mal, inténtalo de nuevo';
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '14px 0',
  border: 'none', borderBottom: '1px solid var(--fv-line)',
  background: 'transparent', color: 'var(--fv-ink)',
  fontFamily: 'var(--fv-serif)', fontSize: 22,
  outline: 'none',
};

export default function LoginPage() {
  const [mode, setMode]         = useState<Mode>('signin');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [signedUp, setSignedUp] = useState(false);
  const router = useRouter();

  async function handleSubmit() {
    if (!email || !password) return;
    setLoading(true);
    setError('');
    const supabase = createClient();

    if (mode === 'signin') {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (err) { setError(translateError(err.message)); return; }
      router.push('/');
      router.refresh();
    } else {
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      setLoading(false);
      if (err) { setError(translateError(err.message)); return; }
      setSignedUp(true);
    }
  }

  function switchMode(m: Mode) {
    setMode(m);
    setError('');
  }

  if (signedUp) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '52px 28px 40px',
        maxWidth: 440, margin: '0 auto',
      }}>
        <div style={{ marginBottom: 40 }}><FurvoWordmark size={40} /></div>
        <div style={{
          padding: '24px', borderRadius: 20,
          background: 'var(--fv-accent-soft)',
          border: '1px solid color-mix(in oklch, var(--fv-accent) 30%, transparent)',
        }}>
          <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fv-accent)', marginBottom: 8 }}>
            ¡Cuenta creada!
          </div>
          <div style={{ fontFamily: 'var(--fv-sans)', fontSize: 15, color: 'var(--fv-ink)', lineHeight: 1.6 }}>
            Revisa <strong>{email}</strong> y confirma tu cuenta para poder entrar.
          </div>
        </div>
        <button
          onClick={() => { setSignedUp(false); setMode('signin'); }}
          style={{
            marginTop: 16, background: 'none', border: 'none', padding: 0,
            fontFamily: 'var(--fv-mono)', fontSize: 11, color: 'var(--fv-muted)',
            letterSpacing: '0.08em', cursor: 'pointer', textAlign: 'left',
          }}
        >
          ← Volver al inicio de sesión
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between', padding: '52px 28px 40px',
      maxWidth: 440, margin: '0 auto',
    }}>
      {/* Logo */}
      <div><FurvoWordmark size={52} /></div>

      {/* Form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 40 }}>
        <div style={{
          fontFamily: 'var(--fv-serif)', fontSize: 40,
          lineHeight: 0.95, letterSpacing: '-0.03em', marginBottom: 32,
        }}>
          La porra<br />
          <em style={{ fontStyle: 'italic', color: 'var(--fv-accent)' }}>del verano.</em>
        </div>

        {/* Mode toggle */}
        <div style={{
          display: 'flex', gap: 4, padding: 4, borderRadius: 999,
          background: 'var(--fv-surface)', border: '1px solid var(--fv-line)',
          marginBottom: 28, alignSelf: 'flex-start',
        }}>
          {(['signin', 'signup'] as Mode[]).map(m => (
            <button key={m} onClick={() => switchMode(m)} style={{
              padding: '7px 16px', borderRadius: 999, border: 'none', cursor: 'pointer',
              fontFamily: 'var(--fv-mono)', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              background: mode === m ? 'var(--fv-accent)' : 'transparent',
              color: mode === m ? '#0a1a12' : 'var(--fv-muted)',
              transition: 'background 0.15s, color 0.15s',
            }}>
              {m === 'signin' ? 'Entrar' : 'Crear cuenta'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Email */}
          <div>
            <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fv-muted)', marginBottom: 6 }}>
              Email
            </div>
            <input
              type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="tu@email.com"
              autoComplete="email"
              style={inputStyle}
            />
          </div>

          {/* Password */}
          <div>
            <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fv-muted)', marginBottom: 6 }}>
              {mode === 'signup' ? 'Contraseña (mín. 6 caracteres)' : 'Contraseña'}
            </div>
            <input
              type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="··········"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              style={inputStyle}
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{
              fontFamily: 'var(--fv-mono)', fontSize: 11, color: 'var(--fv-bad)',
              letterSpacing: '0.06em', padding: '10px 14px', borderRadius: 10,
              background: 'var(--fv-bad-soft)',
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading || !email || !password}
            style={{
              width: '100%', padding: '15px 20px', borderRadius: 999, border: 'none',
              background: 'var(--fv-accent)', color: '#0a1a12',
              fontFamily: 'var(--fv-sans)', fontSize: 16, fontWeight: 700,
              cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
              opacity: loading || !email || !password ? 0.45 : 1,
              transition: 'opacity 0.15s',
              marginTop: 4,
            }}
          >
            {loading ? 'Un momento…' : mode === 'signin' ? 'Entrar →' : 'Crear cuenta →'}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        fontFamily: 'var(--fv-mono)', fontSize: 9,
        color: 'var(--fv-tertiary)', letterSpacing: '0.1em',
        textAlign: 'center', lineHeight: 1.6,
      }}>
        Sin spam · Sin datos innecesarios<br />
        Solo fútbol con tus amigos
      </div>
    </div>
  );
}
