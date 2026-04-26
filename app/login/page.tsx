'use client';
import { useState, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
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

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/';
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';
  const [mode, setMode]         = useState<Mode>(initialMode);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError]       = useState('');
  const [signedUp, setSignedUp] = useState(false);
  const router = useRouter();

  async function handleGoogle() {
    setGoogleLoading(true);
    setError('');
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (err) {
      setError('No se pudo conectar con Google. Inténtalo de nuevo.');
      setGoogleLoading(false);
    }
  }

  async function handleSubmit() {
    if (!email || !password) return;
    setLoading(true);
    setError('');
    const supabase = createClient();

    if (mode === 'signin') {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (err) { setError(translateError(err.message)); return; }
      router.push(next);
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

        {/* Google OAuth */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading || loading}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 10, padding: '13px 20px', borderRadius: 999,
            background: 'var(--fv-surface)', border: '1px solid var(--fv-line)',
            color: 'var(--fv-ink)', cursor: 'pointer',
            fontFamily: 'var(--fv-sans)', fontSize: 15, fontWeight: 600,
            opacity: googleLoading || loading ? 0.5 : 1,
            transition: 'opacity 0.15s, border-color 0.15s',
            marginBottom: 20,
          }}
        >
          {!googleLoading && (
            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          {googleLoading ? 'Conectando…' : 'Continuar con Google'}
        </button>

        {/* Divider */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24,
        }}>
          <div style={{ flex: 1, height: 1, background: 'var(--fv-line)' }} />
          <div style={{ fontFamily: 'var(--fv-mono)', fontSize: 9, color: 'var(--fv-tertiary)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            o con email
          </div>
          <div style={{ flex: 1, height: 1, background: 'var(--fv-line)' }} />
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

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
