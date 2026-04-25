'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function RulesCheck({ ligaId }: { ligaId: string }) {
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem('furvo_rules_seen')) {
      router.replace(`/reglas?next=/liga/${ligaId}`);
    }
  }, [ligaId, router]);
  return null;
}
