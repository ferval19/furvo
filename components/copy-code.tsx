'use client';
import { useState } from 'react';

export function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select text
    }
  }

  return (
    <button
      onClick={copy}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, padding: 0,
        textAlign: 'left',
      }}
    >
      <div style={{
        fontFamily: 'var(--fv-mono)', fontSize: 9, letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: copied ? 'var(--fv-accent)' : 'var(--fv-muted)',
        transition: 'color 0.2s',
      }}>
        {copied ? '¡Copiado!' : 'Código de invitación · toca para copiar'}
      </div>
      <div style={{
        fontFamily: 'var(--fv-mono)', fontSize: 24, fontWeight: 700,
        letterSpacing: '0.22em', color: copied ? 'var(--fv-accent)' : 'var(--fv-accent)',
        transition: 'opacity 0.15s',
        opacity: copied ? 0.7 : 1,
      }}>
        {code}
      </div>
    </button>
  );
}
